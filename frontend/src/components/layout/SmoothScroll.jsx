import { ReactLenis } from 'lenis/react';

export default function SmoothScroll({ children }) {
  // lerp controls the "smoothness" / friction. Lower = smoother/slower.
  return (
    <ReactLenis root options={{ lerp: 0.08, duration: 1.5, smoothTouch: false }}>
      {children}
    </ReactLenis>
  );
}