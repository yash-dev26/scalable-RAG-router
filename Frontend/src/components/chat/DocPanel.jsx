function ContextPanel({ sources }) {
  return (
    <aside className="w-72 shrink-0 border-l border-zinc-800 flex flex-col">
      <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
        <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Context</span>
        <Badge variant="default">{sources.length}</Badge>
      </div>

      <ScrollArea className="flex-1 p-4 space-y-3">
        {sources.length === 0 ? (
          <p className="text-[11px] text-zinc-700 text-center mt-6 leading-relaxed">
            No context retrieved yet.
            <br />Submit a query to see sources.
          </p>
        ) : (
          sources.map((doc) => (
            <div
              key={doc.id}
              className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-zinc-600">#{doc.rank}</span>
                {doc.page && (
                  <Badge variant="accent">p.{doc.page}</Badge>
                )}
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed line-clamp-4">{doc.text}</p>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-zinc-700">SIM</span>
                <div className="flex-1 h-0.5 bg-zinc-800 rounded-full">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${Math.min(doc.score * 100, 100)}%` }}
                  />
                </div>
                <span className="font-mono text-[10px] text-emerald-500">
                  {doc.score.toFixed(2)}
                </span>
              </div>
            </div>
          ))
        )}
      </ScrollArea>
    </aside>
  );
}
export default ContextPanel;
