'use client';

import Link from 'next/link';

const plans = [
  {
    name: 'Starter',
    price: 'GHS 0',
    period: '/month',
    desc: 'For freelancers just getting started',
    features: ['Up to 5 invoices/month', '1 client profile', 'Basic templates', 'Manual payment tracking', 'Email support'],
    cta: 'Get Started Free',
    href: '/register',
    popular: false,
  },
  {
    name: 'Pro',
    price: 'GHS 180',
    period: '/month',
    desc: 'For active freelancers and solo businesses',
    features: ['Unlimited invoices', 'Unlimited clients', 'Automated payment reminders', 'Payment links', 'Multi-currency support', 'Revenue dashboard', 'Priority email support'],
    cta: 'Start 14-Day Free Trial',
    href: '/register',
    popular: true,
  },
  {
    name: 'Business',
    price: 'GHS 450',
    period: '/month',
    desc: 'For teams and growing agencies',
    features: ['Everything in Pro', 'Up to 10 team members', 'Client portal access', 'Custom invoice branding', 'Advanced reports & exports', 'Tax automation', 'Dedicated account manager'],
    cta: 'Start 14-Day Free Trial',
    href: '/register',
    popular: false,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 lp-animate">
          <span className="inline-block text-sm font-bold text-[#4318FF] uppercase tracking-widest mb-4 bg-[#4318FF]/5 px-4 py-1.5 rounded-full">Pricing</span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">Simple pricing. No surprises.</h2>
          <p className="text-lg text-gray-500 font-medium">Start free. Upgrade when you're ready. Cancel anytime.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
          {plans.map((plan, i) => (
            <div key={i} className={`lp-animate rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2 relative ${plan.popular ? 'bg-[#4318FF] text-white shadow-2xl shadow-[#4318FF]/30 scale-[1.02] md:scale-105 border-2 border-[#4318FF]' : 'bg-white border border-gray-200 hover:shadow-xl hover:border-[#4318FF]/20'}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-gray-900 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                  Most Popular
                </div>
              )}

              <h3 className={`text-xl font-bold mb-1 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
              <p className={`text-sm font-medium mb-6 ${plan.popular ? 'text-white/70' : 'text-gray-500'}`}>{plan.desc}</p>

              <div className="flex items-end gap-1 mb-8">
                <span className={`text-5xl font-black ${plan.popular ? 'text-white' : 'text-gray-900'}`}>{plan.price}</span>
                <span className={`text-sm font-medium mb-2 ${plan.popular ? 'text-white/60' : 'text-gray-400'}`}>{plan.period}</span>
              </div>

              <ul className="space-y-3.5 mb-8">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <svg className={`w-5 h-5 shrink-0 mt-0.5 ${plan.popular ? 'text-green-300' : 'text-green-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className={`text-sm font-medium ${plan.popular ? 'text-white/90' : 'text-gray-600'}`}>{f}</span>
                  </li>
                ))}
              </ul>

              <a href={plan.href} className={`block w-full text-center font-bold py-4 rounded-2xl transition-all text-sm ${plan.popular ? 'bg-white text-[#4318FF] hover:bg-gray-100 shadow-lg' : 'bg-[#4318FF] text-white hover:bg-[#3311db] shadow-lg shadow-[#4318FF]/20'}`}>
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
