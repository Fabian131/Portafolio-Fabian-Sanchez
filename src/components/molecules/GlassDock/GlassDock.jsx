import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, GmailIcon, CVIcon } from '../../atoms/ui/Icons/Icons';
import { useDockItem, useGlassDock } from '../../../hooks/useGlassDock';

const DockItem = ({ item, mouseX, index, scale }) => {
  const { ref, size, y } = useDockItem({ mouseX, index, scale });
  
  // Choose icon based on iconKey
  const iconMap = {
    github: <Github size="100%" />,
    linkedin: <Linkedin size="100%" />,
    email: <GmailIcon size="100%" />,
    cv: <CVIcon size="100%" />,
  };

  return (
    <motion.a
      href={item.href}
      target={item.onClick ? undefined : "_blank"}
      rel={item.onClick ? undefined : "noopener noreferrer"}
      onClick={item.onClick ? (e) => { e.preventDefault(); item.onClick(); } : undefined}
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
        className="dock-icon-wrapper flex items-center justify-center relative rounded-[25%] border-[1.5px] border-transparent group-hover:border-white/30 dark:group-hover:border-white/40 transition-[box-shadow,border-color] duration-300 group-hover:shadow-[0_0_16px_rgba(255,255,255,0.12)] dark:group-hover:shadow-[0_0_20px_rgba(255,255,255,0.18)]"
        data-icon={item.iconKey}
      >
        <span className="absolute -top-[36.5%] -left-[36.5%] w-[173%] h-[173%] pointer-events-none flex items-center justify-center">
          {iconMap[item.iconKey]}
        </span>
      </motion.div>
    </motion.a>
  );
};

const GlassDock = ({ items, scale = 1 }) => {
  const { mouseX, handleMouseMove, handleMouseLeave } = useGlassDock();

  return (
    <div className="flex w-full justify-center py-2">
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 180, damping: 20 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        // Scaled padding proportionally based on the scale prop
        style={{
          paddingLeft: `${1.25 * scale}rem`,
          paddingRight: `${1.25 * scale}rem`,
          paddingBottom: `${0.75 * scale}rem`,
          paddingTop: `${0.75 * scale}rem`,
          gap: `${0.75 * scale}rem`,
        }}
        className="glass-dock relative isolate mx-auto flex items-end rounded-[24px]"
      >
        {items.map((item, i) => (
          <DockItem key={item.name} item={item} mouseX={mouseX} index={i} scale={scale} />
        ))}
      </motion.div>
    </div>
  );
};

export default GlassDock;
