'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMagnetic, setIsMagnetic] = useState(false);
  const pos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const magneticTarget = useRef<{ el: HTMLElement; rect: DOMRect; strength: number } | null>(null);

  // Magnetic attraction logic
  const findMagneticTarget = useCallback((x: number, y: number) => {
    const magnetics = document.querySelectorAll('[data-magnetic]');
    for (const el of magnetics) {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dist = Math.hypot(x - cx, y - cy);
      const threshold = Math.max(rect.width, rect.height) * 1.2;

      if (dist < threshold) {
        const strength = parseFloat((el as HTMLElement).dataset.magnetic || '0.3');
        return { el: el as HTMLElement, rect, strength };
      }
    }
    return null;
  }, []);

  useEffect(() => {
    // Don't show on touch devices
    if (typeof window !== 'undefined' && 'ontouchstart' in window) return;

    const handleMouseMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      // Check for magnetic targets
      const target = findMagneticTarget(e.clientX, e.clientY);
      if (target) {
        magneticTarget.current = target;
        setIsMagnetic(true);
      } else {
        magneticTarget.current = null;
        setIsMagnetic(false);
      }
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    const handleHoverIn = () => setIsHovering(true);
    const handleHoverOut = () => setIsHovering(false);

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Add hover detection for interactive elements
    const addListeners = () => {
      const interactives = document.querySelectorAll('a, button, [data-magnetic], input, textarea, .cursor-hover');
      interactives.forEach((el) => {
        el.addEventListener('mouseenter', handleHoverIn);
        el.addEventListener('mouseleave', handleHoverOut);
      });
      return interactives;
    };

    let interactives = addListeners();

    // Re-add listeners periodically (for dynamically added elements)
    const intervalId = setInterval(() => {
      interactives.forEach((el) => {
        el.removeEventListener('mouseenter', handleHoverIn);
        el.removeEventListener('mouseleave', handleHoverOut);
      });
      interactives = addListeners();
    }, 2000);

    // Animation loop
    let raf: number;
    const animate = () => {
      // Magnetic attraction
      let finalX = pos.current.x;
      let finalY = pos.current.y;

      if (magneticTarget.current) {
        const { rect, strength } = magneticTarget.current;
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (cx - pos.current.x) * strength;
        const dy = (cy - pos.current.y) * strength;
        finalX = pos.current.x + dx;
        finalY = pos.current.y + dy;
      }

      if (dotRef.current) {
        // Dot follows precisely (with magnetic offset)
        const dotSize = isHovering ? 6 : 8;
        dotRef.current.style.transform = `translate(${finalX - dotSize / 2}px, ${finalY - dotSize / 2}px)`;
        dotRef.current.style.width = `${dotSize}px`;
        dotRef.current.style.height = `${dotSize}px`;
      }

      // Ring follows with lerp
      const ringLerp = isMagnetic ? 0.2 : 0.12;
      ringPos.current.x += (finalX - ringPos.current.x) * ringLerp;
      ringPos.current.y += (finalY - ringPos.current.y) * ringLerp;

      if (ringRef.current) {
        const size = isHovering ? 56 : isMagnetic ? 48 : 32;
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
  }, [isHovering, isVisible, isMagnetic, findMagneticTarget]);

  // Don't render on mobile
  if (typeof window !== 'undefined' && 'ontouchstart' in window) return null;

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none mix-blend-difference"
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: '#B8860B',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.3s, width 0.3s, height 0.3s',
        }}
      />
      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9997] pointer-events-none"
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          border: isHovering
            ? '1.5px solid rgba(184, 134, 11, 0.9)'
            : isMagnetic
            ? '1.5px solid rgba(184, 134, 11, 0.7)'
            : '1px solid rgba(184, 134, 11, 0.4)',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.3s, width 0.3s, height 0.3s, border-color 0.3s',
          boxShadow: isHovering
            ? '0 0 30px rgba(184, 134, 11, 0.5)'
            : isMagnetic
            ? '0 0 20px rgba(184, 134, 11, 0.3)'
            : '0 0 10px rgba(184, 134, 11, 0.1)',
        }}
      />
    </>
  );
}
