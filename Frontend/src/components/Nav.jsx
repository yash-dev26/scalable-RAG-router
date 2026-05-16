import { Link } from "react-router-dom";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";

function Nav() {

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center h-15 bg-slate-950/85 backdrop-blur-md border-b border-emerald-500/15"
      style={{ height: 60 }}
    >
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2.5 text-emerald-400 text-sm font-semibold no-underline tracking-tight"
        >
          ADAPTIVE RAG AGENT
        </Link>
        <div className="flex items-center gap-8">
        <a
          href="#how-it-works"
          className="text-slate-400 text-sm hover:text-emerald-400 transition-colors no-underline"
        >
          Architecture
        </a>
        <a
          href="#capabilities"
          className="text-slate-400 text-sm hover:text-emerald-400 transition-colors no-underline"
        >
          Capabilities
        </a>
        <a
          href="https://github.com/yash-dev26/adaptive-rag"
          target="_blank"
          rel="noreferrer"
          className="text-slate-400 text-sm hover:text-emerald-400 transition-colors no-underline"
        >
          GitHub
        </a>
        <SignedOut>
          <SignInButton mode="modal">
            <button className="bg-emerald-500 text-black font-mono font-semibold text-xs px-4 py-1.5 rounded-md">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <div className="flex items-center gap-4">
            <Link
              to="/chat"
              className="text-slate-300 no-underline"
            >
              Chat
            </Link>

            <UserButton />
          </div>
        </SignedIn>
      </div>
      </div>
    </nav>
  );
}
export default Nav;
