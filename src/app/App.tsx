import { useEffect, useState } from 'react';
import { FullKey, Page, ProofSheet, type ReaderOptions } from '../render';
import { About } from './About';

const STORAGE_KEY = 'color-reader-state-v5';

const DEFAULT_TITLE = 'The Mouse and the Frog';
const DEFAULT_TEXT = [
  'Once upon a time there was a mouse.',
  'She lived in a city by a bridge.',
  'One night she saw some ice on the pond.',
  '"I wish I could dance on it," said the mouse.',
  'A giant frog was sitting by the water.',
  '"Do you want to race?" he said, laughing.',
  'They ran in a circle and fell on their faces.',
  'The ice was rough, though, and gave them a pinch.',
  '"That is enough!" said the mouse.',
  'She went home to eat cheese.',
].join('\n');

type View = 'page' | 'proof' | 'fullkey';

interface AppState {
  title: string;
  text: string;
  view: View;
  options: ReaderOptions;
}

const DEFAULT_STATE: AppState = {
  title: DEFAULT_TITLE,
  text: DEFAULT_TEXT,
  view: 'page',
  options: {
    syllableMode: 'band',
    chunkMode: 'body-coda',
    markShort: true,
    colorMode: 'family',
    keyPosition: 'top',
    fontSizePt: 22,
    showSource: false,
  },
};

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const saved = JSON.parse(raw) as Partial<AppState>;
    return { ...DEFAULT_STATE, ...saved, options: { ...DEFAULT_STATE.options, ...saved.options } };
  } catch {
    return DEFAULT_STATE;
  }
}

const labelCls = 'block text-xs text-gray-600 mt-3 flex items-center gap-2';
const inputCls = 'border border-gray-300 rounded px-1 py-0.5 text-xs bg-white';

export default function App() {
  const [state, setState] = useState<AppState>(loadState);
  const [aboutOpen, setAboutOpen] = useState(false);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  const { options } = state;
  const setOpt = <K extends keyof ReaderOptions>(k: K, v: ReaderOptions[K]) =>
    setState((s) => ({ ...s, options: { ...s.options, [k]: v } }));

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="no-print w-[260px] shrink-0 p-3 bg-white border-r border-gray-200 text-sm overflow-y-auto h-screen sticky top-0">
        <h1 className="font-semibold mb-2">Color Reader</h1>
        <div className="flex items-center gap-2">
          <button
            className="bg-gray-800 text-white rounded px-2 py-1 text-xs"
            onClick={() => window.print()}
          >
            Print
          </button>
          <select
            className={inputCls}
            value={state.view}
            onChange={(e) => setState((s) => ({ ...s, view: e.target.value as View }))}
          >
            <option value="page">Page</option>
            <option value="proof">Proof sheet</option>
            <option value="fullkey">Full key</option>
          </select>
          <button
            className="text-xs text-blue-700 underline ml-auto"
            onClick={() => setAboutOpen(true)}
          >
            About
          </button>
        </div>
        <About open={aboutOpen} onClose={() => setAboutOpen(false)} />

        <label className={labelCls.replace('flex items-center gap-2', '')}>
          Title
          <input
            className={`${inputCls} w-full mt-1`}
            value={state.title}
            onChange={(e) => setState((s) => ({ ...s, title: e.target.value }))}
          />
        </label>
        <label className={labelCls.replace('flex items-center gap-2', '')}>
          Text (one line per printed line)
          <textarea
            className={`${inputCls} w-full mt-1 font-mono h-[60vh]`}
            value={state.text}
            onChange={(e) => setState((s) => ({ ...s, text: e.target.value }))}
          />
        </label>

        <label className={labelCls}>
          Chunks
          <select
            className={inputCls}
            value={options.chunkMode}
            onChange={(e) => setOpt('chunkMode', e.target.value as ReaderOptions['chunkMode'])}
          >
            <option value="body-coda">body + coda (ca·t)</option>
            <option value="onset-rime">onset + rime (c·at)</option>
            <option value="syllable">syllable</option>
          </select>
        </label>
        <label className={labelCls}>
          Vowel color
          <select
            className={inputCls}
            value={options.colorMode}
            onChange={(e) => setOpt('colorMode', e.target.value as ReaderOptions['colorMode'])}
          >
            <option value="family">by family (long / team / r / schwa)</option>
            <option value="sound">by sound (one color each)</option>
            <option value="none">none (marks only)</option>
          </select>
        </label>
        <label className={labelCls}>
          Chunk marking
          <select
            className={inputCls}
            value={options.syllableMode}
            onChange={(e) => setOpt('syllableMode', e.target.value as ReaderOptions['syllableMode'])}
          >
            <option value="band">band</option>
            <option value="gap">gap</option>
            <option value="none">none</option>
          </select>
        </label>
        <label className={labelCls}>
          Key
          <select
            className={inputCls}
            value={options.keyPosition}
            onChange={(e) => setOpt('keyPosition', e.target.value as ReaderOptions['keyPosition'])}
          >
            <option value="top">top</option>
            <option value="bottom">bottom</option>
            <option value="none">none</option>
          </select>
        </label>
        <label className={labelCls}>
          <input
            type="checkbox"
            checked={options.markShort}
            onChange={(e) => setOpt('markShort', e.target.checked)}
          />
          Mark short vowels
        </label>
        <label className={labelCls}>
          <input
            type="checkbox"
            checked={options.showSource}
            onChange={(e) => setOpt('showSource', e.target.checked)}
          />
          Show source badges (rules / unknown)
        </label>
        <label className={labelCls}>
          Font size {options.fontSizePt}pt
          <input
            type="range"
            min={16}
            max={28}
            value={options.fontSizePt}
            onChange={(e) => setOpt('fontSizePt', Number(e.target.value))}
          />
        </label>
      </aside>

      <main className="flex-1 p-6 print:p-0 overflow-x-auto">
        {state.view === 'page' && <Page title={state.title} text={state.text} options={options} />}
        {state.view === 'proof' && <ProofSheet options={options} />}
        {state.view === 'fullkey' && <FullKey options={options} />}
      </main>
    </div>
  );
}
