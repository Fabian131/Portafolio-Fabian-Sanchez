import { useMemo } from 'react';
import { useTranslation } from './useTranslation';

export const useHeroSection = ({ socialLinks, theme, onCVDownload }) => {
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

  const roles = useMemo(() => [
    t('hero.role1'),
    t('hero.role2'),
    t('hero.role3'),
    t('hero.role4')
  ], [t]);

  return {
    t,
    theme,
    dockItems,
    roles
  };
};
