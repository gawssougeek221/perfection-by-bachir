'use client';

import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const pos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window !== 'undefined' && 'ontouchstart' in window) return;

    const handleMouseMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    const handleHoverIn = () => setIsHovering(true);
    const handleHoverOut = () => setIsHovering(false);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    const addListeners = () => {
      const interactives = document.querySelectorAll('a, button, input, textarea, .cursor-hover');
      interactives.forEach((el) => {
        el.addEventListener('mouseenter', handleHoverIn);
        el.addEventListener('mouseleave', handleHoverOut);
      });
      return interactives;
    };

    let interactives = addListeners();
    const intervalId = setInterval(() => {
      interactives.forEach((el) => {
        el.removeEventListener('mouseenter', handleHoverIn);
        el.removeEventListener('mouseleave', handleHoverOut);
      });
      interactives = addListeners();
    }, 2000);

    let raf: number;
    const animate = () => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x - 2}px, ${pos.current.y - 2}px)`;
      }
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.1;
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.1;
      if (ringRef.current) {
        const size = isHovering ? 40 : 24;
        ringRef.current.style.transform = `translate(${ringPos.current.x - size / 2}px, ${ringPos.current.y - size / 2}px)`;
        ringRef.current.style.width = `${size}px`;
        ringRef.current.style.height = `${size}px`;
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      interactives.forEach((el) => {
        el.removeEventListener('mouseenter', handleHoverIn);
        el.removeEventListener('mouseleave', handleHoverOut);
      });
      clearInterval(intervalId);
      cancelAnimationFrame(raf);
    };
  }, [isHovering, isVisible]);

  if (typeof window !== 'undefined' && 'ontouchstart' in window) return null;

  return (
    <>
      {/* Dot — small, subtle */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
        style={{
          width: 4,
          height: 4,
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.3s',
        }}
      />
      {/* Ring — thin, white */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9997] pointer-events-none"
        style={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.3s, width 0.3s, height 0.3s, border-color 0.3s',
          borderColor: isHovering ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.15)',
        }}
      />
    </>
  );
}
