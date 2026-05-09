'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 171;
const FRAME_PATH = '/frames-webp/frame_####.webp';

function getFramePath(index: number): string {
  return FRAME_PATH.replace('####', String(index + 1).padStart(4, '0'));
}

export default function HeroScrub() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const objRef = useRef({ frame: 0 });
  const framesRef = useRef<HTMLImageElement[]>([]);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const rafRef = useRef<number>(0);

  // Draw current frame to canvas
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    const img = framesRef.current[frameIndex];
    if (!canvas || !img || !img.complete) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Use willReadFrequently for better perf
    canvas.width = canvas.clientWidth * (window.devicePixelRatio > 1 ? 1.5 : 1);
    canvas.height = canvas.clientHeight * (window.devicePixelRatio > 1 ? 1.5 : 1);

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  }, []);

  // Preload all frames
  useEffect(() => {
    let loaded = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFramePath(i);
      img.decoding = 'async';

      img.onload = () => {
        loaded++;
        setLoadProgress(Math.round((loaded / TOTAL_FRAMES) * 100));
        if (loaded === TOTAL_FRAMES) {
          setIsReady(true);
        }
      };

      img.onerror = () => {
        loaded++;
        setLoadProgress(Math.round((loaded / TOTAL_FRAMES) * 100));
      };

      images[i] = img;
    }

    framesRef.current = images;

    return () => {
      images.forEach((img) => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, []);

  // Setup GSAP ScrollTrigger once ready
  useEffect(() => {
    if (!isReady || !containerRef.current || !canvasRef.current) return;

    // Draw first frame
    drawFrame(0);

    // Pin the section
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: '+=300%',
      pin: true,
    });

    // Scrub through frames
    const tween = gsap.to(objRef.current, {
      frame: TOTAL_FRAMES - 1,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=300%',
        scrub: 1.5,
        onUpdate: () => {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = requestAnimationFrame(() => {
            const idx = Math.round(objRef.current.frame);
            drawFrame(idx);
          });
        },
      },
    });

    // Text parallax + fade
    if (textRef.current) {
      gsap.to(textRef.current, {
        y: -150,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=150%',
          scrub: 1,
        },
      });
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      tween.scrollTrigger?.kill();
      tween.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [isReady, drawFrame]);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      const idx = Math.round(objRef.current.frame);
      drawFrame(idx);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawFrame]);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-bachir-black"
    >
      {/* Canvas for frame rendering */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ imageRendering: 'auto' }}
      />

      {/* Loading overlay */}
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-bachir-black z-20">
          <div className="text-center">
            <p className="text-bachir-gold text-xs tracking-[0.4em] uppercase mb-4">
              Loading Experience
            </p>
            <div className="w-48 h-px bg-bachir-gray-700 relative overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-bachir-gold transition-all duration-300"
                style={{ width: `${loadProgress}%` }}
              />
            </div>
            <p className="text-bachir-gray-500 text-[10px] mt-3 tracking-wider">
              {loadProgress}%
            </p>
          </div>
        </div>
      )}

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background:
            'linear-gradient(105deg, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.6) 40%, rgba(10,10,10,0.15) 100%)',
        }}
      />

      {/* Hero text */}
      <div
        ref={textRef}
        className="absolute inset-0 flex items-center justify-start px-6 md:px-24 z-10 pointer-events-none"
      >
        <div className="max-w-3xl">
          <p className="text-bachir-gold text-[10px] md:text-xs tracking-[0.5em] uppercase font-medium mb-4 md:mb-6">
            Luxury Car Renovation — Dakar
          </p>
          <h1 className="font-[family-name:var(--font-syne)] text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight leading-[0.9]">
            <span className="text-bachir-white">PERFECTION</span>
            <br />
            <span className="text-bachir-white">IS NOT REPAIR.</span>
            <br />
            <span className="text-bachir-gold text-gold-glow">IT IS REBIRTH.</span>
          </h1>
          <div className="mt-8 md:mt-12 flex items-center gap-6">
            <div className="h-px w-12 bg-bachir-gold/40" />
            <p className="text-white/40 text-sm font-light">
              L&apos;art de la transformation automobile
            </p>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce z-10">
        <span className="text-bachir-gold/40 text-[9px] tracking-[0.3em] uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-bachir-gold/50 to-transparent" />
      </div>
    </section>
  );
}
