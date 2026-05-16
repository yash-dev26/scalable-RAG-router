import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FontLink from "./components/FontLink";
import Nav from "./components/Nav";
import LandingPage from "./pages/LandingPage";
import ChatPage from "./pages/ChatPage";
import {
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/clerk-react";

export default function App() {
  return (
    <Router>
      <FontLink />
      <div className="bg-[#0f1113] text-[#e6e6e6] min-h-screen flex flex-col">
        <Routes>
          <Route path="/" element={<><Nav /><LandingPage /></>} />
          <Route path="/chat" element={<>
                <SignedIn>
                  <ChatPage />
                </SignedIn>

                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            } />
        </Routes>
      </div>
    </Router>
  );
}
