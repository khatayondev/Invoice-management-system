'use client';

import { useState } from 'react';
import SidebarNav from '@/components/SidebarNav';
import { Menu, X } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-container">
      {/* Mobile hamburger */}
      <button
        className="mobile-menu-btn"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={22} />
      </button>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar print-hide shadow-[0_4px_24px_rgba(0,0,0,0.02)] ${sidebarOpen ? 'open' : ''}`}>
        {/* Mobile close button */}
        <div className="flex items-center justify-between md:block">
          <div className="sidebar-header flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-primary flex items-center justify-center rounded-xl text-white shadow-lg shadow-brand-primary/30">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span>Invo.</span>
          </div>
          <button
            className="md:hidden mr-4 p-2 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>
        <SidebarNav onNavigate={() => setSidebarOpen(false)} />
      </aside>
      {children}
    </div>
  );
}

