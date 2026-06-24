import React, { memo } from 'react';
import ScrollReveal from '../atoms/ScrollReveal';
import LiquidNav from '../molecules/LiquidNav';

const Navbar = memo(({ activeSection, toggleTheme, isDark, onNavClick }) => {
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full px-4 flex justify-center">
      <ScrollReveal direction="down" delay={200}>
        <LiquidNav activeSection={activeSection} toggleTheme={toggleTheme} isDark={isDark} onNavClick={onNavClick} />
      </ScrollReveal>
    </div>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;
