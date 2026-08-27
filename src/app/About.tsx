import { useEffect, useRef } from 'react';

const REPO = 'https://github.com/ianb/color-reader';

export function About({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      className="no-print m-auto rounded-lg shadow-xl p-6 max-w-lg text-sm leading-relaxed text-gray-800 backdrop:bg-black/30"
    >
      <h2 className="text-lg font-semibold mb-2">About Color Reader</h2>
      <p className="mb-3">
        A tool for making printable reading pages for very beginning readers. Paste
        in a story and it comes back with the letters lightly marked up to show how
        each word is sounded out, with a key on the same page.
      </p>
      <p className="mb-3">
        Letters keep their identity; marks appear only where a letter is not doing
        its usual job. Underlines describe vowels (straight = long, wavy = vowel
        team, bracket = bossy r, dot = schwa), silent letters are grayed, soft{' '}
        <i>c</i>/<i>g</i> get a small mark, and a heart flags a letter you just have
        to remember. Shaded chunks show how to break the word up. Plain, unmarked
        text is the goal.
      </p>
      <p className="mb-3">
        Nothing leaves your browser; there is no server. This is an experiment in
        progress.
      </p>
      <p className="mb-4">
        Source, the full write-up of the idea, and issues:{' '}
        <a className="text-blue-700 underline" href={REPO} target="_blank" rel="noreferrer">
          github.com/ianb/color-reader
        </a>
      </p>
      <button
        className="bg-gray-800 text-white rounded px-3 py-1 text-xs"
        onClick={onClose}
      >
        Close
      </button>
    </dialog>
  );
}
