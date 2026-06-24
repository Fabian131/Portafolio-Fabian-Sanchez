import React, { memo } from 'react';

const Footer = memo(() => {
  const year = new Date().getFullYear();

  return (
    <footer className="py-12 text-center text-zinc-500 dark:text-zinc-500 relative z-10 w-full border-t border-zinc-200 dark:border-white/5">
      <p>© {year} Fabián Sánchez. Universidad Nacional de Costa Rica.</p>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;