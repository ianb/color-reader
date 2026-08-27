// Merged hand-authored lexicon. Later sources override earlier ones on
// duplicate keys; keep the specific/curated lists last.
import { WORDS_SIGHT } from './words-sight';
import { WORDS_DECODABLE } from './words-decodable';
import { WORDS_NOUNS } from './words-nouns';

export const WORDS: Record<string, string> = {
  ...WORDS_DECODABLE,
  ...WORDS_NOUNS,
  ...WORDS_SIGHT,
};
