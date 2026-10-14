
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedAdminRoute() {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    let cancelled = false;

    const checkAuthentication = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/me`,
          {
            method: 'GET',
            credentials: 'include',
          }
        );

        if (!response.ok) {
          if (!cancelled) setStatus('unauthenticated');
          return;
        }

        const data = await response.json();

        if (!cancelled) {
          setStatus(
            data.success && data.admin
              ? 'authenticated'
              : 'unauthenticated'
          );
        }
      } catch (error) {
        console.error('Authentication check failed:', error);

        if (!cancelled) {
          setStatus('unauthenticated');
        }
      }
    };

    checkAuthentication();

    return () => {
      cancelled = true;
    };
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
