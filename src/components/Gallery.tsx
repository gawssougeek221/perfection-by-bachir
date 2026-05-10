'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const GALLERY_ITEMS = [
  {
    title: 'Mercedes AMG',
    subtitle: 'RESTAURATION COMPLÈTE',
    image: '/gallery-mercedes.png',
  },
  {
    title: 'Porsche 911',
    subtitle: 'DETAILING CÉRAMIQUE',
    image: '/gallery-porsche.png',
  },
  {
    title: 'Range Rover',
    subtitle: 'PEINTURE SHOWROOM',
    image: '/gallery-range-rover.png',
  },
  {
    title: 'BMW M5',
    subtitle: 'POLISH PREMIUM',
    image: '/gallery-bmw.png',
  },
  {
    title: 'Audi RS7',
    subtitle: 'CUIR INTÉRIEUR',
    image: '/gallery-audi.png',
  },
];

export default function Gallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current) return;

    const ctx = gsap.context(() => {
      // Header reveal
      if (headerRef.current) {
        gsap.from(headerRef.current, {
          y: 60,
          opacity: 0,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            end: 'top 40%',
            scrub: 1,
          },
        });
      }

      // Horizontal scroll — keep the existing pinned behavior
      const track = trackRef.current;
      const totalWidth = track.scrollWidth - window.innerWidth;

      const horizontalTween = gsap.to(track, {
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

      // Gallery cards — subtle scale/y parallax during horizontal scroll
      gsap.utils.toArray<HTMLElement>('.gallery-card').forEach((card, i) => {
        gsap.from(card, {
          scale: 0.92,
          opacity: 0.7,
          duration: 0.5,
          scrollTrigger: {
            trigger: card,
            start: 'left 85%',
            end: 'left 50%',
            scrub: 1,
            containerAnimation: horizontalTween,
          },
        });
      });
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-bachir-black overflow-hidden">
      <div ref={headerRef} className="py-16 md:py-24 px-6 md:px-12">
        <p className="text-white/40 text-[10px] tracking-[0.5em] uppercase font-medium mb-4">
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
            className="gallery-card group relative flex-shrink-0 w-[75vw] md:w-[40vw] aspect-[4/3] overflow-hidden"
            style={{
              perspective: '800px',
            }}
          >
            {/* Car image */}
            <img
              src={item.image}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-bachir-black/40 group-hover:bg-bachir-black/20 transition-colors duration-500" />

            {/* Shine sweep on hover */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background:
                  'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.04) 45%, transparent 50%)',
                backgroundSize: '200% 100%',
                animation: 'galleryShine 2s ease-in-out infinite',
              }}
            />



            {/* Info overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 bg-gradient-to-t from-bachir-black/80 via-bachir-black/30 to-transparent">
              <p className="text-white/50 text-[9px] tracking-[0.4em] uppercase font-medium mb-2">
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
