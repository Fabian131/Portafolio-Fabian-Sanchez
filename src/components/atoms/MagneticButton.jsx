import React, { useRef, useCallback, memo } from 'react';

const MagneticButton = memo(({ children, className = '' }) => {
  const ref = useRef(null);
  const animationFrameRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!ref.current) return;
    
    cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = requestAnimationFrame(() => {
      const { left, top, width, height } = ref.current.getBoundingClientRect();
      const x = e.clientX - (left + width / 2);
      const y = e.clientY - (top + height / 2);
      ref.current.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return;
    cancelAnimationFrame(animationFrameRef.current);
    ref.current.style.transform = `translate(0px, 0px)`;
  }, []);

  return (
    <div ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className={`transition-transform duration-300 ease-out ${className}`}>
      {children}
    </div>
  );
});

export default MagneticButton;
