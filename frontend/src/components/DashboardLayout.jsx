import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function DashboardLayout({ children }) {
  const location = useLocation();
  const { user, logout, isManager } = useAuth();

  const navItems = [
    { path: '/', label: 'My dashboard', roles: ['employee', 'manager'] },
    { path: '/manager', label: 'Manager', roles: ['manager'] },
    { path: '/calendar', label: 'Team calendar', roles: ['employee', 'manager'] },
    { path: '/history', label: 'Leave history', roles: ['employee', 'manager'] },
  ].filter((item) => item.roles.includes(user?.role || 'employee'));

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <header
        className="h-14 flex items-center px-6 border-b"
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <h1
          className="text-xl tracking-tight"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
        >
          CodeRelay
        </h1>
        <span className="ml-2 text-[15px] font-normal" style={{ color: 'var(--color-muted)' }}>
          Leave & workload
        </span>
        <div className="ml-auto flex items-center gap-3">
          <span className="text-sm" style={{ color: 'var(--color-muted)' }}>
            {user?.name || 'User'}
          </span>
          <button
            onClick={logout}
            className="text-[13px] px-2 py-1 rounded hover:bg-black/5 transition-colors"
            style={{ color: 'var(--color-muted)' }}
          >
            Sign out
          </button>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0"
            style={{ backgroundColor: '#d6d3ce', color: 'var(--color-text)' }}
          >
            {(user?.name?.[0] || 'U').toUpperCase()}
          </div>
        </div>
      </header>

      <div className="flex">
        <aside
          className="w-52 min-h-[calc(100vh-3.5rem)] py-5 pl-4 pr-2"
          style={{ backgroundColor: 'var(--color-surface)', borderRight: '1px solid var(--color-border)' }}
        >
          <nav className="space-y-0.5">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block py-2 px-3 text-[15px] transition-colors rounded-md ${
                  isActive(item.path)
                    ? 'font-medium'
                    : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
                }`}
                style={
                  isActive(item.path)
                    ? { backgroundColor: 'rgba(161,98,7,0.08)', color: 'var(--color-accent)' }
                    : {}
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1 py-7 px-8 max-w-5xl">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
