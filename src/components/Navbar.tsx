'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Menu, X } from 'lucide-react';

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
      className={`fixed top-0 left-0 right-0 z-[90] transition-all duration-700 ${
        scrolled ? 'bg-[#0C0C0C]/80 backdrop-blur-2xl' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 md:px-16 flex items-center justify-between h-20">
        <a href="#hero" onClick={(e) => { e.preventDefault(); handleNavClick('#hero'); }}>
          <span className="font-[family-name:var(--font-syne)] text-base md:text-lg font-bold tracking-tight text-bachir-white">
            PERFECTION
          </span>
        </a>

        <div className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
              className="text-[11px] tracking-[0.2em] uppercase text-white/30 hover:text-white/80 transition-colors duration-500"
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://wa.me/221770000000"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 text-[10px] tracking-[0.2em] uppercase text-white/50 border border-white/10 hover:border-white/20 transition-all duration-500"
          >
            WhatsApp
          </a>
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-white/40">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-[#0C0C0C]/95 backdrop-blur-2xl">
          <div className="px-8 py-10 flex flex-col gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                className="text-sm tracking-[0.2em] uppercase text-white/30 hover:text-white/80 transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://wa.me/221770000000"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] tracking-[0.2em] uppercase text-white/50 border border-white/10 px-5 py-3 inline-block w-fit"
            >
              WhatsApp
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
