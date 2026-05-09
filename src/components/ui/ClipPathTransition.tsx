'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ClipPathTransition() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapperRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapperRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2,
      },
    });

    // Pulse glow appears
    tl.fromTo(
      pulseRef.current!,
      { opacity: 0, scale: 0 },
      { opacity: 0.6, scale: 1, duration: 0.4 },
      0
    )
      .to(pulseRef.current!, { opacity: 0, duration: 0.3 }, 0.4)
      // Gold ring expands
      .fromTo(
        ringRef.current!,
        { scale: 0, opacity: 1 },
        { scale: 1, opacity: 1, duration: 0.5 },
        0
      )
      .to(ringRef.current!, { opacity: 0, duration: 0.35 }, 0.6)
      // Circle clip-path expands
      .fromTo(
        circleRef.current!,
        { clipPath: 'circle(0% at 50% 50%)' },
        { clipPath: 'circle(150% at 50% 50%)', duration: 0.85 },
        0.15
      );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative h-[35vh] overflow-hidden bg-bachir-white">
      {/* Dark circle expanding */}
      <div
        ref={circleRef}
        className="absolute inset-0 bg-bachir-black"
        style={{ clipPath: 'circle(0% at 50% 50%)' }}
      />

      {/* Gold ring */}
      <div
        ref={ringRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border-2 border-bachir-gold"
        style={{
          boxShadow: '0 0 40px rgba(200,169,107,0.6), 0 0 80px rgba(200,169,107,0.3)',
        }}
      />

      {/* Pulse glow */}
      <div
        ref={pulseRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(200,169,107,0.4) 0%, transparent 70%)',
        }}
      />
    </div>
  );
}
