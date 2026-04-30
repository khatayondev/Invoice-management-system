'use client';

const features = [
  {
    icon: '⚡', title: 'Create in seconds, not hours',
    desc: 'Build professional, branded invoices in under 60 seconds. Add your logo, customize line items, apply taxes, and send — all from one clean interface.',
    gradient: 'from-[#4318FF] to-purple-600',
  },
  {
    icon: '🔔', title: 'Let Invo do the chasing',
    desc: 'Set reminder schedules and Invo automatically nudges clients before and after due dates — politely, professionally, and without you lifting a finger.',
    gradient: 'from-green-500 to-emerald-600',
  },
  {
    icon: '📊', title: 'Always know where your money stands',
    desc: 'A live overview of every invoice — paid, pending, overdue. See your income pipeline at a glance, filter by client or date, and never be caught off guard.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: '🌍', title: 'Built for global business',
    desc: 'Work with clients across borders without the headache. Invo supports multiple currencies, local tax rules, and automatic conversion.',
    gradient: 'from-orange-500 to-amber-500',
  },
  {
    icon: '💳', title: 'Make it stupid easy to pay you',
    desc: 'Every invoice comes with a secure, one-click payment link. Clients can pay via card, bank transfer, or mobile money — no account needed.',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    icon: '📈', title: 'Know your numbers, grow your business',
    desc: 'Monthly summaries, revenue trends, top-paying clients, and overdue reports — all exportable. Invo gives you financial clarity for smart decisions.',
    gradient: 'from-violet-500 to-purple-600',
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 md:py-32 bg-gradient-to-b from-[#F4F7FE] to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 lp-animate">
          <span className="inline-block text-sm font-bold text-[#4318FF] uppercase tracking-widest mb-4 bg-[#4318FF]/5 px-4 py-1.5 rounded-full">What Invo Does</span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-6">
            Everything you need to<br className="hidden md:block" /> get paid — in one place.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="lp-animate group bg-white rounded-3xl border border-gray-100 p-8 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 hover:-translate-y-2" style={{ transitionDelay: `${i * 80}ms` }}>
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center text-2xl shadow-lg mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
              <p className="text-gray-500 font-medium text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
