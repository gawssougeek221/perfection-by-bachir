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

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.process-step', {
        y: 50,
        opacity: 0,
        stagger: 0.15,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      });

      // Number slides in from left
      gsap.from('.process-num', {
        x: -40,
        opacity: 0,
        stagger: 0.15,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-bachir-black py-32 md:py-48">
      <div className="max-w-3xl mx-auto px-8 md:px-16">
        <div className="text-center mb-20 md:mb-32">
          <p className="text-[10px] tracking-[0.3em] uppercase text-white/20 mb-6">
            Notre Processus
          </p>
          <SplitText
            as="h2"
            className="font-[family-name:var(--font-syne)] text-3xl md:text-5xl font-semibold tracking-tight text-bachir-white"
          >
            De la Vision à la Perfection
          </SplitText>
        </div>

        <div className="flex flex-col">
          {STEPS.map((step, i) => (
            <div key={step.num}>
              <div className="process-step">
                <span className="process-num font-[family-name:var(--font-syne)] text-6xl md:text-8xl font-extralight text-white/[0.04]">
                  {step.num}
                </span>
                <h3 className="font-[family-name:var(--font-syne)] text-xl md:text-2xl font-semibold text-bachir-white mt-4 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-white/30 text-sm leading-relaxed mt-2">
                  {step.desc}
                </p>
              </div>
              {i < STEPS.length - 1 && (
                <div className="h-px w-12 bg-white/[0.06] my-12 md:my-16" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
