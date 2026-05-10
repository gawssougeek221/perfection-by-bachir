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
  clipReveal?: boolean;
  scrub?: boolean;
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
  clipReveal = true,
  scrub = false,
}: SplitTextProps) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const elements = containerRef.current.querySelectorAll('.split-el');

    if (clipReveal) {
      // Clip-path reveal: each word slides up from behind a mask
      gsap.from(elements, {
        y,
        opacity: 0,
        rotateX: 40,
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
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      });
    } else {
      // Classic reveal
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
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars.trigger === containerRef.current) t.kill();
      });
    };
  }, [stagger, duration, y, delay, splitBy, clipReveal, scrub]);

  const parts =
    splitBy === 'chars'
      ? children.split('').map((char, i) => (
          <span
            key={i}
            className="split-el inline-block will-change-transform"
            style={{ perspective: '600px' }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))
      : children.split(' ').map((word, i) => (
          <span
            key={i}
            className="split-el inline-block mr-[0.3em] will-change-transform"
            style={{ perspective: '600px' }}
          >
            {word}
          </span>
        ));

  return (
    <Tag ref={containerRef as any} className={className} style={{ perspective: '800px' }}>
      {parts}
    </Tag>
  );
}
