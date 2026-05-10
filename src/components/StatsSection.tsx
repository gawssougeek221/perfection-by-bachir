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

    // Blur reveal for the entire section
    gsap.from(sectionRef.current, {
      filter: 'blur(8px)',
      opacity: 0.6,
      duration: 1.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 85%',
      },
    });

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
    <section ref={sectionRef} className="relative bg-bachir-white py-24 md:py-36 overflow-hidden">
      {/* Depth blur orbs in background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[50vh] rounded-full" style={{
          background: 'radial-gradient(ellipse, rgba(200,169,107,0.06) 0%, transparent 60%)',
          filter: 'blur(60px)',
        }} />
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {STATS.map((stat, i) => (
            <div key={stat.label} className="text-center relative">
              {/* Depth shadow behind stat */}
              <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-2xl" style={{
                boxShadow: '0 8px 40px rgba(200,169,107,0.08)',
                backdropFilter: 'blur(10px)',
                background: 'rgba(200,169,107,0.02)',
              }} />
              <div className="relative z-10 py-4">
                <div className="flex items-baseline justify-center gap-1">
                  <span
                    ref={(el) => {
                      if (el) counterRefs.current[i] = el;
                    }}
                    className="font-[family-name:var(--font-syne)] text-5xl md:text-[6rem] font-extralight text-bachir-gray-900 leading-none tabular-nums"
                  >
                    0
                  </span>
                  <span className="font-[family-name:var(--font-syne)] text-2xl md:text-4xl font-light text-bachir-gold drop-shadow-[0_0_10px_rgba(200,169,107,0.2)]">
                    {stat.suffix}
                  </span>
                </div>
                <p className="mt-3 text-bachir-gray-500 text-xs md:text-sm tracking-wide">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
