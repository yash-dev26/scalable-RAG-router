function ArchitectureSection({ naiveNodes, adaptiveNodes, adaptiveHighlighted }) {
  return (
    <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-24">
      <p className="font-mono text-xs text-emerald-400 tracking-widest mb-3">ARCHITECTURE</p>
      <h2 className="text-4xl font-bold tracking-tight mb-3">Naive RAG vs. Adaptive RAG</h2>
      <p className="text-slate-400 max-w-lg leading-relaxed mb-12">
        Standard RAG pipelines retrieve blindly. This system plans, rewrites, evaluates, and reranks before
        generating - exposing every decision.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-8">
          <p className="font-mono text-xs text-slate-500 tracking-widest mb-4">◯ NAIVE RAG</p>
          <div className="flex items-center flex-wrap gap-2">
            {naiveNodes.map((node, index) => (
              <span key={node} className="flex items-center gap-2">
                <span className="bg-slate-700 text-slate-300 font-mono text-xs px-3 py-1.5 rounded">{node}</span>
                {index < naiveNodes.length - 1 && <span className="text-slate-600 text-xs">→</span>}
              </span>
            ))}
          </div>
          <p className="text-slate-400 text-sm mt-6 leading-relaxed">
            Fixed retrieval with no adaptation. Query is sent directly to vector DB, top-k results passed to LLM. No
            evaluation, no reranking, no fallback logic.
          </p>
        </div>

        <div className="bg-slate-800 border border-emerald-500/30 rounded-xl p-8">
          <p className="font-mono text-xs text-emerald-400 tracking-widest mb-4">◈ ADAPTIVE RAG</p>
          <div className="flex items-center flex-wrap gap-2">
            {adaptiveNodes.map((node, index) => (
              <span key={node} className="flex items-center gap-2">
                <span
                  className={`font-mono text-xs px-3 py-1.5 rounded ${
                    adaptiveHighlighted.has(node)
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25"
                      : "bg-slate-700 text-slate-300"
                  }`}
                >
                  {node}
                </span>
                {index < adaptiveNodes.length - 1 && <span className="text-slate-600 text-xs">→</span>}
              </span>
            ))}
          </div>
          <p className="text-slate-400 text-sm mt-6 leading-relaxed">
            LangGraph-orchestrated pipeline with a planner node, multi-strategy query rewriting, confidence-scored
            evaluation, and cross-encoder reranking before generation.
          </p>
        </div>
      </div>
    </section>
  );
}

export default ArchitectureSection;
