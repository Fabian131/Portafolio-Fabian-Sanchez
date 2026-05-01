import { useCallback, useRef } from 'react';

export const useThrottle = (callback, delay) => {
  const lastRan = useRef(0);
  const timeoutRef = useRef(null);

  return useCallback((...args) => {
    const now = Date.now();
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (now - lastRan.current >= delay) {
        callback(...args);
        lastRan.current = now;
      }
    }, delay - (now - lastRan.current));
  }, [callback, delay]);
};
