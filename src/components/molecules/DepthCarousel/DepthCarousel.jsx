import React, { memo, useCallback, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useDepthCarousel } from "../../../hooks/useDepthCarousel";
import ImageLightbox from "../ImageLightbox/ImageLightbox";
import "./DepthCarousel.css";

// Cache for precomputed image edge gradients
const gradientCache = new Map();

function extractImageGradient(src, callback) {
  if (!src) return;
  if (gradientCache.has(src)) {
    callback(gradientCache.get(src));
    return;
  }
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = src;
  img.onload = () => {
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      canvas.width = 16;
      canvas.height = 16;
      ctx.drawImage(img, 0, 0, 16, 16);
      const data = ctx.getImageData(0, 0, 16, 16).data;

      // Sample top row (row 0)
      let rT = 0;
      let gT = 0;
      let bT = 0;
      for (let x = 0; x < 16; x++) {
        const idx = x * 4;
        rT += data[idx];
        gT += data[idx + 1];
        bT += data[idx + 2];
      }
      rT = Math.round(rT / 16);
      gT = Math.round(gT / 16);
      bT = Math.round(bT / 16);

      // Sample bottom row (row 15)
      let rB = 0;
      let gB = 0;
      let bB = 0;
      for (let x = 0; x < 16; x++) {
        const idx = (15 * 16 + x) * 4;
        rB += data[idx];
        gB += data[idx + 1];
        bB += data[idx + 2];
      }
      rB = Math.round(rB / 16);
      gB = Math.round(gB / 16);
      bB = Math.round(bB / 16);

      const gradient = `linear-gradient(180deg, rgb(${rT}, ${gT}, ${bT}) 0%, rgb(${rB}, ${gB}, ${bB}) 100%)`;
      gradientCache.set(src, gradient);
      callback(gradient);
    } catch {
      // Graceful fallback to solid background
    }
  };
}

const DepthCarousel = memo(
  ({
    items,
    cardWidth = 380,
    cardHeight = 280,
    radius = 24,
    depth = 110,
    spread = 100,
    perspective = 1400,
    visibleCards = 3,
    blur = 6,
    autoplay = true,
    autoplayDelay = 3200,
    showControls = true,
    showIndicators = true,
    ariaLabel = "Image carousel",
    className = "",
  }) => {
    const [lightboxItem, setLightboxItem] = useState(null);
    const [cardGradients, setCardGradients] = useState({});
    const handleExpand = useCallback((item) => setLightboxItem(item), []);
    const handleClose = useCallback(() => setLightboxItem(null), []);

    const {
      data,
      count,
      active,
      isDragging,
      rootRef,
      cardRefs,
      goTo,
      navigateBy,
      onCardClick,
      rootHandlers,
    } = useDepthCarousel({
      items,
      cardWidth,
      cardHeight,
      depth,
      spread,
      visibleCards,
      blur,
      autoplay,
      autoplayDelay,
      paused: lightboxItem !== null,
      onExpand: handleExpand,
    });

    // Extract dominant edge gradient for each image to eliminate letterbox contrast
    React.useEffect(() => {
      let isMounted = true;
      data.forEach((item, index) => {
        if (!item.image) return;
        extractImageGradient(item.image, (grad) => {
          if (isMounted) {
            setCardGradients((prev) => {
              if (prev[index] === grad) return prev;
              return { ...prev, [index]: grad };
            });
          }
        });
      });
      return () => {
        isMounted = false;
      };
    }, [data]);

    return (
      <>
        <div
          ref={rootRef}
          className={`depth-carousel${isDragging ? " is-dragging" : ""} ${className}`.trim()}
          style={{ "--dc-perspective": `${perspective}px` }}
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label={ariaLabel}
          {...rootHandlers}
        >
          <div className="depth-carousel__stage">
            {data.map((item, i) => (
              <div
                key={item.id ?? i}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className="depth-carousel__card"
                style={{
                  width: cardWidth,
                  height: cardHeight,
                  borderRadius: radius,
                  backgroundColor: "#0d1117",
                  backgroundImage: cardGradients[i] || "none",
                }}
                onClick={() => onCardClick(i)}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${count}`}
                aria-hidden={active !== i}
              >
                {/* Fondo ambiental difuminado para extender la foto de forma continua */}
                <img
                  className="depth-carousel__img-bg"
                  src={item.image}
                  alt=""
                  draggable={false}
                  aria-hidden="true"
                  decoding="async"
                />

                {/* Imagen principal completa y nítida */}
                <img
                  className="depth-carousel__img"
                  src={item.image}
                  alt={item.alt || ""}
                  draggable={false}
                  decoding="async"
                />
              </div>
            ))}
          </div>

          {showControls && count > 1 && (
            <>
              <button
                type="button"
                className="depth-carousel__arrow depth-carousel__arrow--prev"
                onPointerDown={(e) => e.stopPropagation()}
                onPointerUp={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  navigateBy(-1);
                }}
                aria-label="Previous slide"
              >
                <ChevronLeft size={22} strokeWidth={2.5} />
              </button>
              <button
                type="button"
                className="depth-carousel__arrow depth-carousel__arrow--next"
                onPointerDown={(e) => e.stopPropagation()}
                onPointerUp={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  navigateBy(1);
                }}
                aria-label="Next slide"
              >
                <ChevronRight size={22} strokeWidth={2.5} />
              </button>
            </>
          )}

          {showIndicators && count > 1 && (
            <div
              className="depth-carousel__dots"
              role="tablist"
              aria-label="Slides"
              onPointerDown={(e) => e.stopPropagation()}
              onPointerUp={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
              {data.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={active === i}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`depth-carousel__dot${active === i ? " is-active" : ""}`}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    goTo(i);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <ImageLightbox
          src={lightboxItem?.image}
          alt={lightboxItem?.alt}
          isOpen={!!lightboxItem}
          onClose={handleClose}
        />
      </>
    );
  },
);

DepthCarousel.displayName = "DepthCarousel";

export default DepthCarousel;
