'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const WORDS = ['RÉPARER', 'RESTAURER', 'TRANSFORMER', 'RENAÎTRE'];

export default function MorphEffects() {
  const sectionRef = useRef<HTMLElement>(null);
  const wordRefs = useRef<HTMLDivElement[]>([]);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: '+=300%',
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const wordIndex = Math.min(Math.floor(progress * WORDS.length), WORDS.length - 1);
        const wordProgress = progress * WORDS.length - wordIndex;

        wordRefs.current.forEach((el, i) => {
          if (!el) return;
          if (i < wordIndex) {
            // Past word — subtle blur out + shrink
            gsap.set(el, { opacity: 0, scale: 0.8, y: 80, filter: 'blur(8px)' });
          } else if (i === wordIndex) {
            // Active word — stays sharp, slight scale + subtle blur as it transitions out
            const blur = wordProgress * 6;
            gsap.set(el, {
              opacity: 1,
              scale: 1 + wordProgress * 0.4,
              y: 0,
              filter: `blur(${blur}px)`,
            });
          } else if (i === wordIndex + 1) {
            // Next word — emerging from subtle blur
            const incomingBlur = (1 - wordProgress) * 6;
            gsap.set(el, {
              opacity: wordProgress,
              scale: 1.3 - wordProgress * 0.3,
              y: 0,
              filter: `blur(${incomingBlur}px)`,
            });
          } else {
            // Future words — hidden
            gsap.set(el, { opacity: 0, scale: 1.3, y: 0, filter: 'blur(4px)' });
          }
        });
      },
    });

    scrollTriggerRef.current = st;

    return () => {
      st.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-bachir-black"
    >
      {/* Morphing blobs background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${200 + i * 80}px`,
              height: `${200 + i * 80}px`,
              left: `${15 + i * 18}%`,
              top: `${20 + (i % 3) * 20}%`,
              background: `radial-gradient(circle, rgba(200,169,107,0.08) 0%, transparent 70%)`,
              filter: 'blur(40px)',
              animation: `blobFloat${i % 3} ${8 + i * 2}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      {/* Vignette — depth effect */}
      <div className="absolute inset-0 z-[3] pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)',
      }} />

      {/* Words */}
      <div className="relative z-10 flex flex-col items-center">
        {WORDS.map((word, i) => (
          <div
            key={word}
            ref={(el) => {
              if (el) wordRefs.current[i] = el;
            }}
            className="absolute font-[family-name:var(--font-syne)] text-[10vw] md:text-[10rem] font-bold tracking-tighter leading-none will-change-transform"
            style={{
              opacity: i === 0 ? 1 : 0,
              color: i === WORDS.length - 1 ? '#C8A96B' : '#FFFFFF',
              textShadow:
                i === WORDS.length - 1
                  ? '0 0 60px rgba(200,169,107,0.5), 0 0 120px rgba(200,169,107,0.2)'
                  : '0 0 30px rgba(255,255,255,0.05)',
            }}
          >
            {word}
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes blobFloat0 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -20px) scale(1.1); }
        }
        @keyframes blobFloat1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-20px, 30px) scale(0.9); }
        }
        @keyframes blobFloat2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(15px, 15px) scale(1.05); }
        }
      `}</style>
    </section>
  );
}
