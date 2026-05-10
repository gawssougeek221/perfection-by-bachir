'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitText from '@/components/ui/SplitText';

gsap.registerPlugin(ScrollTrigger);

export default function BeforeAfter() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!sectionRef.current || !containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      });

      gsap.from(containerRef.current, {
        clipPath: 'inset(100% 0 0 0)',
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleMove = (clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    setSliderPos(Math.max(5, Math.min(95, ((clientX - rect.left) / rect.width) * 100)));
  };

  return (
    <section id="before-after" ref={sectionRef} className="bg-bachir-black py-32 md:py-48">
      <div className="max-w-6xl mx-auto px-8 md:px-16">
        <div ref={headerRef} className="text-center mb-16">
          <p className="text-[10px] tracking-[0.3em] uppercase text-white/20 mb-6">
            Réalisations
          </p>
          <SplitText
            as="h2"
            className="font-[family-name:var(--font-syne)] text-4xl md:text-5xl font-semibold tracking-tight text-bachir-white"
          >
            Avant & Après
          </SplitText>
        </div>

        <div ref={containerRef}>
          <div
            ref={sliderRef}
            className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden select-none cursor-ew-resize"
            onMouseMove={(e) => isDragging && handleMove(e.clientX)}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onTouchMove={(e) => handleMove(e.touches[0].clientX)}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
          >
            {/* Before */}
            <div className="absolute inset-0">
              <img src="/before.jpg" alt="Avant" className="w-full h-full object-cover" />
              <div className="absolute top-6 left-6">
                <span className="text-[9px] tracking-[0.3em] uppercase text-white/30">Avant</span>
              </div>
            </div>

            {/* After */}
            <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}>
              <img src="/after.jpg" alt="Après" className="w-full h-full object-cover" />
              <div className="absolute top-6 right-6">
                <span className="text-[9px] tracking-[0.3em] uppercase text-white/30">Après</span>
              </div>
            </div>

            {/* Slider handle — thin line with small circle */}
            <div
              className="absolute top-0 bottom-0 z-20"
              style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
            >
              <div className="w-px h-full bg-white/20" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-white/20 bg-[#0C0C0C]/60 backdrop-blur-sm flex items-center justify-center">
                <div className="flex gap-1">
                  <div className="w-px h-3 bg-white/30" />
                  <div className="w-px h-3 bg-white/30" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
