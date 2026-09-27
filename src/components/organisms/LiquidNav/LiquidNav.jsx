import React, { memo } from 'react';
import { createPortal } from 'react-dom';
import { Moon, Sun, X } from 'lucide-react';
import ScrollReveal from '../../atoms/layout/ScrollReveal/ScrollReveal';
import LanguageSwitcher from '../../atoms/ui/LanguageSwitcher/LanguageSwitcher';
import './LiquidNav.css';
import { useLiquidNav } from '../../../hooks/useLiquidNav';

const LiquidNav = memo(({ activeSection, toggleTheme, isDark, onNavClick }) => {
  const {
    t,
    navRef,
    sidebarPillRef,
    pillElRef,
    indicatorStyle,
    mobileOpen,
    toggleMobileOpen,
    isMoving,
    isDragging,
    dragOffset,
    isMobile,
    sidebarPillStyle,
    sidebarMoving,
    isPillDragging,
    links,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleNavClick,
    handlePillMouseDown
  } = useLiquidNav({ activeSection, onNavClick });

  return (
    <>
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full px-4 flex justify-center">
        <ScrollReveal direction="down" delay={200}>
          <>
            <nav className="liquid-nav max-w-[95vw] overflow-x-auto hide-scrollbar desktop-nav-only">
              <ul ref={navRef} className="liquid-nav-container">
                <div
                  role="presentation"
                  className={`liquid-nav-pill ${isMoving ? 'moving' : ''}`}
                  style={{
                    transform: `translateX(${indicatorStyle.left}px)`,
                    width: `${indicatorStyle.width}px`
                  }}
                />

                {links.map(link => (
                  <li key={link.id} data-id={link.id} className={activeSection === link.id ? 'active' : ''}>
                    <a 
                      href={`#${link.id}`} 
                      draggable={false}
                      onDragStart={(e) => e.preventDefault()}
                      onClick={(e) => e.preventDefault()} 
                      onPointerDown={(e) => {
                        e.preventDefault(); 
                        handleNavClick(link.id);
                      }}
                      className="liquid-nav-link text-base"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}

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

      {!isMobile && (
        <div className="fixed top-[38px] right-14 z-50">
          <LanguageSwitcher />
        </div>
      )}

      {isMobile && (
        <div className="fixed top-6 right-4 z-50">
          <button
            onClick={toggleMobileOpen}
            className={`mobile-nav-hamburger ${mobileOpen ? 'opacity-0 pointer-events-none' : ''}`}
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
            onClick={() => toggleMobileOpen()}
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
            inert={!mobileOpen || undefined}
          >
            <div className="sidebar-header">
              <button onClick={(e) => { e.currentTarget.blur(); toggleMobileOpen(); }} className="sidebar-close-btn" aria-label={t('ui.closeMenu')}>
                <X size={24} className="stroke-[2.5]" />
              </button>
            </div>

            <div
                ref={sidebarPillRef}
                className="sidebar-pill-container"
                onMouseDown={handlePillMouseDown}
              >
              {/* Phase 4 & 5: pillElRef attached directly, isPillDragging drives class */}
              <div
                ref={pillElRef}
                className={`sidebar-pill ${sidebarMoving ? 'moving' : ''} ${isPillDragging ? 'dragging' : ''}`}
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

            <div className="sidebar-footer">
              <div className="sidebar-footer-row">
                <span className="sidebar-theme-label">
                  {isDark ? t('ui.darkMode') : t('ui.lightMode')}
                </span>
                <button onClick={toggleTheme} className="sidebar-theme-btn" aria-label={t('ui.themeToggle')}>
                  {isDark ? <Sun size={20} className="stroke-[2.5]" /> : <Moon size={20} className="stroke-[2.5]" />}
                </button>
              </div>
              <div className="sidebar-footer-row">
                <span className="sidebar-theme-label">{t('ui.langToggle')}</span>
                <LanguageSwitcher direction="up" parentOpen={mobileOpen} key={mobileOpen ? 'open' : 'closed'} />
              </div>
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
