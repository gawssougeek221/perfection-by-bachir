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
  const depthBgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Image — scrub-based clipPath reveal + parallax (moves slower = further away)
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

        // Image parallax — moves slower relative to text
        gsap.to(imageRef.current, {
          y: -50,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
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

      // Parallax depth on background — enhanced movement range
      if (depthBgRef.current) {
        gsap.to(depthBgRef.current, {
          y: -150,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
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
      {/* Top gradient — smooth transition from StatsSection (light) to this (dark) */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-bachir-white to-transparent z-20 pointer-events-none" />

      {/* Depth blur background — enhanced parallax */}
      <div ref={depthBgRef} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[60vw] h-[60vh] rounded-full" style={{
          background: 'radial-gradient(circle, rgba(200,169,107,0.04) 0%, transparent 60%)',
          filter: 'blur(80px)',
        }} />
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vh] rounded-full" style={{
          background: 'radial-gradient(circle, rgba(200,169,107,0.03) 0%, transparent 60%)',
          filter: 'blur(100px)',
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Image — with depth shadow and blur reveal */}
          <div ref={imageRef} className="relative aspect-[3/4] overflow-hidden" style={{
            boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 60px rgba(200,169,107,0.05)',
          }}>
            <img
              src="/about-bachir.png"
              alt="Bachir - Fondateur de Perfection by Bachir"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Depth blur overlay — simulates DOF */}
            <div className="absolute inset-0 pointer-events-none" style={{
              background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)',
            }} />
            <div className="absolute inset-0 bg-gradient-to-t from-bachir-black/60 via-transparent to-transparent" />
            {/* Gold border accent */}
            <div className="absolute top-0 left-0 w-1 h-full bg-bachir-gold/30" />
            <div className="absolute top-0 left-0 h-1 w-full bg-bachir-gold/30" />
            {/* Bokeh depth particles on image */}
            <div className="absolute inset-0 pointer-events-none opacity-40" style={{
              background: 'radial-gradient(circle at 30% 20%, rgba(200,169,107,0.1) 0%, transparent 30%), radial-gradient(circle at 70% 70%, rgba(255,255,255,0.05) 0%, transparent 20%)',
              filter: 'blur(10px)',
            }} />
          </div>

          {/* Story — with blur reveal and staggered parallax */}
          <div ref={textRef}>
            <p className="about-text-reveal text-bachir-gold text-[10px] tracking-[0.5em] uppercase font-medium mb-4">
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
              <div className="h-px w-12 bg-bachir-gold/30" />
              <span className="text-bachir-gold text-[10px] tracking-[0.3em] uppercase font-medium drop-shadow-[0_0_8px_rgba(200,169,107,0.2)]">
                12+ ans d&apos;excellence
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
