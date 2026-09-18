import React, { useRef, useCallback, memo } from 'react';
import { MOBILE_MAX } from '../../utils/breakpoints';

const GlassCard = memo(({ children, className = '', tilt = false, isNavbar = false, performanceTier = 'high' }) => {
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

  return (
    <div
      ref={wrapperRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative group ${radius} w-full h-full`}
      style={{ '--mouse-x': '-999px', '--mouse-y': '-999px' }}
    >
      {/* Card body */}
      <div
        ref={cardRef}
        className={`glass-card relative overflow-hidden transition-all duration-300 ease-out will-change-transform ${radius}
          ${isLowPerf ? 'is-low-perf' : ''}
          ${className}`}
      >
        {/* Border spotlight — lights the rim where cursor is, Vercel/Linear style */}
        {!isLowPerf && (
          <div
            className={`absolute inset-0 ${radius} pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20`}
            style={{
              background: `radial-gradient(240px circle at var(--mouse-x) var(--mouse-y), rgba(14, 165, 233, 0.4), transparent 70%)`,
              padding: '1px',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }}
          />
        )}
        {children}
      </div>
    </div>
  );
});

GlassCard.displayName = 'GlassCard';

export default GlassCard;