'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FOOTER_SERVICES = [
  'Carrosserie',
  'Peinture',
  'Detailing',
  'Céramique',
  'Cuir',
  'Jantes',
  'Polish',
  'Restauration',
];

export default function Footer() {
  const spacerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const bachirRef = useRef<HTMLDivElement>(null);
  const auroraRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!spacerRef.current || !footerRef.current) return;

    // Curtain reveal
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

    // BACHIR parallax
    if (bachirRef.current) {
      gsap.to(bachirRef.current, {
        y: -120,
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,
        },
      });
    }

    // Aurora breathing
    if (auroraRef.current) {
      gsap.to(auroraRef.current, {
        scale: 1.15,
        opacity: 0.25,
        duration: 4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    }

    // Marquee
    gsap.to('.footer-marquee', {
      xPercent: -50,
      duration: 20,
      ease: 'none',
      repeat: -1,
    });
  }, []);

  return (
    <>
      {/* Spacer that triggers the reveal — white bg for seamless CTA→Footer flow */}
      <div ref={spacerRef} className="h-[100vh] bg-bachir-black" />

      <footer
        ref={footerRef}
        className="fixed bottom-0 left-0 right-0 bg-bachir-black z-50 overflow-hidden"
        style={{ clipPath: 'inset(100% 0 0 0)' }}
      >
        {/* Giant BACHIR watermark */}
        <div
          ref={bachirRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <span
            className="font-[family-name:var(--font-syne)] font-bold text-bachir-gold/10 select-none"
            style={{ fontSize: '15vw', letterSpacing: '-0.04em' }}
          >
            BACHIR
          </span>
        </div>

        {/* Aurora glow */}
        <div
          ref={auroraRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[40vh] rounded-full opacity-15"
          style={{
            background:
              'radial-gradient(ellipse, rgba(200,169,107,0.15) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {/* Brand */}
            <div>
              <h3 className="font-[family-name:var(--font-syne)] text-2xl md:text-3xl font-bold tracking-tight text-bachir-white mb-4">
                PERFECTION
                <span className="text-bachir-gold text-sm ml-2 tracking-[0.3em] uppercase font-medium">
                  BY BACHIR
                </span>
              </h3>
              <p className="text-bachir-gray-500 text-sm leading-relaxed">
                Atelier de rénovation automobile haut de gamme.
                <br />
                Dakar, Sénégal
              </p>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-[10px] tracking-[0.3em] uppercase text-bachir-gold font-medium mb-4">
                Services
              </h4>
              <div className="flex flex-wrap gap-2">
                {FOOTER_SERVICES.map((s) => (
                  <span
                    key={s}
                    className="px-3 py-1 border border-white/10 text-bachir-gray-500 text-xs hover:border-bachir-gold hover:text-bachir-gold transition-colors duration-300"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-[10px] tracking-[0.3em] uppercase text-bachir-gold font-medium mb-4">
                Contact
              </h4>
              <div className="space-y-2 text-bachir-gray-500 text-sm">
                <p>+221 77 000 00 00</p>
                <p>contact@perfectionbachir.com</p>
                <p>Dakar, Sénégal</p>
              </div>
              <div className="flex gap-4 mt-4">
                <a
                  href="#"
                  className="w-8 h-8 border border-white/10 flex items-center justify-center text-bachir-gray-500 hover:border-bachir-gold hover:text-bachir-gold transition-colors duration-300 text-xs"
                >
                  IG
                </a>
                <a
                  href="#"
                  className="w-8 h-8 border border-white/10 flex items-center justify-center text-bachir-gray-500 hover:border-bachir-gold hover:text-bachir-gold transition-colors duration-300 text-xs"
                >
                  FB
                </a>
                <a
                  href="#"
                  className="w-8 h-8 border border-white/10 flex items-center justify-center text-bachir-gray-500 hover:border-bachir-gold hover:text-bachir-gold transition-colors duration-300 text-xs"
                >
                  TK
                </a>
              </div>
            </div>
          </div>

          {/* Marquee */}
          <div className="mt-12 md:mt-16 overflow-hidden border-t border-white/10 pt-6">
            <div className="footer-marquee flex whitespace-nowrap gap-8">
              {[...FOOTER_SERVICES, ...FOOTER_SERVICES].map((s, i) => (
                <span
                  key={i}
                  className="font-[family-name:var(--font-syne)] text-2xl md:text-4xl font-bold text-white/5 tracking-tight"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-bachir-gray-500 text-xs">
              © 2026 Perfection by Bachir. Tous droits réservés.
            </p>
            <p className="text-bachir-gray-500 text-xs">
              Crafting Perfection, Every Detail.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
