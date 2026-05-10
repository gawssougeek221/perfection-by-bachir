'use client';

import dynamic from 'next/dynamic';

// Dynamic imports to avoid SSR memory issues - all sections are client-only
const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: false });
const HeroScrub = dynamic(() => import('@/components/HeroScrub'), { ssr: false });
const MorphEffects = dynamic(() => import('@/components/MorphEffects'), { ssr: false });
const ScrubTransition = dynamic(() => import('@/components/ui/ScrubTransition'), { ssr: false });
const ClipPathTransition = dynamic(() => import('@/components/ui/ClipPathTransition'), { ssr: false });
const TrustLogos = dynamic(() => import('@/components/TrustLogos'), { ssr: false });
const StatsSection = dynamic(() => import('@/components/StatsSection'), { ssr: false });
const AboutBachir = dynamic(() => import('@/components/AboutBachir'), { ssr: false });
const SenegalDivider = dynamic(() => import('@/components/SenegalDivider'), { ssr: false });
const Services = dynamic(() => import('@/components/Services'), { ssr: false });
const ProcessSection = dynamic(() => import('@/components/ProcessSection'), { ssr: false });
const BeforeAfter = dynamic(() => import('@/components/BeforeAfter'), { ssr: false });
const Gallery = dynamic(() => import('@/components/Gallery'), { ssr: false });
const Testimonials = dynamic(() => import('@/components/Testimonials'), { ssr: false });
const CTA = dynamic(() => import('@/components/CTA'), { ssr: false });
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });

export default function Home() {
  return (
    <main className="relative">
      <Navbar />

      {/* 01 — HERO: 171 frames cinematic scrub */}
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
