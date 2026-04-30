'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!started) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, [started, target]);

  return <>{count.toLocaleString()}{suffix}</>;
}

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-20">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F4F7FE] via-white to-[#EDE9FF]" />
      <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-[#4318FF]/5 rounded-full blur-[120px] animate-[float_8s_ease-in-out_infinite]" />
      <div className="absolute bottom-20 right-10 w-[400px] h-[400px] bg-purple-400/8 rounded-full blur-[100px] animate-[float_6s_ease-in-out_infinite_reverse]" />
      <div className="absolute top-40 right-1/4 w-[300px] h-[300px] bg-blue-300/8 rounded-full blur-[80px] animate-[float_10s_ease-in-out_infinite]" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(#4318FF 1px, transparent 1px), linear-gradient(90deg, #4318FF 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-md border border-[#4318FF]/10 rounded-full px-5 py-2 mb-8 shadow-sm animate-[fadeUp_0.6s_ease-out]">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm font-semibold text-gray-700">Trusted by 4,000+ freelancers and growing businesses</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-gray-900 mb-6 leading-[1.05] animate-[fadeUp_0.8s_ease-out]">
          Stop chasing<br />
          <span className="bg-gradient-to-r from-[#4318FF] via-purple-500 to-blue-500 bg-clip-text text-transparent">payments.</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-500 font-medium max-w-2xl mx-auto mb-10 leading-relaxed animate-[fadeUp_1s_ease-out]">
          Invo is the modern invoice management platform that helps freelancers and teams create, send, and track invoices — so money moves faster and nothing falls through the cracks.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6 animate-[fadeUp_1.2s_ease-out]">
          <Link href="/register" className="bg-[#4318FF] text-white font-bold px-8 py-4 rounded-2xl text-lg hover:bg-[#3311db] shadow-xl shadow-[#4318FF]/25 hover:shadow-[#4318FF]/40 transition-all hover:-translate-y-1 hover:scale-105">
            Start for Free
          </Link>
          <a href="#how-it-works" className="bg-white/80 backdrop-blur-md border border-gray-200 text-gray-700 font-bold px-8 py-4 rounded-2xl text-lg hover:border-[#4318FF]/30 hover:text-[#4318FF] transition-all hover:-translate-y-0.5 shadow-sm">
            See How It Works
          </a>
        </div>
        <p className="text-sm text-gray-400 font-medium animate-[fadeUp_1.4s_ease-out]">No credit card required</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-xl mx-auto mt-16 animate-[fadeUp_1.6s_ease-out]">
          <div>
            <div className="text-3xl md:text-4xl font-black text-gray-900">GH₵ <AnimatedCounter target={650} />M+</div>
            <div className="text-sm text-gray-500 font-medium mt-1">Invoices processed</div>
          </div>
          <div className="border-x border-gray-200 px-8">
            <div className="text-3xl md:text-4xl font-black text-gray-900"><AnimatedCounter target={3} />x</div>
            <div className="text-sm text-gray-500 font-medium mt-1">Faster payments</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-black text-gray-900"><AnimatedCounter target={98} />%</div>
            <div className="text-sm text-gray-500 font-medium mt-1">Satisfaction rate</div>
          </div>
        </div>
      </div>
    </section>
  );
}
