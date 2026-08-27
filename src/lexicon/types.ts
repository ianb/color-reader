/**
 * Core data model for the color-reader markup scheme (see initial-brief.md §4).
 *
 * A word is a chain of syllables; a syllable is a chain of graphemes.
 * Each grapheme is a run of letters mapped to one sound (or silence),
 * carrying only the marks that differ from the default.
 */

/**
 * Vowel sounds. One color per sound, regardless of spelling.
 * Short vowels (lowercase) are the unmarked default for a single vowel letter.
 */
export type VowelSound =
  // short (default): cat bed sit hot cup
  | 'a' | 'e' | 'i' | 'o' | 'u'
  // long: cake me bike boat cute/use (U = /yoo/ as in cute, use, few)
  | 'A' | 'E' | 'I' | 'O' | 'U'
  // other teams
  | 'oo'   // moon, blue, new, you
  | 'uu'   // book, put, could
  | 'ow'   // cow, out
  | 'oy'   // boy, oil
  | 'aw'   // saw, all, taught, walk, water (also hot's o in cot-caught merged dialects — we keep o short)
  | 'uh'   // schwa: a in about, o in button
  // r-controlled
  | 'ar'   // car
  | 'or'   // for, more, four
  | 'er'   // her, bird, fur, work
  | 'air'  // hair, care, there
  | 'eer'; // deer, here, ear

/** Family of a vowel sound — drives the non-color (shape) mark. */
export type VowelFamily = 'short' | 'long' | 'other' | 'r' | 'schwa';

export function vowelFamily(s: VowelSound): VowelFamily {
  switch (s) {
    case 'a': case 'e': case 'i': case 'o': case 'u': return 'short';
    case 'A': case 'E': case 'I': case 'O': case 'U': return 'long';
    case 'uh': return 'schwa';
    case 'ar': case 'or': case 'er': case 'air': case 'eer': return 'r';
    default: return 'other';
  }
}

export const ALL_VOWEL_SOUNDS: VowelSound[] = [
  'a', 'e', 'i', 'o', 'u',
  'A', 'E', 'I', 'O', 'U',
  'oo', 'uu', 'ow', 'oy', 'aw', 'uh',
  'ar', 'or', 'er', 'air', 'eer',
];

/** Default short sound for a lone vowel letter. */
export function defaultShort(letter: string): VowelSound | undefined {
  const l = letter.toLowerCase();
  if (l === 'a' || l === 'e' || l === 'i' || l === 'o' || l === 'u') return l;
  if (l === 'y') return 'i';
  return undefined;
}

export interface Grapheme {
  /** The letters as they appear in the word, original case preserved. */
  letters: string;
  /** Present iff this grapheme is a vowel unit (single vowel or team). */
  vowel?: VowelSound;
  /** Consonant digraph/trigraph (sh, ch, th, ck, tch, ...): tightening. */
  digraph?: boolean;
  /** Whole grapheme is silent (k in knight, w in write, e in cake). */
  silent?: boolean;
  /** Soft c (/s/) or soft g (/j/). */
  soft?: boolean;
  /** "Just memorize this bit": irregular grapheme→phoneme pairing. */
  heart?: boolean;
  /** Letters to use for this grapheme in a decodable respelling (of: f says "v"). */
  says?: string;
}

export interface Syllable {
  graphemes: Grapheme[];
}

export interface WordAnalysis {
  /** Original surface text of the word (case & punctuation stripped). */
  word: string;
  syllables: Syllable[];
  /** Where the analysis came from. `unknown` = no analysis; render plain. */
  source: 'lexicon' | 'rules' | 'unknown';
}

/** Every cue kind that can appear on a page; the key covers these. */
export type CueKind =
  | `vowel-${VowelSound}`
  | 'digraph'
  | 'silent'
  | 'soft'
  | 'heart'
  | 'syllable';

export const ALL_CUES: CueKind[] = [
  ...ALL_VOWEL_SOUNDS.map((s) => `vowel-${s}` as CueKind),
  'digraph',
  'silent',
  'soft',
  'heart',
  'syllable',
];

/**
 * Where the heart shows. Hearts are for letter-identity oddities the marks
 * can't explain: consonants saying another sound (of → /v/), and vowel
 * letters/teams making a *different short vowel* (said: ai → e; was: a → o).
 * A vowel making a long/team/r/schwa sound already has its shape mark
 * (the, to, you), so no heart there.
 */
export function showsHeart(g: Grapheme): boolean {
  if (!g.heart) return false;
  if (!g.vowel) return true;
  return vowelFamily(g.vowel) === 'short' && defaultShort(g.letters) !== g.vowel;
}

/**
 * Collect the set of cue kinds a word exhibits.
 * Short vowels count only when spelled irregularly (said: ai→e), or always
 * when `includeShort` is set (the "mark short vowels" option).
 */
export function cuesOf(a: WordAnalysis, includeShort = false): Set<CueKind> {
  const out = new Set<CueKind>();
  if (a.syllables.length > 1) out.add('syllable');
  for (const s of a.syllables)
    for (const g of s.graphemes) {
      // A hearted vowel is an oddity (said), not an example of its sound.
      if (g.vowel && !showsHeart(g)) {
        const short = vowelFamily(g.vowel) === 'short';
        const irregular = defaultShort(g.letters) !== g.vowel;
        if (!short || includeShort || irregular) out.add(`vowel-${g.vowel}`);
      }
      if (g.digraph) out.add('digraph');
      if (g.silent) out.add('silent');
      if (g.soft) out.add('soft');
      if (showsHeart(g)) out.add('heart');
    }
  return out;
}
