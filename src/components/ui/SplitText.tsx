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
}

export default function SplitText({
  children,
  as: Tag = 'div',
  className = '',
  splitBy = 'words',
  stagger = 0.05,
  duration = 0.8,
  y = 40,
  delay = 0,
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
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars.trigger === containerRef.current) t.kill();
      });
    };
  }, [stagger, duration, y, delay, splitBy]);

  const parts =
    splitBy === 'chars'
      ? children.split('').map((char, i) => (
          <span key={i} className="split-el inline-block">
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))
      : children.split(' ').map((word, i) => (
          <span key={i} className="split-el inline-block mr-[0.3em]">
            {word}
          </span>
        ));

  return (
    <Tag ref={containerRef as any} className={className}>
      {parts}
    </Tag>
  );
}
