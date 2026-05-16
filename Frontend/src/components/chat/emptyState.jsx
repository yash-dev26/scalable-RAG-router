const SUGGESTIONS = [
  "What is adaptive RAG?",
  "Explain query rewriting strategies",
];

function EmptyState({ onSelect }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20 text-center">
      <p className="text-sm text-zinc-600">Upload a document, then ask a question.</p>
      <div className="flex flex-col gap-2 w-full max-w-xs">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => onSelect(s)}
            className="rounded-md border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-left text-xs font-mono text-zinc-500 hover:border-zinc-700 hover:text-zinc-300 transition-colors"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

export default EmptyState;