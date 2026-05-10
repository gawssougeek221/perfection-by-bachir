'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollVelocityTextProps {
  children: string;
  className?: string;
}

export default function ScrollVelocityText({ children, className = '' }: ScrollVelocityTextProps) {
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!textRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: textRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const velocity = self.getVelocity();
          const normalized = gsap.utils.clamp(-3000, 3000, velocity);
          const skewX = (normalized / 3000) * 3;

          gsap.to(textRef.current, {
            skewX,
            duration: 0.3,
            ease: 'power2.out',
          });
        },
      });

      let resetTimer: ReturnType<typeof setTimeout>;
      const checkReset = () => {
        clearTimeout(resetTimer);
        resetTimer = setTimeout(() => {
          gsap.to(textRef.current, { skewX: 0, duration: 0.5, ease: 'power2.out' });
        }, 150);
      };

      window.addEventListener('scroll', checkReset, { passive: true });
      return () => {
        window.removeEventListener('scroll', checkReset);
        clearTimeout(resetTimer);
      };
    });

    return () => ctx.revert();
  }, []);

  return <span ref={textRef} className={`inline-block will-change-transform ${className}`}>{children}</span>;
}
