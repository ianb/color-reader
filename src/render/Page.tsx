import { tokenize, type Paragraph } from '../lexicon';
import type { WordAnalysis } from '../lexicon/types';
import { Key } from './Key';
import { HeartKey } from './HeartKey';
import { Word } from './Word';
import type { ChunkMode } from './chunks';

export type SyllableMode = 'gap' | 'band' | 'none';
export type KeyPosition = 'top' | 'bottom' | 'none';
export type ColorMode = 'none' | 'family' | 'sound';

export interface ReaderOptions {
  syllableMode: SyllableMode;
  chunkMode: ChunkMode;
  markShort: boolean;
  colorMode: ColorMode;
  keyPosition: KeyPosition;
  fontSizePt: number;
  showSource: boolean;
}

export function readerClass(o: ReaderOptions): string {
  const cls = ['reader'];
  if (o.syllableMode !== 'none') cls.push(`mode-${o.syllableMode}`);
  cls.push(`color-${o.colorMode ?? 'family'}`);
  if (o.markShort) cls.push('mark-short');
  if (o.showSource) cls.push('show-source');
  return cls.join(' ');
}

export interface PageProps {
  title?: string;
  text: string;
  options: ReaderOptions;
  known?: Set<string>;
}

export function Page({ title, text, options, known }: PageProps) {
  const paragraphs = tokenize(text);
  const words: WordAnalysis[] = paragraphs.flatMap((p) =>
    p.flatMap((line) =>
      line.flatMap((t) => (t.kind === 'word' ? [t.analysis] : [])),
    ),
  );
  const cls = readerClass(options);
  const key =
    options.keyPosition === 'none' ? null : (
      <Key words={words} known={known} position={options.keyPosition} readerClass={cls} chunkMode={options.chunkMode} markShort={options.markShort} colorMode={options.colorMode} />
    );
  return (
    <div className="page">
      {title && <div className="page-title">{title}</div>}
      {options.keyPosition === 'top' && key}
      <div className={cls} style={{ '--font-size': `${options.fontSizePt}pt` } as React.CSSProperties}>
        {paragraphs.map((p, i) => (
          <ParagraphView key={i} paragraph={p} chunkMode={options.chunkMode} />
        ))}
      </div>
      {options.keyPosition === 'bottom' && key}
      {options.keyPosition !== 'none' && (
        <HeartKey words={words} readerClass={cls} chunkMode={options.chunkMode} />
      )}
    </div>
  );
}

function ParagraphView({ paragraph, chunkMode }: { paragraph: Paragraph; chunkMode: ChunkMode }) {
  return (
    <div className="para">
      {paragraph.map((line, i) => (
        <div key={i} className="line">
          {line.map((t, j) => {
            if (t.kind === 'space') return ' ';
            if (t.kind === 'punct') return <span key={j} className="punct">{t.text}</span>;
            return <Word key={j} analysis={t.analysis} chunkMode={chunkMode} />;
          })}
        </div>
      ))}
    </div>
  );
}
