/**
 * Analysis pipeline entry point: lexicon lookup → rule decoding → unknown.
 * Also tokenizes free text into words/punctuation/space for rendering.
 */
import { parseEntry } from './notation';
import { decodeByRules } from './rules';
import type { WordAnalysis } from './types';
import { WORDS } from './words';

export type { CueKind, Grapheme, Syllable, VowelFamily, VowelSound, WordAnalysis } from './types';
export { ALL_CUES, ALL_VOWEL_SOUNDS, cuesOf, vowelFamily } from './types';

/** Re-case each grapheme's letters to match the surface word, position by position. */
function recase(a: WordAnalysis, surface: string): WordAnalysis {
  let i = 0;
  return {
    ...a,
    word: surface,
    syllables: a.syllables.map((s) => ({
      graphemes: s.graphemes.map((g) => {
        const letters = surface.slice(i, i + g.letters.length);
        i += g.letters.length;
        return { ...g, letters };
      }),
    })),
  };
}

export function analyze(word: string): WordAnalysis {
  const key = word.toLowerCase();
  const entry = WORDS[key];
  if (entry) return recase(parseEntry(key, entry), word);
  const byRules = decodeByRules(key);
  if (byRules) return recase(byRules, word);
  return { word, syllables: [], source: 'unknown' };
}

export type Token =
  | { kind: 'word'; text: string; analysis: WordAnalysis }
  | { kind: 'punct'; text: string }
  | { kind: 'space' };

export type Line = Token[];
export type Paragraph = Line[];

const WORD_RE = /[A-Za-z]+(?:['’][A-Za-z]+)*/;
const TOKEN_RE = new RegExp(`(${WORD_RE.source})|(\\s+)|([^\\sA-Za-z]+)`, 'g');

export function tokenizeLine(line: string): Line {
  const tokens: Line = [];
  for (const m of line.matchAll(TOKEN_RE)) {
    if (m[1] !== undefined) {
      tokens.push({ kind: 'word', text: m[1], analysis: analyze(m[1]) });
    } else if (m[2] !== undefined) {
      tokens.push({ kind: 'space' });
    } else if (m[3] !== undefined) {
      tokens.push({ kind: 'punct', text: m[3] });
    }
  }
  return tokens;
}

/** Split text into paragraphs (blank-line separated), then lines, then tokens. */
export function tokenize(text: string): Paragraph[] {
  return text
    .replace(/\r\n?/g, '\n')
    .split(/\n\s*\n/)
    .map((p) => p.split('\n').filter((l) => l.trim() !== '').map(tokenizeLine))
    .filter((p) => p.length > 0);
}
