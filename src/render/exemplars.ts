import { ALL_VOWEL_SOUNDS, type CueKind, type VowelSound, type WordAnalysis, cuesOf } from '../lexicon/types';
import { VOWEL_META } from './vowels';

export interface CueMeta {
  label: string;
  /** Emoji icon for consonant/structure cues; vowel cues use a color swatch instead. */
  icon?: string;
  /** Swatch color for vowel-sound cues. */
  color?: string;
  vowel?: VowelSound;
}

/** Fixed cue → label/icon mapping. Colors live in reader.css; only exemplars change. */
export const CUE_META: Record<CueKind, CueMeta> = {
  ...(Object.fromEntries(
    ALL_VOWEL_SOUNDS.map((s) => [
      `vowel-${s}`,
      { label: VOWEL_META[s].label, color: VOWEL_META[s].color, vowel: s },
    ]),
  ) as Record<`vowel-${VowelSound}`, CueMeta>),
  digraph: { label: 'two letters, one sound', icon: '🔗' },
  silent: { label: 'silent', icon: '🤫' },
  soft: { label: 'soft c / g', icon: '🧊' },
  heart: { label: 'just remember this', icon: '❤️' },
  syllable: { label: 'syllable', icon: '✂️' },
};

/** The spelling (letters) a word uses for a given vowel sound, e.g. "ai" in rain. */
export function spellingOf(a: WordAnalysis, sound: VowelSound): string | undefined {
  for (const s of a.syllables) {
    const gs = s.graphemes;
    for (let i = 0; i < gs.length; i++) {
      const g = gs[i];
      if (g.vowel !== sound) continue;
      // magic-e: vowel, consonant, silent e → "a_e"
      const c = gs[i + 1];
      const e = gs[i + 2];
      if (g.letters.length === 1 && c && !c.vowel && !c.silent && e?.silent && e.letters.toLowerCase() === 'e')
        return `${g.letters.toLowerCase()}_e`;
      return g.letters.toLowerCase();
    }
  }
  return undefined;
}

/**
 * Greedy set-cover: fewest words that together exhibit every cue kind present
 * in `words`. Known words are preferred; among candidates, the one covering the
 * most still-uncovered cues wins (ties → more total cues, then earlier).
 */
export function chooseExemplars(
  words: WordAnalysis[],
  known?: Set<string>,
  includeShort = false,
): WordAnalysis[] {
  const seen = new Set<string>();
  const candidates: { a: WordAnalysis; cues: Set<CueKind>; known: boolean }[] = [];
  for (const a of words) {
    const k = a.word.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    const cues = cuesOf(a, includeShort);
    if (cues.size === 0) continue;
    candidates.push({ a, cues, known: !known || known.has(k) });
  }
  const uncovered = new Set<CueKind>();
  for (const c of candidates) for (const cue of c.cues) uncovered.add(cue);

  const chosen: WordAnalysis[] = [];
  const pool = [...candidates];
  while (uncovered.size > 0 && pool.length > 0) {
    let best = -1;
    let bestScore = [-1, -1, -1];
    pool.forEach((c, i) => {
      const gain = [...c.cues].filter((cue) => uncovered.has(cue)).length;
      const score = [c.known ? 1 : 0, gain, c.cues.size];
      if (gain > 0 && compare(score, bestScore) > 0) {
        best = i;
        bestScore = score;
      }
    });
    if (best < 0) break;
    const [c] = pool.splice(best, 1);
    chosen.push(c.a);
    for (const cue of c.cues) uncovered.delete(cue);
  }
  return chosen;
}

function compare(a: number[], b: number[]): number {
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return a[i] - b[i];
  return 0;
}

/** For each cue kind on the page, the exemplar(s) that show it. */
export function exemplarsByCue(
  exemplars: WordAnalysis[],
  includeShort = false,
): Map<CueKind, WordAnalysis[]> {
  const out = new Map<CueKind, WordAnalysis[]>();
  for (const a of exemplars)
    for (const cue of cuesOf(a, includeShort)) {
      const list = out.get(cue) ?? [];
      list.push(a);
      out.set(cue, list);
    }
  return out;
}
