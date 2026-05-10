'use client';

import dynamic from 'next/dynamic';

// Dynamic imports to avoid SSR memory issues - all sections are client-only
const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: false });
const HeroScrub = dynamic(() => import('@/components/ui/hero-scrub').then(m => ({ default: m.HeroScrub })), { ssr: false });
const MorphEffects = dynamic(() => import('@/components/MorphEffects'), { ssr: false });
const CarParticles = dynamic(() => import('@/components/CarParticles'), { ssr: false });
const TrustLogos = dynamic(() => import('@/components/TrustLogos'), { ssr: false });
const StatsSection = dynamic(() => import('@/components/StatsSection'), { ssr: false });
const AboutBachir = dynamic(() => import('@/components/AboutBachir'), { ssr: false });
const DrawSVGSeparator = dynamic(() => import('@/components/DrawSVGSeparator'), { ssr: false });
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
      <HeroScrub
        frameCount={171}
        frameUrl={(i) => `/frames-webp/frame_${String(i + 1).padStart(4, '0')}.webp`}
        titleTop="PERFECTION"
        titleBottom="REBIRTH"
        subtitle="L'art de la transformation automobile — Dakar"
        accentHex="#B8860B"
      />

      {/* 02 — MORPH TEXT: REPAIR > RESTORE > TRANSFORM > REBIRTH */}
      <MorphEffects />

      {/* 02b — 3D CAR PARTICLES: Scroll-driven particle convergence */}
      <CarParticles />

      {/* 03 — TRUST LOGOS */}
      <TrustLogos />
      <DrawSVGSeparator variant="diamond" />

      {/* 04 — STATS with odometer counters */}
      <StatsSection />
      <DrawSVGSeparator variant="line" />

      {/* 05 — ABOUT BACHIR */}
      <AboutBachir />
      <DrawSVGSeparator variant="ornament" />

      {/* 06 — SERVICES with tilt cards + scroll velocity text */}
      <Services />
      <DrawSVGSeparator variant="diamond" />

      {/* 07 — PROCESS with animated SVG line */}
      <ProcessSection />
      <DrawSVGSeparator variant="line" />

      {/* 08 — BEFORE / AFTER */}
      <BeforeAfter />
      <DrawSVGSeparator variant="ornament" />

      {/* 09 — GALLERY: Horizontal scroll with parallax + tilt */}
      <Gallery />

      {/* 10 — TESTIMONIALS with tilt cards */}
      <Testimonials />
      <DrawSVGSeparator variant="diamond" />

      {/* 11 — CTA with magnetic buttons */}
      <CTA />

      {/* 12 — CINEMATIC FOOTER */}
      <Footer />
    </main>
  );
}
