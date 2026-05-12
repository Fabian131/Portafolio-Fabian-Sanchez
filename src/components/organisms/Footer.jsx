import React, { memo } from 'react';

const Footer = memo(() => {
  return (
    <footer className="py-12 text-center text-gray-500 dark:text-gray-500 relative z-10 w-full border-t border-gray-200 dark:border-white/5">
      <p>© {new Date().getFullYear()} Fabián Sánchez. Universidad Nacional de Costa Rica.</p>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;