# Performance and UX Optimization Plan

## 1. Scroll Animations (One-Time)

**File:** `src/components/atoms/ScrollReveal.jsx`

**Problem:** Animations replay when scrolling up, wasting CPU on repeated animations.

**Solution:** Use `once: true` in Framer Motion's `useInView`:
```jsx
const isInView = useInView(ref, { once: true, amount: 0.1 });
```

**Why:** Animations play only on initial viewport entry. Framer Motion detaches the observer automatically, saving memory and CPU cycles.

---

## 2. Background3D Optimization

**File:** `src/components/organisms/Background3D.jsx`

### A. Touch Device Detection
```jsx
const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
```
Disable mouse tracking on touch devices (no cursor to track anyway).

### B. GPU Frustum Culling
```jsx
geometry.computeBoundingSphere();
```
Enable built-in GPU frustum culling. Particles outside camera view are automatically culled by the GPU.

### C. Render Loop Visibility Check
```jsx
const isVisibleRef = useRef(true);

useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => { isVisibleRef.current = entry.isIntersecting; },
    { threshold: 0, rootMargin: '500px' }
  );
  observer.observe(mountRef.current);
  return () => observer.disconnect();
}, []);

const animate = (currentTime) => {
  if (!isVisibleRef.current) {
    lastRenderTime = 0;
    return;
  }
  // ... rest of animation
};
```

**Why:** When Hero is scrolled past, the canvas is covered. Cancelling the RAF loop saves CPU/GPU cycles entirely.

### D. Optimized Texture
Reduced canvas texture size from complex calculations to simple radial gradient (64x64).

---

## 3. SkillCard Performance

**File:** `src/components/molecules/SkillCard.jsx`

**Problem:** `useState` inside `memo` causes re-renders. Hover state stored in React state for each card.

**Solution:** Use CSS-only hover effects instead of React state:
```jsx
<div className="... group">
  <div className="... group-hover:opacity-100 opacity-0 ... ">
  <span className="... group-hover:text-cyan-600 ...">
```

**Why:** Zero JavaScript re-renders for hover. CSS handles it natively. Eliminated 3 `useState` calls per card.

---

## 4. DraggableMarquee Efficiency

**File:** `src/components/organisms/DraggableMarquee.jsx`

### A. Visibility-Based Pause
```jsx
const [isVisible, setIsVisible] = useState(true);

useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => setIsVisible(entry.isIntersecting),
    { threshold: 0 }
  );
  observer.observe(container);
  return () => observer.disconnect();
}, []);

useEffect(() => {
  if (!isVisible || isDragging || setWidth === 0) {
    cancelAnimationFrame(animationRef.current);
    return;
  }
  // ... animation loop
}, [isVisible, isDragging, setWidth, direction]);
```

**Why:** Animation loop only runs when the marquee is visible. Pauses when scrolled out of view.

### B. Reduced Duplication
```jsx
const duplicatedItems = useMemo(() => {
  return [...items, ...items, ...items, ...items];
}, [items]);
```
Reduced from 6x to 4x duplication (enough for seamless loop).

### C. Momentum Physics
```jsx
velocityRef.current = velocityRef.current * 0.98 + baseSpeed * 0.02;
positionRef.current += velocityRef.current;
```
Smooth, natural deceleration instead of constant speed.

### D. Touch-friendly
Passive event listeners on touch for better scroll performance.

---

## Summary of Changes

| File | Optimization | Impact |
|------|--------------|--------|
| `ScrollReveal.jsx` | `once: true` | No repeated animations |
| `Background3D.jsx` | Frustum culling + visibility pause | GPU + CPU savings |
| `SkillCard.jsx` | CSS-only hover | 0 re-renders on hover |
| `DraggableMarquee.jsx` | Visibility pause + momentum | 60fps while visible |

---

## Testing Checklist

1. **Scroll up/down** - Animations should NOT replay
2. **iPhone/Android** - Test touch interactions on marquee
3. **Scroll past Hero** - 3D should pause (check DevTools RAF)
4. **Hover on skills** - Should be instant, no flicker
5. **Drag marquee** - Should feel smooth with momentum