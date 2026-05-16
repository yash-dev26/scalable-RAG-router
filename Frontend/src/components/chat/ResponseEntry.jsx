import PipelineStep from "./PipelineStep";
import ReactMarkdown from "react-markdown";

function ResponseEntry({ entry }) {
  return (
    <div className="max-w-3xl w-full space-y-2">
      {/* Query */}
      <div className="flex items-start gap-3">
        <span className="text-[11px] font-mono text-zinc-600 pt-0.5 shrink-0 uppercase tracking-wider">You</span>
        <span className="text-sm text-zinc-200 leading-relaxed">{entry.query}</span>
      </div>

      {/* Answer card */}
      <Card>
        <CardHeader>
          {entry.cacheHit && (
            <div className="mb-2">
              <Badge variant="warning">Cached</Badge>
            </div>
          )}
          <div className="text-sm text-zinc-300 leading-relaxed prose-sm max-w-none">
            <ReactMarkdown
              components={{
                strong: ({ children }) => <strong className="text-zinc-100 font-semibold">{children}</strong>,
                code: ({ children }) => (
                  <code className="bg-zinc-800 text-emerald-400 font-mono text-[11px] px-1.5 py-0.5 rounded">
                    {children}
                  </code>
                ),
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-0.5">{children}</ul>,
                li: ({ children }) => <li className="text-zinc-300">{children}</li>,
              }}
            >
              {entry.answer}
            </ReactMarkdown>
          </div>
        </CardHeader>

        {entry.pipeline?.length > 0 && (
          <CardFooter>
            <Collapsible
              trigger={(open) => (
                <Button variant="ghost" size="sm" className="font-mono text-[11px] h-7 px-2">
                  <span className="text-zinc-600">{open ? "▾" : "▸"}</span>
                  Pipeline steps
                </Button>
              )}
            >
              <div className="mt-3 pl-1">
                {entry.pipeline.map((step, i) => (
                  <PipelineStep
                    key={`${step.name}-${i}`}
                    step={step}
                    isLast={i === entry.pipeline.length - 1}
                  />
                ))}
              </div>
            </Collapsible>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

export default ResponseEntry;
