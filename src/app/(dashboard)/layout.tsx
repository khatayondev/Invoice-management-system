import SidebarNav from '@/components/SidebarNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="app-container">
      <aside className="sidebar print-hide shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <div className="sidebar-header flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-primary flex items-center justify-center rounded-xl text-white shadow-lg shadow-brand-primary/30">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span>Invo.</span>
        </div>
        <SidebarNav />
      </aside>
      {children}
    </div>
  );
}
