import {
  SignedIn,
  SignedOut,
  SignInButton,
} from "@clerk/clerk-react";

import { Link } from "react-router-dom";
import { Button } from "../ui";


function CtaSection() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-24 text-center">
      <h2 className="text-3xl font-semibold tracking-tight text-zinc-100 mb-3">Ready to try it?</h2>
      <p className="text-zinc-500 mb-8 max-w-sm mx-auto">Upload a PDF and ask questions with full pipeline transparency.</p>
      <SignedOut>
        <SignInButton mode="modal">
          <Button variant="accent" size="lg" className="font-mono">
            Sign in to start
          </Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <Link to="/chat">
          <Button variant="accent" size="lg" className="font-mono">
            Open chat →
          </Button>
        </Link>
      </SignedIn>
    </section>
  );
}
export default CtaSection;
