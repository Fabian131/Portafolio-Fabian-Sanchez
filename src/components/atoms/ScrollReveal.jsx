import React, { useRef, useCallback, memo, useState, useEffect } from 'react';

const useInView = (ref, options = {}) => {
  const [isInView, setIsInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsInView(true); observer.disconnect(); } },
      { threshold: options.amount || 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, options.amount]);
  return isInView;
};

const useReducedMotion = () => {
  const [reduced, setReduced] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e) => setReduced(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);
  return reduced;
};

const ScrollReveal = memo(({ children, delay = 0, direction = 'up', className = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.1 });
  const prefersReducedMotion = useReducedMotion();

  const getTranslate = useCallback(() => {
    if (prefersReducedMotion) return 'translateY(0)';
    if (direction === 'up') return 'translateY(64px)';
    if (direction === 'down') return 'translateY(-64px)';
    if (direction === 'left') return 'translateX(64px)';
    if (direction === 'right') return 'translateX(-64px)';
    return 'translateY(0)';
  }, [direction, prefersReducedMotion]);

  return (
    <div
      ref={ref}
      className={`will-change-transform ${className}`}
      style={{
        opacity: isInView || prefersReducedMotion ? 1 : 0,
        transform: isInView || prefersReducedMotion ? 'translateY(0) translateX(0)' : getTranslate(),
        transition: prefersReducedMotion
          ? 'none'
          : `opacity 0.75s ease ${delay / 1000}s, transform 0.75s ease ${delay / 1000}s`
      }}
    >
      {children}
    </div>
  );
});

export default ScrollReveal;
