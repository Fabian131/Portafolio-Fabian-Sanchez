import React, { useRef, useMemo } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Github, Linkedin, GmailIcon } from '../atoms/Icons';

const ICON_SIZE = 52;
const MAG_RANGE = 140;
const MAG_SCALE = 1.5;

const DockItem = ({ item, mouseX, index, isMobile }) => {
  const ref = useRef(null);
  
  // Choose icon based on iconKey
  const iconMap = {
    github: <Github size={28} />,
    linkedin: <Linkedin size={28} />,
    email: <GmailIcon size={28} />,
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
        className="pointer-events-none absolute -top-10 rounded-lg px-3 py-1.5 text-xs font-medium text-white/90 opacity-0 group-hover:opacity-100 dark:text-white"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          transition: 'opacity 0.15s',
        }}
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
        className="flex items-center justify-center rounded-[14px] bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 group-hover:border-cyan-500/30 transition-colors hover:shadow-[0_0_15px_rgba(14,165,233,0.15)] text-gray-700 dark:text-gray-300 group-hover:text-cyan-500"
      >
        <span className="flex items-center justify-center pointer-events-none">
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
        className="relative isolate mx-auto flex items-end gap-3 rounded-[24px] px-5 pb-3 pt-3"
        style={{
          background: 'rgba(255, 255, 255, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
        }}
      >
        {/* Dark mode background adjustment classes */}
        <div className="absolute inset-0 z-[-1] rounded-[24px] bg-white/40 dark:bg-[#0f111a]/50 backdrop-blur-md" />
        
        {items.map((item, i) => (
          <DockItem key={item.name} item={item} mouseX={mouseX} index={i} isMobile={isMobile} />
        ))}
      </motion.div>
    </div>
  );
};

export default GlassDock;
