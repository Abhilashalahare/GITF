import { ReactLenis } from 'lenis/react';
import { useLocation } from 'react-router-dom';

export default function SmoothScroll({ children }) {
  const { pathname } = useLocation();

  // Disable Lenis on admin pages so the admin content can scroll independently.
  const isAdminRoute = pathname.startsWith('/admin');

  if (isAdminRoute) {
    return children;
  }

  return (
    <ReactLenis root options={{ lerp: 0.08, duration: 1.5, smoothTouch: false }}>
      {children}
    </ReactLenis>
  );
}