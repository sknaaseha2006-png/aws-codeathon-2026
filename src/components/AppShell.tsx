import { useState, type ReactNode } from 'react';
import {
  LayoutDashboard,
  Sparkles,
  Calculator,
  Compass,
  Users,
  GitCompare,
  ListChecks,
  GraduationCap,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
  RotateCcw,
} from 'lucide-react';
import type { SectionId } from '@/types';
import { useStore } from '@/store/StoreContext';

interface NavItem {
  id: SectionId;
  label: string;
  description: string;
  icon: typeof LayoutDashboard;
}

const NAV: NavItem[] = [
  { id: 'dashboard', label: 'Overview', description: 'Your education snapshot', icon: LayoutDashboard },
  { id: 'assistant', label: 'AI Assistant', description: 'Decision guidance', icon: Sparkles },
  { id: 'cost', label: 'Cost Planner', description: 'Plan education budget', icon: Calculator },
  { id: 'career', label: 'Career & Skills', description: 'Pathways and skills', icon: Compass },
  { id: 'family', label: 'Family Workspace', description: 'Decide together', icon: Users },
  { id: 'simulator', label: 'What-If Simulator', description: 'Compare scenarios', icon: GitCompare },
  { id: 'plan', label: 'My Action Plan', description: 'Track your tasks', icon: ListChecks },
];

export function AppShell({
  active,
  onNavigate,
  onReset,
  children,
}: {
  active: SectionId;
  onNavigate: (id: SectionId) => void;
  onReset: () => void;
  children: ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { state } = useStore();
  const activeItem = NAV.find((n) => n.id === active);

  const handleNav = (id: SectionId) => {
    onNavigate(id);
    setMobileOpen(false);
  };

  const sidebarWidth = collapsed ? 'w-[76px]' : 'w-[260px]';

  return (
    <div className="min-h-screen bg-slate-50 bg-grid">
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between bg-white/90 backdrop-blur border-b border-slate-200 px-4 py-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="btn-ghost !px-2"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <Brand small />
        <div className="w-9" />
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 animate-fade-in" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-navy-950/40 backdrop-blur-sm" />
          <div
            className="absolute left-0 top-0 bottom-0 w-[280px] bg-white shadow-soft-lg flex flex-col animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100">
              <Brand small />
              <button onClick={() => setMobileOpen(false)} className="btn-ghost !px-2" aria-label="Close menu">
                <X size={20} />
              </button>
            </div>
            <NavList active={active} onNavigate={handleNav} collapsed={false} />
            <SidebarFooter onReset={onReset} collapsed={false} />
          </div>
        </div>
      )}

      <div className="flex">
        {/* Desktop sidebar */}
        <aside
          className={`hidden lg:flex flex-col fixed left-0 top-0 bottom-0 ${sidebarWidth} bg-white border-r border-slate-200 transition-all duration-300 z-20`}
        >
          <div className={`flex items-center h-16 border-b border-slate-100 ${collapsed ? 'justify-center px-2' : 'px-4'}`}>
            {collapsed ? <BrandMark /> : <Brand />}
          </div>
          <NavList active={active} onNavigate={handleNav} collapsed={collapsed} />
          <div className="px-3 pb-3">
            <button
              onClick={() => setCollapsed((c) => !c)}
              className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-navy-700 transition-colors"
            >
              {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
              {!collapsed && <span>Collapse sidebar</span>}
            </button>
          </div>
          <SidebarFooter onReset={onReset} collapsed={collapsed} />
        </aside>

        {/* Main */}
        <main className={`flex-1 min-w-0 ${collapsed ? 'lg:ml-[76px]' : 'lg:ml-[260px]'} transition-all duration-300`}>
          <div className="hidden lg:flex items-center h-16 sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-200 px-6">
            <div className="min-w-0">
              <h1 className="font-display text-base font-semibold text-navy-900 truncate">
                {activeItem?.label}
              </h1>
              <p className="text-xs text-slate-500 truncate">{activeItem?.description}</p>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <div className="text-right hidden xl:block">
                <p className="text-sm font-medium text-navy-800">{state.profile.name}</p>
                <p className="text-xs text-slate-500">{state.profile.branch}</p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-navy text-white font-display text-sm font-semibold">
                {state.profile.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
            </div>
          </div>

          <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
            <div key={active} className="animate-fade-in">{children}</div>
          </div>

          <Footer />
        </main>
      </div>
    </div>
  );
}

function NavList({
  active,
  onNavigate,
  collapsed,
}: {
  active: SectionId;
  onNavigate: (id: SectionId) => void;
  collapsed: boolean;
}) {
  return (
    <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
      {NAV.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all group ${
              isActive
                ? 'bg-navy-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-navy-700'
            } ${collapsed ? 'justify-center' : ''}`}
            title={collapsed ? item.label : undefined}
          >
            <Icon size={18} className="shrink-0" />
            {!collapsed && (
              <span className="truncate">{item.label}</span>
            )}
          </button>
        );
      })}
    </nav>
  );
}

function SidebarFooter({ onReset, collapsed }: { onReset: () => void; collapsed: boolean }) {
  return (
    <div className={`border-t border-slate-100 px-3 py-3 ${collapsed ? 'hidden' : ''}`}>
      <button
        onClick={onReset}
        className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
      >
        <RotateCcw size={14} />
        Reset demo data
      </button>
    </div>
  );
}

function BrandMark() {
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-navy text-white">
      <GraduationCap size={20} />
    </div>
  );
}

export function Brand({ small = false }: { small?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-navy text-white shadow-sm">
        <GraduationCap size={20} />
      </div>
      {!small && (
        <div className="leading-tight">
          <p className="font-display text-sm font-bold text-navy-900">EduFamily</p>
          <p className="font-display text-xs text-teal-600 font-semibold tracking-wide">COMPASS</p>
        </div>
      )}
      {small && (
        <div className="leading-tight">
          <p className="font-display text-sm font-bold text-navy-900">EduFamily</p>
          <p className="font-display text-[10px] text-teal-600 font-semibold tracking-wide">COMPASS</p>
        </div>
      )}
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-8 border-t border-slate-200 px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <GraduationCap size={14} className="text-navy-500" />
          <span>
            <span className="font-display font-semibold text-navy-700">EduFamily Compass</span> — Better decisions. Stronger families. Brighter engineering futures.
          </span>
        </div>
        <p className="text-slate-400">
          Demo build · Data stored locally in your browser · Verify official fees, scholarships & placement figures with your institution.
        </p>
      </div>
    </footer>
  );
}
