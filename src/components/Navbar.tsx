'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Menu, X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const NAV_LINKS = [
  { label: 'Accueil', href: '#hero' },
  { label: 'Services', href: '#services' },
  { label: 'Réalisations', href: '#before-after' },
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
      filter: 'blur(10px)',
      duration: 1,
      ease: 'power3.out',
      delay: 2.2,
    });

    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

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
        scrolled
          ? 'bg-bachir-black/60 backdrop-blur-2xl border-b border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
          : 'bg-transparent'
      }`}
      style={{
        backdropFilter: scrolled ? 'blur(20px) saturate(1.5)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('#hero');
          }}
          className="flex items-center gap-3 group"
        >
          <span className="font-[family-name:var(--font-syne)] text-lg md:text-xl font-bold tracking-tight text-bachir-white group-hover:text-white transition-colors duration-300">
            PERFECTION
          </span>
          <span className="hidden md:inline text-bachir-gold text-[10px] tracking-[0.3em] uppercase font-medium">
            BY BACHIR
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link.href);
              }}
              className="text-[11px] font-medium tracking-[0.2em] uppercase text-white/50 hover:text-white transition-all duration-300"
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://wa.me/221770000000"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-4 px-5 py-2 border border-bachir-gold/30 text-bachir-gold text-[10px] tracking-[0.2em] uppercase font-semibold hover:bg-bachir-gold hover:text-bachir-black transition-all duration-300 hover:shadow-[0_0_20px_rgba(184,134,11,0.3)]"
          >
            WhatsApp
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-bachir-white hover:text-white transition-colors"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu — glassmorphism depth */}
      {mobileOpen && (
        <div className="md:hidden bg-bachir-black/70 border-t border-white/5" style={{
          backdropFilter: 'blur(30px) saturate(1.5)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}>
          <div className="px-6 py-8 flex flex-col gap-6">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="text-sm tracking-[0.2em] uppercase text-white/60 hover:text-white transition-all duration-300"
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://wa.me/221770000000"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block px-6 py-3 border border-bachir-gold text-bachir-gold text-xs tracking-[0.2em] uppercase font-semibold text-center hover:shadow-[0_0_20px_rgba(184,134,11,0.3)]"
            >
              WhatsApp
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
