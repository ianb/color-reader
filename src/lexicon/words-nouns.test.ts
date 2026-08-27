import { describe, expect, it } from 'vitest';
import { parseEntry } from './notation';
import { WORDS_NOUNS } from './words-nouns';

describe('WORDS_NOUNS', () => {
  it('has at least 150 entries', () => {
    expect(Object.keys(WORDS_NOUNS).length).toBeGreaterThanOrEqual(150);
  });

  it('every entry parses and spells its word', () => {
    for (const [word, entry] of Object.entries(WORDS_NOUNS)) {
      expect(word).toBe(word.toLowerCase());
      expect(() => parseEntry(word, entry)).not.toThrow();
    }
  });
});
