import { useState, useEffect, useLayoutEffect, useRef, useCallback, useMemo } from 'react';
import { MOBILE_MAX } from '../utils/breakpoints';
import { useTranslation } from './useTranslation';
import { navigationLinks } from '../data/navigation';

export const useLiquidNav = ({ activeSection, onNavClick }) => {
  const { t, lang } = useTranslation();
  const navRef = useRef(null);
  const sidebarPillRef = useRef(null);
  // Direct ref to the pill DOM element — avoids querySelector in hot paths
  const pillElRef = useRef(null);

  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= MOBILE_MAX);
  const [isPillDragging, setIsPillDragging] = useState(false);  // Replaces classList mutation

  const touchStartX = useRef(null);
  const resizeTimeoutRef = useRef(null);
  const movingTimeoutRef = useRef(null);
  const pendingNavRef = useRef(null);
  const scrollAnimationRef = useRef(null);

  const [sidebarPillStyle, setSidebarPillStyle] = useState({ top: 0, height: 0 });
  const [sidebarMoving, setSidebarMoving] = useState(false);
  const sidebarMovingTimeoutRef = useRef(null);

  const pillDraggingRef = useRef(false);
  const pillDragStartYRef = useRef(0);
  const pillDragStartTopRef = useRef(0);
  const pillDragLinkIndexRef = useRef(0);
  const pillDragCacheRef = useRef({ containerTop: 0, pillH: 0, minTop: 0, maxTop: 0 });

  // ─── Phase 1: Single Source of Truth for nav links ───────────────────────
  // IDs come from navigation.js; labels are derived from translations.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const links = useMemo(() => navigationLinks.map(({ id }) => ({
    id,
    label: t(`nav.${id}`)
  })), [t, lang]);

  // ─── Phase 2: Encapsulate mobile toggle in the hook ──────────────────────
  const toggleMobileOpen = useCallback(() => {
    setMobileOpen(prev => !prev);
  }, []);

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
    
    // Prevent pill from jumping to 0 if layout is not yet calculated
    if (activeEl.offsetTop === 0 && activeId !== 'home') return;

    setSidebarMoving(true);
    clearTimeout(sidebarMovingTimeoutRef.current);
    sidebarMovingTimeoutRef.current = setTimeout(() => setSidebarMoving(false), 200);

    setSidebarPillStyle({
      top: activeEl.offsetTop,
      height: activeEl.offsetHeight
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      updateIndicator(activeSection || 'home');
      updateSidebarIndicator(activeSection || 'home');
    }, 50);
    return () => clearTimeout(timer);
  }, [lang, activeSection, updateIndicator, updateSidebarIndicator]);

  useEffect(() => {
    const handleResize = () => {
      clearTimeout(resizeTimeoutRef.current);
      resizeTimeoutRef.current = setTimeout(() => {
        updateIndicator(activeSection || 'home');
        updateSidebarIndicator(activeSection || 'home');
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

  const customScrollTo = useCallback((targetId) => {
    if (scrollAnimationRef.current) {
      cancelAnimationFrame(scrollAnimationRef.current);
      scrollAnimationRef.current = null;
    }

    const targetEl = document.getElementById(targetId);
    if (!targetEl) return;

    const getTargetY = () => Math.round(targetEl.getBoundingClientRect().top + window.scrollY);

    const duration = 1000;
    let start = null;
    let startPosition = window.scrollY;
    const targetPosition = getTargetY();
    const distance = targetPosition - startPosition;

    if (Math.abs(distance) < 2) return;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min(timestamp - start, duration);
      const easeProgress = progress / duration;

      const ease = easeProgress < 0.5
        ? 4 * easeProgress * easeProgress * easeProgress
        : 1 - Math.pow(-2 * easeProgress + 2, 3) / 2;

      window.scrollTo({ top: startPosition + distance * ease, behavior: 'instant' });

      if (progress < duration) {
        scrollAnimationRef.current = requestAnimationFrame(step);
      } else {
        scrollAnimationRef.current = null;
        window.scrollTo({ top: targetPosition, behavior: 'instant' });
      }
    };

    scrollAnimationRef.current = requestAnimationFrame(step);
  }, []);

  useLayoutEffect(() => {
    if (mobileOpen) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';

      const preventScroll = (e) => {
        if (
          !e.target.closest('.sidebar-drawer') &&
          !e.target.closest('.lang-switcher-dropdown')
        ) {
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
        setTimeout(() => {
          customScrollTo(target);
        }, 450);
      }
      setDragOffset(0);
      setIsDragging(false);
    }
  }, [mobileOpen, customScrollTo]);

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
      const timer = setTimeout(() => {
        updateSidebarIndicator(activeSection || 'home');
      }, 50);
      return () => clearTimeout(timer);
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
      customScrollTo(sectionId);
    }
  }, [onNavClick, mobileOpen, customScrollTo]);

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

  // ─── Phase 3: Register pill drag listeners only when dragging starts ──────
  // ─── Phase 4: Use pillElRef to avoid querySelector in hot paths ───────────
  // ─── Phase 5: Use React state (isPillDragging) instead of classList ───────

  const startPillDrag = useCallback((clientY) => {
    const pillEl = pillElRef.current;
    if (!pillEl || !sidebarPillRef.current) return false;
    const pillRect = pillEl.getBoundingClientRect();
    if (clientY < pillRect.top || clientY > pillRect.bottom) return false;

    pillDraggingRef.current = true;
    setIsPillDragging(true);
    pillDragStartYRef.current = pillRect.top + pillRect.height / 2;
    pillDragStartTopRef.current = sidebarPillStyle.top;
    pillDragLinkIndexRef.current = links.findIndex(l => l.id === activeSection);

    const containerRect = sidebarPillRef.current.getBoundingClientRect();
    const linkEls = sidebarPillRef.current.querySelectorAll('a[data-id]');
    const firstEl = linkEls[0];
    const lastEl = linkEls[linkEls.length - 1];
    const pillH = pillEl.offsetHeight;
    pillDragCacheRef.current = {
      containerTop: containerRect.top,
      pillH,
      minTop: firstEl ? firstEl.offsetTop : 0,
      maxTop: lastEl ? lastEl.offsetTop + lastEl.offsetHeight - pillH : 0
    };
    return true;
  }, [sidebarPillStyle.top, activeSection, links]);

  const movePillDrag = useCallback((clientY) => {
    if (!pillDraggingRef.current || !pillElRef.current || !sidebarPillRef.current) return;
    const { containerTop, pillH, minTop, maxTop } = pillDragCacheRef.current;
    const relativeY = clientY - containerTop;
    const newTop = Math.max(minTop, Math.min(maxTop, relativeY - pillH / 2));

    // Direct style mutation is acceptable for real-time drag animation
    pillElRef.current.style.transform = `translateY(${newTop}px)`;

    const result = getPillLinkFromY(clientY);
    if (result && pillDragLinkIndexRef.current !== result.index) {
      pillDragLinkIndexRef.current = result.index;
      onNavClick(result.link.id);
    }
  }, [getPillLinkFromY, onNavClick]);

  const endPillDrag = useCallback(() => {
    if (!pillDraggingRef.current) return;
    pillDraggingRef.current = false;
    setIsPillDragging(false);
    if (pillElRef.current) {
      // Instead of clearing the transform and hoping React restores it
      // (which it won't if the state hasn't changed), we manually sync it.
      const activeEl = sidebarPillRef.current?.querySelector(`a[data-id="${activeSection || 'home'}"]`);
      if (activeEl) {
        pillElRef.current.style.transform = `translateY(${activeEl.offsetTop}px)`;
      } else {
        pillElRef.current.style.transform = '';
      }
    }
    setSidebarMoving(true);
    updateSidebarIndicator(activeSection || 'home');
    sidebarMovingTimeoutRef.current = setTimeout(() => setSidebarMoving(false), 400);
    handleNavClick(activeSection || 'home');
  }, [updateSidebarIndicator, activeSection, handleNavClick]);

  // Touch handlers for sidebar pill drag
  const handlePillTouchStart = useCallback((e) => {
    const touch = e.touches[0];
    if (startPillDrag(touch.clientY)) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, [startPillDrag]);

  const handlePillTouchMove = useCallback((e) => {
    if (!pillDraggingRef.current) return;
    e.preventDefault();
    movePillDrag(e.touches[0].clientY);
  }, [movePillDrag]);

  const handlePillTouchEnd = useCallback(() => {
    endPillDrag();
  }, [endPillDrag]);

  // Mouse handler — starts drag, then registers move/up on document only for the duration
  const handlePillMouseDown = useCallback((e) => {
    if (!startPillDrag(e.clientY)) return;
    e.preventDefault();

    // Phase 3: Register move/up only while drag is active, not permanently
    const handleMouseMove = (ev) => movePillDrag(ev.clientY);
    const handleMouseUp = () => {
      endPillDrag();
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [startPillDrag, movePillDrag, endPillDrag]);

  // Register touch events on the sidebar pill container
  useEffect(() => {
    const container = sidebarPillRef.current;
    if (!container || !isMobile) return;

    container.addEventListener('touchstart', handlePillTouchStart, { passive: false });
    container.addEventListener('touchmove', handlePillTouchMove, { passive: false });
    container.addEventListener('touchend', handlePillTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handlePillTouchStart);
      container.removeEventListener('touchmove', handlePillTouchMove);
      container.removeEventListener('touchend', handlePillTouchEnd);
    };
  }, [handlePillTouchStart, handlePillTouchMove, handlePillTouchEnd, isMobile]);

  return {
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
  };
};
