'use client';

import { useState } from 'react';

const faqs = [
  { q: 'Do I need a credit card to sign up?', a: 'No. Your free account is completely free — no card required. You only need payment info if you upgrade to a paid plan.' },
  { q: 'Can I use Invo with my existing accounting software?', a: 'Yes. Invo integrates with QuickBooks, Xero, and FreshBooks. You can also export all records as CSV or PDF anytime.' },
  { q: 'What payment methods can my clients use?', a: 'Clients can pay via credit/debit card, bank transfer, and mobile money. We support Stripe, PayPal, and local payment providers depending on your region.' },
  { q: 'Is my data secure?', a: 'Absolutely. Invo uses 256-bit SSL encryption and is SOC 2 compliant. Your data and your clients\' data is never shared or sold.' },
  { q: 'Can I customize my invoices with my brand?', a: 'Yes — on Pro and Business plans you can add your logo, choose colors, and customize the layout to match your brand identity.' },
  { q: 'What happens if I go over my invoice limit on the free plan?', a: "We'll notify you and give you the option to upgrade. We won't cut off your access or charge you automatically." },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 md:py-32 bg-gradient-to-b from-[#F4F7FE] to-white relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16 lp-animate">
          <span className="inline-block text-sm font-bold text-[#4318FF] uppercase tracking-widest mb-4 bg-[#4318FF]/5 px-4 py-1.5 rounded-full">FAQ</span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            Questions? We've got answers.
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="lp-animate bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-[#4318FF]/10">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left group"
              >
                <span className="font-bold text-gray-900 text-[15px] pr-4">{faq.q}</span>
                <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center transition-all duration-300 ${openIndex === i ? 'bg-[#4318FF] text-white rotate-45' : 'bg-gray-100 text-gray-500 group-hover:bg-[#4318FF]/10 group-hover:text-[#4318FF]'}`}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M7 1v12M1 7h12" />
                  </svg>
                </div>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${openIndex === i ? 'max-h-40 pb-6' : 'max-h-0'}`}>
                <p className="px-6 text-gray-500 font-medium text-sm leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
