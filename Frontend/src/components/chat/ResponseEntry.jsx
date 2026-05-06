import { useState } from "react";
import PipelineStep from "./PipelineStep";
import ReactMarkdown from "react-markdown";


function ResponseEntry({ entry }) {
  const [pipelineOpen, setPipelineOpen] = useState(false);

  return (
    <div className="max-w-3xl w-full">
      <div className="flex items-start gap-3 mb-3">
        <span className="text-slate-500 text-sm pt-0.5 shrink-0">You</span>
        <span className="font-mono text-sm text-slate-200 leading-relaxed">{entry.query}</span>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-700">
          <span className="font-mono text-xs text-slate-500">
          {entry.cacheHit ? "⚡ cached" : ""}
          </span>
          <span className="font-mono text-xs text-slate-600">{entry.processingMs}ms</span>
        </div>

        <div className="px-5 py-5">
          <div className="text-slate-300 text-sm leading-loose prose-sm max-w-none">
            <ReactMarkdown
              components={{
                strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
                code: ({ children }) => <code className="bg-slate-700 text-emerald-400 font-mono text-xs px-1.5 py-0.5 rounded">{children}</code>,
                p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
                li: ({ children }) => <li className="text-slate-300">{children}</li>,
              }}
            >
              {entry.answer}
            </ReactMarkdown>
          </div>
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
