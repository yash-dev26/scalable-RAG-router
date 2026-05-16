import { Separator } from "../components/ui";
import HeroSection from "../components/landing/HeroSection";
import ArchitectureSection from "../components/landing/ArchitectureSection";
import DifferentiatorsSection from "../components/landing/Capabilities.jsx";
import TechStackSection from "../components/landing/TechStackSection";
import CtaSection from "../components/landing/CtaSection";

export default function LandingPage() {
  return (
    <main className="pt-14">
      <HeroSection />
      <Separator />
      <ArchitectureSection />
      <Separator />
      <DifferentiatorsSection />
      <Separator />
      <TechStackSection />
      <Separator />
      <CtaSection />
    </main>
  );
}