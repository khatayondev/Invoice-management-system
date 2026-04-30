'use client';

const testimonials = [
  {
    quote: "I went from spending 3 hours a week on invoicing to maybe 20 minutes. The automated reminders alone have saved me thousands in late payments.",
    name: 'Kwame Asante',
    title: 'Freelance Brand Designer, Accra',
    avatar: 'K',
    color: 'from-[#4318FF] to-purple-500',
  },
  {
    quote: "Invo gave me a real picture of my cash flow for the first time. I didn't realize how much money I was losing to late invoices until I saw it on the dashboard.",
    name: 'Priya Menon',
    title: 'Founder, Menon Consulting Group',
    avatar: 'P',
    color: 'from-emerald-500 to-green-600',
  },
  {
    quote: "My clients actually comment on how professional my invoices look now. And I haven't had to chase a single late payment since I turned on the reminders.",
    name: 'Jordan Marks',
    title: 'Photographer & Creative Director',
    avatar: 'J',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    quote: "We run a team of 12 with clients in 6 countries. Invo handles the multi-currency billing and tax stuff so we don't have to think about it.",
    name: 'Amaka Osei',
    title: 'COO, Pivot Digital Agency',
    avatar: 'A',
    color: 'from-pink-500 to-rose-500',
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 md:py-32 bg-gradient-to-b from-white to-[#F4F7FE] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 lp-animate">
          <span className="inline-block text-sm font-bold text-[#4318FF] uppercase tracking-widest mb-4 bg-[#4318FF]/5 px-4 py-1.5 rounded-full">What Our Users Say</span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            Businesses that switched<br className="hidden md:block" /> never went back.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <div key={i} className="lp-animate bg-white rounded-3xl border border-gray-100 p-8 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 hover:-translate-y-1 group" style={{ transitionDelay: `${i * 100}ms` }}>
              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, j) => (
                  <svg key={j} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="text-gray-700 font-medium leading-relaxed mb-6 text-[15px]">"{t.quote}"</p>

              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${t.color} text-white flex items-center justify-center font-bold text-sm shadow-md group-hover:scale-110 transition-transform`}>
                  {t.avatar}
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-sm">{t.name}</div>
                  <div className="text-xs text-gray-500 font-medium">{t.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
