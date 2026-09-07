import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { CheckCircle, XCircle, Warning, Info, X } from '@phosphor-icons/react';

const GLASS_BLUR = {
  backdropFilter: 'blur(24px) saturate(1.8)',
  WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
};

const GLASS_PANEL = {
  background: 'rgba(255, 255, 255, 0.06)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 8px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
};

const TOAST_DURATION = 4000;

export const TOAST_VARIANTS = {
  success: { color: '#06D6A0', icon: CheckCircle, label: 'Success' },
  error: { color: '#FF5C8A', icon: XCircle, label: 'Error' },
  warning: { color: '#FFBE0B', icon: Warning, label: 'Warning' },
  info: { color: '#3A86FF', icon: Info, label: 'Info' },
};

const ENTER_SPRING = { type: 'spring', stiffness: 300, damping: 26 };

function useToastProgress(id, isPaused, onComplete) {
  const progressRef = useRef(null);
  const elapsedRef = useRef(0);
  const lastTimeRef = useRef(0);
  const rafRef = useRef(0);

  useEffect(() => {
    let alive = true;
    lastTimeRef.current = performance.now();

    function tick(now) {
      if (!alive) return;

      if (!isPaused) {
        const delta = now - lastTimeRef.current;
        elapsedRef.current += delta;
      }

      lastTimeRef.current = now;

      const fraction = Math.max(0, 1 - elapsedRef.current / TOAST_DURATION);

      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${fraction})`;
      }

      if (fraction <= 0) {
        onComplete(id);
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      alive = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [id, isPaused, onComplete]);

  return progressRef;
}

export function ToastCard({ toast, onDismiss }) {
  const [hovered, setHovered] = useState(false);
  const prefersReduced = useReducedMotion();
  const variant = TOAST_VARIANTS[toast.variant];
  const Icon = variant.icon;

  const handleComplete = useCallback(
    (id) => onDismiss(id),
    [onDismiss]
  );

  const progressRef = useToastProgress(toast.id, hovered, handleComplete);

  const enterAnim = prefersReduced ? { opacity: 0 } : { opacity: 0, x: 80, scale: 0.95 };
  const showAnim = prefersReduced ? { opacity: 1 } : { opacity: 1, x: 0, scale: 1 };
  const exitAnim = prefersReduced ? { opacity: 0 } : { opacity: 0, x: 80, scale: 0.95 };

  return (
    <motion.div
      layout
      initial={enterAnim}
      animate={{ ...showAnim, scale: hovered && !prefersReduced ? 1.01 : 1 }}
      exit={exitAnim}
      transition={ENTER_SPRING}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative w-full overflow-hidden rounded-2xl"
      style={{ ...GLASS_PANEL }}
    >
      <div className="pointer-events-none absolute inset-0 z-0 rounded-2xl" style={GLASS_BLUR} />

      <div className="relative z-10 flex items-center gap-3 py-3.5 pl-4 pr-10">
        <div
          className="flex shrink-0 items-center justify-center rounded-xl"
          style={{ width: 36, height: 36, background: `${variant.color}18`, border: `1px solid ${variant.color}22` }}
        >
          <Icon size={18} weight="regular" style={{ color: variant.color }} />
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-sm font-semibold text-white/90 font-sans">
            {toast.title}
          </span>
          {toast.description && (
            <span className="mt-0.5 truncate text-xs text-white/50 font-sans">
              {toast.description}
            </span>
          )}
        </div>
      </div>

      <motion.button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss"
        className="absolute right-0 top-1/2 z-20 flex -translate-y-1/2 cursor-pointer items-center justify-center bg-transparent"
        style={{ width: 44, height: 44, outline: 'none' }}
      >
        <motion.span
          whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.14)' }}
          whileTap={{ scale: 0.88 }}
          className="flex items-center justify-center rounded-full"
          style={{ width: 20, height: 20, background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.12)' }}
        >
          <X size={10} weight="regular" className="text-white/60" />
        </motion.span>
      </motion.button>

      <div className="absolute bottom-0 left-0 right-0 h-[2px]">
        <div ref={progressRef} className="h-full w-full origin-left" style={{ background: `${variant.color}99` }} />
      </div>
    </motion.div>
  );
}

export function ToastContainer({ toasts, dismissToast }) {
  return (
    <div className="fixed top-20 left-4 right-4 z-50 flex flex-col gap-3 sm:top-24 sm:left-auto sm:right-6 sm:w-[380px]">
      <AnimatePresence mode="popLayout" initial={false}>
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onDismiss={dismissToast} />
        ))}
      </AnimatePresence>
    </div>
  );
}
