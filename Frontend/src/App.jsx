import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import FontLink from "./components/FontLink";
import Nav from "./components/Nav";
import LandingPage from "./pages/LandingPage";
import ChatPage from "./pages/ChatPage";

export default function App() {
  return (
    <Router>
      <FontLink />
      <div className="bg-[#0f1113] text-[#e6e6e6] ">
        <Routes>
          <Route path="/" element={<><Nav /><LandingPage /></>} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </div>
    </Router>
  );
}
