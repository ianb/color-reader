# Reading Practice on Paper — Project Brief

Handoff notes from a design conversation. Goal: kick this off as its own project in Claude Code.

## 1. What this is

A screen-free (or screen-optional) reading-practice loop for early readers (currently two nephews, ages 5 and 6). The child reads a printed page aloud while tracking under the words with a pen. The system captures audio and pen position, aligns both against the known text, and uses that to (a) offer precomputed help at the right moment and (b) generate a better-tuned page for next time.

The page is the interface. The pen and the mic are the sensors. The printer and voice are the outputs. No screen is required.

This sits alongside the broader "box" project (Callback Box / voice + buttons + paper assistant), but is its own thing.

## 2. Hardware (decided or leaning)

- **Pen:** Neo Smartpen M1+ (Ncode optical pen; ~128MB onboard storage; Bluetooth). Uses standard **D1 refills**; Neo's verified list is Zebra 4C, Pilot 8F/8M, Parker D1 — unverified tips may lower recognition. A **Lamy M55 orange highlighter D1 refill** is the preferred tip for reading sessions: the child highlights as they read, leaving a visible trail, and orange ink is invisible to the pen's IR sensor.
- **Paper:** Ncode-patterned pages we print ourselves. Options, easiest first: (1) print content onto Neo's blank pre-dotted sheets; (2) composite our content onto Neo's downloadable Ncode PDFs (plain layout) before printing; (3) Neo's open-source Ncode generation SDK (C#/C++, free test key, license for commercial use) for full control of page IDs and sizes.
- **Printing constraints:** dots must be pure K toner at fine resolution; use a color laser with a PostScript/PCL driver (rich-black conversion breaks the dots). **Content must NOT be pure K** — use CMY-built colors or dark gray/navy. Thin black text is tolerable; solid black fills blind the pen. Each Ncode PDF bundle encodes the same 50 page IDs, so track page IDs ourselves if re-printing (the Neo app otherwise overwrites strokes).
- **Audio in:** headset with boom mic per child (wired preferred for a fixed station). Candidates: JLab JBuddies Learn (wired), JLab JBuddies Play (wireless), BuddyPhones School+ Wireless. Headset color doubles as the child's identity token.
- **Audio out:** already covered.
- **Paper out:** thermal receipt printer for post-session slips (hard words today, a star per sentence — an artifact a 6-year-old can carry to an adult).
- **Buttons (optional):** Stream Deck+ as push-to-talk / status, if the box is present.

## 3. Data capture

- **Pen:** Neo publishes a TypeScript Web Bluetooth SDK (`web_pen_sdk`) that runs in Chrome/Edge on desktop. Each dot = (page ID, x, y, force, ms timestamp). Page IDs are baked into the Ncode pattern, so strokes arrive pre-sorted by physical page. Streams live over BLE, or pulls stored strokes on demand (connect requires a user click — fine for a deliberate "capture" step). Verify the web SDK exposes offline-data retrieval; the native SDKs do. Alternative for batched mode: record pen-clock vs host-clock offset at connect and align afterward.
- **Audio:** record the session. Because the text is known, use **forced alignment** rather than free STT: WhisperX or torchaudio CTC forced alignment for batch; a streaming STT with word timestamps (Deepgram/AssemblyAI/Apple on-device) re-aligned against the reference sentence for live. Output is a "reading cursor": current word + how long they've been on it. Kids' speech is hard for free STT; alignment against a reference is robust to pauses, restarts, and sounding-out.
- **Two cursors:** audio cursor (what they said, when) + pen cursor (where they're pointing). Together:
  - pen dwells on a word, no matching audio for 2–3s → stuck → offer help
  - audio ahead of pen → reciting from memory, not decoding → slow down
  - pen skips a line → "go back"
  - correct → silence (silence is the reward)
- **Batched-first, with precomputed assistance.** The agent works at page-generation time: for each word on the page, precompute an assistance ladder (say the word / say the first sound / split the syllables / point to the key exemplar). The live loop is alignment + rule matching against stored hints — no model call, deterministic, fast. The agent returns post-session to read what happened and generate the next page. Latency caution: a stall prompt that arrives late lands after the child has already worked it out and feels like an interruption; err toward waiting too long.

## 4. Page markup scheme

Principle: **a diff against the default.** Letters carry their identity; marks appear only where a letter isn't doing its usual job. Unmarked text is the reward state. Marks fade per word as the child masters the rule. Three orthogonal channels:

### 4a. Hue = vowel mode
The letter says *which* vowel; the color says *which mode*. Same color for the same sound across spellings (bike/night/my/pie all one color).
- short: default, unmarked
- long: one color
- other (r-controlled, schwa, odd teams like "ou"): another color
- vowel teams are grouped (see spacing) and colored by the sound they make

### 4b. Monochrome marks = consonant news
- tie under consonant digraphs (sh, ch, th, wh, ph, ng, ck, qu, tch, dge)
- dotted underline / gray for silent letters (kn, wr, gn, mb, gh in night)
- one mark for "soft" c/g
- heart mark for "just memorize this bit" (the "heart words" convention kids see in UFLI-style classrooms)
- doubled consonants (ll, ss, ff): no treatment, or lightest tightening
- th voiced/unvoiced: don't distinguish for beginners; per-child add-on if a kid stalls on it

### 4c. Spatial = syllables
- syllable boundary shown by an extra gap (~0.1em) or an alternating faint gray band behind each syllable. Band is better early (a visible object for the finger); gap is the natural fade-to-zero. Don't use hue for syllables.
- three spacing levels, only two meant to be *seen*: obvious syllable gap; normal; digraph tightening (-0.03 to -0.05em) that is felt, not read — the tie mark is the signal, tightening is texture.
- word spaces very large (early-reader convention), so the proportions are unambiguous: word space > syllable gap > normal > tight.
- short lines (4–5 words), large type (~18–24pt), generous leading.
- syllable split follows decoding conventions (VC/CV rab-bit; V/CV ti-ger; keep digraphs together; C-le takes the consonant) so the split *explains* the vowel color (open syllable → long). Dictionary hyphenation is not the same thing; derive from phonemes, sanity-check against Moby.
- "ght" is not a unit: it's a vowel team + t (igh+t, augh+t, ough+t) with silent gh. The vowel-centered decomposition handles it with no special case. When gh sounds (/f/ in laugh), it's a consonant digraph.
- grouping units to support: ~15 consonant units + ~20 vowel teams ≈ 35 total. No new glyphs; letters stay themselves, just closer.
- avoidance (mishap, hothouse, uphill, ingest) is free if tightening is driven by the aligned grapheme string, not a font ligature rule. If ever using OpenType ligatures, suppress with ZWNJ (U+200C), not ZWSP.

### 4d. Color key on the page
- a legend built from words the child already reads reliably, chosen by set-cover: fewest known words that together exhibit every cue type on the page. Multi-syllable words do double duty. Weight by mastery + recency.
- reading the key aloud is a free warm-up.
- the key is instrumented: pen landing on the key mid-sentence tells you which cue hasn't landed.
- **color-to-meaning mapping never changes across pages; only the exemplars do.**

### 4e. Per-child settings
- mark short vowels too at the very start, fade within weeks
- letters where the default is wrong more often than right (y, ea): always mark
- single- vs double-storey *a*: match the school's handwriting if they drill ball-and-stick
- redundancy: every color cue is paired with a shape/underline cue (≈1 in 12 boys is red-green deficient)

## 5. Linguistic data

- **CMUdict** (public domain): phonemes for ~135k words incl. alternates. No grapheme alignment.
- **Grapheme–phoneme alignment:** run CMUdict through Phonetisaurus's aligner or m2m-aligner → per-word chain of (letters → phoneme), e.g. `sh|i|p`, `kn|igh|t`. This is the coloring unit. Compute once, store.
- **Syllables:** Moby Hyphenator (public domain) for sanity; derive decoding splits from phonemes + rules above.
- **"Memorize this" detection:** score each (grapheme → phoneme) pair by frequency across the lexicon; rare pair → heart mark. Berndt, Reggia & Mitchum (1987) published English GPC probabilities; can recompute from our aligned lexicon.
- **Heteronyms** (read/read, wind/wind): small fixed list; CMUdict has both; disambiguate by sentence context at page-generation time (in scope for a model).
- **Coverage gap:** kid vocabulary (names, "mommy", sound words). Per-child override table.
- **Vocabulary lists:** Dolch 220, Fry first 100/300 (high-frequency, many irregular → heart-word pool); UFLI scope & sequence for decodable ordering (CVC short-a → short-i → digraphs → blends → magic-e …). Target = decodable-at-stage ∩ high-frequency, as a query over the aligned lexicon. Not Ogden Basic English (adult ESL list).

## 6. Typography

- **Andika** (SIL, free; on Google Fonts): literacy face, even/loose spacing (helps tuning), tailed single-storey *a* (handwriting-like), OpenType alternates for a/g etc. — primary choice.
- **Lexend** (Google, free): alternative; more "app" than "book".
- Commercial "infant" cuts (Sassoon Primary, Bembo/Plantin/Gill Sans Infant) are the traditional UK reader look; not needed.
- Avoid Comic Sans and handwriting-practice fonts (KG Primary etc.).
- Render HTML/CSS → PDF; spacing via `letter-spacing` on spans; a small per-font override table for the ~35 groupings, plus per-pair corrections where the font's kerning fights (f, r, t neighbors). Render a proof sheet of every grouping in context, tune once.

## 7. Precedents (steal ideas, not artifacts)

- **Words in Color** (Gattegno, 1962): one color per phoneme, ~47 colors, the "Fidel" chart. Effective but hard to learn (kids learned colors, not letters). Charts copyrighted, "Fidel" trademarked, sold by Educational Solutions — don't reproduce. The one idea to keep: same color for the same sound across spellings, applied only to vowels.
- **Heart words** (UFLI, Really Great Reading): irregular part marked with a heart.
- **Initial Teaching Alphabet** (1960s): joined digraph glyphs; worked early, had a transition problem to normal print. Cautionary tale for true ligatures.
- **Body-coda vs onset-rime blending:** the "buh-ih-guh" failure comes from isolated stops not existing as sounds; starting with the consonant already attached to its vowel ("bi" then "g") sidesteps schwa insertion. Kana is CV for the same reason.
- **Six syllable types** (closed, open, VCe, vowel team, r-controlled, C-le): the taxonomy teachers use; type predicts sound.
- **Infant fonts research** (Walker, Reading University, early 2000s): kids read double-storey *a* fine; single-storey preference came from teachers (handwriting congruence), not reading performance.

## 8. Experiments the data can settle

All measured as stall time per word from pen + audio timestamps. Alternate versions across days.
- body-coda vs onset-rime grouping
- vowel color with vs without the syllable band
- syllable gap vs syllable band
- whether digraph tightening adds anything over the tie mark

## 9. Suggested phases

0. **Lexicon + renderer.** Aligned CMUdict, syllable splits, GPC rarity scores, vocab-stage filter; HTML/CSS page renderer with the markup scheme and a color key; proof sheet of all groupings in Andika.
1. **Paper + pen.** Ncode overlay printing (option 2), pen capture via web SDK, stroke → word mapping from known word boxes. Confirm offline retrieval in the web SDK.
2. **Audio, batched.** Record sessions; forced alignment; produce the two-cursor timeline; post-session report + receipt slip.
3. **Rules + precomputed hints.** Stall/ahead/skip detection over recorded sessions; assistance ladder per word generated at page time; next-page generation from session data (fading, key exemplars, per-child overrides).
4. **Live loop.** Streaming alignment + rule matching with no model in the loop; voice prompts.

Note: Callback Box is TypeScript; the pen SDK is TypeScript/web; alignment tooling (WhisperX, torchaudio, Phonetisaurus) is Python. Expect a Python service for alignment/lexicon and TS for capture/rendering.

## 10. Open questions

- Does `web_pen_sdk` expose offline stroke retrieval, or only live streaming?
- Does the Neo app need to be involved at all, or can we own the whole pipeline?
- Ncode PDF page-ID management when re-printing bundles.
- Which color laser is available and whether its driver passes pure K.
- Exact spacing values (start: syllable gap 0.1em, tight -0.03 to -0.05em, word space ≥0.33em) — tune on the proof sheet.