
// src/admin/components/AdminSidebar.jsx

import { NavLink } from 'react-router-dom';
import {
  LuLayoutDashboard,
  LuImages,
  LuImage,
  LuLogOut,
  LuSchool,
} from 'react-icons/lu';

export default function AdminSidebar() {
  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`,
        {
          method: 'POST',
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error('Logout request failed');
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Logout failed');
      }

      localStorage.removeItem('adminEmail');
      window.location.replace('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Logout failed. Please try again.');
    }
  };

  const navItems = [
    {
      label: 'Dashboard',
      path: '/admin/dashboard',
      icon: LuLayoutDashboard,
    },
    {
      label: 'Gallery',
      path: '/admin/gallery',
      icon: LuImages,
    },
    {
      label: 'Website Media',
      path: '/admin/website-media',
      icon: LuImage,
    },
  ];

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 z-50 h-screen w-72 flex-col overflow-hidden bg-[#7E5CAD] text-white">
      {/* Brand */}
      <div className="shrink-0 border-b border-white/15 px-8 py-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center bg-[#66BB6A]">
            <LuSchool size={22} />
          </div>

          <div>
            <h1 className="font-serif text-xl">GITF</h1>

            <p className="text-[10px] uppercase tracking-[0.18em] text-white/60">
              Admin Portal
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-8">
        <p className="mb-4 px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
          Management
        </p>

        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3.5 text-sm transition-colors ${
                    isActive
                      ? 'bg-white font-bold text-[#7E5CAD]'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Logout - fixed at the bottom of the sidebar */}
      <div className="mt-auto shrink-0 border-t border-white/15 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-4 px-4 py-3.5 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        >
          <LuLogOut size={19} />
          Logout
        </button>
      </div>
    </aside>
  );
}
