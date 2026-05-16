import STATIC_DATA from "../static/staticData";
import HeroSection from "../components/landing/HeroSection";
import SectionDivider from "../components/landing/SectionDivider";
import ArchitectureSection from "../components/landing/ArchitectureSection";
import DifferentiatorsSection from "../components/landing/DifferentiatorsSection";
import TechStackSection from "../components/landing/TechStackSection";
import CtaSection from "../components/landing/CtaSection";

const { NAIVE_NODES, ADAPTIVE_NODES, ADAPTIVE_HIGHLIGHTED, DIFFERENTIATORS, TECH_STACK } = STATIC_DATA;


function LandingPage() {

  return (
    <div className="pt-15 font-sans" style={{ paddingTop: 60 }}>
      <HeroSection />
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
      <CtaSection />
    </div>
  );
}

export default LandingPage;

