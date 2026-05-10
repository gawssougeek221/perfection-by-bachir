'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface StackingCardsProps {
  children: React.ReactNode[];
  className?: string;
}

export default function StackingCards({ children, className = '' }: StackingCardsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const cards = cardsRef.current.filter(Boolean);
    if (cards.length === 0) return;

    const ctx = gsap.context(() => {
      cards.forEach((card, i) => {
        if (i === cards.length - 1) return; // Last card stays

        const scale = 1 - (cards.length - 1 - i) * 0.04;
        const opacity = 1 - (cards.length - 1 - i) * 0.08;

        ScrollTrigger.create({
          trigger: card,
          start: 'top 10%',
          end: 'bottom 10%',
          pin: true,
          pinSpacing: false,
          onUpdate: (self) => {
            const progress = self.progress;
            gsap.to(card, {
              scale: scale - progress * 0.05,
              opacity: opacity - progress * 0.15,
              filter: `blur(${progress * 2}px)`,
              duration: 0.3,
              ease: 'power2.out',
            });
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={`relative ${className}`}>
      {children.map((child, i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) cardsRef.current[i] = el;
          }}
          className="stacking-card will-change-transform"
        >
          {child}
        </div>
      ))}
    </section>
  );
}
