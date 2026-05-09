'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrubTransitionProps {
  direction: 'dark-to-light' | 'light-to-dark';
}

export default function ScrubTransition({ direction }: ScrubTransitionProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const isDarkToLight = direction === 'dark-to-light';

  useEffect(() => {
    if (!wrapperRef.current || !overlayRef.current || !glowRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapperRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2,
      },
    });

    tl.to(overlayRef.current, {
      yPercent: -100,
      ease: 'none',
    })
      .to(
        glowRef.current,
        {
          opacity: 0,
        },
        0.6
      );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative h-[35vh] overflow-hidden">
      {/* Base color (destination) */}
      <div
        className={`absolute inset-0 ${
          isDarkToLight ? 'bg-bachir-white' : 'bg-bachir-black'
        }`}
      />

      {/* Overlay (source color, slides away) */}
      <div
        ref={overlayRef}
        className={`absolute inset-0 ${
          isDarkToLight ? 'bg-bachir-black' : 'bg-bachir-white'
        }`}
      />

      {/* Gold glow line */}
      <div
        ref={glowRef}
        className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-bachir-gold gold-line-glow"
      />
    </div>
  );
}
