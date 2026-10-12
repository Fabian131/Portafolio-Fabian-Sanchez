import React, { memo, useCallback, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useDepthCarousel } from "../../../hooks/useDepthCarousel";
import ImageLightbox from "../ImageLightbox/ImageLightbox";
import "./DepthCarousel.css";

// Cache for precomputed image edge metadata
const imageMetaCache = new Map();

function analyzeImage(src, cardRatio, callback) {
  if (!src) return;
  const cacheKey = `${src}__${cardRatio.toFixed(3)}`;
  if (imageMetaCache.has(cacheKey)) {
    callback(imageMetaCache.get(cacheKey));
    return;
  }
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = src;
  img.onload = () => {
    try {
      const w = img.naturalWidth || 1;
      const h = img.naturalHeight || 1;
      const imgRatio = w / h;
      const diff = Math.abs(imgRatio - cardRatio) / cardRatio;

      // When aspect ratio is within 9% of the card ratio, full-bleed provides edge-to-edge beauty without gaps
      const isCover = diff <= 0.09;
      const isLandscape = imgRatio > cardRatio;

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      let gradient = "none";

      if (ctx) {
        canvas.width = 16;
        canvas.height = 16;
        ctx.drawImage(img, 0, 0, 16, 16);
        const data = ctx.getImageData(0, 0, 16, 16).data;

        // Sample top row
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

        // Sample bottom row
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

        gradient = `linear-gradient(180deg, rgb(${rT}, ${gT}, ${bT}) 0%, rgb(${rB}, ${gB}, ${bB}) 100%)`;
      }

      const meta = { gradient, isCover, isLandscape };
      imageMetaCache.set(cacheKey, meta);
      callback(meta);
    } catch {
      callback({ gradient: "none", isCover: false, isLandscape: true });
    }
  };
  img.onerror = () => {
    callback({ gradient: "none", isCover: false, isLandscape: true });
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
    isMobile = false,
    performanceTier = "high",
  }) => {
    const [lightboxItem, setLightboxItem] = useState(null);
    const [cardMeta, setCardMeta] = useState({});
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

    // Analyze aspect ratios and edge gradients to provide optimal full-bleed or seamless ambient fill
    React.useEffect(() => {
      let isMounted = true;
      const cardRatio = cardWidth / cardHeight;
      data.forEach((item, index) => {
        if (!item.image) return;
        analyzeImage(item.image, cardRatio, (meta) => {
          if (isMounted) {
            setCardMeta((prev) => {
              if (prev[index] === meta) return prev;
              return { ...prev, [index]: meta };
            });
          }
        });
      });
      return () => {
        isMounted = false;
      };
    }, [data, cardWidth, cardHeight]);

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
            {data.map((item, i) => {
              const meta = cardMeta[i] || {
                gradient: "none",
                isCover: false,
                isLandscape: true,
              };
              return (
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
                    backgroundImage: meta.gradient || "none",
                  }}
                  onClick={() => onCardClick(i)}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${count}`}
                  aria-hidden={active !== i}
                >
                  {/* Para imágenes que no cubren por completo, extender bordes con capas ambientales ancladas (solo escritorio) */}
                  {!meta.isCover && !isMobile && performanceTier !== "low" && (
                    <div className="depth-carousel__ambient-layer" aria-hidden="true">
                      <div
                        className="depth-carousel__ambient-slice depth-carousel__ambient-slice--top"
                        style={{ backgroundImage: `url(${item.image})` }}
                      />
                      <div
                        className="depth-carousel__ambient-slice depth-carousel__ambient-slice--bottom"
                        style={{ backgroundImage: `url(${item.image})` }}
                      />
                    </div>
                  )}

                  {/* Imagen principal: full-bleed cuando encaja de forma natural, o contenida con difuminado suave en los bordes */}
                  <img
                    className={`depth-carousel__img ${meta.isCover ? "is-cover" : "is-contained"}`}
                    src={item.image}
                    alt={item.alt || ""}
                    draggable={false}
                    decoding="async"
                    loading={i < 3 ? "eager" : "lazy"}
                  />
                </div>
              );
            })}
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
