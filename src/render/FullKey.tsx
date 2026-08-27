import { analyze } from '../lexicon';
import { ALL_VOWEL_SOUNDS, vowelFamily, type VowelFamily } from '../lexicon/types';
import { readerClass, type ReaderOptions } from './Page';
import { Word } from './Word';
import { FAMILY_MARK, SPELLING_EXAMPLES, VOWEL_META } from './vowels';

const FAMILY_NAME: Record<VowelFamily, string> = {
  short: 'Short vowels',
  long: 'Long vowels',
  other: 'Other vowel teams',
  schwa: 'Schwa',
  r: 'Bossy r',
};

const CONSONANT_ROWS: [string, string, string[]][] = [
  ['two letters, one sound', 'letters pulled close together', ['ship', 'chip', 'duck']],
  ['silent letter', 'gray, dotted line below', ['knee', 'write', 'cake']],
  ['soft c / g', 'small dot below', ['cent', 'gem']],
  ['just remember this', 'small heart above', ['the', 'said', 'of']],
];

/** Printable reference: every vowel sound with its color, mark and spellings, plus consonant marks. */
export function FullKey({ options }: { options: ReaderOptions }) {
  const cls = readerClass({ ...options, showSource: false, markShort: true });
  const style = { '--font-size': `${options.fontSizePt}pt` } as React.CSSProperties;
  let lastFamily: VowelFamily | undefined;
  return (
    <div className="page fullkey">
      <div className="page-title">Full key</div>
      <h2>Vowel sounds — one color per sound, whatever the spelling</h2>
      <table>
        <thead>
          <tr>
            <th />
            <th>sound</th>
            <th>mark</th>
            <th>spellings</th>
          </tr>
        </thead>
        <tbody>
          {ALL_VOWEL_SOUNDS.map((s) => {
            const fam = vowelFamily(s);
            const first = fam !== lastFamily;
            lastFamily = fam;
            const meta = VOWEL_META[s];
            return (
              <tr key={s} className={first ? 'family-start' : undefined}>
                <td>
                  <span className={`swatch g v-${s} fam-${fam}`} />
                </td>
                <td>
                  {first && <div className="mark-desc">{FAMILY_NAME[fam]}</div>}
                  {meta.label}
                </td>
                <td className="mark-desc">{FAMILY_MARK[fam].description}</td>
                <td>
                  <span className={cls} style={style}>
                    {SPELLING_EXAMPLES[s].map(([sp, word]) => (
                      <span key={sp + word} className="spell">
                        <Word analysis={analyze(word)} chunkMode={options.chunkMode} />
                        <span className="spelling">{sp}</span>
                      </span>
                    ))}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <h2>Consonant marks</h2>
      <table>
        <tbody>
          {CONSONANT_ROWS.map(([label, mark, words]) => (
            <tr key={label}>
              <td>{label}</td>
              <td className="mark-desc">{mark}</td>
              <td>
                <span className={cls} style={style}>
                  {words.map((w) => (
                    <span key={w} className="spell">
                      <Word analysis={analyze(w)} chunkMode={options.chunkMode} />
                    </span>
                  ))}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Chunks</h2>
      <table>
        <tbody>
          <tr>
            <td>decoding chunks</td>
            <td className="mark-desc">
              {options.syllableMode === 'band' ? 'alternating shaded band' : options.syllableMode === 'gap' ? 'small gap' : 'not shown'}
            </td>
            <td>
              <span className={cls} style={style}>
                {['rabbit', 'tiger', 'table'].map((w) => (
                  <span key={w} className="spell">
                    <Word analysis={analyze(w)} chunkMode={options.chunkMode} />
                  </span>
                ))}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
