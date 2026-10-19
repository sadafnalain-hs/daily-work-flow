import React from 'react';
import {
  CalendarCheck,
  CalendarDays,
  BarChart3,
  Sparkles,
  Home,
  Briefcase,
  Share2,
  CloudSun,
  TrendingUp,
  Settings,
  X,
} from 'lucide-react';
import { NavigationPage } from '../types';

interface SidebarProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  completionRate: number;
  pendingCount: number;
}

export const NAV_ITEMS: Array<{
  id: NavigationPage;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}> = [
  { id: 'today', label: 'Today', icon: CalendarCheck },
  { id: 'planner', label: 'My Planner', icon: CalendarDays },
  { id: 'powerbi', label: 'Power BI Projects', icon: BarChart3 },
  { id: 'learning', label: 'AI Learning', icon: Sparkles },
  { id: 'home', label: 'Home & Family', icon: Home },
  { id: 'jobs', label: 'Jobs & Clients', icon: Briefcase },
  { id: 'social', label: 'Social Media', icon: Share2 },
  { id: 'weather', label: 'Weather', icon: CloudSun },
  { id: 'progress', label: 'Weekly Progress', icon: TrendingUp },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  isOpenMobile,
  onCloseMobile,
  completionRate,
  pendingCount,
}) => {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-68 flex-col border-r border-slate-200/80 bg-white transition-transform duration-200 ease-out lg:static lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 shadow-xl' : '-translate-x-full'
        }`}
      >
        {/* Brand header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-slate-900">
              Sadaf's LifeFlow AI
            </span>
            <span className="text-[11px] font-medium text-slate-500">
              Your Life · Your Goals · Your AI
            </span>
          </div>
          <button
            onClick={onCloseMobile}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4" aria-label="Main Navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onCloseMobile();
                }}
                className={`group flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-purple-50 text-purple-900 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`h-4 w-4 shrink-0 transition-colors ${
                      isActive ? 'text-purple-700' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.id === 'today' && pendingCount > 0 && (
                  <span className="tabular-nums text-[11px] font-semibold text-purple-700">
                    {pendingCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom card: Daily progress mini widget */}
        <div className="border-t border-slate-100 p-4">
          <div className="rounded-xl bg-[#FAF8F5] p-3 border border-stone-200/60">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-800">Today's Flow</span>
              <span className="font-mono font-semibold text-purple-800 tabular-nums">
                {completionRate}%
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-purple-600 transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, completionRate))}%` }}
              />
            </div>
            <div className="mt-2 text-[11px] text-slate-500">
              Lahore, Pakistan · Asia/Karachi
            </div>
          </div>
        </div>

        {/* User profile footer */}
        <div className="flex items-center gap-3 border-t border-slate-100 px-4 py-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-800">
            SN
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-semibold text-slate-900">Sadaf Nalain</div>
            <div className="truncate text-[11px] text-slate-500">Junior Data Analyst</div>
          </div>
        </div>
      </aside>
    </>
  );
};
