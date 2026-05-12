import React, { useState, useEffect, useRef, memo, useCallback, useMemo } from 'react';
import SkillCard from '../molecules/SkillCard';

const DraggableMarquee = memo(({ items, direction = 'left', color = 'cyan' }) => {
  const trackRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const animationRef = useRef(null);
  const positionRef = useRef(0);
  const dragStartX = useRef(0);
  const dragStartPos = useRef(0);
  const [setWidth, setSetWidth] = useState(0);
  const isReady = useRef(false);
  const lastFrameTime = useRef(0);

  const duplicatedItems = useMemo(() => [
    ...items, ...items, ...items, ...items, ...items, ...items
  ], [items]);

  useEffect(() => {
    if (trackRef.current && !isReady.current) {
      requestAnimationFrame(() => {
        if (trackRef.current) {
          const totalWidth = trackRef.current.scrollWidth;
          const oneSetWidth = totalWidth / 6;
          setSetWidth(oneSetWidth);

          if (direction === 'right') {
            positionRef.current = -oneSetWidth;
            trackRef.current.style.transform = `translate3d(${positionRef.current}px, 0, 0)`;
          }

          isReady.current = true;
        }
      });
    }
  }, [direction]);

  useEffect(() => {
    if (isDragging || setWidth === 0) {
      cancelAnimationFrame(animationRef.current);
      return;
    }

    const speed = direction === 'left' ? -0.9 : 0.9;
    const targetFPS = 45;
    const frameInterval = 1000 / targetFPS;

    const animate = (timestamp) => {
      if (timestamp - lastFrameTime.current < frameInterval) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrameTime.current = timestamp;

      positionRef.current += speed;

      if (direction === 'left') {
        if (positionRef.current <= -setWidth) {
          positionRef.current += setWidth;
        } else if (positionRef.current > 0) {
          positionRef.current -= setWidth;
        }
      } else {
        if (positionRef.current >= 0) {
          positionRef.current -= setWidth;
        } else if (positionRef.current < -setWidth) {
          positionRef.current += setWidth;
        }
      }

      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${positionRef.current}px, 0, 0)`;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isDragging, setWidth, direction]);

  const normalizePosition = useCallback((pos) => {
    let normalized = pos;
    const maxDrag = setWidth * 2;

    if (direction === 'left') {
      while (normalized < -maxDrag) normalized += setWidth;
      while (normalized > setWidth) normalized -= setWidth;
    } else {
      while (normalized > 0) normalized -= setWidth;
      while (normalized < -maxDrag) normalized += setWidth;
    }
    return normalized;
  }, [setWidth, direction]);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartX.current = e.clientX;
    dragStartPos.current = positionRef.current;
    cancelAnimationFrame(animationRef.current);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || setWidth === 0) return;
    e.preventDefault();

    const deltaX = e.clientX - dragStartX.current;
    positionRef.current = normalizePosition(dragStartPos.current + deltaX);

    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${positionRef.current}px, 0, 0)`;
    }
  }, [isDragging, setWidth, normalizePosition]);

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
    if (!isDragging || setWidth === 0) return;
    const deltaX = e.touches[0].clientX - dragStartX.current;
    positionRef.current = normalizePosition(dragStartPos.current + deltaX);

    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${positionRef.current}px, 0, 0)`;
    }
  }, [isDragging, setWidth, normalizePosition]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div
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
          <SkillCard key={`${skill.name}-${i}`} skill={skill} index={i} color={color} />
        ))}
      </div>
    </div>
  );
});

DraggableMarquee.displayName = 'DraggableMarquee';

export default DraggableMarquee;