'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitText from '@/components/ui/SplitText';
import TiltCard from '@/components/ui/TiltCard';
import { Shield, Palette, Sparkles, RefreshCw, CircleDot, Armchair } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const SERVICES = [
  { num: '01', title: 'Carrosserie', subtitle: 'Restauration', icon: Shield, description: 'Remise en état complète. Réparation des impacts, traitement anti-rouille et finition showroom.' },
  { num: '02', title: 'Peinture', subtitle: 'Application', icon: Palette, description: 'Cabine dédiée. Finition premium, couleurs personnalisées et vernis céramique.' },
  { num: '03', title: 'Detailing', subtitle: 'Protection', icon: Sparkles, description: 'Polish correction, traitement céramique et protection longue durée.' },
  { num: '04', title: 'Restauration', subtitle: 'Transformation', icon: RefreshCw, description: "Transformation totale. De la mécanique à l'esthétique." },
  { num: '05', title: 'Jantes', subtitle: 'Personnalisation', icon: CircleDot, description: 'Rénovation et personnalisation. Poudrage, chromage et finitions exclusives.' },
  { num: '06', title: 'Cuir', subtitle: 'Sellerie', icon: Armchair, description: "Sellerie sur mesure, surpiqûres dorées et finitions artisanales." },
];

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.service-card', {
        y: 40,
        opacity: 0,
        stagger: 0.08,
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
    <section id="services" ref={sectionRef} className="bg-bachir-black py-20 md:py-36">
      <div className="max-w-7xl mx-auto px-8 md:px-16">
        <div className="mb-16 md:mb-20">
          <p className="text-white/25 text-[9px] tracking-[0.5em] uppercase font-medium mb-6">
            Nos Services
          </p>
          <SplitText
            as="h2"
            className="font-[family-name:var(--font-syne)] text-4xl md:text-6xl font-semibold tracking-tight text-bachir-white leading-[1.05]"
          >
            L&apos;Excellence dans Chaque Détail
          </SplitText>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <TiltCard key={service.num} tiltStrength={4} className="service-card">
                <div className="group p-6 md:p-8 border border-white/[0.04] hover:border-white/[0.08] transition-all duration-500 bg-transparent hover:bg-white/[0.02]">
                  <div className="flex items-center justify-between mb-6">
                    <Icon className="w-4 h-4 text-white/15 group-hover:text-bachir-gold transition-colors duration-500" />
                    <span className="text-white/10 text-[9px] tracking-[0.3em] uppercase font-medium">
                      {service.subtitle}
                    </span>
                  </div>
                  <h3 className="font-[family-name:var(--font-syne)] text-xl md:text-2xl font-semibold text-bachir-white mb-3 tracking-tight">
                    {service.title}
                  </h3>
                  <p className="text-white/30 text-sm leading-relaxed">
                    {service.description}
                  </p>
                  <div className="mt-6 h-px w-0 group-hover:w-full bg-bachir-gold/30 transition-all duration-700" />
                </div>
              </TiltCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
