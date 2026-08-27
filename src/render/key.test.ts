import { describe, expect, it } from 'vitest';
import { parseEntry } from '../lexicon/notation';
import { cuesOf } from '../lexicon/types';
import { chooseExemplars, spellingOf } from './exemplars';

const w = (word: string, entry: string) => parseEntry(word, entry);

describe('chooseExemplars', () => {
  it('covers every cue with the fewest words, preferring multi-cue words', () => {
    const words = [
      w('cat', 'c.a.t'), // no cues
      w('ship', 'sh:D.i.p'), // digraph
      w('cake', 'c.a/A.k.e:X'), // long A + silent
      w('tiger', 't.i/I-g.er/er'), // long I + er + syllable
      w('knight', 'k:X.n.igh/I.t'), // silent + long I
      w('the', 'th:D.e/uh:H'), // digraph + schwa (heart on a colored vowel is not shown)
      w('of', 'o/u:H.f:H'), // heart (consonant oddity)
    ];
    const chosen = chooseExemplars(words);
    const covered = new Set(chosen.flatMap((a) => [...cuesOf(a)]));
    expect(covered).toEqual(
      new Set(['digraph', 'silent', 'vowel-A', 'vowel-I', 'vowel-er', 'vowel-uh', 'heart', 'syllable']),
    );
    expect(chosen.map((a) => a.word)).toEqual(['tiger', 'cake', 'the', 'of']);
  });

  it('prefers known words and dedupes', () => {
    const words = [w('ship', 'sh:D.i.p'), w('chip', 'ch:D.i.p'), w('ship', 'sh:D.i.p')];
    expect(chooseExemplars(words, new Set(['chip'])).map((a) => a.word)).toEqual(['chip']);
    expect(chooseExemplars(words)).toHaveLength(1);
  });
});

describe('spellingOf', () => {
  it('reports the letters used for a sound, with magic-e as a_e', () => {
    expect(spellingOf(w('rain', 'r.ai/A.n'), 'A')).toBe('ai');
    expect(spellingOf(w('cake', 'c.a/A.k.e:X'), 'A')).toBe('a_e');
    expect(spellingOf(w('cake', 'c.a/A.k.e:X'), 'E')).toBeUndefined();
  });
});
