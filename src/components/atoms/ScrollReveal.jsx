import React, { useRef, useCallback, memo } from 'react';
import { motion, useInView } from 'framer-motion';

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
    <motion.div
      ref={ref}
      className={`will-change-transform ${className}`}
      initial={{
        opacity: 0,
        filter: 'blur(8px)',
        transform: getTranslate()
      }}
      animate={isInView ? {
        opacity: 1,
        filter: 'blur(0px)',
        transform: 'translateY(0) translateX(0)'
      } : {
        opacity: 0,
        filter: 'blur(8px)',
        transform: getTranslate()
      }}
      transition={{
        duration: 0.75,
        ease: [0.25, 0.1, 0.25, 1],
        delay: delay / 1000
      }}
    >
      {children}
    </motion.div>
  );
});

export default ScrollReveal;
