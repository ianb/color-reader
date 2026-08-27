/**
 * Compact hand-authorable notation for lexicon entries.
 *
 *   entry   := syllable ('-' syllable)*
 *   syllable:= grapheme ('.' grapheme)*
 *   grapheme:= letters ('/' sound)? (':' codes)? ('=' says)?
 *   sound   := a VowelSound id (see types.ts):
 *               a e i o u      short (default for a lone vowel letter; y → i)
 *               A E I O U      long (U = /yoo/: cute, use, few)
 *               oo uu ow oy aw uh   moon book cow boy saw schwa
 *               ar or er air eer    car for her hair deer
 *   codes   := one or more of:
 *     D  consonant digraph
 *     X  silent
 *     C  soft c / soft g
 *     H  heart (memorize this bit)
 *   says    := letters to substitute in a decodable respelling of the word
 *              (used for the heart-words key): of -> "o/u:H.f:H=v" respells
 *              as "uv"; one -> "o/u:H=wu.n.e:X" respells as "wun". Vowels
 *              default to a standard respelling of their sound (see respell.ts).
 *
 * Examples:
 *   ship    -> "sh:D.i.p"
 *   knight  -> "k:X.n.igh/I.t"
 *   tiger   -> "t.i/I-g.er/er"
 *   rabbit  -> "r.a.b-b.i.t"
 *   cake    -> "c.a/A.k.e:X"
 *   said    -> "s.ai/e:H.d"
 *   the     -> "th:D.e/uh:H"
 *   cent    -> "c:C.e.n.t"
 *   moon    -> "m.oo/oo.n"      book -> "b.oo/uu.k"
 *
 * A grapheme with no sound that consists solely of vowel letters is a
 * short vowel (a e i o u → itself; lone y → i). Anything else is a consonant.
 */
import { ALL_VOWEL_SOUNDS, defaultShort, vowelFamily, type Grapheme, type Syllable, type VowelSound, type WordAnalysis } from './types';

const VOWEL_LETTERS = /^[aeiouy]+$/i;
const SOUND_SET = new Set<string>(ALL_VOWEL_SOUNDS);

export function parseEntry(word: string, entry: string): WordAnalysis {
  const syllables: Syllable[] = entry.split('-').map((syl) => ({
    graphemes: syl.split('.').map(parseGrapheme),
  }));
  const joined = syllables
    .flatMap((s) => s.graphemes.map((g) => g.letters))
    .join('');
  if (joined.toLowerCase() !== word.toLowerCase()) {
    throw new Error(
      `Lexicon entry for "${word}" spells "${joined}" (entry: ${entry})`,
    );
  }
  return { word, syllables, source: 'lexicon' };
}

function parseGrapheme(tok: string): Grapheme {
  const [body, says] = tok.split('=');
  const [head, codes = ''] = body.split(':');
  const [letters, sound] = head.split('/');
  if (!letters) throw new Error(`Empty grapheme in token "${tok}"`);
  const g: Grapheme = { letters };
  if (says !== undefined) g.says = says;
  if (sound !== undefined) {
    if (!SOUND_SET.has(sound)) throw new Error(`Unknown vowel sound "${sound}" in token "${tok}"`);
    g.vowel = sound as VowelSound;
  }
  for (const c of codes) {
    switch (c) {
      case 'D': g.digraph = true; break;
      case 'X': g.silent = true; break;
      case 'C': g.soft = true; break;
      case 'H': g.heart = true; break;
      default: throw new Error(`Unknown code "${c}" in token "${tok}"`);
    }
  }
  if (!g.vowel && !g.silent && !g.digraph && VOWEL_LETTERS.test(letters)) {
    if (letters.length === 1) g.vowel = defaultShort(letters);
    else throw new Error(`Vowel team "${letters}" needs an explicit /sound in token "${tok}"`);
  }
  return g;
}

/** Inverse of parseEntry, for round-trip tests and tooling. */
export function formatEntry(a: WordAnalysis): string {
  return a.syllables
    .map((s) =>
      s.graphemes
        .map((g) => {
          let tok = g.letters;
          if (g.vowel) {
            const implicit =
              g.letters.length === 1 && defaultShort(g.letters) === g.vowel && vowelFamily(g.vowel) === 'short';
            if (!implicit) tok += `/${g.vowel}`;
          }
          let codes = '';
          if (g.digraph) codes += 'D';
          if (g.silent) codes += 'X';
          if (g.soft) codes += 'C';
          if (g.heart) codes += 'H';
          if (codes) tok += `:${codes}`;
          if (g.says !== undefined) tok += `=${g.says}`;
          return tok;
        })
        .join('.'),
    )
    .join('-');
}
