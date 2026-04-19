function LoadingEntry({ step, loadingSteps, trace = [], message = "" }) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/70 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex gap-1 shrink-0">
          {[0, 1, 2].map((idx) => (
            <span
              key={idx}
              className="w-1.5 h-1.5 rounded-full bg-emerald-400"
              style={{ animation: `bounce 1.2s ease-in-out ${idx * 0.2}s infinite` }}
            />
          ))}
        </div>
        <div className="min-w-0">
          <p className="font-mono text-xs text-slate-300 truncate">
            {message || loadingSteps[step] || "Processing..."}
          </p>
          {trace.length > 0 && (
            <div className="mt-2 space-y-1">
              {trace.map((item) => (
                <div key={`${item.node}-${item.status}-${item.detail}`} className="flex items-start gap-2 text-xs font-mono text-slate-500">
                  <span className={item.status === "done" ? "text-emerald-400" : "text-amber-400"}>
                    {item.status === "done" ? "✓" : "•"}
                  </span>
                  <span className="text-slate-400">{item.node}</span>
                  <span className="text-slate-600">{item.detail}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoadingEntry;
