'use client';

import dynamic from 'next/dynamic';

const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: false });
const HeroScrub = dynamic(() => import('@/components/ui/hero-scrub').then(m => ({ default: m.HeroScrub })), { ssr: false });
const MorphEffects = dynamic(() => import('@/components/MorphEffects'), { ssr: false });
const TrustLogos = dynamic(() => import('@/components/TrustLogos'), { ssr: false });
const StatsSection = dynamic(() => import('@/components/StatsSection'), { ssr: false });
const AboutBachir = dynamic(() => import('@/components/AboutBachir'), { ssr: false });
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

      {/* 01 — HERO: 171 frames cinematic scrub (unchanged) */}
      <HeroScrub
        frameCount={171}
        frameUrl={(i) => `/frames-webp/frame_${String(i + 1).padStart(4, '0')}.webp`}
        titleTop="PERFECTION"
        titleBottom="REBIRTH"
        subtitle="L'art de la transformation automobile — Dakar"
        accentHex="#B8860B"
      />

      {/* 02 — MORPH TEXT (unchanged) */}
      <MorphEffects />

      {/* 03 — TRUST LOGOS */}
      <TrustLogos />

      {/* 04 — STATS */}
      <StatsSection />

      {/* 05 — ABOUT BACHIR */}
      <AboutBachir />

      {/* 06 — SERVICES */}
      <Services />

      {/* 07 — PROCESS */}
      <ProcessSection />

      {/* 08 — BEFORE / AFTER */}
      <BeforeAfter />

      {/* 09 — GALLERY */}
      <Gallery />

      {/* 10 — TESTIMONIALS */}
      <Testimonials />

      {/* 11 — CTA */}
      <CTA />

      {/* 12 — FOOTER */}
      <Footer />
    </main>
  );
}
