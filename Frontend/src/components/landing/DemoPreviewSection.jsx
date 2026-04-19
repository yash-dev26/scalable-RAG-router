function DemoPreviewSection() {
  const mockDocs = [
    { score: 0.91, rank: 1, text: "Adaptive RAG extends standard RAG by incorporating a planning phase..." },
    {
      score: 0.84,
      rank: 2,
      text: "Unlike naive retrieval pipelines, adaptive systems maintain a confidence evaluator...",
    },
    { score: 0.76, rank: 3, text: "Query rewriting improves retrieval precision by up to 34%..." },
  ];

  return (
    <section className="max-w-6xl mx-auto px-6 py-24">
      <p className="font-mono text-xs text-emerald-400 tracking-widest mb-3">DEMO PREVIEW</p>
      <h2 className="text-4xl font-bold tracking-tight mb-3">Not a chatbot. A pipeline inspector.</h2>
      <p className="text-slate-400 max-w-lg leading-relaxed mb-10">
        Every response exposes the internal retrieval path, document scores, and confidence metrics.
      </p>

      <div className="bg-slate-800 border border-emerald-500/20 rounded-2xl overflow-hidden">
        <div className="bg-slate-900 px-5 py-3 flex items-center gap-2 border-b border-slate-700">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
          <span className="ml-3 font-mono text-xs text-slate-600">adaptive-rag / session:a3f2b1</span>
        </div>

        <div className="grid md:grid-cols-[1fr_320px]">
          <div className="p-6 border-r border-slate-700">
            <p className="font-mono text-xs text-emerald-400 tracking-widest mb-2">ANSWER</p>
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-4 text-xs text-slate-300 leading-relaxed mb-5">
              Adaptive RAG introduces a planning layer that evaluates whether retrieval is necessary, then rewrites the
              query before fetching documents from the vector database...
            </div>
            <p className="font-mono text-xs text-emerald-400 tracking-widest mb-2">PIPELINE</p>
            <div className="flex flex-wrap gap-1.5 mb-5">
              {["pre_planner", "multi_rewrite", "retrieve", "evaluator", "rerank", "generate"].map((step) => (
                <span
                  key={step}
                  className="bg-emerald-500/8 border border-emerald-500/20 text-emerald-400 font-mono text-xs px-2 py-0.5 rounded"
                >
                  {step}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-slate-600">CONFIDENCE</span>
              <div className="flex-1 h-1 bg-slate-700 rounded-full">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "89%" }} />
              </div>
              <span className="font-mono text-xs text-emerald-400">0.89</span>
            </div>
          </div>

          <div className="p-5 bg-slate-900/50">
            <p className="font-mono text-xs text-emerald-400 tracking-widest mb-3">RETRIEVED CONTEXT</p>
            {mockDocs.map((doc) => (
              <div key={doc.rank} className="bg-slate-700 rounded-lg p-3 mb-2">
                <p className="font-mono text-xs text-slate-500 mb-1">#{doc.rank}</p>
                <p className="text-xs text-slate-400 leading-relaxed mb-2">{doc.text}</p>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-slate-500">SIM</span>
                  <div className="flex-1 h-1 bg-slate-600 rounded-full">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${doc.score * 100}%` }} />
                  </div>
                  <span className="font-mono text-xs text-emerald-400">{doc.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default DemoPreviewSection;
