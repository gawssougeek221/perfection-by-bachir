'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Minimalist SVG logos for luxury car brands
const logos = [
  {
    name: 'Mercedes',
    svg: (
      <svg viewBox="0 0 80 80" className="w-16 h-16 md:w-20 md:h-20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="40" cy="40" r="36" />
        <line x1="40" y1="4" x2="40" y2="76" />
        <line x1="40" y1="40" x2="8.8" y2="58" />
        <line x1="40" y1="40" x2="71.2" y2="58" />
      </svg>
    ),
  },
  {
    name: 'Porsche',
    svg: (
      <svg viewBox="0 0 80 80" className="w-16 h-16 md:w-20 md:h-20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20 20 L40 10 L60 20 L65 45 L55 65 L25 65 L15 45 Z" />
        <line x1="40" y1="10" x2="40" y2="65" />
        <path d="M25 35 L55 35" />
      </svg>
    ),
  },
  {
    name: 'BMW',
    svg: (
      <svg viewBox="0 0 80 80" className="w-16 h-16 md:w-20 md:h-20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="40" cy="40" r="36" />
        <circle cx="40" cy="40" r="28" />
        <line x1="40" y1="12" x2="40" y2="68" />
        <line x1="12" y1="40" x2="68" y2="40" />
      </svg>
    ),
  },
  {
    name: 'Audi',
    svg: (
      <svg viewBox="0 0 120 60" className="w-24 h-12 md:w-28 md:h-14" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="25" cy="30" r="20" />
        <circle cx="48" cy="30" r="20" />
        <circle cx="71" cy="30" r="20" />
        <circle cx="94" cy="30" r="20" />
      </svg>
    ),
  },
  {
    name: 'Range Rover',
    svg: (
      <svg viewBox="0 0 100 50" className="w-24 h-12 md:w-28 md:h-14" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="10" y="10" width="80" height="30" rx="3" />
        <line x1="50" y1="10" x2="50" y2="40" />
        <line x1="10" y1="25" x2="90" y2="25" />
      </svg>
    ),
  },
];

export default function TrustLogos() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    gsap.from('.trust-label', {
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 85%',
      },
    });

    gsap.utils.toArray<HTMLElement>('.trust-logo').forEach((logo, i) => {
      gsap.from(logo, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        delay: i * 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      });
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-bachir-white py-24 md:py-32"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <p className="trust-label text-bachir-gold text-[10px] md:text-xs tracking-[0.5em] uppercase font-medium text-center mb-4">
          Marques de Confiance
        </p>
        <h2 className="trust-label font-[family-name:var(--font-syne)] text-bachir-gray-900 text-3xl md:text-5xl font-semibold tracking-tight text-center mb-16 md:mb-20">
          Ils Nous Font Confiance
        </h2>

        <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
          {logos.map((brand, i) => (
            <div
              key={brand.name}
              className="trust-logo group flex flex-col items-center gap-3 transition-all duration-500"
            >
              <div className="text-bachir-gray-300 group-hover:text-bachir-gold transition-colors duration-500 grayscale group-hover:grayscale-0">
                {brand.svg}
              </div>
              <span className="text-bachir-gray-500 text-[9px] tracking-[0.3em] uppercase group-hover:text-bachir-gold transition-colors duration-300">
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
