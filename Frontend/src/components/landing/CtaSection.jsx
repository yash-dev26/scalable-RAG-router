import {
  SignedIn,
  SignedOut,
  SignInButton,
} from "@clerk/clerk-react";

import { Link } from "react-router-dom";

function CtaSection() {

  return (
    <section className="max-w-6xl mx-auto px-6 pb-24">
      <div className="bg-linear-to-br from-emerald-500/10 to-emerald-500/3 border border-emerald-500/20 rounded-2xl p-12 md:p-16 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-[-0.03em] mb-4">See the pipeline in action</h2>
        <p className="text-slate-400 mb-8 text-base md:text-lg">Query your documents. Watch every retrieval step unfold in real time.</p>
        <SignedOut>
          <SignInButton mode="modal">
            <button className="bg-emerald-500 text-black px-6 py-3 rounded-lg font-semibold">
              Get Started
            </button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <Link to="/chat">
            <button className="bg-emerald-500 text-black px-6 py-3 rounded-lg font-semibold">
              Open App
            </button>
          </Link>
        </SignedIn>
      </div>
    </section>
  );
}

export default CtaSection;
