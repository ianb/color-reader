import { analyze } from '../lexicon';
import { hasHeart, respell } from '../lexicon/respell';
import type { WordAnalysis } from '../lexicon/types';
import type { ChunkMode } from './chunks';
import { Word } from './Word';

/**
 * Reading key for the heart words on a page: each one with a decodable
 * respelling the child can sound out (said → sed, was → wuz).
 */
export function HeartKey({
  words,
  readerClass,
  chunkMode,
}: {
  words: WordAnalysis[];
  readerClass: string;
  chunkMode?: ChunkMode;
}) {
  const seen = new Set<string>();
  const hearts = words.filter((w) => {
    const k = w.word.toLowerCase();
    if (seen.has(k) || !hasHeart(w)) return false;
    seen.add(k);
    return true;
  });
  if (hearts.length === 0) return null;
  return (
    <div className="heart-key">
      <div className="heart-key-title">❤️ heart words — say it like:</div>
      <div className={`heart-key-list ${readerClass}`}>
        {hearts.map((w) => (
          <span key={w.word} className="heart-pair">
            <Word analysis={w} chunkMode={chunkMode} />
            <span className="arrow">→</span>
            <Word analysis={analyze(respell(w))} chunkMode={chunkMode} />
          </span>
        ))}
      </div>
    </div>
  );
}
