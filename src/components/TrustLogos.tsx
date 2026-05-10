'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const logos = ['Mercedes', 'Porsche', 'BMW', 'Audi', 'Range Rover'];

export default function TrustLogos() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.trust-logo', {
        opacity: 0,
        stagger: 0.06,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-bachir-black py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-8 md:px-16">
        <div className="h-px bg-white/[0.04] mb-16 md:mb-24" />
        <div className="flex flex-wrap items-center justify-center gap-10 md:gap-20">
          {logos.map((name) => (
            <span
              key={name}
              className="trust-logo text-white/[0.08] text-[11px] tracking-[0.3em] uppercase font-medium"
            >
              {name}
            </span>
          ))}
        </div>
        <div className="h-px bg-white/[0.04] mt-16 md:mt-24" />
      </div>
    </section>
  );
}
