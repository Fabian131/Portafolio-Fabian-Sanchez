import React, { memo } from 'react';
import { useGlassCard } from '../../../../hooks/useGlassCard';

const GlassCard = memo(({ children, className = '', tilt = false, isNavbar = false, performanceTier = 'high' }) => {
  const {
    wrapperRef,
    cardRef,
    isLowPerf,
    handleMouseMove,
    handleMouseLeave,
    radius
  } = useGlassCard({ tilt, isNavbar, performanceTier });

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