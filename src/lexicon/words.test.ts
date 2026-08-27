import { describe, expect, it } from 'vitest';
import { formatEntry, parseEntry } from './notation';
import { WORDS } from './words';
import { WORDS_SIGHT } from './words-sight';
import { WORDS_DECODABLE } from './words-decodable';
import { WORDS_NOUNS } from './words-nouns';

describe('WORDS', () => {
  it('parses and round-trips every entry', () => {
    for (const [w, e] of Object.entries(WORDS)) {
      const a = parseEntry(w, e);
      expect(parseEntry(w, formatEntry(a)), w).toEqual(a);
    }
  });
  it('has > 600 words', () => {
    expect(Object.keys(WORDS).length).toBeGreaterThan(600);
  });
  it('reports conflicting duplicates across lists', () => {
    const lists = { sight: WORDS_SIGHT, decodable: WORDS_DECODABLE, nouns: WORDS_NOUNS };
    const seen = new Map<string, [string, string]>();
    const conflicts: string[] = [];
    for (const [name, list] of Object.entries(lists))
      for (const [w, e] of Object.entries(list)) {
        const prev = seen.get(w);
        if (prev && prev[1] !== e) conflicts.push(`${w}: ${prev[0]}=${prev[1]} vs ${name}=${e}`);
        seen.set(w, [name, e]);
      }
    expect(conflicts, conflicts.join('\n')).toEqual([]);
  });
});
