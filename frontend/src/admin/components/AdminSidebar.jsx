// src/admin/components/AdminSidebar.jsx

import { NavLink, useNavigate } from 'react-router-dom';
import {
  LuLayoutDashboard,
  LuImages,
  LuImage,
  LuLogOut,
  LuSchool,
} from 'react-icons/lu';

export default function AdminSidebar() {
  const navigate = useNavigate();


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
    <aside className="hidden lg:flex w-72 min-h-screen bg-[#7E5CAD] text-white flex-col sticky top-0">

      {/* Brand */}
      <div className="px-8 py-8 border-b border-white/15">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-[#66BB6A] flex items-center justify-center">
            <LuSchool size={22} />
          </div>

          <div>
            <h1 className="font-serif text-xl">
              GITF
            </h1>

            <p className="text-[10px] uppercase tracking-[0.18em] text-white/60">
              Admin Portal
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8 space-y-2">

        <p className="px-4 mb-4 text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold">
          Management
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-white text-[#7E5CAD] font-bold'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-white/15">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3.5 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
        >
          <LuLogOut size={19} />
          Logout
        </button>
      </div>

    </aside>
  );
}