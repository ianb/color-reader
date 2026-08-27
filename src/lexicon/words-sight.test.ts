import { describe, expect, it } from 'vitest';
import { parseEntry } from './notation';
import { WORDS_SIGHT } from './words-sight';

describe('WORDS_SIGHT', () => {
  it('every entry parses', () => {
    for (const [w, e] of Object.entries(WORDS_SIGHT)) {
      expect(() => parseEntry(w, e), `${w}: ${e}`).not.toThrow();
    }
  });
  it('has enough words', () => {
    expect(Object.keys(WORDS_SIGHT).length).toBeGreaterThanOrEqual(250);
  });
});
