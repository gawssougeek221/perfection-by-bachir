import HeroScrub from '@/components/HeroScrub';
import MorphEffects from '@/components/MorphEffects';
import ScrubTransition from '@/components/ui/ScrubTransition';
import ClipPathTransition from '@/components/ui/ClipPathTransition';
import TrustLogos from '@/components/TrustLogos';
import StatsSection from '@/components/StatsSection';
import AboutBachir from '@/components/AboutBachir';
import Services from '@/components/Services';
import ProcessSection from '@/components/ProcessSection';
import BeforeAfter from '@/components/BeforeAfter';
import Gallery from '@/components/Gallery';
import Testimonials from '@/components/Testimonials';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import SenegalDivider from '@/components/SenegalDivider';

export default function Home() {
  return (
    <main className="relative">
      <Navbar />

      {/* 01 — HERO: 86 frames cinematic scrub */}
      <HeroScrub />

      {/* 02 — MORPH TEXT: REPAIR > RESTORE > TRANSFORM > REBIRTH */}
      <MorphEffects />

      {/* Transition: Dark → Light */}
      <ScrubTransition direction="dark-to-light" />

      {/* 03 — TRUST LOGOS */}
      <TrustLogos />

      {/* 04 — STATS */}
      <StatsSection />

      {/* Transition: Light → Dark via ClipPath */}
      <ClipPathTransition />

      {/* 05 — ABOUT BACHIR */}
      <AboutBachir />

      {/* 06 — SERVICES */}
      <SenegalDivider />
      <Services />

      {/* 07 — PROCESS */}
      <ProcessSection />

      {/* Transition: Dark → Light */}
      <ScrubTransition direction="dark-to-light" />

      {/* 08 — BEFORE / AFTER */}
      <ScrubTransition direction="light-to-dark" />
      <BeforeAfter />

      {/* 09 — GALLERY: Horizontal scroll */}
      <Gallery />

      {/* 10 — TESTIMONIALS */}
      <Testimonials />

      {/* 11 — CTA */}
      <ScrubTransition direction="dark-to-light" />
      <CTA />

      {/* 12 — CINEMATIC FOOTER */}
      <Footer />
    </main>
  );
}
