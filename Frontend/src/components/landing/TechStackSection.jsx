function TechStackSection({ techStack }) {
  return (
    <section className="max-w-6xl mx-auto px-6 py-24">
      <p className="font-mono text-xs text-emerald-400 tracking-widest mb-3">TECH STACK</p>
      <h2 className="text-4xl font-bold tracking-tight mb-10">Built on production-grade tooling</h2>
      <div className="flex flex-wrap gap-4">
        {techStack.map((tech) => (
          <div
            key={tech.name}
            className="bg-slate-800 border border-slate-700 rounded-xl px-5 py-3.5 flex items-center gap-3 hover:border-emerald-500/40 transition-colors"
          >
            <span className={`w-2 h-2 rounded-full ${tech.color}`} />
            <span className="font-mono font-medium text-sm text-slate-200">{tech.name}</span>
            <span className="text-slate-600 text-xs">- {tech.desc}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TechStackSection;
