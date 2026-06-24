import React, { useState, useEffect, useRef, memo, useCallback, useMemo } from 'react';
import { Moon, Sun } from 'lucide-react';

const LiquidNav = memo(({ activeSection, toggleTheme, isDark, onNavClick }) => {
  const navRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const resizeTimeoutRef = useRef(null);
  const movingTimeoutRef = useRef(null);

  const links = useMemo(() => [
    { id: 'inicio', label: 'Inicio' },
    { id: 'sobre-mi', label: 'Sobre Mí' },
    { id: 'skills', label: 'Skills' },
    { id: 'proyectos', label: 'Proyectos' },
    { id: 'contacto', label: 'Contacto' }
  ], []);

  const updateIndicator = useCallback((activeId) => {
    if (!navRef.current) return;
    const activeEl = navRef.current.querySelector(`li[data-id="${activeId}"]`);
    if (!activeEl) return;

    setIsMoving(true);
    clearTimeout(movingTimeoutRef.current);
    movingTimeoutRef.current = setTimeout(() => setIsMoving(false), 200);

    setIndicatorStyle({
      left: activeEl.offsetLeft,
      width: activeEl.offsetWidth
    });
  }, []);

  useEffect(() => {
    updateIndicator(activeSection || 'inicio');
  }, [activeSection, updateIndicator]);

  useEffect(() => {
    const handleResize = () => {
      clearTimeout(resizeTimeoutRef.current);
      resizeTimeoutRef.current = setTimeout(() => {
        updateIndicator(activeSection || 'inicio');
        if (window.innerWidth >= 768) setMobileOpen(false);
      }, 150);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    setTimeout(handleResize, 150);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeoutRef.current);
      clearTimeout(movingTimeoutRef.current);
    };
  }, [activeSection, updateIndicator]);

  useEffect(() => {
    const closeOnScroll = () => setMobileOpen(false);
    window.addEventListener('scroll', closeOnScroll, { passive: true });
    return () => window.removeEventListener('scroll', closeOnScroll);
  }, []);

  return (
    <>
      <nav className="liquid-nav max-w-[95vw] overflow-x-auto hide-scrollbar desktop-nav-only">
        <ul ref={navRef} className="liquid-nav-container">
<div
              className={`liquid-nav-pill ${isMoving ? 'moving' : ''}`}
              style={{
                transform: `translateX(${indicatorStyle.left}px)`,
                width: `${indicatorStyle.width}px`
              }}
            />

          {links.map(link => (
            <li key={link.id} data-id={link.id} className={activeSection === link.id ? 'active' : ''}>
              <a href={`#${link.id}`} onClick={(e) => { e.preventDefault(); onNavClick(link.id); document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' }); }} className="liquid-nav-link text-base">
                 {link.label}
              </a>
            </li>
          ))}

          <li className="theme-toggle-li">
             <button onClick={toggleTheme} className="liquid-nav-link theme-btn flex justify-center items-center h-full px-2" aria-label="Toggle Theme">
                {isDark ? <Sun size={20} className="stroke-[2.5]" /> : <Moon size={20} className="stroke-[2.5]" />}
             </button>
          </li>
        </ul>
      </nav>

      <div className="md:hidden relative">
        <div className="mobile-nav-bar">
          <button onClick={toggleTheme} className="mobile-nav-theme" aria-label="Toggle Theme">
            {isDark ? <Sun size={18} className="stroke-[2.5]" /> : <Moon size={18} className="stroke-[2.5]" />}
          </button>
          <span className="mobile-nav-title">{links.find(l => l.id === activeSection)?.label || 'Inicio'}</span>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="mobile-nav-hamburger" aria-label="Menu">
            <span className={`hamburger-line ${mobileOpen ? 'rotate-45 translate-y-[6px]' : ''}`}></span>
            <span className={`hamburger-line ${mobileOpen ? 'opacity-0' : ''}`}></span>
            <span className={`hamburger-line ${mobileOpen ? '-rotate-45 -translate-y-[6px]' : ''}`}></span>
          </button>
        </div>

        <div className={`mobile-nav-dropdown ${mobileOpen ? 'mobile-nav-open' : 'mobile-nav-closed'}`}>
          {links.map(link => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => { e.preventDefault(); onNavClick(link.id); document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' }); setMobileOpen(false); }}
              className={`mobile-nav-item ${activeSection === link.id ? 'mobile-nav-active' : ''}`}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </>
  );
});

LiquidNav.displayName = 'LiquidNav';

export default LiquidNav;