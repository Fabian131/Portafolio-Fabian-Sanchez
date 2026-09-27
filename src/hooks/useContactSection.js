import { useTranslation } from './useTranslation';

export const useContactSection = ({ socialLinks }) => {
  const { t } = useTranslation();

  return {
    t,
    socialLinks
  };
};
