import { useAuth0 } from "@auth0/auth0-react";

function CtaSection({ onLaunch }) {

    const { loginWithRedirect, isAuthenticated } = useAuth0();
  return (
    <section className="max-w-6xl mx-auto px-6 pb-24">
      <div className="bg-linear-to-br from-emerald-500/10 to-emerald-500/3 border border-emerald-500/20 rounded-2xl p-12 md:p-16 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-[-0.03em] mb-4">See the pipeline in action</h2>
        <p className="text-slate-400 mb-8 text-base md:text-lg">Query your documents. Watch every retrieval step unfold in real time.</p>
        <button
          onClick={() => {
            if (!isAuthenticated) {
            loginWithRedirect();
            } else {
            onLaunch();
            }
        }}
          className="bg-emerald-500 text-black font-semibold text-sm px-8 py-3 rounded-lg hover:opacity-90 hover:-translate-y-0.5 transition-all inline-flex items-center gap-2"
        >
          Launch App →
        </button>
      </div>
    </section>
  );
}

export default CtaSection;
