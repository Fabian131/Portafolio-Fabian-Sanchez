import React, { useState, useEffect, useLayoutEffect, useRef, memo, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Moon, Sun, X } from 'lucide-react';
import ScrollReveal from '../atoms/ScrollReveal';
import LanguageSwitcher from '../atoms/LanguageSwitcher';
import { MOBILE_MAX } from '../../utils/breakpoints';
import { t, useTranslation } from '../../hooks/useTranslation';

const LiquidNav = memo(({ activeSection, toggleTheme, isDark, onNavClick }) => {
  const { lang } = useTranslation();
  const navRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= MOBILE_MAX);
  const touchStartX = useRef(null);
  const resizeTimeoutRef = useRef(null);
  const movingTimeoutRef = useRef(null);
  const pendingNavRef = useRef(null);
  const sidebarPillRef = useRef(null);
  const [sidebarPillStyle, setSidebarPillStyle] = useState({ top: 0, height: 0 });
  const [sidebarMoving, setSidebarMoving] = useState(false);
  const sidebarMovingTimeoutRef = useRef(null);
  const pillDraggingRef = useRef(false);
  const pillDragStartYRef = useRef(0);
  const pillDragStartTopRef = useRef(0);
  const pillDragLinkIndexRef = useRef(0);

  const links = useMemo(() => [
    { id: 'inicio', label: t('nav.home') },
    { id: 'sobre-mi', label: t('nav.about') },
    { id: 'skills', label: t('nav.skills') },
    { id: 'proyectos', label: t('nav.projects') },
    { id: 'contacto', label: t('nav.contact') }
  ], [lang]);

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

  const updateSidebarIndicator = useCallback((activeId) => {
    if (!sidebarPillRef.current) return;
    if (pillDraggingRef.current) return;
    const activeEl = sidebarPillRef.current.querySelector(`a[data-id="${activeId}"]`);
    if (!activeEl) return;

    setSidebarMoving(true);
    clearTimeout(sidebarMovingTimeoutRef.current);
    sidebarMovingTimeoutRef.current = setTimeout(() => setSidebarMoving(false), 200);

    setSidebarPillStyle({
      top: activeEl.offsetTop,
      height: activeEl.offsetHeight
    });
  }, []);

  useEffect(() => {
    updateIndicator(activeSection || 'inicio');
    updateSidebarIndicator(activeSection || 'inicio');
  }, [activeSection, updateIndicator, updateSidebarIndicator]);

  useEffect(() => {
    const handleResize = () => {
      clearTimeout(resizeTimeoutRef.current);
      resizeTimeoutRef.current = setTimeout(() => {
        updateIndicator(activeSection || 'inicio');
        updateSidebarIndicator(activeSection || 'inicio');
        const mobile = window.innerWidth <= MOBILE_MAX;
        setIsMobile(mobile);
        if (!mobile) setMobileOpen(false);
      }, 150);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    setTimeout(handleResize, 150);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeoutRef.current);
      clearTimeout(movingTimeoutRef.current);
      clearTimeout(sidebarMovingTimeoutRef.current);
    };
  }, [activeSection, updateIndicator, updateSidebarIndicator]);

  useLayoutEffect(() => {
    if (mobileOpen) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';

      const preventScroll = (e) => {
        if (!e.target.closest('.sidebar-drawer')) {
          e.preventDefault();
        }
      };
      document.addEventListener('touchmove', preventScroll, { passive: false });
      document.addEventListener('wheel', preventScroll, { passive: false });

      return () => {
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        document.removeEventListener('touchmove', preventScroll);
        document.removeEventListener('wheel', preventScroll);
      };
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';

      if (pendingNavRef.current) {
        const target = pendingNavRef.current;
        pendingNavRef.current = null;
        requestAnimationFrame(() => {
          document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
        });
      }
      setDragOffset(0);
      setIsDragging(false);
    }
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

  useEffect(() => {
    if (mobileOpen) {
      requestAnimationFrame(() => {
        updateSidebarIndicator(activeSection || 'inicio');
      });
    }
  }, [mobileOpen, activeSection, updateSidebarIndicator]);

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
    if (mobileOpen) {
      pendingNavRef.current = sectionId;
      setMobileOpen(false);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [onNavClick, mobileOpen]);

  const getPillLinkFromY = useCallback((clientY) => {
    if (!sidebarPillRef.current) return null;
    const containerRect = sidebarPillRef.current.getBoundingClientRect();
    const relativeY = clientY - containerRect.top;
    let bestIndex = 0;
    let bestDist = Infinity;
    links.forEach((link, i) => {
      const el = sidebarPillRef.current.querySelector(`a[data-id="${link.id}"]`);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const centerY = rect.top - containerRect.top + rect.height / 2;
      const dist = Math.abs(relativeY - centerY);
      if (dist < bestDist) {
        bestDist = dist;
        bestIndex = i;
      }
    });
    return { index: bestIndex, link: links[bestIndex] };
  }, [links]);

  const handlePillTouchStart = useCallback((e) => {
    if (!sidebarPillRef.current) return;
    const touch = e.touches[0];
    const pillEl = sidebarPillRef.current.querySelector('.sidebar-pill');
    if (!pillEl) return;
    const pillRect = pillEl.getBoundingClientRect();
    if (touch.clientY >= pillRect.top && touch.clientY <= pillRect.bottom) {
      e.preventDefault();
      e.stopPropagation();
      pillDraggingRef.current = true;
      pillDragStartYRef.current = pillRect.top + pillRect.height / 2;
      pillDragStartTopRef.current = sidebarPillStyle.top;
      pillDragLinkIndexRef.current = links.findIndex(l => l.id === activeSection);
      pillEl.classList.add('dragging');
    }
  }, [sidebarPillStyle.top, activeSection, links]);

  const handlePillTouchMove = useCallback((e) => {
    if (!pillDraggingRef.current || !sidebarPillRef.current) return;
    e.preventDefault();
    const touch = e.touches[0];
    const containerRect = sidebarPillRef.current.getBoundingClientRect();
    const relativeY = touch.clientY - containerRect.top;

    const firstEl = sidebarPillRef.current.querySelector('a[data-id]');
    const lastEl = sidebarPillRef.current.querySelectorAll('a[data-id]');
    const lastLinkEl = lastEl[lastEl.length - 1];
    if (!firstEl || !lastLinkEl) return;

    const pillEl = sidebarPillRef.current.querySelector('.sidebar-pill');
    const pillH = pillEl ? pillEl.offsetHeight : sidebarPillStyle.height;
    const minTop = firstEl.offsetTop;
    const maxTop = lastLinkEl.offsetTop + lastLinkEl.offsetHeight - pillH;

    const newTop = Math.max(minTop, Math.min(maxTop, relativeY - pillH / 2));
    if (pillEl) pillEl.style.transform = `translateY(${newTop}px)`;

    const result = getPillLinkFromY(touch.clientY);
    if (result && pillDragLinkIndexRef.current !== result.index) {
      pillDragLinkIndexRef.current = result.index;
      onNavClick(result.link.id);
    }
  }, [getPillLinkFromY, onNavClick, sidebarPillStyle.height]);

  const handlePillTouchEnd = useCallback(() => {
    if (!pillDraggingRef.current) return;
    pillDraggingRef.current = false;
    const pillEl = sidebarPillRef.current?.querySelector('.sidebar-pill');
    if (pillEl) {
      pillEl.classList.remove('dragging');
      pillEl.style.transform = '';
    }
    setSidebarMoving(true);
    updateSidebarIndicator(activeSection || 'inicio');
    sidebarMovingTimeoutRef.current = setTimeout(() => setSidebarMoving(false), 400);
    handleNavClick(activeSection || 'inicio');
  }, [updateSidebarIndicator, activeSection, handleNavClick]);

  const handlePillMouseDown = useCallback((e) => {
    if (!sidebarPillRef.current) return;
    const pillEl = sidebarPillRef.current.querySelector('.sidebar-pill');
    if (!pillEl) return;
    const pillRect = pillEl.getBoundingClientRect();
    if (e.clientY >= pillRect.top && e.clientY <= pillRect.bottom) {
      e.preventDefault();
      pillDraggingRef.current = true;
      pillDragStartYRef.current = pillRect.top + pillRect.height / 2;
      pillDragStartTopRef.current = sidebarPillStyle.top;
      pillDragLinkIndexRef.current = links.findIndex(l => l.id === activeSection);
      pillEl.classList.add('dragging');
    }
  }, [sidebarPillStyle.top, activeSection, links]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!pillDraggingRef.current || !sidebarPillRef.current) return;
      const containerRect = sidebarPillRef.current.getBoundingClientRect();
      const relativeY = e.clientY - containerRect.top;

      const firstEl = sidebarPillRef.current.querySelector('a[data-id]');
      const lastEl = sidebarPillRef.current.querySelectorAll('a[data-id]');
      const lastLinkEl = lastEl[lastEl.length - 1];
      if (!firstEl || !lastLinkEl) return;

      const pillEl = sidebarPillRef.current.querySelector('.sidebar-pill');
      const pillH = pillEl ? pillEl.offsetHeight : sidebarPillStyle.height;
      const minTop = firstEl.offsetTop;
      const maxTop = lastLinkEl.offsetTop + lastLinkEl.offsetHeight - pillH;

      const newTop = Math.max(minTop, Math.min(maxTop, relativeY - pillH / 2));
      if (pillEl) pillEl.style.transform = `translateY(${newTop}px)`;

      const result = getPillLinkFromY(e.clientY);
      if (result && pillDragLinkIndexRef.current !== result.index) {
        pillDragLinkIndexRef.current = result.index;
        onNavClick(result.link.id);
      }
    };

    const handleMouseUp = () => {
      if (!pillDraggingRef.current) return;
      pillDraggingRef.current = false;
      const pillEl = sidebarPillRef.current?.querySelector('.sidebar-pill');
      if (pillEl) {
        pillEl.classList.remove('dragging');
        pillEl.style.transform = '';
      }
      setSidebarMoving(true);
      updateSidebarIndicator(activeSection || 'inicio');
      sidebarMovingTimeoutRef.current = setTimeout(() => setSidebarMoving(false), 400);
      handleNavClick(activeSection || 'inicio');
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [getPillLinkFromY, onNavClick, sidebarPillStyle.height, updateSidebarIndicator, activeSection, handleNavClick]);

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

                <li className="flex items-center">
                  <LanguageSwitcher />
                </li>

                <li className="theme-toggle-li">
                  <button onClick={toggleTheme} className="liquid-nav-link theme-btn flex justify-center items-center h-full px-2" aria-label={t('ui.themeToggle')}>
                    {isDark ? <Sun size={20} className="stroke-[2.5]" /> : <Moon size={20} className="stroke-[2.5]" />}
                  </button>
                </li>
              </ul>
            </nav>

          </>
        </ScrollReveal>
      </div>

      {isMobile && (
        <div className="fixed top-6 right-4 z-50">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="mobile-nav-hamburger"
            aria-label={t('ui.menu')}
            aria-expanded={mobileOpen}
          >
            <span className={`hamburger-line ${mobileOpen ? 'rotate-45 translate-y-[7px]' : ''}`}></span>
            <span className={`hamburger-line ${mobileOpen ? 'opacity-0' : ''}`}></span>
            <span className={`hamburger-line ${mobileOpen ? '-rotate-45 -translate-y-[7px]' : ''}`}></span>
          </button>
        </div>
      )}

      {isMobile && createPortal(
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
            aria-label={t('ui.navigationMenu')}
          >
            <div className="sidebar-header">
              <button onClick={() => setMobileOpen(false)} className="sidebar-close-btn" aria-label={t('ui.closeMenu')}>
                <X size={24} className="stroke-[2.5]" />
              </button>
            </div>

            <div
                ref={sidebarPillRef}
                className="sidebar-pill-container"
                onTouchStart={handlePillTouchStart}
                onTouchMove={handlePillTouchMove}
                onTouchEnd={handlePillTouchEnd}
                onMouseDown={handlePillMouseDown}
              >
              <div
                className={`sidebar-pill ${sidebarMoving ? 'moving' : ''}`}
                style={{
                  transform: `translateY(${sidebarPillStyle.top}px)`,
                  height: `${sidebarPillStyle.height}px`
                }}
              />
              {links.map(link => (
                <a
                  key={link.id}
                  data-id={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.id); }}
                  className={`sidebar-link ${activeSection === link.id ? 'sidebar-link-active' : ''}`}
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="sidebar-theme-row">
              <span className="sidebar-theme-label">
                {isDark ? t('ui.darkMode') : t('ui.lightMode')}
              </span>
              <button onClick={toggleTheme} className="sidebar-theme-btn" aria-label={t('ui.themeToggle')}>
                {isDark ? <Sun size={20} className="stroke-[2.5]" /> : <Moon size={20} className="stroke-[2.5]" />}
              </button>
            </div>

            <div className="sidebar-theme-row">
              <span className="sidebar-theme-label">{t('ui.langToggle')}</span>
              <LanguageSwitcher />
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
