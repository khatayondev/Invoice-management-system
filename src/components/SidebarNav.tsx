'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, FileText, Users, Box, Settings, LogOut } from 'lucide-react';

export default function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const links: { href: string; label: string; icon: any; badge?: number | string }[] = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/invoices', label: 'Invoices', icon: FileText },
    { href: '/clients', label: 'Clients', icon: Users },
    { href: '/products', label: 'Products', icon: Box },
    { href: '/settings', label: 'Settings', icon: Settings }
  ];

  async function handleLogout() {
    if (!window.confirm('Are you sure you want to log out?')) return;
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  return (
    <div className="flex flex-col h-full">
      <nav className="sidebar-nav flex-1 pt-6">
        {links.map(link => {
          const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
          const Icon = link.icon;
          
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => onNavigate?.()}
              className={`sidebar-link ${isActive ? 'active' : ''} relative`}
            >
              {Icon ? <Icon size={20} strokeWidth={isActive ? 2.5 : 2} /> : <div className="w-[20px]" />}
              <span>{link.label}</span>
              {link.badge && (
                <span className="absolute right-4 w-5 h-5 bg-brand-primary text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                  {link.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-6">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-3 text-gray-500 font-medium transition-colors w-full rounded-xl hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={20} />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
}

