'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitText from '@/components/ui/SplitText';
import TiltCard from '@/components/ui/TiltCard';

gsap.registerPlugin(ScrollTrigger);

const TESTIMONIALS = [
  { name: 'Amadou Diallo', car: 'Mercedes CLS 63 AMG', text: "Incroyable. Ma voiture a retrouvé son éclat d'origine. Le niveau de détail est exceptionnel." },
  { name: 'Fatou Ndiaye', car: 'Porsche Cayenne', text: "Le meilleur atelier de Dakar, sans hésitation. Professionnalisme et résultat premium." },
  { name: 'Ibrahima Sow', car: 'Range Rover Autobiography', text: "Restauration complète impeccable. On dirait une voiture sortie d'usine." },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.testimonial-card', {
        y: 30,
        opacity: 0,
        stagger: 0.12,
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
    <section ref={sectionRef} className="bg-bachir-black py-20 md:py-36">
      <div className="max-w-6xl mx-auto px-8 md:px-16">
        <div className="text-center mb-16">
          <p className="text-white/25 text-[9px] tracking-[0.5em] uppercase font-medium mb-6">
            Témoignages
          </p>
          <SplitText
            as="h2"
            className="font-[family-name:var(--font-syne)] text-3xl md:text-5xl font-semibold tracking-tight text-bachir-white"
          >
            Ce Que Disent Nos Clients
          </SplitText>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {TESTIMONIALS.map((t, i) => (
            <TiltCard key={i} tiltStrength={3}>
              <div className="testimonial-card group p-8 border border-white/[0.04] hover:border-white/[0.08] transition-all duration-500">
                {/* Quote mark */}
                <span className="text-bachir-gold/20 text-4xl font-serif leading-none block mb-4">&ldquo;</span>
                <p className="text-white/40 text-sm leading-relaxed mb-8 group-hover:text-white/60 transition-colors duration-500">
                  {t.text}
                </p>
                <div className="h-px w-6 bg-bachir-gold/20 mb-4" />
                <p className="text-bachir-white text-sm font-medium">{t.name}</p>
                <p className="text-white/20 text-[9px] tracking-[0.2em] uppercase mt-1">
                  {t.car}
                </p>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
