import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

function Nav() {
    const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 h-15 bg-slate-950/85 backdrop-blur-md border-b border-emerald-500/15"
      style={{ height: 60 }}
    >
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
        {!isAuthenticated ? (
        <button
          onClick={() => loginWithRedirect()}
          className="bg-emerald-500 text-black font-mono font-semibold text-xs px-4 py-1.5 rounded-md"
        >
          Sign Up
        </button>
      ) : (
        <button
          onClick={() =>
            logout({
              logoutParams: {
                returnTo: window.location.origin,
              },
            })
          }
        >
          Logout
        </button>
      )}
        </div>
    </nav>
  );
}

export default Nav;
