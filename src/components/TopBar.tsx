'use client';

import { useState, useEffect } from 'react';
import { Bell, ChevronDown, LogOut, HelpCircle, Search, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    if (!window.confirm('Are you sure you want to log out?')) return;
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="flex items-center justify-between mb-8 animate-fade-in relative z-30">
      {/* Mobile Burger & Desktop Search */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMenuClick}
          className="md:hidden w-11 h-11 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-50 transition-all active:scale-95"
        >
          <Menu size={22} />
        </button>

        <div className="relative hidden md:block group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="w-72 bg-white/60 backdrop-blur-md border border-gray-100 rounded-2xl py-3 pl-12 pr-4 text-sm text-gray-700 shadow-[0_4px_24px_rgba(0,0,0,0.02)] focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:bg-white transition-all hover:bg-white"
          />
        </div>
      </div>
      
      {/* Right Side: Notifications & Profile */}
      <div className="flex items-center gap-3 md:gap-6">
        <div className="relative cursor-pointer bg-white shadow-sm p-2.5 md:p-3 rounded-2xl border border-gray-100 hover:shadow-md transition-all active:scale-95">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </div>
        
        {/* Profile Dropdown */}
        <div className="relative">
          <div 
            className="flex items-center gap-2 md:gap-3 cursor-pointer bg-white p-1.5 md:pr-4 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 active:scale-95"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-brand-primary to-purple-500 flex items-center justify-center text-white font-bold shadow-inner">
              A
            </div>
            <div className="hidden md:block text-left">
              <div className="text-sm font-bold text-gray-900">Admin User</div>
              <div className="text-xs text-gray-500 font-medium">Sales Admin</div>
            </div>
            <ChevronDown size={16} className={`text-gray-400 transition-transform hidden md:block ${showProfileMenu ? 'rotate-180' : ''}`} />
          </div>

          {/* Dropdown Menu */}
          {showProfileMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)}></div>
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-fade-in overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-50 mb-1 md:hidden">
                  <p className="text-sm text-gray-900 font-bold">Admin User</p>
                  <p className="text-xs text-gray-500 font-medium">Sales Admin</p>
                </div>
                <button 
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => { setShowProfileMenu(false); router.push('/settings'); }}
                >
                  <HelpCircle size={18} className="text-gray-400" />
                  Settings
                </button>
                <button 
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  onClick={handleLogout}
                >
                  <LogOut size={18} className="text-red-500" />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
