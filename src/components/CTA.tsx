'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitText from '@/components/ui/SplitText';

gsap.registerPlugin(ScrollTrigger);

export default function CTA() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.cta-reveal', {
        y: 50,
        opacity: 0,
        stagger: 0.12,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="cta" ref={sectionRef} className="bg-bachir-black py-40 md:py-56">
      <div className="max-w-4xl mx-auto px-8 md:px-16 text-center">
        <SplitText
          as="h2"
          className="cta-reveal font-[family-name:var(--font-syne)] text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-bachir-white leading-[1.05]"
        >
          Votre voiture mérite le meilleur
        </SplitText>

        <p className="cta-reveal mt-6 text-white/25 text-sm">
          Contactez-nous pour un diagnostic gratuit
        </p>

        <div className="cta-reveal mt-14">
          <a
            href="https://wa.me/221770000000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-10 py-5 bg-bachir-gold text-[#0C0C0C] text-sm tracking-[0.15em] uppercase font-semibold transition-all duration-300 hover:brightness-110"
          >
            WhatsApp
          </a>
        </div>

        <p className="cta-reveal mt-8 text-white/25 text-sm">
          +221 77 000 00 00
        </p>
      </div>
    </section>
  );
}
