# AGENTS.md — working notes for coding agents

Color Reader is a static web app that marks up text for very beginning readers
and prints it. Read `README.md` first for the pedagogy; this file is about how
the code is organized and which decisions are already made.

Live site: https://ianb.github.io/color-reader/ · Repo: github.com/ianb/color-reader

## Scope

- In scope: the markup scheme, the word lexicon, the page/key rendering, print
  layout, and the editing UI. Everything is client-side; no server, no accounts.
- Out of scope (deliberately, for now): the pen hardware, Ncode paper, audio
  capture, speech recognition, and the live feedback loop described in
  `initial-brief.md` §2–3 and §9 phases 1–4. Don't build toward them or
  mention them in user-facing text.

## Stack and commands

- Vite 8 + React 19 + TypeScript, Tailwind v4 (for UI chrome only), vitest.
- `npm run dev` · `npm test` · `npm run build` (runs `tsc -b` first, so type
  errors fail the build) · `npm run preview`.
- Deploy: push to `main` → `.github/workflows/deploy.yml` → GitHub Pages.
  `GITHUB_PAGES=1` makes Vite use `/color-reader/` as the base path.
- Fonts: Andika (primary) and Lexend from Google Fonts, linked in `index.html`.

## Layout of the code

```
src/lexicon/    word knowledge
  types.ts        Grapheme / Syllable / WordAnalysis, VowelSound, cue kinds
  notation.ts     compact entry notation + parseEntry / formatEntry
  words-*.ts      hand-authored lexicon, merged in words.ts (~800 words)
  rules.ts        rule-based decoder for words not in the lexicon
  respell.ts      decodable respellings for heart words (said → sed)
  index.ts        analyze(word), tokenize(text)
src/render/     everything that draws marked-up text
  Word.tsx        one word → spans with cue classes
  chunks.ts       decoding-chunk splitter (body-coda / onset-rime / syllable)
  Key.tsx         per-page key; exemplars.ts has the cue metadata + set-cover
  HeartKey.tsx    heart words with respellings
  Page.tsx        a printable page; ReaderOptions lives here
  FullKey.tsx     reference sheet of all marks; ProofSheet.tsx for typography
  vowels.ts       per-sound colors/labels; reader.css is the reading stylesheet
src/app/        the editor UI (App.tsx) and About dialog
```

Tailwind classes are fine for the sidebar and dialogs. The reading text itself
is styled only by hand-written CSS in `src/render/reader.css` using custom
properties, so that print output is fully under our control.

## The data model in one paragraph

A word is a list of syllables; a syllable is a list of graphemes; a grapheme is
a run of letters with optional flags: `vowel` (a `VowelSound` id), `digraph`,
`silent`, `soft`, `heart`, and `says` (respelling letters for odd consonants).
`VowelSound` is per *sound*, not per spelling: short `a e i o u`, long
`A E I O U`, teams `oo uu ow oy aw uh` (moon, book, cow, boy, saw, schwa), and
r-controlled `ar or er air eer`. `vowelFamily()` collapses these to
short / long / other / r / schwa, which is what the marks are keyed on.

## Lexicon notation

Entries are strings like `k:X.n.igh/I.t` (knight) or `t.i/I-g.er/er` (tiger):
`-` between syllables, `.` between graphemes, `/sound` on vowels (a lone vowel
letter with its default short sound needs none; every vowel team must have
one), `:codes` from `D` digraph, `X` silent, `C` soft c/g, `H` heart, and
`=says` for what an odd consonant actually says (`o/u:H.f:H=v` for *of*). The
letters must concatenate exactly to the word — `parseEntry` throws otherwise,
and the tests parse every entry.

Conventions when adding words:

- Syllable splits follow decoding conventions, not dictionary hyphenation:
  VC/CV (*rab-bit*), V/CV with the open vowel long (*ti-ger*), C-le takes the
  consonant (*ta-ble*, with `l.e:X`), digraphs never split, vowel+r is one
  grapheme (`er/er`). Doubled consonants across a syllable split are two
  graphemes; inside one syllable they're one (`b.e.ll`).
- Heart only the specific grapheme that is irregular, and only when it's a
  letter-identity oddity: a vowel letter/team making a *different short vowel*
  (*said*, *was*, *head*) or a consonant saying another sound (*of*, *is*).
  A vowel making a long/team/r/schwa sound is explained by its mark and gets
  no heart even if the spelling is rare (*though*, *to*, *you*). Give hearted
  consonants a `=says`.
- `wa-` saying "wo" (*want, wash, watch*) is a regular pattern: `a/o`, no heart.
  *was* is `w.a/u:H.s:H=z` (reads "wuz").
- Schwa is marked `/uh` where a reader would mumble it (*upon*, *about*, *the*),
  but never guessed by the rule decoder.
- Three lists (`words-sight`, `words-decodable`, `words-nouns`) are merged;
  a test fails if the same word has different entries in two lists.

## Rendering decisions that are settled

- Marks on vowels are underlines: straight = long, wavy = team, bracket
  beneath = bossy r, dot beneath = schwa, dotted = short (only when
  "mark short vowels" is on, or when a team is making a short sound). No
  overlines.
- Color is secondary. Default is one tint per *family*; per-sound colors are
  kept as an experimental option; "none" is also an option. Never rely on
  color alone. Never use pure black (#000) for text — printers turn it into
  the Ncode-blinding rich black; body ink is navy `#1f2a44`.
- Digraphs get −0.04em tightening and no tie mark.
- Silent letters: gray + dotted underline. Soft c/g: small dot below.
- Heart: small red ♥ above the grapheme. Hearted words also appear in the
  heart-word key with a respelling.
- Chunks: alternating white / light-gray shading, first chunk always white,
  band hugging the letters (not the full line height). Default chunking is
  body-coda, which cuts after every vowel across the whole word
  (*ca·t*, *ra·bbi·t*); a word whose only vowel has no onset (*in*, *at*)
  is one chunk.
- Line breaks in the textarea are the printed line breaks; lines wrap only if
  they are wider than the page. Large type (22pt default), line-height 2.4,
  extra word spacing.
- Key: one row per cue present on the page; in family color mode vowel rows
  collapse to families. Each row gets a *distinct* example word, preferring
  the word with the fewest other cues, and never a one- or two-letter word
  unless nothing else qualifies. Hearted letters never serve as sound
  examples.
- Key exemplars are chosen from the page's words; a `known` set of words can
  restrict candidates (intended for per-child mastery lists, not wired to UI
  yet).

## Things the user has asked for repeatedly

- Show the change in the browser (dev server + screenshot) before declaring
  done; layout regressions have been the most common problem.
- When a default changes, bump `STORAGE_KEY` in `src/app/App.tsx` so stale
  localStorage settings don't hide it.
- Keep explanations of pedagogy in prose; keep code details out of README.
