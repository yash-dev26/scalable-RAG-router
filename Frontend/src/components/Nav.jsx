import { Link } from "react-router-dom";

function Nav() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 h-15 bg-slate-950/85 backdrop-blur-md border-b border-emerald-500/15"
      style={{ height: 60 }}
    >
      <Link
        to="/"
        className="flex items-center gap-2.5 font-mono text-emerald-400 text-xs font-semibold no-underline tracking-wider"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981] animate-pulse" />
        adaptive-rag
      </Link>
      <div className="flex items-center gap-8">
        <a
          href="#how-it-works"
          className="font-mono text-slate-400 text-xs hover:text-emerald-400 transition-colors no-underline"
        >
          Architecture
        </a>
        <a
          href="https://github.com/yash-dev26/adaptive-rag"
          target="_blank"
          rel="noreferrer"
          className="font-mono text-slate-400 text-xs hover:text-emerald-400 transition-colors no-underline"
        >
          GitHub
        </a>
        <Link
          to="/chat"
          className="bg-emerald-500 text-black font-mono font-semibold text-xs px-4 py-1.5 rounded-md hover:opacity-85 transition-opacity no-underline"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
}

export default Nav;
