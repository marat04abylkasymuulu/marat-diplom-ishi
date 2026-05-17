import { useState, useEffect, useRef } from 'react';

/**
 * IntersectionObserver-based “is this element on screen?” hook.
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
 */
export function useInView(options = {}) {
  const { threshold = 0.15, rootMargin = '0px 0px -6% 0px', once = true } = options;
  const ref = useRef(null);
  const [inView, setInView] = useState(
    () => typeof globalThis !== 'undefined' && typeof IntersectionObserver === 'undefined'
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        const hit = entries.some((e) => e.isIntersecting);
        if (hit) {
          setInView(true);
          if (once) obs.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, rootMargin, once]);

  return [ref, inView];
}
