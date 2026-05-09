'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitText from '@/components/ui/SplitText';
import {
  Shield,
  Palette,
  Sparkles,
  RefreshCw,
  CircleDot,
  Armchair,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const SERVICES = [
  {
    num: '01',
    title: 'Carrosserie Premium',
    subtitle: 'RESTAURATION',
    icon: Shield,
    description:
      'Remise en état complète de la carrosserie. Réparation des impacts, traitement anti-rouille et finition showroom.',
    image: '/service-carrosserie.jpg',
  },
  {
    num: '02',
    title: 'Peinture Showroom',
    subtitle: 'APPLICATION',
    icon: Palette,
    description:
      'Peinture professionnelle avec cabine dédiée. Finition premium, couleurs personnalisées et vernis céramique.',
    image: '/service-peinture.jpg',
  },
  {
    num: '03',
    title: 'Polish & Detailing',
    subtitle: 'PROTECTION',
    icon: Sparkles,
    description:
      'Polish correction, traitement céramique et protection longue durée. Votre voiture brille comme au premier jour.',
    image: '/service-detailing.jpg',
  },
  {
    num: '04',
    title: 'Restauration Complète',
    subtitle: 'TRANSFORMATION',
    icon: RefreshCw,
    description:
      "Transformation totale de votre véhicule. De la mécanique à l'esthétique, nous redonnons vie à chaque détail.",
    image: '/service-restauration.jpg',
  },
  {
    num: '05',
    title: 'Jantes Premium',
    subtitle: 'PERSONNALISATION',
    icon: CircleDot,
    description:
      'Rénovation et personnalisation de jantes. Poudrage, chromage et finitions exclusives pour un look unique.',
    image: '/service-jantes.jpg',
  },
  {
    num: '06',
    title: 'Cuir Intérieur',
    subtitle: 'SELLERIE',
    icon: Armchair,
    description:
      "Restauration et refonte de l'intérieur cuir. Sellerie sur mesure, surpiqûres dorées et finitions artisanales.",
    image: '/service-cuir.jpg',
  },
];

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    gsap.from('.services-title', {
      y: 60,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
      },
    });

    gsap.utils.toArray<HTMLElement>('.service-card').forEach((card, i) => {
      gsap.from(card, {
        y: 80,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      });
    });
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative bg-bachir-black py-24 md:py-36"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="services-title mb-16 md:mb-20">
          <p className="text-bachir-gold text-[10px] tracking-[0.5em] uppercase font-medium mb-4">
            Nos Services
          </p>
          <SplitText
            as="h2"
            className="font-[family-name:var(--font-syne)] text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-bachir-white"
          >
            L&apos;Excellence dans Chaque Détail
          </SplitText>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.num}
                className="service-card group relative overflow-hidden border border-white/5 hover:border-bachir-gold/20 transition-all duration-700"
              >
                {/* Image */}
                <div className="relative h-48 md:h-56 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bachir-black via-bachir-black/40 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <Icon className="w-12 h-12 text-bachir-gold/30" />
                  </div>
                </div>

                {/* Content */}
                <div className="relative p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Icon className="w-4 h-4 text-bachir-gold" />
                    <span className="text-bachir-gold text-[10px] tracking-[0.3em] uppercase font-medium">
                      {service.subtitle}
                    </span>
                  </div>
                  <h3 className="font-[family-name:var(--font-syne)] text-xl md:text-2xl font-semibold text-bachir-white mb-3 tracking-tight">
                    {service.title}
                  </h3>
                  <p className="text-bachir-gray-500 text-sm leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <span className="text-bachir-gold text-xs tracking-[0.2em] uppercase font-medium group-hover:tracking-[0.3em] transition-all duration-300">
                    En savoir plus →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
