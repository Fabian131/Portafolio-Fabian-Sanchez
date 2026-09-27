import { useRef, useCallback } from 'react';

export const useMagneticButton = () => {
  const ref = useRef(null);
  const animationFrameRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!ref.current) return;
    
    cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = requestAnimationFrame(() => {
      if (!ref.current) return;
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

  return {
    ref,
    handleMouseMove,
    handleMouseLeave
  };
};
