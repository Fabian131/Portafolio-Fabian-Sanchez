import React, { useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { Github, Linkedin, GmailIcon } from '../atoms/Icons';

const ICON_SIZE = 52;
const MAG_RANGE = 140;
const MAG_SCALE = 1.5;

const DockItem = ({ item, mouseX, index, isMobile }) => {
  const ref = useRef(null);
  
  // Choose icon based on iconKey
  const iconMap = {
    github: <Github size="100%" />,
    linkedin: <Linkedin size="100%" />,
    email: <GmailIcon size="100%" />,
  };

  const distance = useTransform(mouseX, (mx) => {
    const el = ref.current;
    // If mobile, or mouse is outside dock, no magnification
    if (!el || mx < 0 || isMobile) return 200;
    const rect = el.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    return Math.abs(mx - center);
  });

  const rawSize = useTransform(distance, [0, MAG_RANGE], [ICON_SIZE * MAG_SCALE, ICON_SIZE]);
  const size = useSpring(rawSize, { stiffness: 400, damping: 24, mass: 0.2 });
  const y = useTransform(size, [ICON_SIZE, ICON_SIZE * MAG_SCALE], [0, -12]);

  return (
    <motion.a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      ref={ref}
      className="group relative flex cursor-pointer flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20, delay: index * 0.03 }}
      aria-label={item.name}
    >
      {/* Tooltip */}
      <motion.div
        className="glass-dock-tooltip pointer-events-none absolute -top-10 rounded-lg px-3 py-1.5 text-xs font-medium opacity-0 group-hover:opacity-100"
      >
        {item.name}
      </motion.div>

      {/* Dock Icon Container */}
      <motion.div
        style={{
          width: size,
          height: size,
          y,
        }}
        whileTap={{ scale: 0.85 }}
        className="dock-icon-wrapper flex items-center justify-center relative rounded-[25%] border-[1.5px] border-transparent group-hover:border-cyan-500/50 transition-[box-shadow,border-color] duration-300 hover:shadow-[0_0_20px_rgba(14,165,233,0.35)]"
        data-icon={item.iconKey}
      >
        <span className="absolute -top-[36.5%] -left-[36.5%] w-[173%] h-[173%] pointer-events-none flex items-center justify-center">
          {iconMap[item.iconKey]}
        </span>
      </motion.div>
    </motion.a>
  );
};

const GlassDock = ({ items }) => {
  const mouseX = useMotionValue(-200);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className="flex w-full justify-center py-2">
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 180, damping: 20 }}
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(-200)}
        className="glass-dock relative isolate mx-auto flex items-end gap-3 rounded-[24px] px-5 pb-3 pt-3"
      >
        {items.map((item, i) => (
          <DockItem key={item.name} item={item} mouseX={mouseX} index={i} isMobile={isMobile} />
        ))}
      </motion.div>
    </div>
  );
};

export default GlassDock;

