import React, { memo, useState, useCallback, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { AVAILABLE, LANGS } from '../../data/translations';

const ITEM_H = 44;
const PADDING = 8;
const DROPDOWN_H = AVAILABLE.length * ITEM_H + PADDING * 2;

const LanguageSwitcher = memo(({ direction = 'down', parentOpen = true }) => {
  const { lang, changeLang, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
  const btnRef = useRef(null);
  const dropdownRef = useRef(null);
  const pillRef = useRef(null);
  const movingTimer = useRef(null);
  const current = LANGS[lang];

  const draggingRef = useRef(false);
  const didDragRef = useRef(false);
  const dragCurrentIndexRef = useRef(0);
  const dragCacheRef = useRef({ containerTop: 0, pillH: 0, minTop: 0, maxTop: 0 });

  const activeIndex = AVAILABLE.findIndex(({ code }) => code === lang);

  // ── Auto-close if parent container (e.g. mobile sidebar) closes ───────────
  useEffect(() => {
    if (!parentOpen) {
      setIsOpen(false);
      setIsRendered(false);
    }
  }, [parentOpen]);

  // ── Close on outside click/touch & mount animation state ───────────────────
  useEffect(() => {
    let unmountTimer;
    if (isOpen) {
      setIsRendered(true);
      const handleOutsideInteraction = (e) => {
        if (draggingRef.current) return;
        const btn = btnRef.current;
        const dropdown = dropdownRef.current;
        if (btn && btn.contains(e.target)) return;
        if (dropdown && dropdown.contains(e.target)) return;
        setIsOpen(false);
      };

      // Short delay so we don't catch the opening event
      const id = setTimeout(() => {
        document.addEventListener('pointerdown', handleOutsideInteraction, true);
        document.addEventListener('touchstart', handleOutsideInteraction, true);
        document.addEventListener('click', handleOutsideInteraction, true);
      }, 20);

      return () => {
        clearTimeout(id);
        document.removeEventListener('pointerdown', handleOutsideInteraction, true);
        document.removeEventListener('touchstart', handleOutsideInteraction, true);
        document.removeEventListener('click', handleOutsideInteraction, true);
      };
    } else if (isRendered) {
      // Allow exit animation to play before unmounting the portal
      unmountTimer = setTimeout(() => setIsRendered(false), 200);
    }
    return () => clearTimeout(unmountTimer);
  }, [isOpen, isRendered]);

  // ── Get language index from clientY ───────────────────────────────────────
  const getLangFromClientY = useCallback((clientY) => {
    const container = dropdownRef.current;
    if (!container) return null;
    const rect = container.getBoundingClientRect();
    const relY = clientY - rect.top - PADDING;
    const index = Math.max(0, Math.min(AVAILABLE.length - 1, Math.floor(relY / ITEM_H)));
    return { index, code: AVAILABLE[index].code };
  }, []);

  const triggerMoving = useCallback(() => {
    setIsMoving(true);
    clearTimeout(movingTimer.current);
    movingTimer.current = setTimeout(() => setIsMoving(false), 350);
  }, []);

  // ── Start drag logic (shared) ─────────────────────────────────────────────
  const initDrag = useCallback((clientY) => {
    const container = dropdownRef.current;
    const pill = pillRef.current;
    if (!container || !pill) return false;

    const pillRect = pill.getBoundingClientRect();
    if (clientY >= pillRect.top && clientY <= pillRect.bottom) {
      draggingRef.current = true;
      didDragRef.current = false;
      dragCurrentIndexRef.current = activeIndex;

      pill.classList.add('dragging');
      const containerRect = container.getBoundingClientRect();
      const pillH = pill.offsetHeight;
      const initialTop = PADDING + activeIndex * ITEM_H;
      pill.style.setProperty('--drag-y', `${initialTop}px`);
      dragCacheRef.current = {
        containerTop: containerRect.top,
        pillH,
        minTop: PADDING,
        maxTop: PADDING + (AVAILABLE.length - 1) * ITEM_H,
      };
      return true;
    }
    return false;
  }, [activeIndex]);

  // ── Move drag logic (shared) ──────────────────────────────────────────────
  const updateDrag = useCallback((clientY) => {
    if (!draggingRef.current) return;
    const pill = pillRef.current;
    if (!pill) return;

    didDragRef.current = true;
    const { containerTop, pillH, minTop, maxTop } = dragCacheRef.current;
    const relativeY = clientY - containerTop;
    const newTop = Math.max(minTop, Math.min(maxTop, relativeY - pillH / 2));
    
    // Visually move pill instantly tracking the finger/mouse via CSS variable
    // This prevents React from overwriting it during re-renders
    pill.style.setProperty('--drag-y', `${newTop}px`);

    const result = getLangFromClientY(clientY);
    if (!result) return;
    if (result.index !== dragCurrentIndexRef.current) {
      dragCurrentIndexRef.current = result.index;
      changeLang(result.code);
    }
  }, [getLangFromClientY, changeLang]);

  // ── End drag logic (shared) ───────────────────────────────────────────────
  const endDrag = useCallback(() => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    
    const pill = pillRef.current;
    const container = dropdownRef.current;
    if (pill) {
      pill.classList.remove('dragging');
      pill.style.removeProperty('--drag-y');
      // No need to manually restore style.transform because React never stopped managing it!
    }
    if (container) {
      container.classList.remove('is-dragging');
    }
    triggerMoving();
    
    // Close the dropdown when the user releases the drag
    setIsOpen(false);
  }, [triggerMoving]);

  // ── Non-passive touch handlers ────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    const container = dropdownRef.current;
    if (!container) return;

    const onTouchStart = (e) => {
      const touch = e.touches[0];
      if (initDrag(touch.clientY)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const onTouchMove = (e) => {
      if (!draggingRef.current) return;
      e.preventDefault();
      updateDrag(e.touches[0].clientY);
    };

    const onTouchEnd = () => endDrag();

    container.addEventListener('touchstart', onTouchStart, { passive: false });
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onTouchEnd);
    document.addEventListener('touchcancel', onTouchEnd);

    return () => {
      container.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
      document.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [isOpen, initDrag, updateDrag, endDrag]);

  // ── Mouse drag (desktop) ──────────────────────────────────────────────────
  const handleContainerMouseDown = useCallback((e) => {
    if (initDrag(e.clientY)) {
      e.preventDefault();
      e.stopPropagation();
      if (pillRef.current) pillRef.current.style.cursor = 'grabbing';
    }
  }, [initDrag]);

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!draggingRef.current) return;
      updateDrag(e.clientY);
    };
    const onMouseUp = () => {
      if (!draggingRef.current) return;
      if (pillRef.current) pillRef.current.style.cursor = 'grab';
      endDrag();
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [updateDrag, endDrag]);

  // ── Dropdown toggle ───────────────────────────────────────────────────────
  const handleToggle = useCallback((e) => {
    e.stopPropagation();
    if (!isOpen && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const right = window.innerWidth - rect.right;
      setDropdownPos(
        direction === 'up'
          ? { top: rect.top - DROPDOWN_H - 4, right }
          : { top: rect.bottom + 4, right }
      );
    }
    setIsOpen((prev) => !prev);
  }, [isOpen, direction]);

  const handleSelect = useCallback((code) => {
    if (draggingRef.current) return;
    triggerMoving();
    changeLang(code);
    setIsOpen(false);
  }, [changeLang, triggerMoving]);

  if (AVAILABLE.length <= 1) return null;

  return (
    <>
      <div className="relative">
        <button
          ref={btnRef}
          onClick={handleToggle}
          className="lang-switcher-btn flex items-center gap-1.5 px-3 py-2 rounded-full text-sm"
          aria-label={t('ui.langToggle')}
          aria-expanded={isOpen}
        >
          <Globe size={14} />
          <span className="font-medium">{current?.code.toUpperCase()}</span>
          <ChevronDown
            size={12}
            className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {isRendered &&
        createPortal(
          <div
            className="fixed z-[100]"
            style={{ top: `${dropdownPos.top}px`, right: `${dropdownPos.right}px` }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={handleContainerMouseDown}
          >
            <div 
              ref={dropdownRef} 
              className={`lang-switcher-dropdown w-44 ${isOpen ? 'entering' : 'exiting'}`}
              data-direction={direction}
            >
              {/* Liquid draggable pill */}
              <div
                ref={pillRef}
                className={`lang-switcher-pill${isMoving ? ' moving' : ''}`}
                style={{
                  transform: `translateY(${PADDING + activeIndex * ITEM_H}px)`,
                  height: `${ITEM_H}px`,
                  // We no longer need to dynamically change cursor here; 
                  // we can just use CSS or rely on the container grabbing
                }}
              />

              <div style={{ padding: `${PADDING}px 0` }}>
                {AVAILABLE.map(({ code, native }) => (
                  <button
                    key={code}
                    onClick={() => handleSelect(code)}
                    className={`lang-switcher-item relative z-10 w-full flex items-center gap-2 px-4 text-sm text-left${
                      lang === code ? ' active' : ''
                    }`}
                    style={{ height: `${ITEM_H}px` }}
                  >
                    <span>{native}</span>
                    <span className="text-xs opacity-50 ml-auto">{code.toUpperCase()}</span>
                    {lang === code && <Check size={14} className="shrink-0 opacity-70" />}
                  </button>
                ))}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
});

LanguageSwitcher.displayName = 'LanguageSwitcher';

export default LanguageSwitcher;
