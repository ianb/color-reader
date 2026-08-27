import { describe, expect, it } from 'vitest';
import { formatEntry } from './notation';
import { decodeByRules } from './rules';

const cases: Array<[string, string]> = [
  ['ship', 'sh:D.i.p'],
  ['chop', 'ch:D.o.p'],
  ['bath', 'b.a.th:D'],
  ['black', 'b.l.a.ck:D'],
  ['cake', 'c.a/A.k.e:X'],
  ['bike', 'b.i/I.k.e:X'],
  ['hope', 'h.o/O.p.e:X'],
  ['tiger', 't.i/I-g.er/er'],
  ['rabbit', 'r.a.b-b.i.t'],
  ['napkin', 'n.a.p-k.i.n'],
  ['table', 't.a/A-b.l.e:X'],
  ['little', 'l.i.t-t.l.e:X'],
  ['night', 'n.igh/I.t'],
  ['knight', 'k:X.n.igh/I.t'],
  ['write', 'w:X.r.i/I.t.e:X'],
  ['lamb', 'l.a.m.b:X'],
  ['catch', 'c.a.tch:D'],
  ['bridge', 'b.r.i.dge:D'],
  ['moon', 'm.oo/oo.n'],
  ['boat', 'b.oa/O.t'],
  ['rain', 'r.ai/A.n'],
  ['play', 'p.l.ay/A'],
  ['farm', 'f.ar/ar.m'],
  ['bird', 'b.ir/er.d'],
  ['my', 'm.y/I'],
  ['baby', 'b.a/A-b.y/E'],
  ['city', 'c:C.i/I-t.y/E'], // V/CV: open i is long by rule (lexicon overrides)
  ['gem', 'g:C.e.m'],
  ['he', 'h.e/E'],
  ['jumping', 'j.u.m.p-i.ng:D'],
  ['jumped', 'j.u.m.p.e:X.d'],
  ['wanted', 'w.a.n.t-e.d'],
  ['quick', 'qu:D.i.ck:D'],
  ['thumb', 'th:D.u.m.b:X'],
  ['mishap', 'm.i.s-h.a.p'],
  ['uphill', 'u.p-h.i.ll'],
  ['sunset', 's.u.n-s.e.t'],
  ["dog's", "d.o.g.'s"],
  // extras
  ['running', 'r.u.n-n.i.ng:D'],
  ['hoping', 'h.o/O-p.i.ng:D'],
  ['hopped', 'h.o.pp.e:X.d'],
  ['hated', 'h.a/A-t.e.d'],
  ['boxes', 'b.o.x-e.s'],
  ['wishes', 'w.i.sh:D-e.s'],
  ['cakes', 'c.a/A.k.e:X.s'],
  ['hundred', 'h.u.n.d-r.e.d'],
  ['children', 'ch:D.i.l-d.r.e.n'],
  ['pumpkin', 'p.u.m.p-k.i.n'],
  ['gym', 'g:C.y.m'],
  ['finger', 'f.i.n-g.er/er'],
  ['hothouse', 'h.o.t-h.ou/ow.s.e:X'],
  ['Ship', 'Sh:D.i.p'],
  ["don't", "d.o/O.n't"],
  ['ball', 'b.a/aw.ll'],
  ['walk', 'w.a/aw.l:X.k'],
  ['boy', 'b.oy/oy'],
  ['cloud', 'c.l.ou/ow.d'],
  ['saw', 's.aw/aw'],
  ['hair', 'h.air/air'],
  ['deer', 'd.eer/eer'],
  ['care', 'c.are/air'],
  ['here', 'h.ere/eer'],
  ['key', 'k.ey/E'],
  ['pie', 'p.ie/I'],
];

describe('decodeByRules', () => {
  for (const [word, expected] of cases) {
    it(`${word} -> ${expected}`, () => {
      const a = decodeByRules(word);
      expect(a).not.toBeNull();
      expect(a!.source).toBe('rules');
      expect(formatEntry(a!)).toBe(expected);
    });
  }

  it('returns null for non-letters', () => {
    expect(decodeByRules('a1')).toBeNull();
    expect(decodeByRules('hi-there')).toBeNull();
    expect(decodeByRules('')).toBeNull();
  });
});
