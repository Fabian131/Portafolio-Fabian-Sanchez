import React, { useState, useEffect, useRef, memo, useCallback, useMemo } from 'react';
import SkillCard from '../atoms/SkillCard';
import { MOBILE_MAX } from '../../utils/breakpoints';

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
    if (trackRef.current && !isReady.current) {
      requestAnimationFrame(() => {
        if (trackRef.current) {
          const totalWidth = trackRef.current.scrollWidth;
          const oneSetWidth = totalWidth / duplicateCount;
          setOneSetWidth(oneSetWidth);

          if (direction === 'right') {
            positionRef.current = -oneSetWidth;
            trackRef.current.style.transform = `translate3d(${positionRef.current}px, 0, 0)`;
          }

          isReady.current = true;
        }
      });
    }
  }, [direction, duplicateCount]);

  useEffect(() => {
    if (isDragging || oneSetWidth === 0 || !isVisible) {
      cancelAnimationFrame(animationRef.current);
      return;
    }

    const speed = direction === 'left' ? -0.9 : 0.9;
    const targetFPS = 45;
    const frameInterval = 1000 / targetFPS;

    const animate = (timestamp) => {
      if (!isVisible) {
        cancelAnimationFrame(animationRef.current);
        return;
      }

      if (timestamp - lastFrameTime.current < frameInterval) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrameTime.current = timestamp;

      positionRef.current += speed;

      if (direction === 'left') {
        if (positionRef.current <= -oneSetWidth) {
          positionRef.current += oneSetWidth;
        } else if (positionRef.current > 0) {
          positionRef.current -= oneSetWidth;
        }
      } else {
        if (positionRef.current >= 0) {
          positionRef.current -= oneSetWidth;
        } else if (positionRef.current < -oneSetWidth) {
          positionRef.current += oneSetWidth;
        }
      }

      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${positionRef.current}px, 0, 0)`;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isDragging, oneSetWidth, direction, isVisible]);

  const normalizePosition = useCallback((pos) => {
    let normalized = pos;
    const maxDrag = oneSetWidth * 2;

    if (direction === 'left') {
      while (normalized < -maxDrag) normalized += oneSetWidth;
      while (normalized > oneSetWidth) normalized -= oneSetWidth;
    } else {
      while (normalized > 0) normalized -= oneSetWidth;
      while (normalized < -maxDrag) normalized += oneSetWidth;
    }
    return normalized;
  }, [oneSetWidth, direction]);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartX.current = e.clientX;
    dragStartPos.current = positionRef.current;
    cancelAnimationFrame(animationRef.current);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || oneSetWidth === 0) return;
    e.preventDefault();

    const deltaX = e.clientX - dragStartX.current;
    positionRef.current = normalizePosition(dragStartPos.current + deltaX);

    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${positionRef.current}px, 0, 0)`;
    }
  }, [isDragging, oneSetWidth, normalizePosition]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (isDragging) setIsDragging(false);
  }, [isDragging]);

  const handleTouchStart = useCallback((e) => {
    setIsDragging(true);
    dragStartX.current = e.touches[0].clientX;
    dragStartPos.current = positionRef.current;
    cancelAnimationFrame(animationRef.current);
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging || oneSetWidth === 0) return;
    const deltaX = e.touches[0].clientX - dragStartX.current;
    positionRef.current = normalizePosition(dragStartPos.current + deltaX);

    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${positionRef.current}px, 0, 0)`;
    }
  }, [isDragging, oneSetWidth, normalizePosition]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden cursor-grab active:cursor-grabbing select-none h-24"
      style={{ contain: 'layout' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
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