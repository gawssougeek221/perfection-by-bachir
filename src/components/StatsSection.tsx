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

    STATS.forEach((stat, i) => {
      gsap.to(objRefs.current[i], {
        val: stat.target,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 90%',
          end: 'top 30%',
          scrub: 1.5,
          onUpdate: () => {
            if (counterRefs.current[i]) {
              counterRefs.current[i].textContent = Math.round(objRefs.current[i].val).toString();
            }
          },
        },
      });
    });
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-bachir-white py-24 md:py-36">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {STATS.map((stat, i) => (
            <div key={stat.label} className="text-center">
              <div className="flex items-baseline justify-center gap-1">
                <span
                  ref={(el) => {
                    if (el) counterRefs.current[i] = el;
                  }}
                  className="font-[family-name:var(--font-syne)] text-5xl md:text-[6rem] font-extralight text-bachir-gray-900 leading-none tabular-nums"
                >
                  0
                </span>
                <span className="font-[family-name:var(--font-syne)] text-2xl md:text-4xl font-light text-bachir-gold">
                  {stat.suffix}
                </span>
              </div>
              <p className="mt-3 text-bachir-gray-500 text-xs md:text-sm tracking-wide">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
