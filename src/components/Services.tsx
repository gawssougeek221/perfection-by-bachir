'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitText from '@/components/ui/SplitText';

gsap.registerPlugin(ScrollTrigger);

const SERVICES = [
  { num: '01', title: 'Carrosserie', description: 'Remise en état complète. Réparation des impacts, traitement anti-rouille et finition showroom.' },
  { num: '02', title: 'Peinture', description: 'Cabine dédiée. Finition premium, couleurs personnalisées et vernis céramique.' },
  { num: '03', title: 'Detailing', description: 'Polish correction, traitement céramique et protection longue durée.' },
  { num: '04', title: 'Restauration', description: "Transformation totale. De la mécanique à l'esthétique." },
  { num: '05', title: 'Jantes', description: 'Rénovation et personnalisation. Poudrage, chromage et finitions exclusives.' },
  { num: '06', title: 'Cuir', description: "Sellerie sur mesure, surpiqûres dorées et finitions artisanales." },
];

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.service-card', {
        y: 50,
        opacity: 0,
        stagger: 0.08,
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
    <section id="services" ref={sectionRef} className="bg-bachir-black py-32 md:py-48">
      <div className="max-w-7xl mx-auto px-8 md:px-16">
        <div className="mb-20 md:mb-28">
          <p className="text-[10px] tracking-[0.3em] uppercase text-white/20 mb-6">
            Nos Services
          </p>
          <SplitText
            as="h2"
            className="font-[family-name:var(--font-syne)] text-4xl md:text-6xl font-semibold tracking-tight text-bachir-white leading-[1.05]"
          >
            L&apos;Excellence dans Chaque Détail
          </SplitText>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {SERVICES.map((service) => (
            <div key={service.num} className="service-card group">
              <span className="text-[10px] text-white/15 tracking-[0.2em]">{service.num}</span>
              <h3 className="font-[family-name:var(--font-syne)] text-xl md:text-2xl font-semibold text-bachir-white mt-4 tracking-tight group-hover:text-white transition-colors duration-500">
                {service.title}
              </h3>
              <div className="w-0 group-hover:w-full h-px bg-white/10 transition-all duration-700 mt-4" />
              <p className="text-white/30 text-sm leading-relaxed mt-4">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
