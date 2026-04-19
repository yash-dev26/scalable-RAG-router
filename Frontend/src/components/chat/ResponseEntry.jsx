import { useState } from "react";
import PipelineStep from "./PipelineStep";

function renderMd(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong class='text-white font-semibold'>$1</strong>")
    .replace(/`(.*?)`/g, "<code class='bg-slate-700 text-emerald-400 font-mono text-xs px-1.5 py-0.5 rounded'>$1</code>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n\n/g, "<br/><br/>")
    .replace(/\n- /g, "<br/>• ");
}

function ResponseEntry({ entry }) {
  const [pipelineOpen, setPipelineOpen] = useState(false);

  return (
    <div className="max-w-3xl w-full">
      <div className="flex items-start gap-3 mb-3">
        <span className="font-mono text-emerald-400 text-sm pt-0.5 shrink-0">$&gt;</span>
        <span className="font-mono text-sm text-slate-200 leading-relaxed">{entry.query}</span>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-700 bg-emerald-500/4">
          <span className="font-mono text-xs text-emerald-400 tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            RESPONSE
            {entry.cacheHit && (
              <span className="ml-2 bg-amber-500/15 border border-amber-500/25 text-amber-400 font-mono text-xs px-2 py-0.5 rounded">
                ⚡ cache hit
              </span>
            )}
          </span>
          <span className="font-mono text-xs text-slate-600">{entry.processingMs}ms</span>
        </div>

        <div className="px-5 py-5">
          <p
            className="text-slate-300 text-sm leading-loose"
            dangerouslySetInnerHTML={{ __html: renderMd(entry.answer) }}
          />
        </div>

        <div className="px-5 py-3 border-t border-slate-700">
          <p className="font-mono text-xs text-slate-600 tracking-widest mb-2">SOURCES USED</p>
          <div className="flex flex-wrap gap-2">
            {entry.sources.map((source) => (
              <div
                key={source.id}
                className="bg-slate-700 border border-slate-600 rounded-md px-2.5 py-1 font-mono text-xs text-slate-300 flex items-center gap-2"
              >
                <span>{source.id}</span>
                <span className="text-emerald-400">{source.score}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="px-5 py-3 border-t border-slate-700 flex items-center gap-4">
          <span className="font-mono text-xs text-slate-600 tracking-widest">CONFIDENCE</span>
          <div className="flex-1 h-1 bg-slate-700 rounded-full">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-700"
              style={{ width: `${entry.confidence * 100}%` }}
            />
          </div>
          <span className="font-mono text-xs text-emerald-400">{entry.confidence}</span>
        </div>

        <div className="px-5 py-3 border-t border-slate-700">
          <button
            onClick={() => setPipelineOpen((prev) => !prev)}
            className="bg-transparent border border-slate-700 text-slate-400 font-mono text-xs px-3.5 py-1.5 rounded-md flex items-center gap-2 hover:border-emerald-500 hover:text-emerald-400 transition-all"
          >
            <span>{pipelineOpen ? "▾" : "▸"}</span>
            View Processing Steps
          </button>
          {pipelineOpen && (
            <div className="mt-4">
              {entry.pipeline.map((step, index) => (
                <PipelineStep key={step.name} step={step} isLast={index === entry.pipeline.length - 1} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResponseEntry;
