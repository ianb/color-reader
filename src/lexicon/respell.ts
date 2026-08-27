import { showsHeart, type Grapheme, type VowelSound, type WordAnalysis } from './types';

/** Standard decodable spelling of each vowel sound, for respellings. */
export const RESPELL: Record<VowelSound, string> = {
  a: 'a', e: 'e', i: 'i', o: 'o', u: 'u',
  A: 'ay', E: 'ee', I: 'ie', O: 'oa', U: 'ue',
  oo: 'oo', uu: 'oo', ow: 'ow', oy: 'oy', aw: 'aw', uh: 'u',
  ar: 'ar', or: 'or', er: 'er', air: 'air', eer: 'eer',
};

function respellGrapheme(g: Grapheme): string {
  if (g.says !== undefined) return g.says;
  if (g.silent) return '';
  if (g.vowel && g.heart) return RESPELL[g.vowel];
  if (g.soft) return g.letters.toLowerCase() === 'c' ? 's' : 'j';
  return g.letters.toLowerCase();
}

/** True if the word has at least one visible heart mark. */
export function hasHeart(a: WordAnalysis): boolean {
  return a.syllables.some((s) => s.graphemes.some(showsHeart));
}

/**
 * A decodable respelling of a heart word, keeping regular graphemes as they
 * are and substituting only the odd ones: said → sed, was → wuz, of → uv.
 */
export function respell(a: WordAnalysis): string {
  return a.syllables.map((s) => s.graphemes.map(respellGrapheme).join('')).join('');
}
