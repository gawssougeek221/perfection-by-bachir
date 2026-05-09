'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 86;

export default function HeroScrub() {
  const containerRef = useRef<HTMLDivElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const textRef = useRef<HTMLDivElement>(null);
  const objRef = useRef({ frame: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    // Pin the section
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: '+=300%',
      pin: true,
    });

    // Scrub through frames
    gsap.to(objRef.current, {
      frame: TOTAL_FRAMES - 1,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=300%',
        scrub: 1.5,
        onUpdate: () => {
          const idx = Math.round(objRef.current.frame);
          framesRef.current.forEach((img, i) => {
            if (img) img.style.opacity = i === idx ? '1' : '0';
          });
        },
      },
    });

    // Text parallax
    if (textRef.current) {
      gsap.to(textRef.current, {
        y: -120,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=200%',
          scrub: 1,
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative w-full min-h-[600px] h-screen overflow-hidden bg-bachir-black"
    >
      {/* Frame images */}
      <div className="absolute inset-0">
        {Array.from({ length: TOTAL_FRAMES }, (_, i) => {
          const num = String(i + 1).padStart(3, '0');
          return (
            <img
              key={i}
              ref={(el) => {
                if (el) framesRef.current[i] = el;
              }}
              src={`/frames/ezgif-frame-${num}.jpg`}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                opacity: i === 0 ? 1 : 0,
                willChange: 'opacity',
              }}
              loading={i < 3 ? 'eager' : 'lazy'}
            />
          );
        })}
      </div>

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(105deg, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.6) 40%, rgba(10,10,10,0.15) 100%)',
        }}
      />

      {/* Hero text */}
      <div
        ref={textRef}
        className="absolute inset-0 flex items-center justify-start px-6 md:px-24"
      >
        <div className="max-w-3xl">
          <p className="text-bachir-gold text-[10px] md:text-xs tracking-[0.5em] uppercase font-medium mb-4 md:mb-6">
            Luxury Car Renovation — Dakar
          </p>
          <h1 className="font-[family-name:var(--font-syne)] text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.9]">
            <span className="text-bachir-white">PERFECTION</span>
            <br />
            <span className="text-bachir-white">IS NOT REPAIR.</span>
            <br />
            <span className="text-bachir-gold text-gold-glow">IT IS REBIRTH.</span>
          </h1>
          <div className="mt-8 md:mt-12 flex items-center gap-6">
            <div className="h-px w-12 bg-bachir-gold/40" />
            <p className="text-white/40 text-sm font-light">
              L&apos;art de la transformation automobile
            </p>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-bachir-gold/40 text-[9px] tracking-[0.3em] uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-bachir-gold/50 to-transparent" />
      </div>
    </section>
  );
}
