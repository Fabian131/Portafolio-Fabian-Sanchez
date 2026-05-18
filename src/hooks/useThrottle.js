import { useCallback, useRef } from 'react';

export const useThrottle = (callback, delay) => {
  const lastRan = useRef(0);
  const timeoutRef = useRef(null);

  return useCallback((...args) => {
    const now = Date.now();
    const timeSinceLastRun = now - lastRan.current;

    if (timeSinceLastRun >= delay) {
      callback(...args);
      lastRan.current = now;
    } else {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        callback(...args);
        lastRan.current = Date.now();
      }, delay - timeSinceLastRun);
    }
  }, [callback, delay]);
};