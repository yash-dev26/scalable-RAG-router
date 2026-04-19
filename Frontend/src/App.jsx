import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FontLink from "./components/FontLink";
import Nav from "./components/Nav";
import LandingPage from "./pages/LandingPage";
import ChatPage from "./pages/ChatPage";

export default function App() {
  return (
    <Router>
      <FontLink />
      <div className="bg-slate-950 text-slate-200 min-h-screen">
        <Nav />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </div>
    </Router>
  );
}
