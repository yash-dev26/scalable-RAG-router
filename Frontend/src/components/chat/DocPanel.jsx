function DocPanel({ sources }) {
  return (
    <div className="w-80 min-w-80 bg-slate-800 border-l border-slate-700 overflow-y-auto p-5">
      <div className="flex items-center justify-between mb-5 pb-2.5 border-b border-slate-700">
        <span className="font-mono text-xs text-slate-400 tracking-widest">RETRIEVED CONTEXT</span>
        <span className="bg-emerald-500/10 text-emerald-400 font-mono text-xs px-2 py-0.5 rounded-full">
          {sources.length}
        </span>
      </div>

      {sources.length === 0 ? (
        <p className="font-mono text-xs text-slate-600 text-center mt-8 leading-relaxed">
          No documents yet.<br />Submit a query to see<br />retrieved context.
        </p>
      ) : (
        sources.map((doc) => (
          <div
            key={doc.id}
            className="bg-slate-700 border border-slate-600 rounded-lg p-3 mb-2.5 hover:border-emerald-500/30 transition-colors"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-xs text-slate-500">#{doc.rank}</span>
              <span className="font-mono text-xs text-slate-600">{doc.id}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-2">{doc.text}</p>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-slate-500">SIM</span>
              <div className="flex-1 h-1 bg-slate-600 rounded-full">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${doc.score * 100}%` }} />
              </div>
              <span className="font-mono text-xs text-emerald-400">{doc.score}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default DocPanel;
