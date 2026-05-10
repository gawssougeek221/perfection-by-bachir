'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollVelocityTextProps {
  children: string;
  className?: string;
  baseSkew?: number;
  baseScaleX?: number;
}

export default function ScrollVelocityText({
  children,
  className = '',
  baseSkew = 4,
  baseScaleX = 0.04,
}: ScrollVelocityTextProps) {
  const textRef = useRef<HTMLSpanElement>(null);
  const velocityRef = useRef({ current: 0 });

  useEffect(() => {
    if (!textRef.current) return;

    const ctx = gsap.context(() => {
      // Track scroll velocity
      ScrollTrigger.create({
        trigger: textRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const velocity = self.getVelocity();
          velocityRef.current = velocity;

          // Calculate skew and scale based on velocity
          const normalizedVelocity = gsap.utils.clamp(-3000, 3000, velocity);
          const skewX = (normalizedVelocity / 3000) * baseSkew;
          const scaleX = 1 + Math.abs(normalizedVelocity / 3000) * baseScaleX;

          gsap.to(textRef.current, {
            skewX,
            scaleX,
            duration: 0.3,
            ease: 'power2.out',
          });
        },
      });

      // Return to normal when scrolling stops
      let resetTimer: ReturnType<typeof setTimeout>;
      const checkReset = () => {
        clearTimeout(resetTimer);
        resetTimer = setTimeout(() => {
          gsap.to(textRef.current, {
            skewX: 0,
            scaleX: 1,
            duration: 0.5,
            ease: 'power2.out',
          });
        }, 150);
      };

      // Add scroll listener for reset
      window.addEventListener('scroll', checkReset, { passive: true });

      return () => {
        window.removeEventListener('scroll', checkReset);
        clearTimeout(resetTimer);
      };
    });

    return () => ctx.revert();
  }, [baseSkew, baseScaleX]);

  return (
    <span
      ref={textRef}
      className={`inline-block will-change-transform ${className}`}
    >
      {children}
    </span>
  );
}
