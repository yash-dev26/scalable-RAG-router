import {
  SignedIn,
  SignedOut,
  SignInButton,
} from "@clerk/clerk-react";

import { Link } from "react-router-dom";

function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-10 overflow-hidden">
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

        <h1 className="text-4xl md:text-6xl font-semibold leading-[1.02] tracking-[-0.04em] mb-6 max-w-3xl">
          Transparency &amp; <br /> Self-Correction
          <br />
          <em className="not-italic text-emerald-400">in AI Retrieval</em>
        </h1>

        <p className="max-w-xl text-slate-400 text-base md:text-lg leading-relaxed mb-12 font-normal">
          An explainable document intelligence system powered by LangGraph. Every retrieval step is visible, every
          routing decision is logged, every answer is source-backed.
        </p>

        <div className="flex gap-4 flex-wrap justify-center">
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
          <a
            href="#how-it-works"
            className="border border-slate-600 text-slate-300 text-sm px-7 py-3 rounded-lg flex items-center gap-2 hover:border-emerald-500 hover:text-emerald-400 transition-all no-underline"
          >
            See Architecture
          </a>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
