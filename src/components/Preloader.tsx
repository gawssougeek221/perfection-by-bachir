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
      duration: 1.8,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (counterRef.current) {
          counterRef.current.textContent = Math.round(obj.val).toString();
        }
      },
    });

    const timeout = setTimeout(() => setVisible(false), 4000);

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
        <p className="font-[family-name:var(--font-syne)] text-xs tracking-[0.5em] uppercase text-white/20 mb-8">
          Perfection by Bachir
        </p>
        <span
          ref={counterRef}
          className="font-[family-name:var(--font-syne)] text-5xl font-light text-bachir-white tabular-nums"
        >
          0
        </span>
      </div>
    </div>
  );
}
