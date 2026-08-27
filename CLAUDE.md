# color-reader

Static React/TS/Tailwind app that renders text for beginning readers using the markup scheme in `initial-brief.md` §4 (vowel hue, consonant marks, syllable spacing, color key). Print output is the primary target; screens are secondary.

- `src/lexicon/` — data model (`types.ts`), entry notation (`notation.ts`), hand-authored word database (`words.ts`), rule-based fallback decoder (`rules.ts`), `analyze()` entry point (`index.ts`).
- `src/render/` — React components + CSS for the marked-up text, key, and print layout.
- `src/app/` — editor UI.
- Tests: `npm test` (vitest). Build: `npm run build`. Deploys to GitHub Pages from `main`.

Conventions: lexicon entries use the notation documented in `src/lexicon/notation.ts`. Never use pure black (#000) for content — print constraints (§2). Every color cue is paired with a non-color cue.
