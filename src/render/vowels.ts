/**
 * One color per vowel SOUND, the same across spellings (brief §4a), paired
 * with a non-color shape mark per family (brief §4e, red-green deficiency).
 *
 * Colors are print-safe on white at 22pt: none pure black, none pale.
 * Long vowels = saturated primaries; other teams = mid-lightness secondaries;
 * r-controlled = darker earth tones; schwa = neutral gray-violet.
 * Short vowels default to ink and only get their (light) color under .mark-short.
 */
import type { VowelFamily, VowelSound } from '../lexicon/types';

export interface VowelMeta {
  color: string;
  label: string;
  example: string;
  spellings: string[];
}

export const VOWEL_META: Record<VowelSound, VowelMeta> = {
  // short — ink by default; these colors appear only with .mark-short
  a: { color: '#c0392b', label: 'short a', example: 'cat', spellings: ['a'] },
  e: { color: '#2e86ab', label: 'short e', example: 'bed', spellings: ['e', 'ea'] },
  i: { color: '#8e6c0a', label: 'short i', example: 'sit', spellings: ['i', 'y'] },
  o: { color: '#6c3483', label: 'short o', example: 'hot', spellings: ['o'] },
  u: { color: '#1e8449', label: 'short u', example: 'cup', spellings: ['u'] },
  // long — saturated hues
  A: { color: '#1d5fc4', label: 'long a', example: 'cake', spellings: ['a_e', 'ai', 'ay', 'eigh', 'a'] },
  E: { color: '#0f8a3e', label: 'long e', example: 'tree', spellings: ['ee', 'ea', 'e', 'y', 'e_e', 'ie'] },
  I: { color: '#c81e5b', label: 'long i', example: 'bike', spellings: ['i_e', 'igh', 'y', 'i', 'ie'] },
  O: { color: '#e0700f', label: 'long o', example: 'boat', spellings: ['o_e', 'oa', 'ow', 'o', 'oe'] },
  U: { color: '#7a3fc4', label: 'long u', example: 'cute', spellings: ['u_e', 'u', 'ew', 'ue'] },
  // other teams — mid tones between long and r-controlled
  oo: { color: '#0e8a8f', label: 'oo as in moon', example: 'moon', spellings: ['oo', 'ue', 'ew', 'ou', 'u_e'] },
  uu: { color: '#8a7a12', label: 'oo as in book', example: 'book', spellings: ['oo', 'u', 'ou'] },
  ow: { color: '#b0361f', label: 'ow as in cow', example: 'cow', spellings: ['ow', 'ou'] },
  oy: { color: '#c4269a', label: 'oy as in boy', example: 'boy', spellings: ['oy', 'oi'] },
  aw: { color: '#4f6d1c', label: 'aw as in saw', example: 'saw', spellings: ['aw', 'au', 'al', 'augh'] },
  uh: { color: '#6b6b8a', label: 'schwa (mumbled vowel)', example: 'about', spellings: ['a', 'e', 'o', 'u'] },
  // r-controlled — darker, earthier
  ar: { color: '#7a2e14', label: 'bossy r: ar', example: 'car', spellings: ['ar'] },
  or: { color: '#4a3a8c', label: 'bossy r: or', example: 'corn', spellings: ['or', 'ore', 'our', 'oar'] },
  er: { color: '#4d5e1f', label: 'bossy r: er', example: 'bird', spellings: ['er', 'ir', 'ur', 'or'] },
  air: { color: '#8c4a1e', label: 'bossy r: air', example: 'hair', spellings: ['air', 'are', 'ere'] },
  eer: { color: '#1f5e6b', label: 'bossy r: eer', example: 'deer', spellings: ['eer', 'ear', 'ere'] },
};

export type FamilyMarkKind = 'none' | 'wavy-underline' | 'underline' | 'bracket-below' | 'dot-below';

export interface FamilyMark {
  kind: FamilyMarkKind;
  description: string;
}

/** Non-color mark per vowel family (works for red-green deficient readers). */
export const FAMILY_MARK: Record<VowelFamily, FamilyMark> = {
  short: { kind: 'none', description: 'no mark (dotted underline when short vowels are marked)' },
  long: { kind: 'underline', description: 'straight line below' },
  other: { kind: 'wavy-underline', description: 'wavy line below' },
  r: { kind: 'bracket-below', description: 'double line below' },
  schwa: { kind: 'dot-below', description: 'small dot below' },
};

/** Real words for each spelling of a sound, for the Full Key (rendered via analyze()). */
export const SPELLING_EXAMPLES: Record<VowelSound, [string, string][]> = {
  a: [['a', 'cat']],
  e: [['e', 'bed'], ['ea', 'head']],
  i: [['i', 'sit'], ['y', 'gym']],
  o: [['o', 'hot']],
  u: [['u', 'cup']],
  A: [['a_e', 'cake'], ['ai', 'rain'], ['ay', 'play'], ['eigh', 'eight'], ['a', 'table']],
  E: [['ee', 'tree'], ['ea', 'eat'], ['e', 'me'], ['y', 'happy'], ['e_e', 'these'], ['ie', 'field']],
  I: [['i_e', 'bike'], ['igh', 'night'], ['y', 'my'], ['i', 'tiger'], ['ie', 'pie']],
  O: [['o_e', 'home'], ['oa', 'boat'], ['ow', 'snow'], ['o', 'go'], ['oe', 'toe']],
  U: [['u_e', 'cute'], ['u', 'music'], ['ew', 'few'], ['ue', 'cue']],
  oo: [['oo', 'moon'], ['ue', 'blue'], ['ew', 'new'], ['ou', 'you'], ['u_e', 'rule']],
  uu: [['oo', 'book'], ['u', 'put'], ['ou', 'could']],
  ow: [['ow', 'cow'], ['ou', 'out']],
  oy: [['oy', 'boy'], ['oi', 'oil']],
  aw: [['aw', 'saw'], ['au', 'haul'], ['al', 'all'], ['augh', 'taught']],
  uh: [['a', 'about'], ['e', 'the'], ['o', 'button'], ['u', 'circus']],
  ar: [['ar', 'car']],
  or: [['or', 'corn'], ['ore', 'more'], ['our', 'four'], ['oar', 'board']],
  er: [['er', 'her'], ['ir', 'bird'], ['ur', 'turn'], ['or', 'work']],
  air: [['air', 'hair'], ['are', 'care'], ['ere', 'there']],
  eer: [['eer', 'deer'], ['ear', 'ear'], ['ere', 'here']],
};
