import { memo } from 'react';
import ImageLightbox from '../ImageLightbox/ImageLightbox';
import { useDepthCarousel } from '../../../hooks/useDepthCarousel';
import './DepthCarousel.css';

const DEFAULT_ITEMS = [
  { image: 'https://picsum.photos/seed/depth1/800/1000', alt: 'Slide 1' },
  { image: 'https://picsum.photos/seed/depth2/800/1000', alt: 'Slide 2' },
  { image: 'https://picsum.photos/seed/depth3/800/1000', alt: 'Slide 3' },
  { image: 'https://picsum.photos/seed/depth4/800/1000', alt: 'Slide 4' },
  { image: 'https://picsum.photos/seed/depth5/800/1000', alt: 'Slide 5' },
  { image: 'https://picsum.photos/seed/depth6/800/1000', alt: 'Slide 6' }
];

const DepthCarousel = memo((props) => {
  const {
    items = DEFAULT_ITEMS,
    cardWidth = 300,
    cardHeight = 380,
    radius = 18,
    tint = '#05060a',
    perspective = 1400,
    showControls = true,
    showIndicators = true,
    className = ''
  } = props;

  const {
    data,
    count,
    active,
    rootRef,
    stageRef,
    cardRefs,
    overlayRefs,
    lightboxItem,
    setLightboxItem,
    onPointerDown,
    onPointerMove,
    onPointerEnd,
    onKeyDown,
    onCardClick,
    setFocus,
    navigateBy
  } = useDepthCarousel(props);

  return (
    <>
      <div
        ref={rootRef}
        className={`depth-carousel ${className}`.trim()}
        style={{ '--dc-perspective': `${perspective}px` }}
        role="group"
        aria-roledescription="carousel"
        aria-label="Depth carousel"
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onKeyDown={onKeyDown}
      >
        <div className="depth-carousel__stage" ref={stageRef}>
          {data.map((item, i) => (
            <div
              key={i}
              className="depth-carousel__card"
              ref={el => (cardRefs.current[i] = el)}
              style={{ width: cardWidth, height: cardHeight, borderRadius: radius }}
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={active !== i}
              onClick={(e) => onCardClick(i, e)}
            >
              <img className="depth-carousel__img-bg" src={item.image} alt="" draggable={false} aria-hidden="true" />
              <img className="depth-carousel__img" src={item.image} alt={item.alt || ''} draggable={false} />
              <span
                className="depth-carousel__tint"
                ref={el => (overlayRefs.current[i] = el)}
                style={{ background: tint }}
              />
            </div>
          ))}
        </div>

        {showControls && count > 1 && (
          <>
            <button
              type="button"
              className="depth-carousel__arrow depth-carousel__arrow--prev"
              aria-label="Previous slide"
              onClick={() => navigateBy(-1)}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path
                  d="M15 5l-7 7 7 7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              className="depth-carousel__arrow depth-carousel__arrow--next"
              aria-label="Next slide"
              onClick={() => navigateBy(1)}
            >
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                <path
                  d="M9 5l7 7-7 7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </>
        )}

        {showIndicators && count > 1 && (
          <div className="depth-carousel__dots" role="tablist" aria-label="Slides">
            {data.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={active === i}
                aria-label={`Go to slide ${i + 1}`}
                className={`depth-carousel__dot${active === i ? ' is-active' : ''}`}
                onClick={() => setFocus(i, true)}
              />
            ))}
          </div>
        )}

      </div>

      <ImageLightbox
        src={lightboxItem?.image}
        alt={lightboxItem?.alt}
        isOpen={!!lightboxItem}
        onClose={() => setLightboxItem(null)}
      />
    </>
  );
});

DepthCarousel.displayName = 'DepthCarousel';

export default DepthCarousel;
