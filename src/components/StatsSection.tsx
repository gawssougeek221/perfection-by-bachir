'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { target: 350, suffix: '+', label: 'Voitures transformées' },
  { target: 12, suffix: '', label: "Ans d'expertise" },
  { target: 98, suffix: '%', label: 'Clients satisfaits' },
  { target: 24, suffix: 'h', label: 'Réponse devis' },
];

export default function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const counterRefs = useRef<HTMLSpanElement[]>([]);
  const objRefs = useRef(STATS.map(() => ({ val: 0 })));

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.stat-item', {
        y: 40,
        opacity: 0,
        stagger: 0.12,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      });

      STATS.forEach((stat, i) => {
        gsap.to(objRefs.current[i], {
          val: stat.target,
          duration: 2.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
          onUpdate: () => {
            if (counterRefs.current[i]) {
              counterRefs.current[i].textContent = Math.round(objRefs.current[i].val).toString();
            }
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-bachir-black py-32 md:py-48">
      <div className="max-w-6xl mx-auto px-8 md:px-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-16">
          {STATS.map((stat, i) => (
            <div key={stat.label} className="stat-item text-center">
              <div className="flex items-baseline justify-center gap-0.5">
                <span
                  ref={(el) => { if (el) counterRefs.current[i] = el; }}
                  className="font-[family-name:var(--font-syne)] text-5xl md:text-7xl font-extralight text-bachir-white tabular-nums"
                >
                  0
                </span>
                <span className="text-lg text-white/20">
                  {stat.suffix}
                </span>
              </div>
              <div className="w-4 h-px bg-white/10 mx-auto mt-4" />
              <p className="mt-3 text-[10px] tracking-[0.2em] uppercase text-white/20">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
