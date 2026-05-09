'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const GALLERY_ITEMS = [
  {
    title: 'Mercedes AMG',
    subtitle: 'RESTAURATION COMPLÈTE',
    gradient: 'from-amber-900/40 via-bachir-black to-bachir-black',
  },
  {
    title: 'Porsche 911',
    subtitle: 'DETAILING CÉRAMIQUE',
    gradient: 'from-red-900/40 via-bachir-black to-bachir-black',
  },
  {
    title: 'Range Rover',
    subtitle: 'PEINTURE SHOWROOM',
    gradient: 'from-emerald-900/40 via-bachir-black to-bachir-black',
  },
  {
    title: 'BMW M5',
    subtitle: 'POLISH PREMIUM',
    gradient: 'from-blue-900/40 via-bachir-black to-bachir-black',
  },
  {
    title: 'Audi RS7',
    subtitle: 'CUIR INTÉRIEUR',
    gradient: 'from-purple-900/40 via-bachir-black to-bachir-black',
  },
];

export default function Gallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current) return;

    // Horizontal scroll
    const track = trackRef.current;
    const totalWidth = track.scrollWidth - window.innerWidth;

    gsap.to(track, {
      x: -totalWidth,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: () => `+=${totalWidth}`,
        pin: true,
        scrub: 1,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-bachir-black overflow-hidden">
      <div className="py-16 md:py-24 px-6 md:px-12">
        <p className="text-bachir-gold text-[10px] tracking-[0.5em] uppercase font-medium mb-4">
          Galerie
        </p>
        <h2 className="font-[family-name:var(--font-syne)] text-3xl md:text-5xl font-semibold tracking-tight text-bachir-white">
          Nos Réalisations
        </h2>
      </div>

      <div ref={trackRef} className="flex gap-6 md:gap-8 pl-6 md:pl-12 pb-16">
        {GALLERY_ITEMS.map((item, i) => (
          <div
            key={i}
            className="group relative flex-shrink-0 w-[75vw] md:w-[40vw] aspect-[4/3] overflow-hidden"
          >
            {/* Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient}`} />

            {/* Placeholder visual */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:border-bachir-gold/30 transition-colors duration-500">
                  <span className="text-white/20 text-3xl group-hover:text-bachir-gold/40 transition-colors duration-500">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
              </div>
            </div>

            {/* Shine sweep on hover */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background:
                  'linear-gradient(105deg, transparent 40%, rgba(200,169,107,0.05) 45%, transparent 50%)',
                backgroundSize: '200% 100%',
                animation: 'galleryShine 2s ease-in-out infinite',
              }}
            />

            {/* Info overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 bg-gradient-to-t from-bachir-black/80 to-transparent">
              <p className="text-bachir-gold text-[9px] tracking-[0.4em] uppercase font-medium mb-2">
                {item.subtitle}
              </p>
              <h3 className="font-[family-name:var(--font-syne)] text-2xl md:text-3xl font-semibold text-bachir-white tracking-tight">
                {item.title}
              </h3>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes galleryShine {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </section>
  );
}
