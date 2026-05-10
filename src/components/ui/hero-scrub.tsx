"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PIN_VH_MULTIPLE = 3.2;
const IMMERSE_OVERFILL = 1.04;
const ENTRY_DELAY = 0.2;
const CARD_START_SCALE_DESKTOP = 0.6;
const CARD_START_SCALE_MOBILE = 0.82;

export type HeroScrubProps = {
  frameCount: number;
  frameUrl: (index: number) => string;
  titleTop: string;
  titleBottom: string;
  subtitle?: string;
  bgClassName?: string;
  accentHex?: string;
  defaultAspect?: number;
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return reduced;
}

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
}

// Bokeh depth-of-field particles
function BokehParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; r: number; speed: number; opacity: number; hue: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Create bokeh particles
    for (let i = 0; i < 25; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 4 + 2,
        speed: Math.random() * 0.3 + 0.05,
        opacity: Math.random() * 0.15 + 0.03,
        hue: Math.random() > 0.5 ? 38 : 45, // gold hues
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.y -= p.speed;
        p.x += Math.sin(p.y * 0.005) * 0.3;
        if (p.y < -20) {
          p.y = canvas.height + 20;
          p.x = Math.random() * canvas.width;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 60%, 65%, ${p.opacity})`;
        ctx.fill();
        // Soft glow around bokeh
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 60%, 65%, ${p.opacity * 0.3})`;
        ctx.fill();
      }
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[5] opacity-0 transition-opacity duration-[2s]"
      style={{ filter: "blur(1px)" }}
    />
  );
}

export function HeroScrub({
  frameCount,
  frameUrl,
  titleTop,
  titleBottom,
  subtitle,
  bgClassName = "bg-bachir-black",
  accentHex = "#C8A96B",
  defaultAspect = 16 / 9,
}: HeroScrubProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const lastDrawnRef = useRef<number>(-1);
  const bgRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const titleTopRef = useRef<HTMLHeadingElement>(null);
  const titleBottomRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const bokehRef = useRef<HTMLCanvasElement>(null);
  const depthBlurRef = useRef<HTMLDivElement>(null);

  const [ready, setReady] = useState(false);
  const [framesOk, setFramesOk] = useState(true);
  const [aspect, setAspect] = useState<number>(defaultAspect);
  const reduced = usePrefersReducedMotion();
  const mounted = useMounted();

  // Progressive frame preloading
  useEffect(() => {
    if (reduced || !mounted) return;
    let cancelled = false;
    let errored = 0;
    const images: HTMLImageElement[] = new Array(frameCount);
    imagesRef.current = images;

    const onFirstReady = (img: HTMLImageElement) => {
      if (cancelled) return;
      const canvas = canvasRef.current;
      if (canvas && img.naturalWidth && img.naturalHeight) {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0);
        lastDrawnRef.current = 0;
        setAspect(img.naturalWidth / img.naturalHeight);
      }
      setReady(true);
      // Fade in bokeh particles
      if (bokehRef.current) {
        gsap.to(bokehRef.current, { opacity: 1, duration: 2, delay: 0.5 });
      }
    };

    const onErr = () => {
      errored++;
      if (!cancelled && errored >= 5) setFramesOk(false);
    };

    const loadOne = (i: number) => {
      const img = new window.Image();
      img.decoding = "async";
      if (i < 4)
        (img as HTMLImageElement & { fetchPriority?: string }).fetchPriority = "high";
      img.onerror = onErr;
      if (i === 0) img.onload = () => onFirstReady(img);
      img.src = frameUrl(i);
      images[i] = img;
    };

    const INITIAL = Math.min(20, frameCount);
    for (let i = 0; i < INITIAL; i++) loadOne(i);

    const BATCH = 20;
    let cursor = INITIAL;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const loadNext = () => {
      if (cancelled) return;
      const end = Math.min(frameCount, cursor + BATCH);
      for (let i = cursor; i < end; i++) loadOne(i);
      cursor = end;
      if (cursor < frameCount) timer = setTimeout(loadNext, 80);
    };
    timer = setTimeout(loadNext, 200);

    const fallbackTimer = window.setTimeout(() => {
      if (!cancelled && !images[0]?.complete) setFramesOk(false);
    }, 4500);

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
      window.clearTimeout(fallbackTimer);
    };
  }, [reduced, mounted, frameCount, frameUrl]);

  // Entry animation
  useEffect(() => {
    if (reduced || !mounted) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: ENTRY_DELAY });
      tl.from(bgRef.current, { opacity: 0, duration: 1.4, ease: "power2.out" });
      tl.from(cardRef.current, { opacity: 0, scale: 0.9, duration: 1.1, ease: "power3.out" }, 0.35);
      tl.from(titleTopRef.current, { opacity: 0, y: 30, filter: "blur(8px)", duration: 1, ease: "expo.out" }, 0.5);
      tl.from(titleBottomRef.current, { opacity: 0, y: -30, filter: "blur(8px)", duration: 1, ease: "expo.out" }, 0.62);
      if (subtitleRef.current) {
        tl.from(subtitleRef.current, { opacity: 0, y: 20, filter: "blur(4px)", duration: 0.8, ease: "expo.out" }, 0.75);
      }
    }, sectionRef);
    return () => ctx.revert();
  }, [reduced, mounted]);

  // Scroll-driven choreography with depth-of-field blur
  useEffect(() => {
    if (reduced || !mounted || !ready || !framesOk) return;
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const startScale = () =>
        window.innerWidth < 768 ? CARD_START_SCALE_MOBILE : CARD_START_SCALE_DESKTOP;

      const immerseScale = () => {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const baseW = Math.min(vw * 0.96, vh * 0.72 * aspect);
        const baseH = Math.min(vh * 0.72, (vw * 0.96) / aspect);
        if (baseW <= 0 || baseH <= 0) return 1.5;
        return Math.max(vw / baseW, vh / baseH) * IMMERSE_OVERFILL;
      };

      const isLoaded = (i: number) => {
        const img = imagesRef.current[i];
        return !!img && img.complete && img.naturalWidth > 0;
      };

      const drawFrame = (index: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        let useIdx = index;
        if (!isLoaded(useIdx)) {
          let found = -1;
          for (let d = 1; d < frameCount; d++) {
            if (useIdx - d >= 0 && isLoaded(useIdx - d)) { found = useIdx - d; break; }
            if (useIdx + d < frameCount && isLoaded(useIdx + d)) { found = useIdx + d; break; }
          }
          if (found === -1) return;
          useIdx = found;
        }
        if (lastDrawnRef.current === useIdx) return;
        const img = imagesRef.current[useIdx];
        const ctx2 = canvas.getContext("2d");
        if (!ctx2 || !img) return;
        ctx2.drawImage(img, 0, 0, canvas.width, canvas.height);
        lastDrawnRef.current = useIdx;
      };

      gsap.set(cardRef.current, { scale: startScale(), transformOrigin: "50% 50%" });

      const master = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.4,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            const mapped = gsap.utils.clamp(0, 1, (p - 0.15) / 0.63);
            const frameIdx = Math.min(frameCount - 1, Math.floor(mapped * frameCount));
            drawFrame(frameIdx);
          },
        },
      });

      // Phase 1: Scale up card + slide titles apart with depth blur (0 → 0.15)
      master.to(cardRef.current, { scale: 1, ease: "power2.out", duration: 0.15 }, 0);
      master.to(titleTopRef.current, {
        x: () => (window.innerWidth < 768 ? "-70vw" : "-60vw"),
        letterSpacing: "0.02em",
        filter: "blur(12px)",
        ease: "power2.inOut",
        duration: 0.15,
      }, 0);
      master.to(titleBottomRef.current, {
        x: () => (window.innerWidth < 768 ? "70vw" : "60vw"),
        letterSpacing: "0.02em",
        filter: "blur(12px)",
        ease: "power2.inOut",
        duration: 0.15,
      }, 0);
      if (subtitleRef.current) {
        master.to(subtitleRef.current, { opacity: 0, y: -30, filter: "blur(6px)", ease: "power1.in", duration: 0.1 }, 0.05);
      }

      // Depth blur overlay - intensifies during immerse
      if (depthBlurRef.current) {
        master.to(depthBlurRef.current, { opacity: 0.6, duration: 0.15 }, 0);
        master.to(depthBlurRef.current, { opacity: 0, duration: 0.22 }, 0.78);
      }

      // Phase 2: Immerse — card fills screen, titles fade out completely (0.15 → 0.78)
      master.to(cardRef.current, { scale: immerseScale(), ease: "power2.in", duration: 0.63 }, 0.15);
      master.to(titleTopRef.current, { opacity: 0, ease: "power1.in", duration: 0.22 }, 0.15);
      master.to(titleBottomRef.current, { opacity: 0, ease: "power1.in", duration: 0.22 }, 0.15);

      // Phase 3: Reset — card shrinks back, titles return with blur-to-sharp (0.78 → 1.0)
      master.to(cardRef.current, { scale: startScale(), ease: "power3.inOut", duration: 0.22 }, 0.78);
      master.to(titleTopRef.current, {
        x: 0, opacity: 1, letterSpacing: "-0.04em", filter: "blur(0px)",
        ease: "power2.inOut", duration: 0.22,
      }, 0.78);
      master.to(titleBottomRef.current, {
        x: 0, opacity: 1, letterSpacing: "-0.04em", filter: "blur(0px)",
        ease: "power2.inOut", duration: 0.22,
      }, 0.78);
      if (subtitleRef.current) {
        master.to(subtitleRef.current, {
          opacity: 1, y: 0, filter: "blur(0px)", ease: "power2.inOut", duration: 0.22,
        }, 0.82);
      }

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, [ready, framesOk, reduced, mounted, aspect, frameCount]);

  // Tall section + inner sticky div = same visual as ScrollTrigger pin, without needing pin
  const tallHeight = `${(PIN_VH_MULTIPLE + 1) * 100}vh`;

  const showLoading = mounted && !ready && framesOk;
  const showCanvas = mounted && framesOk;

  return (
    <section
      ref={sectionRef}
      id="hero"
      className={`relative w-full overflow-clip text-white ${bgClassName}`}
      style={{ height: tallHeight }}
      aria-label="Cinematic scroll-scrubbed hero"
    >
      <div
        ref={stickyRef}
        className="sticky top-0 flex h-[100svh] w-full flex-col items-center justify-center overflow-hidden"
      >
        {/* Background accent glow */}
        <div ref={bgRef} aria-hidden className="absolute inset-0 z-0" style={{ backgroundColor: accentHex }} />

        {/* Dark overlay for readability */}
        <div aria-hidden className="absolute inset-0 z-0 bg-black/30" />

        {/* Radial light spot */}
        <div aria-hidden className="absolute inset-0 z-0" style={{
          background: "radial-gradient(ellipse at 50% 35%, rgba(200,169,107,0.06) 0%, rgba(0,0,0,0) 55%)",
        }} />

        {/* Vignette */}
        <div aria-hidden className="absolute inset-0 z-0" style={{
          background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)",
        }} />

        {/* Gold ambient glow at bottom */}
        <div aria-hidden className="absolute inset-0 z-0" style={{
          background: "linear-gradient(to top, rgba(200,169,107,0.08) 0%, transparent 40%)",
        }} />

        {/* Depth-of-field blur overlay — simulates camera DOF during transitions */}
        <div
          ref={depthBlurRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[3] opacity-0"
          style={{
            background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0.7) 100%)",
            backdropFilter: "blur(0.5px)",
          }}
        />

        {/* Bokeh particles for depth illusion */}
        <BokehParticles />
        <canvas
          ref={bokehRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[5] opacity-0 transition-opacity duration-[2s]"
          style={{ filter: "blur(1px)" }}
        />

        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-3 md:gap-4">
          {/* Top title */}
          <h2
            ref={titleTopRef}
            aria-hidden
            className="font-[family-name:var(--font-syne)] font-black uppercase will-change-transform"
            style={{
              fontSize: "clamp(3.75rem, 12vw, 11rem)",
              lineHeight: 0.85,
              letterSpacing: "-0.04em",
            }}
          >
            <span className="text-white">{titleTop}</span>
          </h2>

          {/* Card with canvas — depth shadow + blur edges */}
          <div
            ref={cardRef}
            className="relative overflow-hidden rounded-[12px] will-change-transform md:rounded-[16px]"
            style={{
              width: `min(96vw, calc(72svh * ${aspect}))`,
              height: `min(72svh, 96vw / ${aspect})`,
              aspectRatio: aspect,
              boxShadow: `
                0 20px 80px rgba(0,0,0,0.55),
                0 0 0 1px rgba(255,255,255,0.06),
                0 0 120px rgba(200,169,107,0.08)
              `,
            }}
          >
            {/* Inner shadow vignette on card */}
            <div aria-hidden className="pointer-events-none absolute inset-0 z-20 shadow-[inset_0_0_120px_rgba(0,0,0,0.45)]" />

            {/* Depth blur edge — simulates shallow DOF on card borders */}
            <div aria-hidden className="pointer-events-none absolute inset-0 z-[18]" style={{
              boxShadow: "inset 0 0 80px 30px rgba(0,0,0,0.5)",
              backdropFilter: "blur(0px)",
            }} />

            {/* Gold border glow */}
            <div aria-hidden className="pointer-events-none absolute inset-0 z-20 rounded-[12px] md:rounded-[16px]" style={{
              boxShadow: "inset 0 0 30px rgba(200,169,107,0.1), 0 0 40px rgba(200,169,107,0.05)",
            }} />

            {/* Canvas — always in DOM, hidden until mounted + framesOk */}
            <canvas
              ref={canvasRef}
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover"
              style={{ visibility: showCanvas ? "visible" : "hidden" }}
            />

            {/* Loading overlay — always in DOM, hidden when ready */}
            <div
              className="absolute inset-0 flex items-center justify-center bg-bachir-black z-30 transition-opacity duration-500"
              style={{ opacity: showLoading ? 1 : 0, pointerEvents: showLoading ? "auto" : "none" }}
            >
              <div className="text-center">
                <p className="text-bachir-gold text-[10px] tracking-[0.4em] uppercase mb-3">
                  Loading Experience
                </p>
                <div className="w-32 h-px bg-bachir-gray-700 relative overflow-hidden">
                  <div className="absolute left-0 top-0 h-full bg-bachir-gold animate-pulse" style={{ width: "60%" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom title */}
          <h2
            ref={titleBottomRef}
            aria-hidden
            className="font-[family-name:var(--font-syne)] font-black uppercase will-change-transform"
            style={{
              fontSize: "clamp(3.75rem, 12vw, 11rem)",
              lineHeight: 0.85,
              letterSpacing: "-0.04em",
            }}
          >
            <span className="text-bachir-gold text-gold-glow">{titleBottom}</span>
          </h2>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="text-white/40 text-sm md:text-base font-light tracking-wider mt-2 transition-opacity duration-300"
            style={{ opacity: subtitle ? 1 : 0 }}
          >
            {subtitle || ""}
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20">
          <span className="text-bachir-gold/40 text-[9px] tracking-[0.3em] uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-bachir-gold/50 to-transparent animate-bounce" />
        </div>
      </div>
    </section>
  );
}
