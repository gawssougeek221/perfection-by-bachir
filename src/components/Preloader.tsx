'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    const obj = { val: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(containerRef.current, {
          yPercent: -100,
          duration: 0.8,
          ease: 'power4.inOut',
          onComplete: () => setVisible(false),
        });
      },
    });

    tl.to(obj, {
      val: 100,
      duration: 2,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (counterRef.current) {
          counterRef.current.textContent = Math.round(obj.val).toString();
        }
      },
    });

    // Safety timeout
    const timeout = setTimeout(() => {
      setVisible(false);
    }, 4000);

    return () => {
      tl.kill();
      clearTimeout(timeout);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-bachir-black"
    >
      <div className="text-center">
        <div className="relative mb-8">
          <h1 className="font-[family-name:var(--font-syne)] text-4xl md:text-5xl font-bold tracking-tight text-bachir-gold">
            PERFECTION
          </h1>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
        </div>
        <p className="text-bachir-gray-500 text-sm tracking-[0.3em] uppercase mb-6">
          Crafting Perfection…
        </p>
        <div className="flex items-center justify-center gap-3">
          <div className="h-px w-12 bg-white/15" />
          <span
            ref={counterRef}
            className="font-[family-name:var(--font-syne)] text-2xl font-light text-bachir-gold tabular-nums"
          >
            0
          </span>
          <span className="text-bachir-gold/50 text-sm">%</span>
          <div className="h-px w-12 bg-white/15" />
        </div>
      </div>
    </div>
  );
}
