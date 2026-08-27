import { defaultShort, showsHeart, vowelFamily, type Grapheme, type WordAnalysis } from '../lexicon/types';
import { chunkWord, type ChunkMode } from './chunks';

function graphemeClass(g: Grapheme): string {
  const cls = ['g'];
  if (g.vowel) {
    cls.push(`v-${g.vowel}`, `fam-${vowelFamily(g.vowel)}`);
    // A short sound is "default" only on its own single letter; a team
    // (said, head) or odd letter (was) making a short sound is a diff.
    if (defaultShort(g.letters) !== g.vowel) cls.push('v-marked');
  }
  if (g.digraph) cls.push('digraph');
  if (g.silent) cls.push('silent');
  if (g.soft) cls.push('soft');
  if (showsHeart(g)) cls.push('heart');
  return cls.join(' ');
}

export function Word({
  analysis,
  chunkMode = 'body-coda',
}: {
  analysis: WordAnalysis;
  chunkMode?: ChunkMode;
}) {
  if (analysis.source === 'unknown') {
    return (
      <span className={`word src-${analysis.source}`}>
        {analysis.word}
        <span className="badge">?</span>
      </span>
    );
  }
  const chunks = chunkWord(analysis, chunkMode);
  const cls = `word src-${analysis.source}${chunks.length > 1 ? ' multi' : ''}`;
  return (
    <span className={cls}>
      {chunks.map((c, i) => (
        <span key={i} className={`chunk ${i % 2 === 0 ? 'chunk-a' : 'chunk-b'}`}>
          {c.map((g, j) => (
            <span key={j} className={graphemeClass(g)}>
              {g.letters}
            </span>
          ))}
        </span>
      ))}
      {analysis.source === 'rules' && <span className="badge">r</span>}
    </span>
  );
}
