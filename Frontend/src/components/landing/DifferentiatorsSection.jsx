function DifferentiatorsSection({ differentiators }) {
  return (
    <section className="max-w-6xl mx-auto px-6 py-24">
      <p className="font-mono text-xs text-emerald-400 tracking-widest mb-3">CAPABILITIES</p>
      <h2 className="text-4xl font-bold tracking-tight mb-12">What makes this system non-trivial</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {differentiators.map((item) => (
          <div
            key={item.title}
            className="bg-slate-800 border border-slate-700 rounded-xl p-7 hover:border-emerald-500/40 hover:-translate-y-0.5 transition-all"
          >
            <div className="w-9 h-9 bg-emerald-500/10 rounded-lg flex items-center justify-center text-base mb-4">
              {item.icon}
            </div>
            <h3 className="font-semibold text-sm mb-2 text-white">{item.title}</h3>
            <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default DifferentiatorsSection;
