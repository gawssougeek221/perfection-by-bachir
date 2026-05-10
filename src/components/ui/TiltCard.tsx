'use client';

import { useRef, useCallback } from 'react';
import gsap from 'gsap';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  tiltStrength?: number;
}

export default function TiltCard({
  children,
  className = '',
  tiltStrength = 5,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const percentX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const percentY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

      gsap.to(cardRef.current, {
        rotateY: percentX * tiltStrength,
        rotateX: -percentY * tiltStrength,
        duration: 0.5,
        ease: 'power2.out',
        transformPerspective: 1000,
      });
    },
    [tiltStrength]
  );

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.8,
      ease: 'elastic.out(1, 0.4)',
    });
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
    </div>
  );
}
