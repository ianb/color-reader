import { analyze } from '../lexicon';
import type { ReaderOptions } from './Page';
import { readerClass } from './Page';
import { Word } from './Word';

/** Every grapheme grouping (brief §4c) with 2–3 words in context. */
export const PROOF_UNITS: [string, string[]][] = [
  ['sh', ['ship', 'fish', 'shop']],
  ['ch', ['chip', 'much', 'chat']],
  ['th', ['this', 'bath', 'thin']],
  ['wh', ['when', 'whip', 'white']],
  ['ph', ['phone', 'graph']],
  ['ng', ['sing', 'long', 'ring']],
  ['ck', ['duck', 'back', 'kick']],
  ['qu', ['quit', 'quick', 'queen']],
  ['tch', ['catch', 'match', 'itch']],
  ['dge', ['bridge', 'judge', 'edge']],
  ['kn', ['knee', 'knot', 'knife']],
  ['wr', ['write', 'wrap', 'wrist']],
  ['mb', ['lamb', 'comb', 'thumb']],
  ['ai', ['rain', 'tail', 'wait']],
  ['ay', ['day', 'play', 'stay']],
  ['ee', ['see', 'feet', 'tree']],
  ['ea', ['eat', 'read', 'head']],
  ['oa', ['boat', 'road', 'soap']],
  ['ow', ['cow', 'snow', 'down']],
  ['ou', ['out', 'loud', 'you']],
  ['oi', ['oil', 'coin', 'join']],
  ['oy', ['toy', 'boy', 'joy']],
  ['oo', ['moon', 'book', 'food']],
  ['igh', ['night', 'high', 'light']],
  ['ar', ['car', 'far', 'star']],
  ['or', ['for', 'corn', 'fork']],
  ['er', ['her', 'fern', 'tiger']],
  ['ir', ['bird', 'girl', 'first']],
  ['ur', ['turn', 'hurt', 'burn']],
  ['au', ['haul', 'fault']],
  ['aw', ['saw', 'paw', 'draw']],
  ['ew', ['new', 'few', 'chew']],
  ['ue', ['blue', 'glue', 'true']],
  ['magic e', ['cake', 'bike', 'home']],
  ['soft c/g', ['cent', 'city', 'gem']],
  ['heart', ['the', 'said', 'of']],
];

export function ProofSheet({ options }: { options: ReaderOptions }) {
  const cls = readerClass({ ...options, showSource: true });
  return (
    <div className="proof">
      {PROOF_UNITS.map(([unit, words]) => (
        <div key={unit} className="unit">
          <div className="unit-name">{unit}</div>
          <div className={cls} style={{ '--font-size': `${options.fontSizePt}pt` } as React.CSSProperties}>
            {words.map((w, i) => (
              <span key={w}>
                {i > 0 && ' '}
                <Word analysis={analyze(w)} />
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
