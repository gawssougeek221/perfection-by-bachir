'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitText from '@/components/ui/SplitText';

gsap.registerPlugin(ScrollTrigger);

const logos = ['Mercedes', 'Porsche', 'BMW', 'Audi', 'Range Rover'];

export default function TrustLogos() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.trust-logo', {
        y: 20,
        opacity: 0,
        stagger: 0.08,
        duration: 0.8,
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
    <section ref={sectionRef} className="bg-bachir-black py-16 md:py-20">
      <div className="max-w-6xl mx-auto px-8 md:px-16">
        <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
          {logos.map((name) => (
            <span
              key={name}
              className="trust-logo text-white/20 text-xs md:text-sm tracking-[0.3em] uppercase font-medium hover:text-white/40 transition-colors duration-500"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
