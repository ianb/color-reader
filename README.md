# Color Reader

**Try it: <https://ianb.github.io/color-reader/>**

A tool for making printable reading pages for very beginning readers. Paste in a
story, and it comes back with the letters lightly marked up so a child can see
how each word is meant to be sounded out — and with a key on the same page so
they (or the adult next to them) never have to remember the system.

It is meant to be printed. Screens work too, but paper is the point.

## The idea

A five-year-old sounding out *said* or *knight* or *cake* is fighting the fact
that English letters don't do the same job every time. Most phonics programs
handle this by controlling the words: "decodable" readers only use patterns the
child has been taught. That works, but the stories are dull and the child can't
read anything else.

Color Reader takes the opposite approach: leave the text alone and annotate it.
Every letter keeps its identity and its place. Marks appear only where a letter
is *not* doing its ordinary job, so that plain, unmarked text is the reward
state, and the marks can fade away as the child no longer needs them.

The principles behind the design:

- **A diff against the default.** A short vowel on its own letter (*cat*, *bed*)
  is the default and needs no mark. A long vowel, a vowel team, a silent letter,
  a soft *c* — those are departures, and get a mark. The reader learns to trust
  unmarked letters.
- **Same mark for the same job, whatever the spelling.** The long-*a* in *cake*,
  *rain*, *play* and *eight* all look the same to the reader. The mark describes
  the sound, not the spelling.
- **Letters stay letters.** No new glyphs, no joined digraphs, no rewriting of
  the word. The Initial Teaching Alphabet of the 1960s taught children to read
  its special alphabet and then had trouble moving them to normal print; Color
  Reader never shows the child anything but normal print.
- **Color is never the only cue.** Every color is paired with a shape (an
  underline, a dot, a bracket), so the system works in black and white and for
  the roughly one in twelve boys who are red-green color-deficient. In practice
  the shapes turned out to carry most of the meaning, and color is now just
  reinforcement.
- **Don't recode letters.** An earlier version colored every vowel by its
  precise sound, so the *ai* in *said* was painted "short e". That is exactly
  the trap of Gattegno's *Words in Color* (1962), whose forty-odd colors were
  effective but taught children the colors instead of the letters. The current
  scheme uses a handful of coarse categories and leaves the rest to the marks
  and the key.
- **Be honest about the weird ones.** Some spellings can't be explained, only
  remembered. Those get a heart — the "heart word" convention many classrooms
  already use — and a separate mini-key that spells the word the way it
  actually sounds.

## What the marks mean

**Vowels.** Underlines describe what a vowel is doing:

- no mark — a short vowel saying its usual sound (*cat*, *pond*). Optionally, a
  faint dotted underline for the very first weeks.
- straight underline — a long vowel: *she*, *time*, *rain*, *night*.
- wavy underline — a vowel team with its own sound: *moon*, *book*, *cow*,
  *boy*, *saw*, *you*.
- bracket beneath — "bossy r": the vowel-plus-*r* unit in *car*, *for*, *her*,
  *bird*, *water*.
- small dot beneath — a schwa, the mumbled vowel in *upon*, *about*, *the*.

By default the vowel is also tinted by that same family (long, team, bossy r,
schwa). You can switch the tint off, or switch to one color per vowel sound if
you want to experiment.

**Consonants and silent letters.**

- Two letters that make one sound (*sh*, *ch*, *th*, *ck*, *ng*, *tch*, *dge*)
  are set very slightly closer together — something felt rather than read.
- Silent letters are grayed out with a dotted underline: the *e* in *cake*, the
  *k* in *knight*, the *l* in *could*.
- A soft *c* or *g* (*city*, *ice*, *giant*) gets a small mark below.
- A **heart** sits over a letter that is simply doing the wrong thing and has to
  be memorized: the *ai* in *said*, the *a* in *was*, the *f* in *of* (which
  says *v*), the *gh* in *rough*.

**Chunks.** Each word is broken into decoding chunks shown by alternating white
and light-gray shading, always starting white. The default chunking is
"body + coda": the consonant is kept attached to the vowel that follows it —
*ca·t*, *fi·sh*, *ra·bbi·t* — because a child who sounds out "buh–ih–guh"
inserts vowels that aren't there, while "bi" then "g" doesn't have that problem.
Syllable and onset–rime chunking are available as alternatives, along with a
plain gap instead of shading.

**Typography.** Large type (about 22pt), wide word spacing, generous line
spacing, and short lines that you control with line breaks. The face is Andika,
SIL's literacy font, with a single-storey *a* and clear letter shapes.

## The keys

Every page carries its own key, built from the words on that page. Each row of
the key shows one cue (long vowel, silent letter, soft *c*, …) with an example
word chosen from the text — preferably a plain word that shows only that one
thing, and never a one- or two-letter word. Because the examples are words the
child is about to read, reading the key aloud doubles as a warm-up. The meaning
of each mark never changes from page to page; only the examples do.

Below the story, a second small key lists the heart words on the page with a
sound-it-out respelling: *said → sed*, *was → wuz*, *of → uv*, *once → wuns*,
*laughing → lafing*. The respelling is itself marked up, so the child can decode
it with the same rules and then match it to the real word.

There is also a **Full key** view — a printable reference sheet of every vowel
sound, its mark, and its common spellings, plus the consonant marks — and a
**Proof sheet** showing every letter grouping in context, for tuning the
typography.

## Where the word knowledge comes from

Roughly eight hundred common words — the Dolch and Fry sight-word lists, the
words used in early phonics sequences, and everyday child vocabulary — are
marked up by hand: syllable breaks, which letters form a unit, what sound each
vowel makes, what is silent, what needs a heart. Words outside that list are
decoded by rules (digraphs, magic-*e*, vowel teams, open and closed syllables,
common endings). Rule-decoded words are usually right for regular spellings and
can be wrong for irregular ones; a debugging option marks them so they can be
checked and added to the hand list.

Syllable splits follow decoding conventions rather than dictionary hyphenation
(*rab-bit*, *ti-ger*, *ta-ble*), so that the split explains the vowel: an open
syllable ends in a vowel, and that vowel is long.

## Status

This is an experiment in progress. The marks, the spacing, the colors, and the
chunking are all being tried out on real children and adjusted. Nothing here is
settled.

## Development

```sh
npm install
npm run dev      # local dev server
npm test
npm run build    # -> dist/
```

Pushing to `main` deploys to GitHub Pages automatically. The hand-authored word
list lives in `src/lexicon/` in a compact notation documented in
`src/lexicon/notation.ts`.
