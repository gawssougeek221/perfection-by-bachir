'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitText from '@/components/ui/SplitText';

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
      gsap.from('.testimonial-item', {
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-bachir-black py-32 md:py-48">
      <div className="max-w-5xl mx-auto px-8 md:px-16">
        <div className="text-center mb-20 md:mb-28">
          <p className="text-[10px] tracking-[0.3em] uppercase text-white/20 mb-6">
            Témoignages
          </p>
          <SplitText
            as="h2"
            className="font-[family-name:var(--font-syne)] text-3xl md:text-5xl font-semibold tracking-tight text-bachir-white"
          >
            Ce Que Disent Nos Clients
          </SplitText>
        </div>

        <div className="flex flex-col gap-16 md:gap-24">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="testimonial-item relative">
              <span className="text-white/[0.06] text-[120px] font-serif leading-none absolute -top-8 -left-2">
                &ldquo;
              </span>
              <div className="relative z-10 pl-0 md:pl-16">
                <p className="text-xl md:text-2xl text-white/50 leading-relaxed font-light">
                  {t.text}
                </p>
                <div className="mt-8">
                  <p className="text-white/80 text-sm font-medium">{t.name}</p>
                  <p className="text-white/20 text-[10px] tracking-[0.2em] uppercase mt-1">
                    {t.car}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
