import { useState, useCallback, useMemo } from 'react';
import { useTranslation } from './useTranslation';

const getYouTubeId = (url) => {
  if (!url || url === 'YOUTUBE_URL_AQUI') return null;
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
};

export const useProjectCard = ({ project }) => {
  const { t } = useTranslation();
  const { projectKey, title, description, tags, imageUrl, videoUrl } = project;
  const [isPlaying, setIsPlaying] = useState(false);
  
  const transTitle = useMemo(() => t(`projects.${projectKey || ''}.title`) || title, [t, projectKey, title]);
  const transDesc = useMemo(() => t(`projects.${projectKey || ''}.description`) || description, [t, projectKey, description]);

  const videoId = useMemo(() => getYouTubeId(videoUrl), [videoUrl]);
  const hasVideo = videoId !== null;

  const handlePlay = useCallback(() => setIsPlaying(true), []);

  return {
    t,
    transTitle,
    transDesc,
    tags,
    imageUrl,
    videoId,
    hasVideo,
    isPlaying,
    handlePlay
  };
};
