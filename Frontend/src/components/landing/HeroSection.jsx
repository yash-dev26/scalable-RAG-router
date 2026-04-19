function HeroSection({ onLaunch }) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-20 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(16,185,129,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(16,185,129,0.04) 1px,transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-150 h-75 pointer-events-none"
        style={{ background: "radial-gradient(ellipse,rgba(16,185,129,0.08) 0%,transparent 70%)" }}
      />

      <div className="relative z-10 flex flex-col items-center">
        <span className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-mono text-xs px-4 py-1.5 rounded-full mb-8 tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
          ADAPTIVE RAG AGENT 
        </span>

        <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight mb-6 max-w-3xl">
          Transparency &amp; <br /> Self-Correction
          <br />
          <em className="not-italic text-emerald-400">in AI Retrieval</em>
        </h1>

        <p className="max-w-xl text-slate-400 text-lg leading-relaxed mb-12 font-light">
          An explainable document intelligence system powered by LangGraph. Every retrieval step is visible, every
          routing decision is logged, every answer is source-backed.
        </p>

        <div className="flex gap-4 flex-wrap justify-center">
          <button
            onClick={onLaunch}
            className="bg-emerald-500 text-black font-mono font-semibold text-sm px-7 py-3 rounded-lg flex items-center gap-2 hover:opacity-90 hover:-translate-y-0.5 transition-all"
          >
            Get Started →
          </button>
          <a
            href="#how-it-works"
            className="border border-slate-600 text-slate-300 font-mono text-sm px-7 py-3 rounded-lg flex items-center gap-2 hover:border-emerald-500 hover:text-emerald-400 transition-all no-underline"
          >
            See Architecture
          </a>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
