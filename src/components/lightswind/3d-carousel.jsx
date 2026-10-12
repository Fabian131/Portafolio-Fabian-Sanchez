import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ImageLightbox from "../molecules/ImageLightbox/ImageLightbox";

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

const DEFAULT_ITEMS = [
  { image: "https://picsum.photos/seed/depth1/800/1000", alt: "Slide 1" },
  { image: "https://picsum.photos/seed/depth2/800/1000", alt: "Slide 2" },
  { image: "https://picsum.photos/seed/depth3/800/1000", alt: "Slide 3" },
  { image: "https://picsum.photos/seed/depth4/800/1000", alt: "Slide 4" },
  { image: "https://picsum.photos/seed/depth5/800/1000", alt: "Slide 5" },
  { image: "https://picsum.photos/seed/depth6/800/1000", alt: "Slide 6" },
];

const ThreeDCarousel = memo((props) => {
  const {
    items = DEFAULT_ITEMS,
    autoRotate,
    autoplay,
    rotateInterval,
    autoplayDelay,
    cardWidth,
    cardHeight,
    radius = 24,
    tint = "#05060a",
    perspective = 1000,
    depth = 140,
    spread,
    tilt = 16,
    tiltDirection = "right",
    visibleCards = 2,
    falloff = 0.2,
    blur = 4,
    showControls = false,
    showIndicators = false,
    className = "",
    onCardClick,
  } = props;

  const isAutoRotate = autoRotate ?? autoplay ?? true;
  const effectiveInterval = rotateInterval ?? autoplayDelay ?? 2800;
  const count = items?.length || 0;
  const [active, setActive] = useState(0);
  const [lightboxItem, setLightboxItem] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isInView, setIsInView] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const containerRef = useRef(null);
  const touchStartRef = useRef(null);
  const touchDeltaRef = useRef(0);

  // Responsive check
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // IntersectionObserver to pause autoRotate when offscreen
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Auto-rotate with hover/view awareness
  useEffect(() => {
    if (!isAutoRotate || count < 2 || !isInView || isHovering) return;

    const timer = setInterval(
      () => {
        setActive((prev) => (prev + 1) % count);
      },
      Math.max(effectiveInterval, 1200),
    );

    return () => clearInterval(timer);
  }, [isAutoRotate, count, isInView, isHovering, effectiveInterval]);

  // Touch / Swipe Navigation
  const handleTouchStart = (e) => {
    if (e.targetTouches && e.targetTouches[0]) {
      touchStartRef.current = e.targetTouches[0].clientX;
      touchDeltaRef.current = 0;
    }
  };

  const handleTouchMove = (e) => {
    if (
      touchStartRef.current !== null &&
      e.targetTouches &&
      e.targetTouches[0]
    ) {
      touchDeltaRef.current =
        touchStartRef.current - e.targetTouches[0].clientX;
    }
  };

  const handleTouchEnd = () => {
    if (touchStartRef.current === null) return;
    const minSwipe = 35;
    if (touchDeltaRef.current > minSwipe) {
      setActive((prev) => (prev + 1) % count);
    } else if (touchDeltaRef.current < -minSwipe) {
      setActive((prev) => (prev - 1 + count) % count);
    }
    touchStartRef.current = null;
    touchDeltaRef.current = 0;
  };

  const navigateBy = useCallback(
    (step) => {
      setActive((prev) => (prev + step + count) % count);
    },
    [count],
  );

  // Responsive dimensions & spread calculation
  const actualCardWidth = cardWidth || (isMobile ? 250 : 285);
  const actualCardHeight = cardHeight || (isMobile ? 345 : 380);
  const actualSpread =
    spread !== undefined
      ? isMobile
        ? Math.min(spread, 110)
        : spread
      : isMobile
        ? 115
        : 160;

  return (
    <>
      <div
        ref={containerRef}
        className={`relative w-full h-full min-h-[380px] md:min-h-[440px] flex items-center justify-center overflow-hidden select-none ${className}`.trim()}
        style={{ perspective: `${perspective}px` }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        role="region"
        aria-roledescription="carousel"
        aria-label="3D Carousel"
      >
        <div
          className="relative w-full h-full flex items-center justify-center"
          style={{ transformStyle: "preserve-3d" }}
        >
          {items.map((item, i) => {
            let d = i - active;
            if (count > 1) {
              d = ((d % count) + count) % count;
              if (d > count / 2) d -= count;
            }

            const az = Math.abs(d);
            const isVisible = az <= visibleCards + 0.6;
            const dir = tiltDirection === "left" ? -1 : 1;

            // GPU-accelerated spatial coordinates
            const tx = dir * d * actualSpread;
            const tz = -depth * az;
            const ry = dir * tilt * clamp(d, -1.2, 1.2);
            const scale = Math.max(0.72, 1 - az * 0.12);

            let opacity = 1;
            if (az > visibleCards - 0.4) {
              opacity = clamp(1 - (az - (visibleCards - 0.4)) * 1.5, 0, 1);
            }
            if (az > visibleCards + 0.6) opacity = 0;

            const zIndex = Math.round(2000 - az * 50);
            const blurPx = az > 0 && blur > 0 ? Math.min(blur, az * 2.2) : 0;
            const brightness = Math.max(0.5, 1 - az * falloff);
            const tintOpacity = clamp(az * falloff * 1.2, 0, 0.75);

            const imageSrc =
              typeof item === "string"
                ? item
                : item.image || item.imageUrl || "";
            const altText =
              typeof item === "string" ? "" : item.alt || item.title || "";

            return (
              <div
                key={item.id || i}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all will-change-transform"
                style={{
                  width: `${actualCardWidth}px`,
                  height: `${actualCardHeight}px`,
                  transform: `translate(-50%, -50%) translate3d(${tx}px, 0, ${tz}px) rotateY(${ry}deg) scale(${scale})`,
                  opacity,
                  zIndex,
                  filter: `blur(${blurPx}px) brightness(${brightness})`,
                  pointerEvents: isVisible && opacity > 0.05 ? "auto" : "none",
                  transition:
                    "transform 0.65s cubic-bezier(0.2, 1, 0.3, 1), opacity 0.65s ease, filter 0.65s ease",
                  transformStyle: "preserve-3d",
                }}
                onClick={() => {
                  if (d === 0) {
                    if (onCardClick) {
                      onCardClick(i, item);
                    } else {
                      setLightboxItem({ image: imageSrc, alt: altText });
                    }
                  } else {
                    setActive(i);
                  }
                }}
                aria-hidden={d !== 0}
              >
                {/* Visual Card Frame */}
                <div
                  className="relative w-full h-full overflow-hidden rounded-2xl md:rounded-3xl bg-[#0b0d12] shadow-2xl border border-white/10 dark:border-white/10"
                  style={{ borderRadius: `${radius}px` }}
                >
                  {/* Ambient blurred backdrop so photos never have empty borders */}
                  <img
                    src={imageSrc}
                    alt=""
                    draggable={false}
                    aria-hidden="true"
                    className="absolute -inset-4 w-[calc(100%+32px)] h-[calc(100%+32px)] object-cover pointer-events-none filter blur-xl brightness-90 saturate-150 transform-gpu"
                  />

                  {/* Crisp centered main image */}
                  <img
                    src={imageSrc}
                    alt={altText}
                    draggable={false}
                    className="relative z-10 w-full h-full object-contain pointer-events-none"
                  />

                  {/* Depth tint overlay */}
                  <span
                    className="absolute inset-0 z-20 pointer-events-none transition-opacity duration-500"
                    style={{
                      backgroundColor: tint,
                      opacity: tintOpacity,
                      mixBlendMode: "multiply",
                    }}
                  />

                  {/* Optional rich info overlay if title or description exist */}
                  {(item.title || item.description) && (
                    <div className="absolute inset-x-0 bottom-0 z-30 p-4 bg-gradient-to-t from-black/85 via-black/40 to-transparent text-white">
                      {item.title && (
                        <h4 className="font-semibold text-sm md:text-base line-clamp-1">
                          {item.title}
                        </h4>
                      )}
                      {item.description && (
                        <p className="text-xs text-white/80 line-clamp-2 mt-0.5">
                          {item.description}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Optional Glassmorphic Controls */}
        {showControls && count > 1 && (
          <>
            <button
              type="button"
              className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 dark:bg-black/50 backdrop-blur-md border border-white/15 text-white flex items-center justify-center hover:bg-black/60 hover:scale-105 active:scale-95 transition-all z-40 shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                navigateBy(-1);
              }}
              aria-label="Previous slide"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 dark:bg-black/50 backdrop-blur-md border border-white/15 text-white flex items-center justify-center hover:bg-black/60 hover:scale-105 active:scale-95 transition-all z-40 shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                navigateBy(1);
              }}
              aria-label="Next slide"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Optional Slide Indicators */}
        {showIndicators && count > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-40 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`transition-all duration-300 rounded-full ${
                  active === i
                    ? "w-5 h-1.5 bg-white"
                    : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
                }`}
                onClick={() => setActive(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox for full-size inspection */}
      <ImageLightbox
        src={lightboxItem?.image}
        alt={lightboxItem?.alt}
        isOpen={!!lightboxItem}
        onClose={() => setLightboxItem(null)}
      />
    </>
  );
});

ThreeDCarousel.displayName = "ThreeDCarousel";

export default ThreeDCarousel;
