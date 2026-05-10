'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Menu, X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Réalisations', href: '#gallery' },
  { label: 'À Propos', href: '#about' },
  { label: 'Contact', href: '#cta' },
];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!navRef.current) return;

    gsap.from(navRef.current, {
      y: -100,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out',
      delay: 2.2,
    });

    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-[90] transition-all duration-500 ${
        scrolled ? 'bg-bachir-black/80 backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 md:px-16 flex items-center justify-between h-16 md:h-20">
        <a href="#hero" onClick={(e) => { e.preventDefault(); handleNavClick('#hero'); }} className="flex items-center gap-2">
          <span className="font-[family-name:var(--font-syne)] text-base md:text-lg font-bold tracking-tight text-bachir-white">
            PERFECTION
          </span>
          <span className="hidden md:inline text-bachir-gold text-[9px] tracking-[0.3em] uppercase font-medium">
            by Bachir
          </span>
        </a>

        <div className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
              className="text-[10px] font-medium tracking-[0.25em] uppercase text-white/40 hover:text-white transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://wa.me/221770000000"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 text-bachir-gold text-[9px] tracking-[0.25em] uppercase font-semibold border border-bachir-gold/20 hover:bg-bachir-gold hover:text-bachir-black transition-all duration-300 cursor-hover"
            data-magnetic="0.2"
          >
            WhatsApp
          </a>
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-white/60">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-bachir-black/90 backdrop-blur-xl">
          <div className="px-8 py-8 flex flex-col gap-6">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                className="text-sm tracking-[0.2em] uppercase text-white/50 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
