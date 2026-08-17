import { NavLink, Outlet } from 'react-router-dom';
import { Users, BarChart3, GitCompareArrows, Trophy, LayoutDashboard, Info } from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/players', icon: Users, label: 'Players' },
  { to: '/stats', icon: BarChart3, label: 'Stats' },
  { to: '/compare', icon: GitCompareArrows, label: 'Compare' },
  { to: '/rankings', icon: Trophy, label: 'Rankings' },
  { to: '/about', icon: Info, label: 'About' },
];

export function Layout() {
  return (
    <div className="flex h-screen">
      <nav className="w-56 bg-court-light border-r border-court-border flex flex-col shrink-0">
        <div className="p-4 border-b border-court-border">
          <h1 className="text-lg font-bold text-text-bright flex items-center gap-2">
            <span className="text-2xl">🏀</span>
            <span>ProScout</span>
          </h1>
          <p className="text-xs text-text-dim mt-1">Basketball Prospect Scouting</p>
        </div>
        <div className="flex-1 py-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-accent/15 text-accent border-r-2 border-accent'
                    : 'text-text-dim hover:text-text hover:bg-court-lighter/50'
                }`
              }
              end={to === '/'}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </div>
        <div className="p-4 border-t border-court-border">
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /><span className="text-xs text-text-dim">NCAA</span></div>
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-500" /><span className="text-xs text-text-dim">HS</span></div>
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500" /><span className="text-xs text-text-dim">AAU</span></div>
          </div>
        </div>
      </nav>
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
