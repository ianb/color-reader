import type { Grapheme, WordAnalysis } from '../lexicon/types';

/**
 * How a word is broken into decoding chunks (the unit that gets the
 * alternating band / gap). See brief §7: starting with the consonant
 * already attached to its vowel ("ca" then "t") avoids schwa insertion.
 */
export type ChunkMode = 'syllable' | 'body-coda' | 'onset-rime';

export function chunkWord(a: WordAnalysis, mode: ChunkMode): Grapheme[][] {
  if (mode === 'syllable') return a.syllables.map((s) => s.graphemes);
  if (mode === 'body-coda') return bodyCoda(a.syllables.flatMap((s) => s.graphemes));
  return onsetRime(a);
}

const isVowel = (g: Grapheme) => !!g.vowel && !g.silent;

/**
 * Body-coda: cut after every vowel, ignoring syllable boundaries, so the
 * consonants between two vowels attach to the *next* vowel:
 * cat → ca·t, rabbit → ra·bbi·t, fish → fi·sh. A silent e right after a
 * consonant (cake) stays with the trailing coda chunk.
 */
function bodyCoda(gs: Grapheme[]): Grapheme[][] {
  const out: Grapheme[][] = [];
  let cur: Grapheme[] = [];
  for (const g of gs) {
    cur.push(g);
    if (isVowel(g)) {
      out.push(cur);
      cur = [];
    }
  }
  if (cur.length) out.push(cur);
  // A word with no onset (in, at, up): nothing to attach the vowel to.
  if (out.length === 2 && out[0].length === 1) return [gs];
  return out;
}

/** Onset-rime within each syllable: c·at, r·ab·b·it. */
function onsetRime(a: WordAnalysis): Grapheme[][] {
  const out: Grapheme[][] = [];
  for (const s of a.syllables) {
    const gs = s.graphemes;
    const vi = gs.findIndex(isVowel);
    if (vi <= 0) {
      out.push(gs);
      continue;
    }
    out.push(gs.slice(0, vi), gs.slice(vi));
  }
  return out;
}
