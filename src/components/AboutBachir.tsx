'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitText from '@/components/ui/SplitText';

gsap.registerPlugin(ScrollTrigger);

export default function AboutBachir() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.about-img', {
        clipPath: 'inset(100% 0 0 0)',
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      });

      gsap.from('.about-text', {
        y: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
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
    <section id="about" ref={sectionRef} className="bg-bachir-black py-20 md:py-36">
      <div className="max-w-7xl mx-auto px-8 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Image */}
          <div className="about-img relative aspect-[3/4] overflow-hidden">
            <img
              src="/about-bachir.png"
              alt="Bachir"
              className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
            />
          </div>

          {/* Text */}
          <div>
            <p className="about-text text-white/25 text-[9px] tracking-[0.5em] uppercase font-medium mb-6">
              Notre Histoire
            </p>
            <SplitText
              as="h2"
              className="about-text font-[family-name:var(--font-syne)] text-3xl md:text-5xl font-semibold tracking-tight text-bachir-white mb-10 leading-[1.1]"
            >
              L&apos;Homme Derrière la Perfection
            </SplitText>

            <div className="space-y-6 text-white/40 text-sm leading-relaxed">
              <p className="about-text">
                Bachir a consacré plus de 12 ans à maîtriser l&apos;art de la rénovation automobile.
                Formé dans les meilleurs ateliers européens, il a ramené à Dakar un savoir-faire
                unique, alliant techniques traditionnelles et technologies de pointe.
              </p>
              <p className="about-text">
                Chaque véhicule qui entre dans son atelier est traité avec la même exigence :
                la perfection. Pas de compromis, pas de raccourci. Seul le résultat compte.
              </p>
            </div>

            <div className="about-text mt-10 flex items-center gap-4">
              <div className="h-px w-8 bg-bachir-gold/40" />
              <span className="text-white/25 text-[9px] tracking-[0.3em] uppercase font-medium">
                12+ ans d&apos;excellence
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
