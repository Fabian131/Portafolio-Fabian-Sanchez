import { useRef, useEffect, useCallback } from 'react';

export const useGooeyButton = () => {
  const innerRef = useRef(null);

  useEffect(() => {
    if (innerRef.current) {
      const rect = innerRef.current.getBoundingClientRect();
      innerRef.current.style.setProperty("--width", `${rect.width}px`);
      innerRef.current.style.setProperty("--height", `${rect.height}px`);
    }
  }, []);

  const handleMouseMove = useCallback((e) => {
    const inner = innerRef.current;
    if (!inner) return;

    const rect = inner.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    inner.style.setProperty("--x", `${x}px`);
    inner.style.setProperty("--y", `${y}px`);
    inner.style.setProperty("--height", `${rect.height}px`);
    inner.style.setProperty("--width", `${rect.width}px`);
  }, []);

  return {
    innerRef,
    handleMouseMove
  };
};
