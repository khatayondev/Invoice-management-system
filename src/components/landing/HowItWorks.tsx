'use client';

const steps = [
  { num: '01', title: 'Create your account', desc: 'Sign up free. Add your business details, logo, and payment info in under 5 minutes.', icon: '🚀' },
  { num: '02', title: 'Add your clients', desc: 'Import from a spreadsheet or add manually. Invo remembers everything for next time.', icon: '👥' },
  { num: '03', title: 'Send your first invoice', desc: 'Pick a template, fill in the details, hit send. Your client gets a clean, professional invoice instantly.', icon: '📨' },
  { num: '04', title: 'Get paid & track everything', desc: 'Watch payments roll in on your dashboard. Invo handles reminders, records, and receipts automatically.', icon: '💰' },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 lp-animate">
          <span className="inline-block text-sm font-bold text-[#4318FF] uppercase tracking-widest mb-4 bg-[#4318FF]/5 px-4 py-1.5 rounded-full">How It Works</span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            Up and running in minutes.
          </h2>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Connector line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#4318FF]/20 via-[#4318FF]/10 to-transparent hidden md:block" />

          <div className="space-y-12 md:space-y-16">
            {steps.map((step, i) => (
              <div key={i} className={`lp-animate flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                <div className={`flex-1 ${i % 2 === 1 ? 'md:text-right' : ''}`}>
                  <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="text-4xl mb-4">{step.icon}</div>
                    <div className="text-xs font-black text-[#4318FF] uppercase tracking-widest mb-2">Step {step.num}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-500 font-medium text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>

                {/* Center dot */}
                <div className="hidden md:flex w-12 h-12 rounded-full bg-[#4318FF] text-white font-black text-sm items-center justify-center shrink-0 shadow-lg shadow-[#4318FF]/30 z-10 relative">
                  {step.num}
                </div>

                <div className="flex-1 hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
