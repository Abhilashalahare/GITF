// src/admin/components/ProtectedAdminRoute.jsx

import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedAdminRoute() {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/me`,
          {
            method: 'GET',
            credentials: 'include',
          }
        );

        if (response.ok) {
          setStatus('authenticated');
        } else {
          setStatus('unauthenticated');
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        setStatus('unauthenticated');
      }
    };

    checkAuthentication();
  }, []);

  if (status === 'checking') {
    return (
      <div className="min-h-screen bg-[#F8F7F3] flex items-center justify-center">
        <div className="text-[#7E5CAD] font-serif italic text-xl">
          Checking authentication...
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}