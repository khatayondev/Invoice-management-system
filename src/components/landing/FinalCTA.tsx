'use client';

import Link from 'next/link';

export default function FinalCTA() {
  const badges = ['No credit card required', 'Free plan, forever', 'Cancel anytime', 'SOC 2 Secured'];

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#4318FF] via-[#5B3AFF] to-purple-700" />
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
        backgroundSize: '40px 40px',
      }} />
      <div className="absolute top-10 left-10 w-[400px] h-[400px] bg-white/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-purple-300/10 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6 lp-animate leading-tight">
          Your next invoice should<br className="hidden md:block" /> be your easiest one yet.
        </h2>
        <p className="text-lg md:text-xl text-white/70 font-medium max-w-2xl mx-auto mb-10 lp-animate">
          Join thousands of businesses using Invo to get paid faster, look more professional, and spend less time on admin.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 lp-animate">
          <a href="/register" className="bg-white text-[#4318FF] font-bold px-8 py-4 rounded-2xl text-lg hover:bg-gray-100 shadow-2xl shadow-black/10 transition-all hover:-translate-y-1 hover:scale-105">
            Create Your Free Account
          </a>
          <a href="#how-it-works" className="border-2 border-white/30 text-white font-bold px-8 py-4 rounded-2xl text-lg hover:bg-white/10 transition-all hover:-translate-y-0.5">
            Book a Demo
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 lp-animate">
          {badges.map((badge, i) => (
            <div key={i} className="flex items-center gap-2 text-white/70 text-sm font-medium">
              <svg className="w-4 h-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {badge}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
