'use client';

export default function ProblemSection() {
  const painPoints = [
    { icon: '📧', title: 'Lost invoices', desc: "Clients claim they never received it. You have no proof." },
    { icon: '⏰', title: 'Late payments', desc: "You're too busy to follow up. They're too comfortable to pay." },
    { icon: '👁️', title: 'No visibility', desc: "You have no idea which invoices are paid, pending, or overdue at any moment." },
    { icon: '📋', title: 'Manual busywork', desc: "Copying details, recalculating taxes, formatting PDFs — every single time." },
  ];

  return (
    <section className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 lp-animate">
          <span className="inline-block text-sm font-bold text-[#4318FF] uppercase tracking-widest mb-4 bg-[#4318FF]/5 px-4 py-1.5 rounded-full">The Problem</span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-6">
            Invoicing shouldn't feel like<br className="hidden md:block" /> a second job.
          </h2>
          <p className="text-lg text-gray-500 font-medium max-w-2xl mx-auto">
            Most businesses still rely on scattered spreadsheets, forgotten follow-up emails, and manual payment tracking. That's time stolen from actual work — and money left on the table.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {painPoints.map((p, i) => (
            <div key={i} className="lp-animate group bg-gray-50/80 hover:bg-white border border-gray-100 hover:border-red-100 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/5 hover:-translate-y-1" style={{ transitionDelay: `${i * 100}ms` }}>
              <div className="flex items-start gap-4">
                <div className="text-3xl shrink-0 mt-1 group-hover:scale-110 transition-transform">{p.icon}</div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{p.title}</h3>
                  <p className="text-gray-500 text-sm font-medium leading-relaxed">{p.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
