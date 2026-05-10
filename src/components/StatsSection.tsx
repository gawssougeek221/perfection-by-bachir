'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import OdometerCounter from '@/components/OdometerCounter';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { target: 350, suffix: '+', label: 'Voitures transformées' },
  { target: 12, suffix: '', label: "Ans d'expertise" },
  { target: 98, suffix: '%', label: 'Clients satisfaits' },
  { target: 24, suffix: 'h', label: 'Réponse devis' },
];

export default function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Scrub-based reveal for the whole section
      gsap.from(sectionRef.current, {
        opacity: 0,
        y: 30,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 90%',
          end: 'top 50%',
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-bachir-black py-24 md:py-36 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {STATS.map((stat) => (
            <OdometerCounter
              key={stat.label}
              target={stat.target}
              suffix={stat.suffix}
              label={stat.label}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
