'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitText from '@/components/ui/SplitText';
import TiltCard from '@/components/ui/TiltCard';

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

      // Parallax on images
      gsap.utils.toArray<HTMLElement>('.gallery-img').forEach((img) => {
        gsap.fromTo(img, { y: -15 }, {
          y: 15,
          ease: 'none',
          scrollTrigger: {
            trigger: img.closest('.gallery-card')!,
            start: 'left right',
            end: 'right left',
            scrub: 1,
            containerAnimation: horizontalTween,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="gallery" ref={sectionRef} className="bg-bachir-black overflow-hidden">
      <div className="py-16 md:py-24 px-8 md:px-16">
        <p className="text-white/25 text-[9px] tracking-[0.5em] uppercase font-medium mb-4">
          Galerie
        </p>
        <SplitText
          as="h2"
          className="font-[family-name:var(--font-syne)] text-3xl md:text-5xl font-semibold tracking-tight text-bachir-white"
        >
          Nos Réalisations
        </SplitText>
      </div>

      <div ref={trackRef} className="flex gap-4 md:gap-6 pl-8 md:pl-16 pb-16">
        {GALLERY_ITEMS.map((item, i) => (
          <TiltCard key={i} tiltStrength={4} className="gallery-card group flex-shrink-0 w-[70vw] md:w-[35vw] aspect-[4/3] overflow-hidden relative">
            <div className="absolute inset-[-3%] w-[106%] h-[106%]">
              <img
                src={item.image}
                alt={item.title}
                className="gallery-img absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-bachir-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7">
              <p className="text-white/30 text-[8px] tracking-[0.4em] uppercase font-medium mb-1">
                {item.subtitle}
              </p>
              <h3 className="font-[family-name:var(--font-syne)] text-xl md:text-2xl font-semibold text-bachir-white tracking-tight">
                {item.title}
              </h3>
            </div>
          </TiltCard>
        ))}
      </div>
    </section>
  );
}
