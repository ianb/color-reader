/**
 * Rule-based fallback decoder for words not in the hand lexicon.
 *
 * Pipeline:
 *   1. peel a trailing contraction/possessive ("'s", "n't", ...) as a plain
 *      consonant grapheme;
 *   2. peel common inflections (-ing, -ed, -es, -s) when the stem looks
 *      like a real stem, decode the stem, then re-attach the suffix either
 *      as its own syllable or as trailing graphemes;
 *   3. tokenize the letters greedily into graphemes (silent pairs,
 *      consonant digraphs, vowel teams, soft c/g, single letters);
 *   4. detect C-le and magic-e endings, split syllables by the decoding
 *      conventions in initial-brief.md §4c (VC/CV, V/CV, digraphs kept
 *      together, C-le takes its consonant), then color vowels: open → long,
 *      closed → short, teams by their table;
 *   5. merge doubled consonants that end up inside one syllable.
 *
 * Schwa is never guessed; unresolved vowels stay short.
 */
import { defaultShort, type Grapheme, type Syllable, type VowelSound, type WordAnalysis } from './types';

interface Tok {
  letters: string;
  isVowel: boolean;
  vowel?: VowelSound;
  /** Vowel sound was set by a team/magic-e rule; don't override by openness. */
  fixed?: boolean;
  digraph?: boolean;
  silent?: boolean;
  soft?: boolean;
}

const V = 'aeiou';
const isV = (c: string | undefined) => !!c && V.includes(c);
const isVy = (c: string | undefined) => !!c && 'aeiouy'.includes(c);

/** Long sound of a lone vowel letter in an open / magic-e syllable. */
const LONG: Record<string, VowelSound> = { a: 'A', e: 'E', i: 'I', o: 'O', u: 'U', y: 'I' };

/**
 * Vowel teams → guessed sound. Longest match wins. `ey`, `ie` and the
 * final `are`/`ere` are context-dependent (see matchTeam).
 */
const TEAMS: Record<string, VowelSound> = {
  eigh: 'A', augh: 'aw', ough: 'aw',
  igh: 'I', ear: 'eer', eer: 'eer', air: 'air', are: 'air', ere: 'eer',
  ai: 'A', ay: 'A', ee: 'E', ea: 'E', ei: 'E', ey: 'A', ie: 'E',
  oa: 'O', oe: 'O', ew: 'oo', ue: 'oo', oo: 'oo',
  ow: 'ow', ou: 'ow', oi: 'oy', oy: 'oy', au: 'aw', aw: 'aw',
  ar: 'ar', or: 'or', er: 'er', ir: 'er', ur: 'er',
};
const TEAM_LIST = Object.keys(TEAMS).sort((a, b) => b.length - a.length);
const CONS_DIGRAPHS = ['tch', 'dge', 'sh', 'ch', 'th', 'wh', 'ph', 'ck', 'qu', 'ng'];

/**
 * Words where greedy digraph formation would cross a morpheme boundary.
 * '|' marks a forced syllable split; graphemes never span it.
 */
const EXCEPTIONS: Record<string, string> = {};
for (const e of [
  'mis|hap', 'mis|hear', 'mis|handle', 'dis|honest', 'dis|hearten', 'grass|hopper',
  'hot|house', 'pot|hole', 'knot|hole', 'ant|hill', 'out|house', 'light|house',
  'boat|house', 'court|house', 'pent|house', 'sweet|heart', 'fat|head', 'hot|head',
  'flat|head', 'pot|head', 'goat|herd', 'cat|hood', 'adult|hood', 'knight|hood',
  'nut|hatch', 'up|hill', 'up|hold', 'up|heaval', 'shep|herd', 'loop|hole',
  'hap|hazard', 'long|est', 'strong|est', 'young|est', 'long|er', 'strong|er', 'young|er',
]) {
  EXCEPTIONS[e.replace(/\|/g, '')] = e;
}

/** [substring, offset of the hard g within it]. */
const HARD_G: Array<[string, number]> = [
  ['get', 0], ['giv', 0], ['gift', 0], ['girl', 0], ['gird', 0], ['geese', 0], ['gear', 0],
  ['geek', 0], ['gecko', 0], ['gild', 0], ['gill', 0], ['giggl', 0], ['gimm', 0], ['gizz', 0],
  ['begin', 2], ['tiger', 2], ['finger', 3], ['anger', 2], ['hunger', 3], ['linger', 3],
  ['eager', 2], ['meager', 3], ['burger', 3], ['nugget', 2], ['longe', 3], ['stronge', 5],
  ['younge', 4], ['target', 3], ['together', 2],
];

function hardG(w: string, i: number): boolean {
  if (w[i - 1] === 'g') return true; // gg → hard
  for (const [s, off] of HARD_G) {
    if (i - off >= 0 && w.startsWith(s, i - off)) return true;
  }
  return false;
}

// ---------------------------------------------------------------------------
// Tokenizer

function tokenize(w: string, bounds: Set<number> = new Set()): Tok[] {
  const toks: Tok[] = [];
  const n = w.length;
  let i = 0;
  const spans = (len: number) => {
    for (let k = i + 1; k < i + len; k++) if (bounds.has(k)) return false;
    return true;
  };
  const at = (s: string) => w.startsWith(s, i) && spans(s.length);
  const push = (letters: string, extra: Partial<Tok> = {}) => {
    toks.push({ letters, isVowel: false, ...extra });
    i += letters.length;
  };

  while (i < n) {
    const c = w[i];
    const next = w[i + 1];

    if (i === 0 && (at('kn') || at('gn') || at('wr'))) {
      push(c, { silent: true });
      continue;
    }
    if (c === 'm' && next === 'b' && i + 2 === n && spans(2)) {
      push('m');
      push('b', { silent: true });
      continue;
    }

    let matched = false;
    for (const d of CONS_DIGRAPHS) {
      if (!at(d)) continue;
      if (d === 'ck' && !isVy(w[i - 1])) continue;
      if (d === 'ng') {
        const after = w[i + 2];
        // "finger", "angle", "engage": ng before a vowel or l/r is n + g.
        if (after !== undefined && (isVy(after) || after === 'l' || after === 'r')) continue;
      }
      push(d, { digraph: true });
      matched = true;
      break;
    }
    if (matched) continue;

    if (isV(c)) {
      // "all" / "alk": a says /aw/; l is silent in "alk".
      if (c === 'a' && (w.startsWith('ll', i + 1) || w.startsWith('lk', i + 1)) && spans(2)) {
        const alk = w[i + 1] === 'l' && w[i + 2] === 'k';
        push('a', { isVowel: true, vowel: 'aw', fixed: true });
        if (alk) push('l', { silent: true });
        continue;
      }
      const team = matchTeam(w, i, spans);
      if (team) {
        push(team.letters, { isVowel: true, vowel: team.sound, fixed: true });
      } else {
        push(c, { isVowel: true });
      }
      continue;
    }

    if (c === 'y') {
      const vowelY = i > 0 && !isV(next);
      push('y', { isVowel: vowelY });
      continue;
    }

    if (c === 'c' || c === 'g') {
      const soft = !!next && 'eiy'.includes(next) && !(c === 'g' && hardG(w, i));
      push(c, soft ? { soft: true } : {});
      continue;
    }
    push(c);
  }
  return toks;
}

function matchTeam(
  w: string,
  i: number,
  spans: (len: number) => boolean,
): { letters: string; sound: VowelSound } | null {
  for (const t of TEAM_LIST) {
    if (!w.startsWith(t, i) || !spans(t.length)) continue;
    const after = w[i + t.length];
    const final = after === undefined;
    let sound = TEAMS[t];
    if (t.endsWith('r')) {
      // r-controlled only when r closes the syllable ("farm", "her"),
      // not "carry" / "very" / "tiger" is fine (word-final).
      if (after !== undefined && (isVy(after) || after === 'r')) continue;
    }
    if (t === 'are' || t === 'ere') {
      if (!final) continue; // care, there; otherwise magic-e / open rules apply
    }
    if (t === 'ey' && final) sound = 'E'; // key, money (vs. they, grey)
    if (t === 'ie' && final && !/[aeiouy]/.test(w.slice(0, i))) sound = 'I'; // pie, tie
    return { letters: t, sound };
  }
  return null;
}

// ---------------------------------------------------------------------------
// Syllabification

const isPlainC = (t: Tok | undefined) =>
  !!t && !t.isVowel && !t.silent && !t.digraph && t.letters.length === 1;

function syllabify(toks: Tok[], bounds: Set<number> = new Set()): Tok[][] {
  const vowelCount = () => toks.filter((t) => t.isVowel).length;
  let tail: Tok[] | null = null;

  // Consonant-le: ta-ble, lit-tle.
  const L = toks.length;
  if (
    L >= 4 &&
    toks[L - 1].letters === 'e' && toks[L - 1].isVowel &&
    toks[L - 2].letters === 'l' && !toks[L - 2].isVowel &&
    !toks[L - 3].isVowel && !toks[L - 3].silent &&
    toks.slice(0, L - 3).some((t) => t.isVowel)
  ) {
    tail = toks.slice(L - 3);
    tail[2].isVowel = false;
    tail[2].silent = true;
    toks = toks.slice(0, L - 3);
  } else if (L >= 3 && toks[L - 1].letters === 'e' && toks[L - 1].isVowel && vowelCount() >= 2) {
    const e = toks[L - 1];
    const c = toks[L - 2];
    const v = toks[L - 3];
    e.isVowel = false;
    e.silent = true;
    if (!c.isVowel && !c.silent && v.isVowel && v.letters.length === 1 && !v.fixed) {
      v.vowel = LONG[v.letters];
      v.fixed = true;
    }
  }

  // Positions (letter offsets) of each token, for forced boundaries.
  const pos: number[] = [];
  let p = 0;
  for (const t of toks) {
    pos.push(p);
    p += t.letters.length;
  }

  const vowelIdx = toks.map((t, i) => (t.isVowel ? i : -1)).filter((i) => i >= 0);
  const sylls: Tok[][] = [];
  let start = 0;
  for (let k = 0; k + 1 < vowelIdx.length; k++) {
    const vi = vowelIdx[k];
    const vj = vowelIdx[k + 1];
    let cut = -1;
    for (let c = vi + 1; c <= vj; c++) {
      if (bounds.has(pos[c])) { cut = c; break; }
    }
    if (cut < 0) {
      const n = vj - vi - 1;
      if (n === 0) cut = vj;
      else if (n === 1) cut = vj - 1;
      else if (n === 2) cut = vi + 2;
      else {
        const a = toks[vj - 2];
        const b = toks[vj - 1];
        const blend = isPlainC(a) && !'lr'.includes(a.letters) && (b.letters === 'l' || b.letters === 'r');
        cut = blend ? vj - 2 : vi + 3;
      }
    }
    sylls.push(toks.slice(start, cut));
    start = cut;
  }
  sylls.push(toks.slice(start));
  if (tail) sylls.push(tail);

  for (const s of sylls) assignSounds(s, sylls.length);
  return sylls;
}

function assignSounds(s: Tok[], syllableCount: number) {
  for (let i = 0; i < s.length; i++) {
    const t = s[i];
    if (!t.isVowel || t.fixed) continue;
    const open = i === s.length - 1;
    if (!open) t.vowel = defaultShort(t.letters);
    else if (t.letters === 'y') t.vowel = syllableCount > 1 ? 'E' : 'I'; // baby vs. my
    else t.vowel = LONG[t.letters];
    t.fixed = true;
  }
}

/** Merge doubled plain consonants that landed in the same syllable. */
function finish(sylls: Tok[][]): Tok[][] {
  return sylls.map((s) => {
    const out: Tok[] = [];
    for (const t of s) {
      const prev = out[out.length - 1];
      if (prev && isPlainC(prev) && isPlainC(t) && prev.letters === t.letters && !prev.soft && !t.soft) {
        prev.letters += t.letters;
      } else out.push({ ...t });
    }
    return out;
  });
}

// ---------------------------------------------------------------------------
// Suffixes

const hasVowel = (s: string) => /[aeiouy]/.test(s);

/** A stripped stem that plausibly stands on its own. */
function validStem(stem: string, minLen: number): boolean {
  return stem.length >= minLen && hasVowel(stem) && !'aiou'.includes(stem[stem.length - 1]);
}

/**
 * Prepare stem tokens for a syllabic suffix. Returns the consonant to move
 * into the suffix syllable (doubled consonant, C+l/r cluster, or the C of
 * a CVC stem), and marks a CVC stem vowel long (hop-ing → ho-ping).
 */
function detach(toks: Tok[], opts: { cvc: boolean; move: boolean }): Tok | null {
  const last = toks[toks.length - 1];
  const prev = toks[toks.length - 2];
  if (!isPlainC(last) || !prev) return null;
  let moveIt = false;
  if (isPlainC(prev) && prev.letters === last.letters) moveIt = true;
  else if (!prev.isVowel && 'lr'.includes(last.letters) && !'lr'.includes(prev.letters)) moveIt = true;
  else if (opts.cvc && prev.isVowel && prev.letters.length === 1 && !prev.fixed && last.letters !== 'x') {
    prev.vowel = LONG[prev.letters];
    prev.fixed = true;
    moveIt = true;
  }
  if (!moveIt || !opts.move) return null;
  return toks.pop()!;
}

const vTok = (letters: string, sound: VowelSound): Tok => ({ letters, isVowel: true, vowel: sound, fixed: true });
const cTok = (letters: string, extra: Partial<Tok> = {}): Tok => ({ letters, isVowel: false, ...extra });

function decodeWord(w: string): Tok[][] {
  const ex = EXCEPTIONS[w];
  if (ex) {
    const bounds = new Set<number>();
    let p = 0;
    for (const ch of ex) {
      if (ch === '|') bounds.add(p);
      else p++;
    }
    return finish(syllabify(tokenize(w, bounds), bounds));
  }

  if (w.endsWith('ing') && validStem(w.slice(0, -3), 2)) {
    const toks = tokenize(w.slice(0, -3));
    const moved = detach(toks, { cvc: true, move: true });
    const sylls = syllabify(toks);
    sylls.push([...(moved ? [moved] : []), vTok('i', 'i'), cTok('ng', { digraph: true })]);
    return finish(sylls);
  }

  if (w.endsWith('ed') && validStem(w.slice(0, -2), 2)) {
    const stem = w.slice(0, -2);
    const toks = tokenize(stem);
    const last = toks[toks.length - 1];
    const prev = toks[toks.length - 2];
    const syllabic =
      last.letters === 't' || last.letters === 'd' ||
      (isPlainC(last) && 'lr'.includes(last.letters) && prev && !prev.isVowel && !'lr'.includes(prev.letters));
    if (syllabic) {
      const moved = detach(toks, { cvc: true, move: true });
      const sylls = syllabify(toks);
      sylls.push([...(moved ? [moved] : []), vTok('e', 'e'), cTok('d')]);
      return finish(sylls);
    }
    detach(toks, { cvc: true, move: false });
    const sylls = syllabify(toks);
    sylls[sylls.length - 1].push(cTok('e', { silent: true }), cTok('d'));
    return finish(sylls);
  }

  if (w.endsWith('es') && /(s|x|z|sh|ch)$/.test(w.slice(0, -2)) && validStem(w.slice(0, -2), 2)) {
    const stem = w.slice(0, -2);
    const toks = tokenize(stem);
    const moved = /[sz]$/.test(stem) ? detach(toks, { cvc: true, move: true }) : null;
    const sylls = syllabify(toks);
    sylls.push([...(moved ? [moved] : []), vTok('e', 'e'), cTok('s')]);
    return finish(sylls);
  }

  if (w.endsWith('s') && !w.endsWith('ss') && validStem(w.slice(0, -1), 3)) {
    const sylls = syllabify(tokenize(w.slice(0, -1)));
    sylls[sylls.length - 1].push(cTok('s'));
    return finish(sylls);
  }

  return finish(syllabify(tokenize(w)));
}

// ---------------------------------------------------------------------------

export function decodeByRules(word: string): WordAnalysis | null {
  const lower = word.toLowerCase();
  let core = lower;
  let tail = '';
  const m = /^([a-z]+)('s|n't|'m|'re|'ll|'ve|'d)$/.exec(lower);
  if (m) {
    core = m[1];
    tail = m[2];
  } else if (!/^[a-z]+$/.test(lower)) {
    return null;
  }

  const sylls = decodeWord(core);
  if (tail) sylls[sylls.length - 1].push(cTok(tail));

  let p = 0;
  const syllables: Syllable[] = sylls.map((s) => ({
    graphemes: s.map((t): Grapheme => {
      const g: Grapheme = { letters: word.slice(p, p + t.letters.length) };
      p += t.letters.length;
      if (t.isVowel) g.vowel = t.vowel ?? defaultShort(t.letters[0]);
      if (t.digraph) g.digraph = true;
      if (t.silent) g.silent = true;
      if (t.soft) g.soft = true;
      return g;
    }),
  }));
  return { word, syllables, source: 'rules' };
}
