'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface OdometerCounterProps {
  target: number;
  suffix?: string;
  label: string;
  className?: string;
}

export default function OdometerCounter({ target, suffix = '', label, className = '' }: OdometerCounterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const digitsRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  const targetStr = target.toString();
  const digitCount = targetStr.length;

  useEffect(() => {
    if (!containerRef.current || !digitsRef.current || hasAnimated) return;

    const digits = digitsRef.current.querySelectorAll('.odometer-digit');
    const ctx = gsap.context(() => {
      gsap.from(containerRef.current!, {
        y: 40,
        opacity: 0,
        scrollTrigger: {
          trigger: containerRef.current!,
          start: 'top 85%',
          end: 'top 50%',
          scrub: 1,
        },
      });

      // Animate each digit roll
      ScrollTrigger.create({
        trigger: containerRef.current!,
        start: 'top 70%',
        onEnter: () => {
          if (hasAnimated) return;
          setHasAnimated(true);

          digits.forEach((digit, i) => {
            const inner = digit.querySelector('.odometer-inner') as HTMLElement;
            if (!inner) return;
            const targetDigit = parseInt(targetStr[i]);
            const rollAmount = -(targetDigit * 100 / 10); // each digit is 10% height

            gsap.fromTo(inner,
              { yPercent: 0 },
              {
                yPercent: rollAmount,
                duration: 1.5 + i * 0.15,
                ease: 'power2.out',
                delay: i * 0.08,
              }
            );
          });
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [hasAnimated, targetStr]);

  // Create digit columns 0-9
  const renderDigitColumn = (targetDigit: number) => {
    return (
      <div className="odometer-digit relative overflow-hidden h-[1em]" style={{ width: '0.65em' }}>
        <div
          className="odometer-inner flex flex-col items-center"
          style={{ willChange: 'transform' }}
        >
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <div
              key={n}
              className="flex items-center justify-center"
              style={{ height: '1em' }}
            >
              {n}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div ref={containerRef} className={`text-center relative ${className}`}>
      <div className="py-4">
        <div className="flex items-baseline justify-center gap-0.5">
          <div
            ref={digitsRef}
            className="font-[family-name:var(--font-syne)] text-5xl md:text-[6rem] font-extralight text-bachir-white leading-none flex"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {targetStr.split('').map((digit, i) => renderDigitColumn(parseInt(digit)))}
          </div>
          <span className="font-[family-name:var(--font-syne)] text-2xl md:text-4xl font-light text-white/50 ml-1">
            {suffix}
          </span>
        </div>
        <p className="mt-3 text-bachir-gray-500 text-xs md:text-sm tracking-wide">
          {label}
        </p>
      </div>
    </div>
  );
}
