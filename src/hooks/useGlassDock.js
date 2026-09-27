import { useRef } from 'react';
import { useTransform, useSpring, useMotionValue } from 'framer-motion';

const BASE_ICON_SIZE = 52;
const MAG_RANGE = 140;
const MAG_SCALE = 1.5;

export const useDockItem = ({ mouseX, index, scale }) => {
  const ref = useRef(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const scaledIconSize = BASE_ICON_SIZE * scale;

  const distance = useTransform(mouseX, (mx) => {
    const el = ref.current;
    if (!el || mx < 0 || isMobile) return 200;
    const rect = el.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    return Math.abs(mx - center);
  });

  const rawSize = useTransform(distance, [0, MAG_RANGE], [scaledIconSize * MAG_SCALE, scaledIconSize]);
  const size = useSpring(rawSize, { stiffness: 400, damping: 24, mass: 0.2 });
  const y = useTransform(size, [scaledIconSize, scaledIconSize * MAG_SCALE], [0, -12]);

  return {
    ref,
    size,
    y
  };
};

export const useGlassDock = () => {
  const mouseX = useMotionValue(-200);

  const handleMouseMove = (e) => mouseX.set(e.clientX);
  const handleMouseLeave = () => mouseX.set(-200);

  return {
    mouseX,
    handleMouseMove,
    handleMouseLeave
  };
};
