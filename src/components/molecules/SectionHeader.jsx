import React, { memo } from 'react';
import ScrollReveal from '../atoms/ScrollReveal';

const SectionHeader = memo(({ icon: Icon, title, direction = 'up', delay = 0, className = '' }) => {
  return (
    <ScrollReveal direction={direction} delay={delay}>
      <h2 className={`text-3xl sm:text-4xl md:text-5xl font-extrabold mb-10 md:mb-16 tracking-tight flex items-center justify-center gap-3 ${className}`}>
        {Icon && <Icon className="text-blue-500 shrink-0" size={32} />}
        <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 dark:from-cyan-400 dark:via-blue-500 dark:to-purple-500 text-gradient-animated text-transparent bg-clip-text pb-1">
          {title}
        </span>
      </h2>
    </ScrollReveal>
  );
});

SectionHeader.displayName = 'SectionHeader';

export default SectionHeader;