import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import Nav from "./components/Nav";
import LandingPage from "./pages/LandingPage";
import ChatPage from "./pages/ChatPage";

export default function App() {
  return (
    <Router>
      <div className="bg-zinc-950 text-zinc-100 min-h-screen flex flex-col">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Nav />
                <LandingPage />
              </>
            }
          />
          <Route
            path="/chat"
            element={
              <>
                <SignedIn>
                  <ChatPage />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}