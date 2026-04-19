import STATIC_DATA from "../static/staticData";
import { useNavigate } from "react-router-dom";
import HeroSection from "../components/landing/HeroSection";
import SectionDivider from "../components/landing/SectionDivider";
import ArchitectureSection from "../components/landing/ArchitectureSection";
import DifferentiatorsSection from "../components/landing/DifferentiatorsSection";
import TechStackSection from "../components/landing/TechStackSection";
import DemoPreviewSection from "../components/landing/DemoPreviewSection";
import CtaSection from "../components/landing/CtaSection";

const { NAIVE_NODES, ADAPTIVE_NODES, ADAPTIVE_HIGHLIGHTED, DIFFERENTIATORS, TECH_STACK } = STATIC_DATA;


function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="pt-15" style={{ paddingTop: 60, fontFamily: "'Sora', sans-serif" }}>
      <HeroSection onLaunch={() => navigate("/chat")} />
      <SectionDivider />
      <ArchitectureSection
        naiveNodes={NAIVE_NODES}
        adaptiveNodes={ADAPTIVE_NODES}
        adaptiveHighlighted={ADAPTIVE_HIGHLIGHTED}
      />
      <SectionDivider />
      <DifferentiatorsSection differentiators={DIFFERENTIATORS} />
      <SectionDivider />
      <TechStackSection techStack={TECH_STACK} />
      <SectionDivider />
      <DemoPreviewSection />
      <CtaSection onLaunch={() => navigate("/chat")} />
    </div>
  );
}

export default LandingPage;

