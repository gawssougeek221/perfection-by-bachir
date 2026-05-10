'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SplitTextProps {
  children: string;
  as?: React.ElementType;
  className?: string;
  splitBy?: 'chars' | 'words';
  stagger?: number;
  duration?: number;
  y?: number;
  delay?: number;
  scrub?: boolean;
}

export default function SplitText({
  children,
  as: Tag = 'div',
  className = '',
  splitBy = 'words',
  stagger = 0.04,
  duration = 1,
  y = 30,
  delay = 0,
  scrub = false,
}: SplitTextProps) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const elements = containerRef.current.querySelectorAll('.split-el');

    gsap.from(elements, {
      y,
      opacity: 0,
      stagger,
      duration,
      delay,
      ease: 'power3.out',
      scrollTrigger: scrub ? {
        trigger: containerRef.current,
        start: 'top 85%',
        end: 'top 40%',
        scrub: 1,
      } : {
        trigger: containerRef.current,
        start: 'top 90%',
        toggleActions: 'play none none none',
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars.trigger === containerRef.current) t.kill();
      });
    };
  }, [stagger, duration, y, delay, splitBy, scrub]);

  const parts =
    splitBy === 'chars'
      ? children.split('').map((char, i) => (
          <span key={i} className="split-el inline-block will-change-transform">
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))
      : children.split(' ').map((word, i) => (
          <span key={i} className="split-el inline-block mr-[0.3em] will-change-transform">
            {word}
          </span>
        ));

  return (
    <Tag ref={containerRef as any} className={className}>
      {parts}
    </Tag>
  );
}
