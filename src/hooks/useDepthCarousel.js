import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const normalizeItem = (it) =>
  typeof it === "string" ? { image: it, alt: "" } : it;
const wrap = (v, n) => ((v % n) + n) % n;
// Shortest signed distance on a ring of n slots.
const ringOffset = (v, n) => {
  const o = wrap(v, n);
  return o > n / 2 ? o - n : o;
};

const EASE_PER_FRAME = 0.1;
const FRAME_MS = 1000 / 60;
const SETTLE_EPSILON = 0.001;
const DRAG_THRESHOLD = 10;
const FLING_MS = 200;
// Max useful value is floor(n/2)+1: the farthest ring offset is floor(n/2), shown at full opacity.
const visibleFor = (n, vc) => Math.max(1, Math.min(vc, Math.floor(n / 2) + 1));

export const useDepthCarousel = ({
  items,
  cardWidth,
  cardHeight,
  depth,
  spread,
  visibleCards,
  blur,
  autoplay,
  autoplayDelay,
  paused,
  onExpand,
}) => {
  const data = useMemo(
    () => (Array.isArray(items) ? items : []).map(normalizeItem),
    [items],
  );
  const count = data.length;

  const rootRef = useRef(null);
  const cardRefs = useRef([]);
  const filterCache = useRef([]);
  const posRef = useRef(0);
  const targetRef = useRef(0);
  const rafRef = useRef(0);
  const scaleRef = useRef(1);
  const activeRef = useRef(0);
  const blurEnabledRef = useRef(true);
  const reducedRef = useRef(false);
  const pausedRef = useRef(paused);
  const cfgRef = useRef({});
  const dragRef = useRef({
    active: false,
    moved: false,
    id: null,
    startX: 0,
    lastX: 0,
    startPos: 0,
    lastT: 0,
    v: 0,
  });

  const [active, setActive] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const layout = useCallback((pos) => {
    const {
      count: n,
      depth: d,
      spread: s,
      visibleCards: vc,
      blur: b,
    } = cfgRef.current;
    if (!n) return;

    const sc = scaleRef.current;
    const visible = visibleFor(n, vc);
    const blurStep = blurEnabledRef.current && b > 0 ? b / visible : 0;

    for (let i = 0; i < n; i++) {
      const el = cardRefs.current[i];
      if (!el) continue;

      const offset = n > 1 ? ringOffset(i - pos, n) : i - pos;
      const az = Math.abs(offset);
      const opacity = az > visible - 1 ? Math.max(0, visible - az) : 1;
      const style = el.style;

      if (opacity === 0) {
        style.visibility = "hidden";
        continue;
      }

      style.visibility = "visible";
      style.transform = `translate(-50%, -50%) scale(${sc}) translate3d(${(offset * s).toFixed(2)}px, 0, ${(-az * d).toFixed(2)}px)`;
      style.opacity = opacity.toFixed(3);
      style.zIndex = String(1000 - Math.round(az * 20));
      style.pointerEvents = opacity > 0.5 ? "auto" : "none";

      // Filter writes are the costliest; skip them when the value did not change.
      const filter = `brightness(${Math.max(0.7, 1 - az * 0.12).toFixed(2)})${blurStep ? ` blur(${(az * blurStep).toFixed(1)}px)` : ""}`;
      if (filterCache.current[i] !== filter) {
        filterCache.current[i] = filter;
        style.filter = filter;
      }
    }
  }, []);

  const startAnimation = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    if (reducedRef.current) {
      posRef.current = targetRef.current;
      layout(posRef.current);
      return;
    }

    let last = performance.now();
    const step = (now) => {
      const dt = Math.min(now - last, 64);
      last = now;

      const diff = targetRef.current - posRef.current;
      if (Math.abs(diff) < SETTLE_EPSILON) {
        posRef.current = targetRef.current;
      } else {
        // Frame-rate independent easing (same feel at 60 Hz and 120 Hz).
        posRef.current +=
          diff * (1 - Math.pow(1 - EASE_PER_FRAME, dt / FRAME_MS));
      }

      layout(posRef.current);

      if (posRef.current !== targetRef.current) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        // Offsets are ring-based, so wrapping the position is visually a no-op.
        const n = cfgRef.current.count;
        if (n) targetRef.current = posRef.current = wrap(targetRef.current, n);
      }
    };
    rafRef.current = requestAnimationFrame(step);
  }, [layout]);

  const goTo = useCallback(
    (rawIndex) => {
      const n = cfgRef.current.count;
      if (!n) return;
      const idx = wrap(rawIndex, n);
      targetRef.current += ringOffset(idx - targetRef.current, n);
      if (idx !== activeRef.current) {
        activeRef.current = idx;
        setActive(idx);
      }
      startAnimation();
    },
    [startAnimation],
  );

  const navigateBy = useCallback(
    (step) => {
      goTo(Math.round(targetRef.current) + step);
    },
    [goTo],
  );

  const expandActive = useCallback(() => {
    const idx = activeRef.current;
    if (data[idx]) onExpand?.(data[idx]);
  }, [data, onExpand]);

  const stepPx = () =>
    Math.max(cfgRef.current.cardWidth * 0.55 * scaleRef.current, 50);

  const onPointerDown = useCallback((e) => {
    if (
      cfgRef.current.count < 2 ||
      (e.pointerType === "mouse" && e.button !== 0) ||
      e.target.closest("button, .depth-carousel__dots, .depth-carousel__arrow")
    )
      return;
    cancelAnimationFrame(rafRef.current);
    targetRef.current = posRef.current;
    dragRef.current = {
      active: true,
      moved: false,
      id: e.pointerId,
      startX: e.clientX,
      lastX: e.clientX,
      startPos: posRef.current,
      lastT: performance.now(),
      v: 0,
    };
  }, []);

  const onPointerMove = useCallback(
    (e) => {
      const drag = dragRef.current;
      if (!drag.active || e.pointerId !== drag.id) return;

      if (!drag.moved) {
        if (Math.abs(e.clientX - drag.startX) <= DRAG_THRESHOLD) return;
        drag.moved = true;
        drag.startX = e.clientX;
        setIsDragging(true);
        // Capture only after a real drag, so plain taps still reach the cards.
        rootRef.current?.setPointerCapture(e.pointerId);
      }

      const now = performance.now();
      drag.v = (e.clientX - drag.lastX) / Math.max(now - drag.lastT, 1);
      drag.lastX = e.clientX;
      drag.lastT = now;

      targetRef.current = posRef.current =
        drag.startPos - (e.clientX - drag.startX) / stepPx();
      layout(posRef.current);
    },
    [layout],
  );

  const onPointerUp = useCallback(
    (e) => {
      const drag = dragRef.current;
      if (!drag.active || e.pointerId !== drag.id) return;
      drag.active = false;
      if (!drag.moved) {
        // A tap interrupted an animation; resume it.
        goTo(activeRef.current);
        return;
      }
      setIsDragging(false);
      goTo(Math.round(targetRef.current - (drag.v * FLING_MS) / stepPx()));
    },
    [goTo],
  );

  const onPointerLeave = useCallback(
    (e) => {
      // Without capture (no drag yet), a pointer that leaves never sends pointerup here.
      if (dragRef.current.active && !dragRef.current.moved) onPointerUp(e);
    },
    [onPointerUp],
  );

  const onKeyDown = useCallback(
    (e) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        navigateBy(e.key === "ArrowLeft" ? -1 : 1);
      } else if (
        (e.key === "Enter" || e.key === " ") &&
        e.target === rootRef.current
      ) {
        e.preventDefault();
        expandActive();
      }
    },
    [navigateBy, expandActive],
  );

  const onCardClick = useCallback(
    (index) => {
      if (dragRef.current.moved) return;
      if (index === activeRef.current) expandActive();
      else goTo(index);
    },
    [goTo, expandActive],
  );

  // Sync config before paint so the first frame is already laid out.
  useLayoutEffect(() => {
    cfgRef.current = {
      count,
      depth,
      spread,
      visibleCards,
      blur,
      cardWidth,
      cardHeight,
    };
    layout(posRef.current);
  }, [count, depth, spread, visibleCards, blur, cardWidth, cardHeight, layout]);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    reducedRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    // Animated blur is too expensive for touch GPUs; keep it for desktop pointers only.
    blurEnabledRef.current = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
    filterCache.current = [];
    layout(posRef.current);
  }, [layout]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const {
        cardWidth: cw,
        cardHeight: ch,
        spread: s,
        count: n,
        visibleCards: vc,
      } = cfgRef.current;
      const sides = visibleFor(n, vc) - 1;
      const fitWidth = width / (cw + Math.abs(s) * 2 * sides + 40);
      const fitHeight = (height - 90) / ch;
      scaleRef.current = clamp(Math.min(fitWidth, fitHeight), 0.4, 1.1);
      layout(posRef.current);
    });
    ro.observe(root);
    return () => ro.disconnect();
  }, [layout]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !autoplay || count < 2 || reducedRef.current) return;

    let hovered = false;
    let inView = false;
    const onEnter = () => {
      hovered = true;
    };
    const onLeave = () => {
      hovered = false;
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
      },
      { threshold: 0.15 },
    );

    io.observe(root);
    root.addEventListener("mouseenter", onEnter);
    root.addEventListener("mouseleave", onLeave);
    const timer = setInterval(
      () => {
        if (
          inView &&
          !hovered &&
          !document.hidden &&
          !pausedRef.current &&
          !dragRef.current.active
        )
          navigateBy(1);
      },
      Math.max(autoplayDelay, 1200),
    );

    return () => {
      clearInterval(timer);
      io.disconnect();
      root.removeEventListener("mouseenter", onEnter);
      root.removeEventListener("mouseleave", onLeave);
    };
  }, [autoplay, autoplayDelay, count, navigateBy]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return {
    data,
    count,
    active,
    isDragging,
    rootRef,
    cardRefs,
    goTo,
    navigateBy,
    onCardClick,
    rootHandlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
      onPointerLeave,
      onKeyDown,
    },
  };
};
