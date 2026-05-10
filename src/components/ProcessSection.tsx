'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitText from '@/components/ui/SplitText';

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

    const ctx = gsap.context(() => {
      gsap.from('.process-step', {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      });

      if (lineRef.current) {
        gsap.from(lineRef.current, {
          scaleX: 0,
          transformOrigin: 'left center',
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            end: 'bottom 40%',
            scrub: 1,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-bachir-black py-20 md:py-36">
      <div className="max-w-4xl mx-auto px-8 md:px-16">
        <div className="text-center mb-16 md:mb-24">
          <p className="text-white/25 text-[9px] tracking-[0.5em] uppercase font-medium mb-6">
            Notre Processus
          </p>
          <SplitText
            as="h2"
            className="font-[family-name:var(--font-syne)] text-3xl md:text-5xl font-semibold tracking-tight text-bachir-white"
          >
            De la Vision à la Perfection
          </SplitText>
        </div>

        {/* Horizontal line */}
        <div ref={lineRef} className="hidden md:block h-px bg-white/[0.06] mb-16" />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6">
          {STEPS.map((step) => (
            <div key={step.num} className="process-step group">
              <span className="font-[family-name:var(--font-syne)] text-5xl md:text-6xl font-extralight text-white/[0.06] group-hover:text-bachir-gold/20 transition-colors duration-500">
                {step.num}
              </span>
              <h3 className="font-[family-name:var(--font-syne)] text-lg md:text-xl font-semibold text-bachir-white mt-3 tracking-tight">
                {step.title}
              </h3>
              <p className="text-white/30 text-sm mt-2 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
