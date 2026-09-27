import { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from './useTranslation';
import { AVAILABLE, LANGS } from '../data/translations';

const ITEM_H = 44;
const PADDING = 8;
const DROPDOWN_H = AVAILABLE.length * ITEM_H + PADDING * 2;

export const useLanguageSwitcher = ({ direction = 'down', parentOpen = true }) => {
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

  // Auto-close if parent container (e.g. mobile sidebar) closes
  useEffect(() => {
    if (!parentOpen) {
      setIsOpen(false);
      setIsRendered(false);
    }
  }, [parentOpen]);

  // Close on outside click/touch & mount animation state
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
      unmountTimer = setTimeout(() => setIsRendered(false), 200);
    }
    return () => clearTimeout(unmountTimer);
  }, [isOpen, isRendered]);

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

  const updateDrag = useCallback((clientY) => {
    if (!draggingRef.current) return;
    const pill = pillRef.current;
    if (!pill) return;

    didDragRef.current = true;
    const { containerTop, pillH, minTop, maxTop } = dragCacheRef.current;
    const relativeY = clientY - containerTop;
    const newTop = Math.max(minTop, Math.min(maxTop, relativeY - pillH / 2));
    
    pill.style.setProperty('--drag-y', `${newTop}px`);

    const result = getLangFromClientY(clientY);
    if (!result) return;
    if (result.index !== dragCurrentIndexRef.current) {
      dragCurrentIndexRef.current = result.index;
      changeLang(result.code);
    }
  }, [getLangFromClientY, changeLang]);

  const endDrag = useCallback(() => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    
    const pill = pillRef.current;
    const container = dropdownRef.current;
    if (pill) {
      pill.classList.remove('dragging');
      pill.style.removeProperty('--drag-y');
    }
    if (container) {
      container.classList.remove('is-dragging');
    }
    triggerMoving();
    
    setIsOpen(false);
  }, [triggerMoving]);

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

  return {
    t,
    lang,
    current,
    isOpen,
    isRendered,
    isMoving,
    dropdownPos,
    btnRef,
    dropdownRef,
    pillRef,
    activeIndex,
    ITEM_H,
    PADDING,
    AVAILABLE,
    handleContainerMouseDown,
    handleToggle,
    handleSelect
  };
};
