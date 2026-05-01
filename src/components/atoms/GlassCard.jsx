import React, { useRef, useCallback, memo } from 'react';

const GlassCard = memo(({ children, className = '', tilt = false, isNavbar = false }) => {
  const cardRef = useRef(null);
  const animationFrameRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!tilt || !cardRef.current || window.innerWidth < 768) return;
    
    cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = requestAnimationFrame(() => {
      const card = cardRef.current;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -12;
      const rotateY = ((x - centerX) / centerX) * 12;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03) translateY(-4px)`;
    });
  }, [tilt]);

  const handleMouseLeave = useCallback(() => {
    if (!tilt || !cardRef.current) return;
    cancelAnimationFrame(animationFrameRef.current);
    cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) translateY(0px)`;
  }, [tilt]);

  return (
    <div className={`relative group ${isNavbar ? 'rounded-full' : 'rounded-3xl'} w-full`}>
      <div className={`absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-[inherit] blur-xl opacity-0 ${tilt ? 'group-hover:opacity-40' : ''} transition-opacity duration-700 -z-10`}></div>
      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`relative overflow-hidden transition-all duration-300 ease-out will-change-transform $
          isNavbar ? 'rounded-full' : 'rounded-3xl'}
          bg-white/60 dark:bg-[#0f111a]/60
          backdrop-blur-md supports-[backdrop-filter]:backdrop-blur-xl
          border border-white/60 dark:border-white/10
          shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]
          hover:border-white/80 dark:hover:border-blue-500/30
          ${className}`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-50 dark:opacity-5 pointer-events-none rounded-[inherit]"></div>
        {children}
      </div>
    </div>
  );
});

export default GlassCard;
