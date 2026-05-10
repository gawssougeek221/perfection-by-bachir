'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitText from '@/components/ui/SplitText';

gsap.registerPlugin(ScrollTrigger);

const GALLERY_ITEMS = [
  { title: 'Mercedes AMG', subtitle: 'Restauration complète', image: '/gallery-mercedes.png' },
  { title: 'Porsche 911', subtitle: 'Detailing céramique', image: '/gallery-porsche.png' },
  { title: 'Range Rover', subtitle: 'Peinture showroom', image: '/gallery-range-rover.png' },
  { title: 'BMW M5', subtitle: 'Polish premium', image: '/gallery-bmw.png' },
  { title: 'Audi RS7', subtitle: 'Cuir intérieur', image: '/gallery-audi.png' },
];

export default function Gallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current) return;

    const ctx = gsap.context(() => {
      const track = trackRef.current!;
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="gallery" ref={sectionRef} className="bg-bachir-black overflow-hidden">
      <div className="py-32 md:py-48 px-8 md:px-16">
        <p className="text-[10px] tracking-[0.3em] uppercase text-white/20 mb-6">
          Galerie
        </p>
        <SplitText
          as="h2"
          className="font-[family-name:var(--font-syne)] text-3xl md:text-5xl font-semibold tracking-tight text-bachir-white"
        >
          Nos Réalisations
        </SplitText>
      </div>

      <div ref={trackRef} className="flex gap-6 md:gap-8 pl-8 md:pl-16 pb-16">
        {GALLERY_ITEMS.map((item, i) => (
          <div key={i} className="flex-shrink-0 w-[75vw] md:w-[40vw] aspect-[4/3] overflow-hidden relative group">
            <img
              src={item.image}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0C]/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <p className="text-white/25 text-[9px] tracking-[0.3em] uppercase mb-1">
                {item.subtitle}
              </p>
              <h3 className="font-[family-name:var(--font-syne)] text-xl md:text-2xl font-semibold text-bachir-white tracking-tight">
                {item.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
