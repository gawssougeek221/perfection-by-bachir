'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitText from '@/components/ui/SplitText';
import Magnetic from '@/components/ui/Magnetic';
import { Phone, ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function CTA() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.cta-reveal', {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
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
    <section id="cta" ref={sectionRef} className="bg-bachir-black py-28 md:py-44">
      <div className="max-w-4xl mx-auto px-8 md:px-16 text-center">
        <p className="cta-reveal text-white/25 text-[9px] tracking-[0.5em] uppercase font-medium mb-8">
          Prenez Rendez-vous
        </p>

        <SplitText
          as="h2"
          className="cta-reveal font-[family-name:var(--font-syne)] text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-bachir-white leading-[1.05]"
        >
          Votre voiture mérite le meilleur
        </SplitText>

        <p className="cta-reveal mt-6 text-white/30 text-sm max-w-md mx-auto leading-relaxed">
          Contactez-nous pour un diagnostic gratuit.
          Notre équipe est prête à transformer votre véhicule.
        </p>

        <div className="cta-reveal mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Magnetic strength={0.3}>
            <a
              href="https://wa.me/221770000000"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-bachir-gold text-bachir-black font-semibold text-sm tracking-[0.1em] uppercase transition-all duration-300 hover:shadow-[0_0_40px_rgba(184,134,11,0.2)] cursor-hover"
            >
              <Phone className="w-4 h-4" />
              WhatsApp
              <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
            </a>
          </Magnetic>

          <Magnetic strength={0.2}>
            <a
              href="tel:+221770000000"
              className="inline-flex items-center gap-2 px-8 py-4 text-white/50 text-sm tracking-[0.1em] uppercase font-medium hover:text-white transition-colors duration-300 cursor-hover"
            >
              +221 77 000 00 00
            </a>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
