# color-reader

A printable reading guide for beginning readers. Paste in a passage and the app
renders it with a small, consistent set of decoding cues layered on top of
ordinary letters:

- **Hue = vowel mode.** Short vowels are unmarked; long vowels get one color,
  "other" vowels (r-controlled, schwa, odd teams) another. Same sound, same
  color, regardless of spelling.
- **Monochrome marks = consonant news.** Tie under consonant digraphs, dotted
  underline for silent letters, a mark for soft c/g, and a heart for
  "just memorize this bit". Every color cue is paired with a non-color cue.
- **Spacing = syllables.** Syllable boundaries are shown by a small gap or a
  faint band; digraphs are tightened slightly; word spaces are large.
- **Per-page key.** Each page carries a legend built from words on that page.
  The color-to-meaning mapping never changes; only the example words do.

The scheme is described in `initial-brief.md` §4–§6 (the hardware/audio
sections of the brief are out of scope for this repo). The app is purely
static: no server, no accounts, nothing leaves the browser.

## Development

```sh
npm install
npm run dev      # dev server
npm test         # vitest
npm run build    # tsc + vite build -> dist/
npm run preview  # serve dist/ locally
```

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, which installs, tests,
builds with `GITHUB_PAGES=1` (so Vite uses `/color-reader/` as the base path),
and publishes `dist/` to GitHub Pages. In the repo settings, set Pages
"Source" to "GitHub Actions" once. The repo is `ianb/color-reader`, so the site
lives at `https://ianb.github.io/color-reader/`.

## Lexicon notation

Word entries are hand-authored in a compact notation documented at the top of
`src/lexicon/notation.ts`, e.g. `knight -> "k:X.n.igh:L.t"` (syllables joined
by `-`, graphemes by `.`, codes after `:` — `S`/`L`/`O` vowel mode, `D`
digraph, `X` silent, `C` soft c/g, `H` heart).
