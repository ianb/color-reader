import { describe, expect, it } from 'vitest';
import { parseEntry } from './notation';
import { WORDS_DECODABLE } from './words-decodable';

describe('WORDS_DECODABLE', () => {
  it('has at least 300 entries', () => {
    expect(Object.keys(WORDS_DECODABLE).length).toBeGreaterThanOrEqual(300);
  });

  it('every entry parses and spells its word', () => {
    for (const [word, entry] of Object.entries(WORDS_DECODABLE)) {
      expect(() => parseEntry(word, entry)).not.toThrow();
      expect(word).toBe(word.toLowerCase());
    }
  });
});
