import React, { useState, useEffect, useRef, memo, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Moon, Sun, X } from 'lucide-react';
import ScrollReveal from '../atoms/ScrollReveal';

const LiquidNav = memo(({ activeSection, toggleTheme, isDark, onNavClick }) => {
  const navRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const touchStartX = useRef(null);
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
    if (mobileOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
      document.body.classList.add('sidebar-open', 'sidebar-locked');
    } else {
      document.body.classList.remove('sidebar-open', 'sidebar-locked');
      setDragOffset(0);
      setIsDragging(false);
    }
    return () => {
      document.body.classList.remove('sidebar-open', 'sidebar-locked');
    };
  }, [mobileOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen]);

  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
    setIsDragging(true);
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (touchStartX.current === null) return;
    const delta = e.touches[0].clientX - touchStartX.current;
    const offset = Math.max(0, Math.min(delta, 120));
    setDragOffset(offset);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (dragOffset > 60) {
      setMobileOpen(false);
    }
    setIsDragging(false);
    setDragOffset(0);
    touchStartX.current = null;
  }, [dragOffset]);

  const handleNavClick = useCallback((sectionId) => {
    onNavClick(sectionId);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  }, [onNavClick]);

  return (
    <>
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full px-4 flex justify-center">
        <ScrollReveal direction="down" delay={200}>
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
                    <a href={`#${link.id}`} onClick={(e) => { e.preventDefault(); handleNavClick(link.id); }} className="liquid-nav-link text-base">
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

            <div className="md:hidden w-full max-w-[95vw]">
              <div className="mobile-nav-bar">
                <button onClick={toggleTheme} className="mobile-nav-theme" aria-label="Toggle Theme">
                  {isDark ? <Sun size={18} className="stroke-[2.5]" /> : <Moon size={18} className="stroke-[2.5]" />}
                </button>
                <span className="mobile-nav-title">{links.find(l => l.id === activeSection)?.label || 'Inicio'}</span>
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="mobile-nav-hamburger"
                  aria-label="Menu"
                  aria-expanded={mobileOpen}
                >
                  <span className={`hamburger-line ${mobileOpen ? 'rotate-45 translate-y-[7px]' : ''}`}></span>
                  <span className={`hamburger-line ${mobileOpen ? 'opacity-0' : ''}`}></span>
                  <span className={`hamburger-line ${mobileOpen ? '-rotate-45 -translate-y-[7px]' : ''}`}></span>
                </button>
              </div>
            </div>
          </>
        </ScrollReveal>
      </div>

      {createPortal(
        <>
          <div
            className={`sidebar-overlay ${mobileOpen ? 'sidebar-overlay-open' : 'sidebar-overlay-closed'}`}
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside
            className={`sidebar-drawer ${isDragging ? 'dragging' : ''} ${mobileOpen ? 'sidebar-drawer-open' : 'sidebar-drawer-closed'}`}
            style={isDragging ? { transform: `translateX(${dragOffset}px)` } : undefined}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            role="dialog"
            aria-modal="true"
            aria-hidden={!mobileOpen}
            aria-label="Navigation menu"
          >
            <div className="sidebar-header">
              <button onClick={() => setMobileOpen(false)} className="sidebar-close-btn" aria-label="Close menu">
                <X size={24} className="stroke-[2.5]" />
              </button>
            </div>

            {links.map(link => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => { e.preventDefault(); handleNavClick(link.id); }}
                className={`sidebar-link ${activeSection === link.id ? 'sidebar-link-active' : ''}`}
              >
                {link.label}
              </a>
            ))}

            <div className="sidebar-theme-row">
              <span className="sidebar-theme-label">
                {isDark ? 'Modo oscuro' : 'Modo claro'}
              </span>
              <button onClick={toggleTheme} className="sidebar-theme-btn" aria-label="Toggle Theme">
                {isDark ? <Sun size={20} className="stroke-[2.5]" /> : <Moon size={20} className="stroke-[2.5]" />}
              </button>
            </div>
          </aside>
        </>,
        document.body
      )}
    </>
  );
});

LiquidNav.displayName = 'LiquidNav';

export default LiquidNav;
