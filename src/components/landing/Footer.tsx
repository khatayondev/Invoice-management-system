'use client';

import Link from 'next/link';

export default function Footer() {
  const productLinks = ['Features', 'Pricing', 'Integrations', 'Changelog', 'Roadmap'];
  const companyLinks = ['About', 'Blog', 'Careers', 'Press', 'Contact'];
  const legalLinks = ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Security'];

  return (
    <footer className="bg-gray-950 text-white pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 bg-[#4318FF] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#4318FF]/30">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-xl font-black tracking-tight">Invo.</span>
            </div>
            <p className="text-gray-400 text-sm font-medium mb-6 max-w-xs leading-relaxed">
              Invoice smarter. Get paid faster. The modern invoice platform for freelancers and businesses that mean business.
            </p>
            <div className="flex gap-4">
              {['X', 'in', 'ig'].map((s, i) => (
                <Link key={i} href="/" className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-[#4318FF] flex items-center justify-center text-gray-400 hover:text-white text-xs font-bold transition-all">
                  {s}
                </Link>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-bold text-sm text-white mb-4 uppercase tracking-wider">Product</h4>
            <ul className="space-y-3">
              {productLinks.map((l) => (
                <li key={l}><Link href="/" className="text-gray-400 hover:text-white text-sm font-medium transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-sm text-white mb-4 uppercase tracking-wider">Company</h4>
            <ul className="space-y-3">
              {companyLinks.map((l) => (
                <li key={l}><Link href="/" className="text-gray-400 hover:text-white text-sm font-medium transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-sm text-white mb-4 uppercase tracking-wider">Legal</h4>
            <ul className="space-y-3">
              {legalLinks.map((l) => (
                <li key={l}><Link href="/" className="text-gray-400 hover:text-white text-sm font-medium transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm font-medium">&copy; 2025 Invo Technologies Ltd. All rights reserved.</p>
          <p className="text-gray-600 text-xs font-medium">Invoice smarter. Get paid faster.</p>
        </div>
      </div>
    </footer>
  );
}
