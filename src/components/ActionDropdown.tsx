'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { MoreHorizontal } from 'lucide-react';

interface ActionItem {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'danger';
}

export default function ActionDropdown({ actions }: { actions: ActionItem[] }) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const btnRef = useRef<HTMLButtonElement>(null);

  const updatePosition = useCallback(() => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 6,
        left: rect.right - 176, // 176 = w-44 = 11rem
      });
    }
  }, []);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    function handleClose(e: MouseEvent) {
      if (btnRef.current && btnRef.current.contains(e.target as Node)) return;
      
      // Also check if we clicked inside the dropdown portal
      const dropdownEl = document.getElementById('action-dropdown-portal');
      if (dropdownEl && dropdownEl.contains(e.target as Node)) return;
      
      setOpen(false);
    }
    document.addEventListener('mousedown', handleClose);
    return () => {
      document.removeEventListener('mousedown', handleClose);
    };
  }, [open]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!open) updatePosition();
    setOpen(!open);
  };

  return (
    <>
      <button
        ref={btnRef}
        onClick={handleToggle}
        className={`p-2 rounded-lg transition-all ${
          open
            ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/30'
            : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
        }`}
      >
        <MoreHorizontal size={18} />
      </button>

      {open && typeof window !== 'undefined' && createPortal(
        <div
          id="action-dropdown-portal"
          className="fixed z-[9999]"
          style={{ top: position.top, left: position.left }}
        >
          <div className="w-44 bg-white rounded-xl shadow-2xl border border-gray-100/80 py-1.5 overflow-hidden"
               style={{ animation: 'dropdown-in 0.15s ease-out' }}>
            {actions.map((action, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpen(false);
                  action.onClick();
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
                  action.variant === 'danger'
                    ? 'text-red-600 hover:bg-red-50'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-brand-primary'
                }`}
              >
                <span className="opacity-70">{action.icon}</span>
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>,
        document.body
      )}

      <style jsx global>{`
        @keyframes dropdown-in {
          from { opacity: 0; transform: translateY(-4px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
}
