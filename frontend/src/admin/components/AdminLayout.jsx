
// src/admin/components/AdminLayout.jsx

import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout() {
 
  return (
    <div className="fixed inset-0 overflow-hidden bg-[#F8F7F3]">
      {/* Purple sidebar */}
      <AdminSidebar />

      {/* Independently scrollable white area */}
      <main
        id="admin-main-content"
        className="absolute inset-y-0 right-0 left-0 overflow-x-hidden overflow-y-scroll overscroll-y-contain lg:left-72"
        style={{ WebkitOverflowScrolling: 'touch' }}
      > 
        <Outlet />
      </main>
    </div>
  );
}
