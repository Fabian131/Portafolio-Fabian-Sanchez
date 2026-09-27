import React, { memo } from 'react';
import { useTranslation } from '../../hooks/useTranslation';

const Footer = memo(() => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="py-12 text-center text-zinc-600 dark:text-zinc-400 relative z-10 w-full border-t border-zinc-200 dark:border-white/5">
      <p>{t('footer.copyright', { year })}</p>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;