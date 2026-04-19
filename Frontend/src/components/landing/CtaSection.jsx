function CtaSection({ onLaunch }) {
  return (
    <section className="max-w-6xl mx-auto px-6 pb-24">
      <div className="bg-linear-to-br from-emerald-500/10 to-emerald-500/3 border border-emerald-500/20 rounded-2xl p-16 text-center">
        <h2 className="text-4xl font-bold mb-4">See the pipeline in action</h2>
        <p className="text-slate-400 mb-8 text-lg">Query your documents. Watch every retrieval step unfold in real time.</p>
        <button
          onClick={onLaunch}
          className="bg-emerald-500 text-black font-mono font-semibold text-sm px-8 py-3 rounded-lg hover:opacity-90 hover:-translate-y-0.5 transition-all inline-flex items-center gap-2"
        >
          Launch App →
        </button>
      </div>
    </section>
  );
}

export default CtaSection;
