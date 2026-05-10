'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitText from '@/components/ui/SplitText';

gsap.registerPlugin(ScrollTrigger);

export default function AboutBachir() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Image — scrub-based clipPath reveal
      if (imageRef.current) {
        gsap.from(imageRef.current, {
          clipPath: 'inset(100% 0 0 0)',
          filter: 'blur(10px)',
          y: 60,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'top 25%',
            scrub: 1,
          },
        });
      }

      // Text content — scrub-based reveal with staggered children
      if (textRef.current) {
        gsap.from(textRef.current, {
          y: 80,
          opacity: 0,
          filter: 'blur(6px)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            end: 'top 25%',
            scrub: 1,
          },
        });

        // Staggered reveal for text children
        const textChildren = textRef.current.querySelectorAll('.about-text-reveal');
        textChildren.forEach((child, i) => {
          gsap.from(child, {
            y: 40,
            opacity: 0,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: `top ${65 - i * 8}%`,
              end: `top ${25 - i * 5}%`,
              scrub: 1 + i * 0.2,
            },
          });
        });
      }
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative bg-bachir-black py-24 md:py-36 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Image — with depth shadow and blur reveal */}
          <div ref={imageRef} className="relative aspect-[3/4] overflow-hidden">
            <img
              src="/about-bachir.png"
              alt="Bachir - Fondateur de Perfection by Bachir"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bachir-black/60 via-transparent to-transparent" />
            {/* Gold border accent */}
            <div className="absolute top-0 left-0 w-1 h-full bg-white/10" />
            <div className="absolute top-0 left-0 h-1 w-full bg-white/10" />
          </div>

          {/* Story — with blur reveal */}
          <div ref={textRef}>
            <p className="about-text-reveal text-white/40 text-[10px] tracking-[0.5em] uppercase font-medium mb-4">
              Notre Histoire
            </p>
            <SplitText
              as="h2"
              className="about-text-reveal font-[family-name:var(--font-syne)] text-3xl md:text-5xl font-semibold tracking-tight text-bachir-white mb-8"
            >
              L&apos;Homme Derrière la Perfection
            </SplitText>

            <div className="space-y-5 text-bachir-gray-500 text-sm leading-relaxed">
              <p className="about-text-reveal">
                Bachir a consacré plus de 12 ans à maîtriser l&apos;art de la rénovation automobile.
                Formé dans les meilleurs ateliers européens, il a ramené à Dakar un savoir-faire
                unique, alliant techniques traditionnelles et technologies de pointe.
              </p>
              <p className="about-text-reveal">
                Chaque véhicule qui entre dans son atelier est traité avec la même exigence :
                la perfection. Pas de compromis, pas de raccourci. Seul le résultat compte.
              </p>
              <p className="about-text-reveal">
                Sa philosophie est simple : une voiture n&apos;est pas seulement un moyen de transport.
                C&apos;est une expression de soi, un investissement, un héritage. Et chaque détail
                doit refléter cette vision.
              </p>
            </div>

            <div className="about-text-reveal mt-8 flex items-center gap-6">
              <div className="h-px w-12 bg-white/15" />
              <span className="text-white/50 text-[10px] tracking-[0.3em] uppercase font-medium">
                12+ ans d&apos;excellence
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
