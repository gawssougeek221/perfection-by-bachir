'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ────────────────────────────────────────────
   Generate random scatter positions (cube)
   ──────────────────────────────────────────── */
function generateRandomPositions(count: number): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 10;
    positions[i3 + 1] = (Math.random() - 0.5) * 6;
    positions[i3 + 2] = (Math.random() - 0.5) * 4;
  }
  return positions;
}

/* ────────────────────────────────────────────
   Generate car silhouette positions (side view)
   ──────────────────────────────────────────── */
function generateCarPositions(count: number): Float32Array {
  const positions = new Float32Array(count * 3);
  let idx = 0;

  const addPoint = (x: number, y: number, z: number) => {
    if (idx < count * 3) {
      positions[idx++] = x;
      positions[idx++] = y;
      positions[idx++] = z;
    }
  };

  // ── Car body (rounded rectangle, slightly tapered at front) — 35% ──
  const bodyCount = Math.floor(count * 0.35);
  for (let i = 0; i < bodyCount; i++) {
    const t = (i / bodyCount) * Math.PI * 2;
    // Asymmetric ellipse: slightly tapered at front (negative x)
    const taper = 1 - 0.15 * Math.max(0, -Math.cos(t));
    const x = Math.cos(t) * 2.4 * taper + (Math.random() - 0.5) * 0.12;
    const y = Math.sin(t) * 0.55 + 0.35 + (Math.random() - 0.5) * 0.08;
    const z = (Math.random() - 0.5) * 0.5;
    addPoint(x, y, z);
  }

  // ── Roof (smaller rounded shape on top, set back) — 20% ──
  const roofCount = Math.floor(count * 0.2);
  for (let i = 0; i < roofCount; i++) {
    const t = (i / roofCount) * Math.PI;
    const x = Math.cos(t) * 1.1 + 0.25 + (Math.random() - 0.5) * 0.08;
    const y = Math.sin(t) * 0.45 + 1.15 + (Math.random() - 0.5) * 0.06;
    const z = (Math.random() - 0.5) * 0.4;
    addPoint(x, y, z);
  }

  // ── Windshield (angled area between body and roof) — 10% ──
  const windCount = Math.floor(count * 0.1);
  for (let i = 0; i < windCount; i++) {
    // Front windshield: line from body top-front to roof front
    const t = Math.random();
    const x = (1 - t) * 1.0 + t * 1.35 + (Math.random() - 0.5) * 0.06;
    const y = (1 - t) * 0.9 + t * 1.15 + (Math.random() - 0.5) * 0.06;
    const z = (Math.random() - 0.5) * 0.35;
    addPoint(x, y, z);
  }

  // ── Rear windshield — 5% ──
  const rearWindCount = Math.floor(count * 0.05);
  for (let i = 0; i < rearWindCount; i++) {
    const t = Math.random();
    const x = (1 - t) * (-0.85) + t * (-0.6) + (Math.random() - 0.5) * 0.05;
    const y = (1 - t) * 0.9 + t * 1.15 + (Math.random() - 0.5) * 0.05;
    const z = (Math.random() - 0.5) * 0.35;
    addPoint(x, y, z);
  }

  // ── Wheels (two circles at bottom) — 15% ──
  const wheelCount = Math.floor(count * 0.075);
  for (let w = 0; w < 2; w++) {
    const cx = w === 0 ? -1.4 : 1.4;
    for (let i = 0; i < wheelCount; i++) {
      const t = (i / wheelCount) * Math.PI * 2;
      const r = 0.42 + (Math.random() - 0.5) * 0.04;
      const px = cx + Math.cos(t) * r;
      const py = Math.sin(t) * r - 0.12;
      const pz = (Math.random() - 0.5) * 0.3;
      addPoint(px, py, pz);
    }
  }

  // ── Fill interior for body density — remaining ──
  const fillCount = count - Math.floor(idx / 3);
  for (let i = 0; i < fillCount; i++) {
    const x = (Math.random() - 0.5) * 4.4;
    const y = Math.random() * 1.5 + 0.05;
    const z = (Math.random() - 0.5) * 0.3;
    // Keep points inside car silhouette
    const bodyWidth = 2.2 * (1 - 0.15 * Math.max(0, -x / 2.2));
    if (Math.abs(x) < bodyWidth && y < 1.55) {
      addPoint(x, y, z);
    } else {
      // Fallback: random body interior
      addPoint(
        (Math.random() - 0.5) * 3.5,
        Math.random() * 0.7 + 0.1,
        (Math.random() - 0.5) * 0.25
      );
    }
  }

  return positions;
}

/* ────────────────────────────────────────────
   Create a circular particle texture via Canvas
   ──────────────────────────────────────────── */
function createCircleTexture(): THREE.CanvasTexture {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const half = size / 2;
  const gradient = ctx.createRadialGradient(half, half, 0, half, half, half);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.3, 'rgba(255,255,255,0.8)');
  gradient.addColorStop(0.7, 'rgba(255,255,255,0.3)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/* ────────────────────────────────────────────
   Component
   ──────────────────────────────────────────── */
const PARTICLE_COUNT = 2500;
const CHAMPAGNE_HEX = 0xb8860b;
const WHITE_HEX = 0xffffff;

export default function CarParticles() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    /* ── Scene setup ── */
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0.5, 6);
    camera.lookAt(0, 0.4, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setClearColor(0x2a2a2a, 1);

    /* ── Particle data ── */
    const randomPos = generateRandomPositions(PARTICLE_COUNT);
    const carPos = generateCarPositions(PARTICLE_COUNT);

    // Current interpolated positions
    const currentPos = new Float32Array(PARTICLE_COUNT * 3);
    currentPos.set(randomPos);

    // Color per particle: ~80% champagne, ~20% white
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const champagne = new THREE.Color(CHAMPAGNE_HEX);
    const white = new THREE.Color(WHITE_HEX);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const isWhite = Math.random() < 0.2;
      const c = isWhite ? white : champagne;
      // Slight random variation for richness
      const variation = 0.85 + Math.random() * 0.3;
      colors[i * 3] = c.r * variation;
      colors[i * 3 + 1] = c.g * variation;
      colors[i * 3 + 2] = c.b * variation;
    }

    /* ── BufferGeometry ── */
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(currentPos, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const texture = createCircleTexture();

    const material = new THREE.PointsMaterial({
      size: 0.04,
      map: texture,
      transparent: true,
      opacity: 0.85,
      vertexColors: true,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    const group = new THREE.Group();
    group.add(points);
    scene.add(group);

    /* ── Progress value for scroll ── */
    const progress = { value: 0 };

    /* ── GSAP ScrollTrigger ── */
    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.5,
      onUpdate: (self) => {
        progress.value = self.progress;
      },
    });

    /* ── Animation loop ── */
    let rafId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      rafId = requestAnimationFrame(animate);

      const posAttr = geometry.getAttribute('position') as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;
      const p = progress.value;

      // Lerp between random and car positions
      for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
        arr[i] = randomPos[i] + (carPos[i] - randomPos[i]) * p;
      }
      posAttr.needsUpdate = true;

      // Slow rotation
      const elapsed = clock.getElapsedTime();
      group.rotation.y = Math.sin(elapsed * 0.15) * 0.25;
      group.rotation.x = Math.sin(elapsed * 0.1) * 0.05;

      // Subtle floating when in car formation
      if (p > 0.5) {
        const floatStrength = (p - 0.5) * 2; // 0→1
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const i3 = i * 3;
          arr[i3 + 1] += Math.sin(elapsed * 0.8 + i * 0.01) * 0.002 * floatStrength;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    /* ── Resize handler ── */
    const handleResize = () => {
      if (!canvas) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    /* ── Cleanup ── */
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      st.kill();
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-[300vh] bg-bachir-black"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10">
          <p className="text-white/40 text-[10px] tracking-[0.5em] uppercase font-medium">
            L&apos;Art de la Perfection
          </p>
        </div>
      </div>
    </section>
  );
}
