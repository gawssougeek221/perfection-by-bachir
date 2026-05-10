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
      // Staggered fade in
      gsap.from('.stat-item', {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      });

      // Counter animation
      STATS.forEach((stat, i) => {
        gsap.to(objRefs.current[i], {
          val: stat.target,
          duration: 2,
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
    <section ref={sectionRef} className="bg-bachir-black py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-8 md:px-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16">
          {STATS.map((stat, i) => (
            <div key={stat.label} className="stat-item text-center">
              <div className="flex items-baseline justify-center gap-0.5">
                <span
                  ref={(el) => { if (el) counterRefs.current[i] = el; }}
                  className="font-[family-name:var(--font-syne)] text-4xl md:text-6xl font-light text-bachir-white tabular-nums"
                >
                  0
                </span>
                <span className="font-[family-name:var(--font-syne)] text-lg md:text-2xl font-light text-white/30">
                  {stat.suffix}
                </span>
              </div>
              <div className="mt-2 h-px w-8 mx-auto bg-bachir-gold/30" />
              <p className="mt-3 text-white/30 text-[10px] md:text-xs tracking-[0.15em] uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
