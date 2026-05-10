'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TESTIMONIALS = [
  {
    name: 'Amadou Diallo',
    car: 'Mercedes CLS 63 AMG',
    text: "Incroyable. Ma voiture a retrouvé son éclat d'origine. Le niveau de détail est exceptionnel.",
    rating: 5,
  },
  {
    name: 'Fatou Ndiaye',
    car: 'Porsche Cayenne',
    text: "Le meilleur atelier de Dakar, sans hésitation. Professionnalisme et résultat premium.",
    rating: 5,
  },
  {
    name: 'Ibrahima Sow',
    car: 'Range Rover Autobiography',
    text: "Restauration complète impeccable. On dirait une voiture sortie d'usine. Merci Bachir !",
    rating: 5,
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Title reveal — scrub-based
      gsap.from('.testimonials-title', {
        y: 60,
        opacity: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          end: 'top 35%',
          scrub: 1,
        },
      });

      // Cards — scrub-based parallax reveal, each at different speed
      gsap.utils.toArray<HTMLElement>('.testimonial-card').forEach((card, i) => {
        gsap.from(card, {
          y: 60 + i * 25,
          opacity: 0,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: `top ${80 - i * 5}%`,
            end: `top ${30 - i * 5}%`,
            scrub: 1 + i * 0.2,
          },
        });
      });

      // Background subtle parallax movement
      if (bgRef.current) {
        gsap.to(bgRef.current, {
          y: -50,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-bachir-black py-24 md:py-36 overflow-hidden">
      {/* Background decorative element with parallax */}
      <div ref={bgRef} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[50vw] h-[50vh] rounded-full" style={{
          background: 'radial-gradient(circle, rgba(200,169,107,0.03) 0%, transparent 60%)',
          filter: 'blur(80px)',
        }} />
        <div className="absolute bottom-1/4 left-0 w-[30vw] h-[30vh] rounded-full" style={{
          background: 'radial-gradient(circle, rgba(200,169,107,0.02) 0%, transparent 60%)',
          filter: 'blur(60px)',
        }} />
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
        <div className="testimonials-title text-center mb-16">
          <p className="text-bachir-gold text-[10px] tracking-[0.5em] uppercase font-medium mb-4">
            Témoignages
          </p>
          <h2 className="font-[family-name:var(--font-syne)] text-3xl md:text-5xl font-semibold tracking-tight text-bachir-white">
            Ce Que Disent Nos Clients
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="testimonial-card group p-8 border border-white/5 hover:border-bachir-gold/20 transition-all duration-500"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(t.rating)].map((_, j) => (
                  <svg
                    key={j}
                    className="w-4 h-4 text-bachir-gold"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p className="text-bachir-gray-500 text-sm leading-relaxed mb-6 group-hover:text-bachir-gray-300 transition-colors duration-500">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Author */}
              <div>
                <p className="text-bachir-white text-sm font-medium">{t.name}</p>
                <p className="text-bachir-gold text-[10px] tracking-[0.2em] uppercase mt-1">
                  {t.car}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
