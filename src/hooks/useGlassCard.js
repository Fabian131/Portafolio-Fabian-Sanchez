import { useRef, useCallback } from 'react';
import { MOBILE_MAX } from '../utils/breakpoints';

export const useGlassCard = ({ tilt, isNavbar, performanceTier }) => {
  const wrapperRef = useRef(null);
  const cardRef = useRef(null);
  const animationFrameRef = useRef(null);
  const isLowPerf = performanceTier === 'low';

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current || !wrapperRef.current || window.innerWidth <= MOBILE_MAX) return;

    cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = requestAnimationFrame(() => {
      const card = cardRef.current;
      const wrapper = wrapperRef.current;
      if (!card || !wrapper) return;

      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      wrapper.style.setProperty('--mouse-x', `${x}px`);
      wrapper.style.setProperty('--mouse-y', `${y}px`);

      if (tilt) {
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotateX = ((y - cy) / cy) * -10;
        const rotateY = ((x - cx) / cx) * 10;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02) translateY(-3px)`;
      }
    });
  }, [tilt]);

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current || !wrapperRef.current) return;
    cancelAnimationFrame(animationFrameRef.current);
    if (tilt) {
      cardRef.current.style.transform = '';
    }
  }, [tilt]);

  const radius = isNavbar ? 'rounded-full' : 'rounded-3xl';

  return {
    wrapperRef,
    cardRef,
    isLowPerf,
    handleMouseMove,
    handleMouseLeave,
    radius
  };
};
