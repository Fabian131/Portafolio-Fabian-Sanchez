import { useTranslation } from './useTranslation';

export const useHeroSection = ({ socialLinks, isMobile, theme, onCVDownload }) => {
  const { t } = useTranslation();

  return {
    t,
    socialLinks,
    isMobile,
    theme,
    onCVDownload
  };
};
