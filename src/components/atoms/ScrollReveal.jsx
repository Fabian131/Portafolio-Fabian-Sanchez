import React, { useCallback, memo } from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const ScrollReveal = memo(({ children, delay = 0, direction = 'up', className = '' }) => {
  const [targetRef, isInView] = useIntersectionObserver({ threshold: 0.1 });
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
      ref={targetRef}
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

ScrollReveal.displayName = 'ScrollReveal';

export default ScrollReveal;
