import { useEffect, useRef, useState } from 'react';

export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const targetRef = useRef(null);
  const timeoutRef = useRef(null);
  const hasIntersectedRef = useRef(false);
  const { threshold = 0.1, rootMargin = '50px', once = false } = options;

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    hasIntersectedRef.current = false;

    const observer = new IntersectionObserver(([entry]) => {
      if (once && hasIntersectedRef.current) return;

      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        if (entry.isIntersecting && once) {
          hasIntersectedRef.current = true;
          setIsIntersecting(true);
          observer.unobserve(target);
        } else {
          setIsIntersecting(entry.isIntersecting);
        }
      }, 16);
    }, { threshold, rootMargin, ...options });

    observer.observe(target);

    return () => {
      observer.unobserve(target);
      clearTimeout(timeoutRef.current);
    };
  }, [threshold, rootMargin, once]);

  return [targetRef, isIntersecting];
};
