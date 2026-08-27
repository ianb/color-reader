import { describe, expect, it } from 'vitest';
import { analyze } from './index';
import { hasHeart, respell } from './respell';

describe('respell', () => {
  it.each([
    ['said', 'sed'],
    ['was', 'wuz'],
    ['of', 'uv'],
    ['one', 'wun'],
    ['once', 'wuns'],
    ['is', 'iz'],
    ['rough', 'ruf'],
    ['laughing', 'lafing'],
  ])('%s → %s', (w, exp) => {
    const a = analyze(w);
    expect(hasHeart(a)).toBe(true);
    expect(respell(a)).toBe(exp);
  });
  it('regular words have no heart', () => {
    expect(hasHeart(analyze('the'))).toBe(false);
    expect(hasHeart(analyze('though'))).toBe(false);
  });
});
