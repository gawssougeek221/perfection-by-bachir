'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const spacerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!spacerRef.current || !footerRef.current) return;

    gsap.timeline({
      scrollTrigger: {
        trigger: spacerRef.current,
        start: 'top bottom',
        end: 'bottom bottom',
        scrub: 1.5,
      },
    }).fromTo(
      footerRef.current,
      { clipPath: 'inset(100% 0 0 0)' },
      { clipPath: 'inset(0% 0 0 0)', ease: 'none' }
    );
  }, []);

  const SERVICES = ['Carrosserie', 'Peinture', 'Detailing', 'Céramique', 'Cuir', 'Jantes'];

  return (
    <>
      <div ref={spacerRef} className="h-[100vh] bg-bachir-black" />

      <footer
        ref={footerRef}
        className="fixed bottom-0 left-0 right-0 bg-[#0A0A0A] z-50 overflow-hidden"
        style={{ clipPath: 'inset(100% 0 0 0)' }}
      >
        <div className="max-w-7xl mx-auto px-8 md:px-16 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Brand */}
            <div>
              <h3 className="font-[family-name:var(--font-syne)] text-xl font-bold tracking-tight text-bachir-white">
                PERFECTION
              </h3>
              <span className="text-white/15 text-[9px] tracking-[0.3em] uppercase font-medium">
                by Bachir
              </span>
              <p className="text-white/20 text-xs leading-relaxed mt-4">
                Atelier de rénovation automobile haut de gamme.<br />Dakar, Sénégal
              </p>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-[10px] tracking-[0.3em] uppercase text-white/15 font-medium mb-6">
                Services
              </h4>
              <div className="flex flex-col gap-3">
                {SERVICES.map((s) => (
                  <span key={s} className="text-white/25 text-xs hover:text-white/50 transition-colors duration-300">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-[10px] tracking-[0.3em] uppercase text-white/15 font-medium mb-6">
                Contact
              </h4>
              <div className="space-y-2 text-white/25 text-xs">
                <p>+221 77 000 00 00</p>
                <p>contact@perfectionbachir.com</p>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-16 pt-8 border-t border-white/[0.04] flex items-center justify-between">
            <p className="text-white/10 text-[10px]">© 2026 Perfection by Bachir</p>
            <p className="text-white/10 text-[10px] tracking-[0.2em] uppercase">Crafting Perfection</p>
          </div>
        </div>
      </footer>
    </>
  );
}
