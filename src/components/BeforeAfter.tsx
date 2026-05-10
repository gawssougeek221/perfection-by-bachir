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
      // Header — scrub-based parallax reveal
      if (headerRef.current) {
        gsap.from(headerRef.current, {
          y: 60,
          opacity: 0,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            end: 'top 35%',
            scrub: 1,
          },
        });
      }

      // ClipPath reveal — scrub-based instead of one-shot
      gsap.fromTo(
        containerRef.current,
        { clipPath: 'polygon(0 100%, 0 100%, 0 100%, 0 100%)' },
        {
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            end: 'top 20%',
            scrub: 1,
          },
        }
      );

    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  const handleMove = (clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const pos = ((clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.max(5, Math.min(95, pos)));
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) handleMove(e.clientX);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  return (
    <section
      id="before-after"
      ref={sectionRef}
      className="relative bg-bachir-black py-24 md:py-36"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div ref={headerRef}>
          <p className="text-white/40 text-[10px] tracking-[0.5em] uppercase font-medium mb-4 text-center">
            Réalisations
          </p>
          <SplitText
            as="h2"
            className="font-[family-name:var(--font-syne)] text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-bachir-white text-center mb-6"
          >
            Avant & Après
          </SplitText>
          <p className="text-bachir-gray-500 text-sm text-center mb-12 md:mb-16 max-w-xl mx-auto">
            Glissez le curseur pour découvrir la transformation. Chaque véhicule
            renaît sous nos mains.
          </p>
        </div>

        <div ref={containerRef}>
          <div
            ref={sliderRef}
            className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden select-none"
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchMove={handleTouchMove}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
          >
            {/* BEFORE image (full width, underneath) */}
            <div className="absolute inset-0">
              <img
                src="/before.jpg"
                alt="Avant rénovation"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-sm">
                <span className="text-white/70 text-[10px] tracking-[0.3em] uppercase">Avant</span>
              </div>
            </div>

            {/* AFTER image (clipped) */}
            <div
              className="absolute inset-0"
              style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
            >
              <img
                src="/after.jpg"
                alt="Après rénovation"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 right-4 px-3 py-1 bg-bachir-gold/20 backdrop-blur-sm">
                <span className="text-bachir-gold text-[10px] tracking-[0.3em] uppercase">Après</span>
              </div>
              {/* Shine sweep effect */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(105deg, transparent 40%, rgba(184,134,11,0.1) 45%, transparent 50%)`,
                  backgroundSize: '200% 100%',
                  animation: 'shine 3s ease-in-out infinite',
                }}
              />
            </div>

            {/* Slider handle */}
            <div
              className="absolute top-0 bottom-0 z-20"
              style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
            >
              <div className="w-px h-full bg-bachir-gold gold-line-glow" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-bachir-gold bg-bachir-black/80 backdrop-blur-sm flex items-center justify-center gold-border-glow cursor-ew-resize">
                <div className="flex gap-1">
                  <div className="w-0.5 h-4 bg-bachir-gold rounded-full" />
                  <div className="w-0.5 h-4 bg-bachir-gold rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shine {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </section>
  );
}
