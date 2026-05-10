'use client';

import { useRef, useCallback } from 'react';
import gsap from 'gsap';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  tiltStrength?: number;
  glareEnabled?: boolean;
}

export default function TiltCard({
  children,
  className = '',
  tiltStrength = 12,
  glareEnabled = true,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const percentX = (e.clientX - centerX) / (rect.width / 2);
      const percentY = (e.clientY - centerY) / (rect.height / 2);

      gsap.to(cardRef.current, {
        rotateY: percentX * tiltStrength,
        rotateX: -percentY * tiltStrength,
        duration: 0.4,
        ease: 'power2.out',
        transformPerspective: 800,
      });

      if (glareEnabled && glareRef.current) {
        gsap.to(glareRef.current, {
          opacity: 0.15,
          background: `radial-gradient(circle at ${(percentX + 1) * 50}% ${(percentY + 1) * 50}%, rgba(255,255,255,0.25), transparent 60%)`,
          duration: 0.3,
        });
      }
    },
    [tiltStrength, glareEnabled]
  );

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.7,
      ease: 'elastic.out(1, 0.5)',
    });
    if (glareRef.current) {
      gsap.to(glareRef.current, {
        opacity: 0,
        duration: 0.4,
      });
    }
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative will-change-transform ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
      {/* Glare overlay */}
      {glareEnabled && (
        <div
          ref={glareRef}
          className="absolute inset-0 pointer-events-none z-20 opacity-0"
          style={{ borderRadius: 'inherit' }}
        />
      )}
    </div>
  );
}
