'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface DrawSVGSeparatorProps {
  variant?: 'line' | 'diamond' | 'ornament';
  className?: string;
}

export default function DrawSVGSeparator({ variant = 'ornament', className = '' }: DrawSVGSeparatorProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const paths = svgRef.current.querySelectorAll('path, line, circle, rect');
    const ctx = gsap.context(() => {
      paths.forEach((path) => {
        const length = (path as SVGPathElement).getTotalLength?.() ?? 0;
        if (length > 0) {
          gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length,
          });
          gsap.to(path, {
            strokeDashoffset: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: svgRef.current,
              start: 'top 90%',
              end: 'top 40%',
              scrub: 1,
            },
          });
        }
      });
    }, svgRef);

    return () => ctx.revert();
  }, []);

  if (variant === 'line') {
    return (
      <div className={`relative flex items-center justify-center py-8 ${className}`}>
        <svg
          ref={svgRef}
          viewBox="0 0 600 2"
          className="w-full max-w-2xl h-px"
          fill="none"
          stroke="#B8860B"
          strokeWidth="1"
        >
          <line x1="0" y1="1" x2="600" y2="1" />
          <circle cx="300" cy="1" r="2" fill="#B8860B" />
        </svg>
      </div>
    );
  }

  if (variant === 'diamond') {
    return (
      <div className={`relative flex items-center justify-center py-10 ${className}`}>
        <svg
          ref={svgRef}
          viewBox="0 0 400 20"
          className="w-full max-w-md h-5"
          fill="none"
          stroke="#B8860B"
          strokeWidth="0.8"
        >
          {/* Left line */}
          <line x1="0" y1="10" x2="155" y2="10" />
          {/* Diamond */}
          <path d="M165 10 L175 2 L185 10 L175 18 Z" />
          {/* Right line */}
          <line x1="195" y1="10" x2="400" y2="10" />
          {/* Small dots */}
          <circle cx="155" cy="10" r="1.5" fill="#B8860B" />
          <circle cx="195" cy="10" r="1.5" fill="#B8860B" />
        </svg>
      </div>
    );
  }

  // ornament variant — elegant separator with scroll-draw
  return (
    <div className={`relative flex items-center justify-center py-12 ${className}`}>
      <svg
        ref={svgRef}
        viewBox="0 0 600 30"
        className="w-full max-w-2xl h-8"
        fill="none"
        stroke="#B8860B"
        strokeWidth="0.7"
      >
        {/* Left ornamental line */}
        <path d="M0 15 Q50 15 100 15 Q130 15 150 8 Q165 3 175 15" />
        {/* Center diamond */}
        <path d="M185 15 L195 5 L205 15 L195 25 Z" />
        <circle cx="195" cy="15" r="2" fill="#B8860B" stroke="none" />
        {/* Right ornamental line */}
        <path d="M215 15 Q225 3 240 8 Q260 15 290 15 Q550 15 600 15" />
      </svg>
    </div>
  );
}
