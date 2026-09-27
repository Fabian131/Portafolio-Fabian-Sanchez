import React, { useState, useEffect, useRef, memo, useCallback, useMemo } from 'react';
import SkillCard from '../SkillCard/SkillCard';
import { MOBILE_MAX } from '../../../utils/breakpoints';

const DraggableMarquee = memo(({ items, direction = 'left', color = 'cyan', performanceTier = 'high' }) => {
  const trackRef = useRef(null);
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const animationRef = useRef(null);
  const positionRef = useRef(0);
  const dragStartX = useRef(0);
  const dragStartPos = useRef(0);
  const [oneSetWidth, setOneSetWidth] = useState(0);
  const isReady = useRef(false);
  const lastFrameTime = useRef(0);
  const [isVisible, setIsVisible] = useState(true);

  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= MOBILE_MAX);
  const duplicateCount = isMobile ? 3 : 6;

  const duplicatedItems = useMemo(() => {
    return Array(duplicateCount).fill(null).flatMap(() => items);
  }, [items, duplicateCount]);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= MOBILE_MAX;
      setIsMobile(prev => prev !== mobile ? mobile : prev);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (!entry.isIntersecting) {
          cancelAnimationFrame(animationRef.current);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        // scrollWidth is accurate for the overflowing flex container
        const totalWidth = entry.target.scrollWidth;
        const newOneSetWidth = totalWidth / duplicateCount;

        if (newOneSetWidth > 0 && Math.abs(newOneSetWidth - oneSetWidth) > 1) {
          setOneSetWidth(newOneSetWidth);

          if (!isReady.current) {
            if (direction === 'right') {
              positionRef.current = -newOneSetWidth;
              entry.target.style.transform = `translate3d(${positionRef.current}px, 0, 0)`;
            }
            isReady.current = true;
          }
        }
      }
    });

    resizeObserver.observe(track);
    return () => resizeObserver.disconnect();
  }, [duplicateCount, direction, oneSetWidth]);

  useEffect(() => {
    if (isDragging || oneSetWidth === 0 || !isVisible) {
      cancelAnimationFrame(animationRef.current);
      return;
    }

    const pixelsPerMs = direction === 'left' ? -0.06 : 0.06;

    const animate = (timestamp) => {
      if (!isVisible) {
        cancelAnimationFrame(animationRef.current);
        return;
      }

      if (!lastFrameTime.current) lastFrameTime.current = timestamp;
      const deltaTime = timestamp - lastFrameTime.current;
      lastFrameTime.current = timestamp;

      // Cap delta time to prevent massive jumps when tab becomes active again
      const dt = Math.min(deltaTime, 50);

      positionRef.current += pixelsPerMs * dt;
      
      // Strict modulo normalization to keep position in (-oneSetWidth, 0]
      while (positionRef.current > 0) {
        positionRef.current -= oneSetWidth;
      }
      while (positionRef.current <= -oneSetWidth) {
        positionRef.current += oneSetWidth;
      }

      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${positionRef.current}px, 0, 0)`;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    lastFrameTime.current = 0;
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isDragging, oneSetWidth, direction, isVisible]);

  const normalizePosition = useCallback((pos) => {
    let normalized = pos;
    if (oneSetWidth === 0) return 0;
    
    // Strict modulo normalization to keep position in (-oneSetWidth, 0]
    while (normalized > 0) {
      normalized -= oneSetWidth;
    }
    while (normalized <= -oneSetWidth) {
      normalized += oneSetWidth;
    }
    
    return normalized;
  }, [oneSetWidth]);

  const handlePointerDown = useCallback((e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragStartX.current = e.clientX;
    dragStartPos.current = positionRef.current;
    cancelAnimationFrame(animationRef.current);
  }, []);

  const handlePointerMove = useCallback((e) => {
    if (!isDragging || oneSetWidth === 0) return;
    
    const deltaX = e.clientX - dragStartX.current;
    positionRef.current = normalizePosition(dragStartPos.current + deltaX);

    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${positionRef.current}px, 0, 0)`;
    }
  }, [isDragging, oneSetWidth, normalizePosition]);

  const handlePointerUp = useCallback((e) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    setIsDragging(false);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden cursor-grab active:cursor-grabbing select-none h-24"
      style={{ contain: 'layout', touchAction: 'pan-y' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div
        ref={trackRef}
        className="absolute top-0 left-0 flex gap-3"
        style={{
          transform: 'translate3d(0, 0, 0)',
          willChange: 'transform',
          backfaceVisibility: 'hidden'
        }}
      >
        {duplicatedItems.map((skill, i) => (
          <SkillCard key={`${skill.name}-${i}`} skill={skill} color={color} performanceTier={performanceTier} />
        ))}
      </div>
    </div>
  );
});

DraggableMarquee.displayName = 'DraggableMarquee';

export default DraggableMarquee;