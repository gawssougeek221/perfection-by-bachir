'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  { num: '01', title: 'Diagnostic', desc: 'Évaluation complète de votre véhicule par nos experts.' },
  { num: '02', title: 'Préparation', desc: 'Planification détaillée et sélection des matériaux premium.' },
  { num: '03', title: 'Restauration', desc: 'Transformation minutieuse avec un savoir-faire artisanal.' },
  { num: '04', title: 'Livraison', desc: 'Remise de votre véhicule dans un état showroom impeccable.' },
];

export default function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    gsap.from('.process-step', {
      y: 40,
      opacity: 0,
      stagger: 0.15,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
      },
    });

    if (lineRef.current) {
      gsap.to(lineRef.current, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          end: 'bottom 40%',
          scrub: 1,
        },
      });
    }
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-bachir-black py-24 md:py-36">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <p className="text-bachir-gold text-[10px] tracking-[0.5em] uppercase font-medium mb-4 text-center">
          Notre Processus
        </p>
        <h2 className="font-[family-name:var(--font-syne)] text-3xl md:text-5xl font-semibold tracking-tight text-bachir-white text-center mb-16 md:mb-24">
          De la Vision à la Perfection
        </h2>

        <div className="relative">
          {/* Vertical progress line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-white/10 md:-translate-x-px">
            <div
              ref={lineRef}
              className="w-full bg-bachir-gold origin-top"
              style={{ transform: 'scaleY(0)', height: '100%' }}
            />
          </div>

          <div className="space-y-16 md:space-y-24">
            {STEPS.map((step, i) => (
              <div
                key={step.num}
                className={`process-step relative flex items-start gap-6 md:gap-12 ${
                  i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Step dot */}
                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-bachir-gold mt-2 gold-border-glow z-10" />

                {/* Content */}
                <div className={`ml-12 md:ml-0 md:w-[45%] ${i % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'}`}>
                  <span className="font-[family-name:var(--font-syne)] text-5xl md:text-7xl font-extralight text-bachir-gold/20">
                    {step.num}
                  </span>
                  <h3 className="font-[family-name:var(--font-syne)] text-2xl md:text-3xl font-semibold text-bachir-white mt-2 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-bachir-gray-500 text-sm mt-3 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
