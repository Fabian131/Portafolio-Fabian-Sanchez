import React, { memo } from 'react';
import { useFooter } from '../../../hooks/useFooter';

const Footer = memo(() => {
  const { copyrightText } = useFooter();

  return (
    <footer className="py-12 text-center text-zinc-600 dark:text-zinc-400 relative z-10 w-full border-t border-zinc-200 dark:border-white/5">
      <p>{copyrightText}</p>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;