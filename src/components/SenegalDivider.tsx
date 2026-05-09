'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SenegalDivider() {
  const dividerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dividerRef.current) return;

    gsap.from('.diamond', {
      scale: 0,
      opacity: 0,
      stagger: 0.08,
      duration: 0.6,
      ease: 'back.out(2)',
      scrollTrigger: {
        trigger: dividerRef.current,
        start: 'top 85%',
      },
    });
  }, []);

  return (
    <div
      ref={dividerRef}
      className="relative bg-bachir-black py-12 flex items-center justify-center gap-4"
    >
      <div className="h-px w-16 md:w-24 bg-bachir-gold/20" />
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="diamond w-2.5 h-2.5 rotate-45 bg-bachir-gold/40 hover:bg-bachir-gold transition-colors duration-300"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
      <div className="h-px w-16 md:w-24 bg-bachir-gold/20" />
    </div>
  );
}
