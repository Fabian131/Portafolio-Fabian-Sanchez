import React, { useRef, useCallback, memo } from 'react';
import { useInView } from 'framer-motion';

const ScrollReveal = memo(({ children, delay = 0, direction = 'up', className = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.1 });

  const getTranslate = useCallback(() => {
    if (direction === 'up') return 'translateY(64px)';
    if (direction === 'down') return 'translateY(-64px)';
    if (direction === 'left') return 'translateX(64px)';
    if (direction === 'right') return 'translateX(-64px)';
    return 'translateY(0)';
  }, [direction]);

  return (
    <div
      ref={ref}
      className={`will-change-transform ${className}`}
      style={{
        opacity: isInView ? 1 : 0,
        filter: isInView ? 'blur(0px)' : 'blur(8px)',
        transform: isInView ? 'translateY(0) translateX(0)' : getTranslate(),
        transition: `opacity 0.75s ease ${delay / 1000}s, filter 0.75s ease ${delay / 1000}s, transform 0.75s ease ${delay / 1000}s`
      }}
    >
      {children}
    </div>
  );
});

export default ScrollReveal;
