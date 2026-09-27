import { useTranslation } from './useTranslation';

export const useSkillsSection = ({ skills, performanceTier }) => {
  const { t } = useTranslation();

  return {
    t,
    skills,
    performanceTier
  };
};
