import { Link } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { Button } from "./ui";

const NAV_LINKS = [
  { label: "Architecture", href: "#how-it-works" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "GitHub", href: "https://github.com/yash-dev26/adaptive-rag", external: true },
];

export default function Nav() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 h-14 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto h-full px-6 flex items-center justify-between">
        <Link to="/" className="font-mono text-sm font-semibold text-zinc-100 tracking-tight no-underline">
          ADAPTIVE RAG
        </Link>

        <div className="flex items-center gap-6">
          {NAV_LINKS.map(({ label, href, external }) => (
            <a
              key={label}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noreferrer" : undefined}
              className="text-sm text-zinc-500 hover:text-zinc-200 transition-colors no-underline"
            >
              {label}
            </a>
          ))}

          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="accent" size="sm" className="font-mono">
                Sign in
              </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <div className="flex items-center gap-4">
              <Link to="/chat" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors no-underline">
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