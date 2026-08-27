import { ALL_CUES, cuesOf, vowelFamily, type CueKind, type VowelFamily, type VowelSound, type WordAnalysis } from '../lexicon/types';
import { CUE_META, exemplarsByCue, spellingOf } from './exemplars';
import { Word } from './Word';
import type { ChunkMode } from './chunks';
import type { ColorMode } from './Page';

export interface KeyProps {
  words: WordAnalysis[];
  known?: Set<string>;
  position: 'top' | 'bottom';
  readerClass: string;
  chunkMode?: ChunkMode;
  markShort?: boolean;
  colorMode?: ColorMode;
}

const FAMILY_LABEL: Record<VowelFamily, string> = {
  short: 'short vowel',
  long: 'long vowel',
  other: 'vowel team',
  r: 'bossy r',
  schwa: 'schwa (mumbled vowel)',
};
/** Representative sound per family, for the swatch class. */
const FAMILY_SOUND: Record<VowelFamily, VowelSound> = {
  short: 'a', long: 'A', other: 'oo', r: 'er', schwa: 'uh',
};

interface Row {
  id: string;
  label: string;
  icon?: string;
  /** Vowel sound (or family representative) used to color the swatch. */
  swatch?: VowelSound;
  words: WordAnalysis[];
  /** Sound to name the spelling of, per exemplar (only in by-sound mode). */
  spellingSound?: VowelSound;
}

function buildRows(byCue: Map<CueKind, WordAnalysis[]>, colorMode: ColorMode): Row[] {
  const rows: Row[] = [];
  const byFamily = new Map<VowelFamily, Row>();
  for (const cue of ALL_CUES) {
    const words = byCue.get(cue);
    if (!words) continue;
    const meta = CUE_META[cue];
    if (!meta.vowel) {
      rows.push({ id: cue, label: meta.label, icon: meta.icon, words });
      continue;
    }
    if (colorMode === 'sound') {
      rows.push({ id: cue, label: meta.label, swatch: meta.vowel, words, spellingSound: meta.vowel });
      continue;
    }
    // Family mode: one row per family; colors are per family, so per-sound
    // rows would be identical swatches.
    const fam = vowelFamily(meta.vowel);
    let row = byFamily.get(fam);
    if (!row) {
      row = { id: `fam-${fam}`, label: FAMILY_LABEL[fam], swatch: FAMILY_SOUND[fam], words: [] };
      byFamily.set(fam, row);
      rows.push(row);
    }
    for (const w of words) if (!row.words.includes(w)) row.words.push(w);
  }
  return rows;
}

/**
 * Give each row its own example word where possible: rows with the fewest
 * candidates choose first, and each picks the unused word with the fewest
 * other cues (the "purest" example). A word is reused only when nothing
 * else on the page exhibits that cue.
 */
function assignExemplars(rows: Row[], includeShort: boolean): void {
  const used = new Set<string>();
  const cueCount = (w: WordAnalysis) => cuesOf(w, includeShort).size;
  const order = [...rows].sort((a, b) => a.words.length - b.words.length);
  for (const row of order) {
    const ranked = [...row.words].sort((a, b) => cueCount(a) - cueCount(b));
    const pick = ranked.find((w) => !used.has(w.word.toLowerCase())) ?? ranked[0];
    if (!pick) continue;
    used.add(pick.word.toLowerCase());
    row.words = [pick];
  }
}

export function Key({ words, known, position, readerClass, chunkMode, markShort, colorMode = 'family' }: KeyProps) {
  const seen = new Set<string>();
  const candidates = words.filter((w) => {
    const k = w.word.toLowerCase();
    if (seen.has(k) || (known && !known.has(k))) return false;
    seen.add(k);
    return true;
  });
  const byCue = exemplarsByCue(candidates, markShort);
  const rows = buildRows(byCue, colorMode);
  assignExemplars(rows, !!markShort);
  if (rows.length === 0) return null;
  const wide = rows.length > 6;
  return (
    <div className={`key key-${position}${wide ? ' key-wide' : ''}`}>
      {rows.map((row) => (
        <RowFragment key={row.id} row={row} readerClass={readerClass} chunkMode={chunkMode} />
      ))}
    </div>
  );
}

function RowFragment({ row, readerClass, chunkMode }: { row: Row; readerClass: string; chunkMode?: ChunkMode }) {
  const shown = row.words.slice(0, 1);
  return (
    <>
      <span aria-hidden="true">
        {row.swatch ? (
          <span className={`${readerClass} swatch-wrap`}>
            <span className={`swatch g v-${row.swatch} fam-${vowelFamily(row.swatch)}`} />
          </span>
        ) : (
          row.icon
        )}
      </span>
      <span className="key-label">{row.label}</span>
      <span className={readerClass}>
        {shown.map((w, i) => (
          <span key={i}>
            {i > 0 && ' '}
            <Word analysis={w} chunkMode={chunkMode} />
            {row.spellingSound && <span className="spelling">{spellingOf(w, row.spellingSound)}</span>}
          </span>
        ))}
      </span>
    </>
  );
}
