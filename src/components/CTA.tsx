'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitText from '@/components/ui/SplitText';
import Magnetic from '@/components/ui/Magnetic';
import { Phone } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function CTA() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // CTA content — scrub-based parallax reveal
      const ctaContent = sectionRef.current?.querySelector('.cta-content');
      if (ctaContent) {
        gsap.from(ctaContent, {
          y: 80,
          opacity: 0,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'top 30%',
            scrub: 1,
          },
        });
      }

      // Decorative lines — scrub-based animation
      gsap.utils.toArray<HTMLElement>('.cta-line').forEach((line, i) => {
        gsap.from(line, {
          scaleY: 0,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: `top ${80 - i * 3}%`,
            end: `top ${35 - i * 3}%`,
            scrub: 1,
          },
        });
      });
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="cta"
      ref={sectionRef}
      className="relative bg-bachir-black py-32 md:py-44 overflow-hidden"
    >
      {/* Decorative vertical lines */}
      <div className="absolute inset-0 flex justify-between px-12 md:px-24 opacity-10">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="cta-line w-px h-full bg-white/5 origin-top"
          />
        ))}
      </div>

      <div className="cta-content relative max-w-4xl mx-auto px-6 md:px-12 text-center z-10">
        <p className="text-white/40 text-[10px] tracking-[0.5em] uppercase font-medium mb-6">
          Prenez Rendez-vous
        </p>

        <SplitText
          as="h2"
          className="font-[family-name:var(--font-syne)] text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-bachir-white leading-[1.1]"
        >
          Votre voiture mérite le meilleur
        </SplitText>

        <p className="mt-6 md:mt-8 text-bachir-gray-500 text-sm md:text-base max-w-lg mx-auto leading-relaxed">
          Contactez-nous dès aujourd&apos;hui pour un diagnostic gratuit.
          Notre équipe d&apos;experts est prête à transformer votre véhicule.
        </p>

        <div className="mt-10 md:mt-14 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Magnetic strength={0.4}>
            <a
              href="https://wa.me/221770000000"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[#22C55E] text-white font-semibold text-sm tracking-[0.1em] uppercase overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(34,197,94,0.4)]"
            >
              <Phone className="w-4 h-4" />
              WhatsApp
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </a>
          </Magnetic>

          <Magnetic strength={0.3}>
            <a
              href="tel:+221770000000"
              className="inline-flex items-center gap-2 px-8 py-4 border border-bachir-gold/40 text-bachir-gold text-sm tracking-[0.1em] uppercase font-medium hover:bg-bachir-gold hover:text-bachir-black transition-all duration-300 hover:shadow-[0_0_30px_rgba(184,134,11,0.2)]"
            >
              +221 77 000 00 00
            </a>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
