import { Card, CardHeader } from "../ui";

function Dots() {
  return (
    <div className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-emerald-500"
          style={{ animation: `pulse-dot 1.2s ease-in-out ${i * 0.2}s infinite` }}
        />
      ))}
    </div>
  );
}

function LoadingIndicator({ message, trace }) {
  return (
    <Card className="max-w-3xl w-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Dots />
          <span className="text-xs text-zinc-500 font-mono">{message || "Processing…"}</span>
        </div>
        {trace.length > 0 && (
          <div className="mt-2 space-y-1 pl-1">
            {trace.map((t) => (
              <div key={`${t.node}-${t.status}`} className="flex items-center gap-2 text-[11px]">
                <span className={t.status === "done" ? "text-emerald-400" : "text-amber-400"}>
                  {t.status === "done" ? "✓" : "·"}
                </span>
                <span className="font-mono text-zinc-500">{t.node}</span>
                <span className="text-zinc-700">{t.detail}</span>
              </div>
            ))}
          </div>
        )}
      </CardHeader>
    </Card>
  );
}

export default LoadingIndicator;
