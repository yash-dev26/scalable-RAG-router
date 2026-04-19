function PipelineStep({ step, isLast }) {
  return (
    <div className="flex items-start gap-3 pb-5 relative">
      {!isLast && <div className="absolute left-3.5 top-7 bottom-0 w-px bg-slate-700" />}
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 z-10
        ${
          step.status === "done"
            ? "bg-emerald-500/12 border border-emerald-500/30 text-emerald-400"
            : "bg-slate-700 border border-slate-600 text-slate-500"
        }`}
      >
        {step.status === "done" ? "✓" : "–"}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`font-mono text-xs font-semibold ${step.status === "done" ? "text-emerald-400" : "text-slate-600"}`}
          >
            {step.name}
          </span>
          {step.badge === "rewrite" && (
            <span className="bg-emerald-500/12 text-emerald-400 font-mono text-xs px-2 py-0.5 rounded">
              rewrite
            </span>
          )}
          {step.badge === "cache" && (
            <span className="bg-amber-500/15 text-amber-400 font-mono text-xs px-2 py-0.5 rounded">
              cache
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{step.detail}</p>
      </div>
    </div>
  );
}

export default PipelineStep;
