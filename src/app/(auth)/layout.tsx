import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Left Column - Visuals */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#0F0C29] animate-fade-in flex-col justify-between p-12">
        {/* Background Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-brand-primary rounded-full mix-blend-screen filter blur-[128px] opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#8A2BE2] rounded-full mix-blend-screen filter blur-[128px] opacity-40"></div>
        <div className="absolute top-[40%] left-[20%] w-72 h-72 bg-[#00FFFF] rounded-full mix-blend-screen filter blur-[128px] opacity-20"></div>

        {/* Content */}
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 text-2xl font-black uppercase tracking-wider text-white">
            <div className="w-10 h-10 bg-white text-brand-primary flex items-center justify-center rounded-lg shadow-lg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            Invoice Engine
          </Link>
        </div>

        <div className="relative z-10 mb-12">
          <h1 className="text-5xl font-bold text-white leading-tight mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Elevate your billing <br /> experience.
          </h1>
          <p className="text-xl text-gray-300 max-w-md animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Create, manage, and track your invoices with our premium set of tools designed for modern professionals.
          </p>
        </div>

        {/* Floating Glassmorphism Badge */}
        <div className="relative z-10 backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 max-w-sm animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <div>
              <p className="text-white font-semibold">Fast & Secure</p>
              <p className="text-gray-300 text-sm">Enterprise-grade security</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-gray-50/30">
        <div className="mx-auto w-full max-w-md animate-slide-up">
          {children}
        </div>
      </div>
    </div>
  );
}
