import { useMemo } from 'react';
import { useTranslation } from './useTranslation';

export const useProjectsSection = ({ projects }) => {
  const { t } = useTranslation();
  
  const cols = useMemo(() => Math.min(projects.length, 4), [projects]);

  return {
    t,
    projects,
    cols
  };
};
