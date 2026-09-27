import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import './ImageLightbox.css';

const ImageLightbox = memo(({ src, alt, isOpen, onClose }) => {
  const [phase, setPhase] = useState('closed'); // closed | entering | open | exiting
  const overlayRef = useRef(null);
  const imgRef = useRef(null);

  // Open flow: closed → entering → open
  useEffect(() => {
    if (isOpen && phase === 'closed') {
      setPhase('entering');
      // Allow the browser to paint the entering state, then transition to open
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setPhase('open'));
      });
    }
  }, [isOpen, phase]);

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

  if (phase === 'closed') return null;

  const isVisible = phase === 'open';

  return createPortal(
    <div
      ref={overlayRef}
      className={`lightbox-overlay lightbox-overlay--${phase}`}
      onClick={handleClose}
      onTransitionEnd={handleTransitionEnd}
      onAnimationEnd={(e) => {
        // Fallback for animation end if transition end doesn't catch it
        if (phase === 'exiting' && e.target === overlayRef.current) {
          setPhase('closed');
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-label={alt || 'Image preview'}
    >
      {/* Image container */}
      <div
        className={`lightbox-content lightbox-content--${phase}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button inside content container */}
        <button
          className={`lightbox-close lightbox-close--${phase}`}
          onClick={(e) => { e.stopPropagation(); handleClose(); }}
          aria-label="Close"
        >
          <X size={22} className="stroke-[2.5]" />
        </button>

        <img
          ref={imgRef}
          src={src}
          alt={alt || ''}
          className="lightbox-img"
          draggable={false}
        />
      </div>
    </div>,
    document.body
  );
});

ImageLightbox.displayName = 'ImageLightbox';

export default ImageLightbox;
