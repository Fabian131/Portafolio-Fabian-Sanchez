import { useMemo } from 'react';
import { useTranslation } from './useTranslation';

export const useFooter = () => {
  const { t } = useTranslation();
  
  const copyrightText = useMemo(() => {
    const year = new Date().getFullYear();
    return t('footer.copyright', { year });
  }, [t]);

  return {
    copyrightText
  };
};
