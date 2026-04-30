'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Testimonials', href: '#testimonials' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.06)] py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 bg-[#4318FF] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#4318FF]/30 group-hover:scale-110 transition-transform">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-xl font-black tracking-tight text-gray-900">Invo.</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-semibold text-gray-600 hover:text-[#4318FF] transition-colors">
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <a href="/login" className="text-sm font-bold text-gray-700 hover:text-[#4318FF] transition-colors">
            Sign In
          </a>
          <a href="/register" className="bg-[#4318FF] text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-[#3311db] shadow-lg shadow-[#4318FF]/25 hover:shadow-[#4318FF]/40 transition-all hover:-translate-y-0.5">
            Get Started Free
          </a>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-gray-700" aria-label="Toggle menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-xl animate-[fadeDown_0.3s_ease-out]">
          <div className="px-6 py-6 space-y-4">
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="block text-sm font-semibold text-gray-700 hover:text-[#4318FF] py-2">
                {l.label}
              </a>
            ))}
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <a href="/login" className="block text-sm font-bold text-gray-700 py-2">Sign In</a>
              <a href="/register" className="block bg-[#4318FF] text-white text-sm font-bold px-6 py-3 rounded-xl text-center shadow-lg shadow-[#4318FF]/25">
                Get Started Free
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
