// src/admin/components/AdminLayout.jsx

import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#F8F7F3] flex">
      <AdminSidebar />

      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}