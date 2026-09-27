import { useMemo } from 'react';
import { useTranslation } from './useTranslation';

export const useContactSection = ({ socialLinks, onCVDownload }) => {
  const { t } = useTranslation();

  const dockItems = useMemo(() => [
    ...socialLinks,
    {
      name: t('hero.downloadCV'),
      href: '#',
      onClick: onCVDownload,
      iconKey: 'cv'
    }
  ], [socialLinks, t, onCVDownload]);

  return {
    t,
    dockItems
  };
};
