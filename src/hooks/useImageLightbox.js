import { useState, useRef, useEffect, useCallback } from 'react';

export const useImageLightbox = ({ isOpen, onClose }) => {
  const [phase, setPhase] = useState('closed'); // closed | entering | open | exiting
  const overlayRef = useRef(null);
  const imgRef = useRef(null);

  // Open flow: closed → entering → open
  useEffect(() => {
    if (!isOpen) return;
    let raf1 = 0;
    let raf2 = 0;
    raf1 = requestAnimationFrame(() => {
      setPhase('entering');
      raf2 = requestAnimationFrame(() => setPhase('open'));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [isOpen]);

  // Close flow: open → exiting → closed
  const handleClose = useCallback(() => {
    setPhase('exiting');
  }, []);

  // When exit animation ends, fully close
  const handleTransitionEnd = useCallback((e) => {
    if (phase === 'exiting' && e.target === overlayRef.current) {
      setPhase('closed');
      onClose();
    }
  }, [phase, onClose]);

  const handleAnimationEnd = useCallback((e) => {
    if (phase === 'exiting' && e.target === overlayRef.current) {
      setPhase('closed');
      onClose();
    }
  }, [phase, onClose]);

  // Close on Escape
  useEffect(() => {
    if (phase === 'closed') return;
    const handleKey = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [phase, handleClose]);

  // Lock scroll while open
  useEffect(() => {
    if (phase !== 'closed') {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      return () => {
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
      };
    }
  }, [phase]);

  return {
    phase,
    overlayRef,
    imgRef,
    handleClose,
    handleTransitionEnd,
    handleAnimationEnd,
    isVisible: phase === 'open'
  };
};
