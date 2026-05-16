import { Badge } from "../ui";

function PipelineStep({ step, isLast }) {
  const done = step.status === "done";
  return (
    <div className="flex items-start gap-3 pb-3 relative">
      {!isLast && (
        <div className="absolute left-[13px] top-6 bottom-0 w-px bg-zinc-800" />
      )}
      <div
        className={[
          "mt-0.5 w-6 h-6 rounded-full border flex items-center justify-center text-[10px] shrink-0 z-10",
          done
            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
            : "border-zinc-700 bg-zinc-900 text-zinc-600",
        ].join(" ")}
      >
        {done ? "✓" : "·"}
      </div>
      <div className="min-w-0 pt-0.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={["text-xs font-mono", done ? "text-zinc-300" : "text-zinc-600"].join(" ")}>
            {step.name}
          </span>
          {step.badge === "rewrite" && <Badge variant="accent">rewrite</Badge>}
          {step.badge === "cache" && <Badge variant="warning">cached</Badge>}
        </div>
        <p className="text-[11px] text-zinc-600 mt-0.5 leading-relaxed">{step.detail}</p>
      </div>
    </div>
  );
}

export default PipelineStep;
