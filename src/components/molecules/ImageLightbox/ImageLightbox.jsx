import React, { memo } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useImageLightbox } from '../../../hooks/useImageLightbox';
import './ImageLightbox.css';

const ImageLightbox = memo(({ src, alt, isOpen, onClose }) => {
  const {
    phase,
    overlayRef,
    imgRef,
    handleClose,
    handleTransitionEnd,
    handleAnimationEnd
  } = useImageLightbox({ isOpen, onClose });

  if (phase === 'closed') return null;

  return createPortal(
    <div
      ref={overlayRef}
      className={`lightbox-overlay lightbox-overlay--${phase}`}
      onClick={handleClose}
      onTransitionEnd={handleTransitionEnd}
      onAnimationEnd={handleAnimationEnd}
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
