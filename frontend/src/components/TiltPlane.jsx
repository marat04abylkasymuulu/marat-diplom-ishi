import { useCallback, useRef } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

/**
 * Subtle 3D tilt toward cursor (desktop hover). Disabled when user prefers reduced motion.
 */
export default function TiltPlane({ className = '', children, strength = 11 }) {
  const reduced = usePrefersReducedMotion();
  const rootRef = useRef(null);

  const onMove = useCallback(
    (e) => {
      if (reduced) return;
      const el = rootRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty('--tilt-rx', `${(-y * strength).toFixed(2)}deg`);
      el.style.setProperty('--tilt-ry', `${(x * strength).toFixed(2)}deg`);
    },
    [reduced, strength]
  );

  const onLeave = useCallback(() => {
    const el = rootRef.current;
    if (!el) return;
    el.style.setProperty('--tilt-rx', '0deg');
    el.style.setProperty('--tilt-ry', '0deg');
  }, []);

  return (
    <div
      ref={rootRef}
      className={`tilt-plane ${className}`.trim()}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </div>
  );
}
