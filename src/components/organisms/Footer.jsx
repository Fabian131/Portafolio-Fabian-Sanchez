import React, { memo, useState, useEffect } from 'react';

const Footer = memo(() => {
  const [year, setYear] = useState(() => new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer suppressHydrationWarning className="py-12 text-center text-zinc-500 dark:text-zinc-500 relative z-10 w-full border-t border-zinc-200 dark:border-white/5">
      <p suppressHydrationWarning>© {year} Fabián Sánchez. Universidad Nacional de Costa Rica.</p>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;