'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitText from '@/components/ui/SplitText';

gsap.registerPlugin(ScrollTrigger);

export default function AboutBachir() {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.about-img', {
        clipPath: 'inset(100% 0 0 0)',
        duration: 1.4,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      });

      // Subtle parallax on image
      if (imgRef.current) {
        gsap.fromTo(imgRef.current, { y: -20 }, {
          y: 20,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        });
      }

      gsap.from('.about-text', {
        y: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 65%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="bg-bachir-black py-32 md:py-48">
      <div className="max-w-7xl mx-auto px-8 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
          {/* Image */}
          <div className="about-img relative aspect-[3/4] overflow-hidden">
            <div ref={imgRef} className="absolute inset-0">
              <img
                src="/about-bachir.png"
                alt="Bachir"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Text */}
          <div className="md:pl-8">
            <p className="about-text text-[10px] tracking-[0.3em] uppercase text-white/20 mb-8">
              À Propos
            </p>
            <SplitText
              as="h2"
              className="about-text font-[family-name:var(--font-syne)] text-4xl md:text-6xl font-semibold tracking-tight text-bachir-white leading-[1.05]"
            >
              L&apos;Homme Derrière la Perfection
            </SplitText>

            <div className="about-text w-6 h-px bg-bachir-gold/40 mt-10 mb-8" />

            <div className="space-y-6 text-white/35 text-[15px] leading-[1.8]">
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
          </div>
        </div>
      </div>
    </section>
  );
}
