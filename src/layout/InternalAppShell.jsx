import React, { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Bell,
  ChartLine,
  LayoutGrid,
  Menu,
  MessageCircle,
  Settings,
  User,
  X,
  CalendarDays,
  Wallet,
  Briefcase,
  MessageSquare,
  FileText,
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import './internal-app-shell.css';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', route: '/dashboard', icon: LayoutGrid },
  { id: 'profile', label: 'Profile', route: '/funchome', icon: User },
  { id: 'content', label: 'Content', route: '/contentscheduler', icon: CalendarDays, badge: '3' },
  { id: 'analytics', label: 'Analytics', route: '/dashboard', icon: ChartLine },
  { id: 'aichat', label: 'AI Chat', route: '/aichat', icon: MessageCircle },
  { id: 'experiences', label: 'Experiences', route: '/experiences', icon: Briefcase },
  { id: 'opinions', label: 'Opinions', route: '/opinions', icon: MessageSquare },
  { id: 'posts', label: 'Posts', route: '/posts', icon: FileText },
  { id: 'credits', label: 'Credits', route: '/credits', icon: Wallet },
  { id: 'usage', label: 'Usage', route: '/usage', icon: ChartLine },
  { id: 'subscription', label: 'Subscription', route: '/subscription', icon: Wallet },
  { id: 'settings', label: 'Settings', route: '/settings', icon: Settings },
];

function SidebarLinks({ activeNav, onNavigate }) {
  return (
    <nav className="internal-shell__nav" aria-label="App navigation">
      {NAV_ITEMS.map(item => {
        const Icon = item.icon;
        return (
          <Link
            key={item.id}
            to={item.route}
            className={`internal-shell__nav-link${activeNav === item.id ? ' internal-shell__nav-link--active' : ''}`}
            onClick={onNavigate}
          >
            <Icon size={16} aria-hidden="true" />
            <span>{item.label}</span>
            {item.badge && <span className="internal-shell__badge">{item.badge}</span>}
          </Link>
        );
      })}
    </nav>
  );
}

export default function InternalAppShell({ title, activeNav, children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const resolvedTitle = useMemo(() => {
    if (title) return title;
    const current = NAV_ITEMS.find(item => item.route === location.pathname);
    return current?.label || 'Workspace';
  }, [location.pathname, title]);

  return (
    <div className="internal-shell">
      <aside className="internal-shell__sidebar">
        <Link to="/" className="internal-shell__logo" aria-label="Go to marketing home">
          <span className="internal-shell__logo-mark">LX</span>
          <span className="internal-shell__logo-text">OPTIMOS</span>
        </Link>
        <SidebarLinks activeNav={activeNav} />
      </aside>

      <div className="internal-shell__main-wrap">
        <header className="internal-shell__topbar">
          <button
            type="button"
            className="internal-shell__menu-btn"
            aria-label="Open navigation"
            onClick={() => setDrawerOpen(true)}
          >
            <Menu size={18} />
          </button>

          <h1>{resolvedTitle}</h1>

          <div className="internal-shell__topbar-actions">
            <button
              type="button"
              className="internal-shell__logout-btn"
              onClick={async () => {
                await logout();
                navigate('/login', { replace: true });
              }}
            >
              Logout
            </button>
            <button type="button" className="internal-shell__icon-btn" aria-label="Notifications">
              <Bell size={16} />
              <span className="internal-shell__notif-dot" />
            </button>
            <div className="internal-shell__avatar" aria-hidden="true">AM</div>
          </div>
        </header>

        <div className="internal-shell__content">{children}</div>
      </div>

      <div
        className={`internal-shell__backdrop${drawerOpen ? ' internal-shell__backdrop--open' : ''}`}
        onClick={() => setDrawerOpen(false)}
      />

      <aside className={`internal-shell__drawer${drawerOpen ? ' internal-shell__drawer--open' : ''}`}>
        <div className="internal-shell__drawer-top">
          <span>Navigation</span>
          <button type="button" onClick={() => setDrawerOpen(false)} aria-label="Close navigation">
            <X size={16} />
          </button>
        </div>
        <SidebarLinks activeNav={activeNav} onNavigate={() => setDrawerOpen(false)} />
      </aside>
    </div>
  );
}
