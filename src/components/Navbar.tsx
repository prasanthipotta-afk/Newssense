import { NavLink, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Search', to: '/search' },
  { label: 'Categories', to: '/categories' },
  { label: 'Filters', to: '/filters' },
  { label: 'History', to: '/history' },
  { label: 'Bookmarks', to: '/bookmarks' },
  { label: 'Settings', to: '/settings' },
];

export default function Navbar() {
  const { logout, theme, toggleTheme, user } = useAppContext();
  const navigate = useNavigate();

  return (
    <header className={`sticky top-0 z-50 border-b ${theme === 'dark' ? 'border-slate-800 bg-slate-950/95' : 'border-slate-200 bg-white/95'} backdrop-blur-xl`}>
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div>
          <button type="button" onClick={() => navigate('/')} className="text-lg font-semibold tracking-tight text-brand-700 dark:text-brand-300">
            NewsSense AI
          </button>
          <p className="text-xs text-slate-500 dark:text-slate-400">Personalized industry insight generator</p>
        </div>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-full px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-brand-500 text-white shadow-soft'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            {theme === 'dark' ? 'Light' : 'Dark'} Mode
          </button>
          <div className="hidden rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 md:block">
            {user?.username}
          </div>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="rounded-full bg-brand-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
