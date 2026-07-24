import React, { memo, useState, useCallback } from 'react';
import { Play } from 'lucide-react';
import GlassCard from '../atoms/GlassCard';
import { useTranslation } from '../../hooks/useTranslation';

const getYouTubeId = (url) => {
  if (!url || url === 'YOUTUBE_URL_AQUI') return null;
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
};

const ProjectCard = memo(({ project }) => {
  const { t } = useTranslation();
  const { projectKey, title, description, tags, imageUrl, videoUrl } = project;
  const [isPlaying, setIsPlaying] = useState(false);
  const pKey = projectKey || '';
  const transTitle = t(`projects.${pKey}.title`) || title;
  const transDesc = t(`projects.${pKey}.description`) || description;

  const videoId = getYouTubeId(videoUrl);
  const hasVideo = videoId !== null;

  const handlePlay = useCallback(() => setIsPlaying(true), []);

  return (
    <GlassCard tilt={true} className="flex flex-col cursor-pointer h-full min-h-[560px] border-t border-t-cyan-500/30">
      {/* Image / Video — edge-to-edge, no padding */}
      <div className="w-full aspect-video overflow-hidden relative shrink-0">
        {hasVideo && isPlaying ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={transTitle}
          />
        ) : hasVideo ? (
          <>
            <img
              src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
              alt={transTitle}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
              loading="lazy"
            />
            <button
              onClick={handlePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors z-10 cursor-pointer"
              aria-label={t('projects.playVideo')}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 dark:bg-white/20 backdrop-blur flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                <Play size={20} className="sm:w-5 sm:h-5 text-zinc-900 dark:text-white ml-0.5" fill="currentColor" />
              </div>
            </button>
          </>
        ) : (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700"
            style={{ backgroundImage: `url('${imageUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop'}')` }}
          />
        )}
      </div>

      {/* Content area — with padding */}
      <div className="flex-1 flex flex-col p-4 sm:p-5 sm:px-6">
        <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white mb-3 leading-tight">
          {transTitle}
        </h3>

        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-7 min-h-[160px] mb-4">
          {transDesc}
        </p>

        <div className="flex flex-wrap gap-2 text-[10px] sm:text-xs font-medium mt-auto min-h-[52px] content-start">
          {tags.map((tag) => (
            <span key={tag.label || tag} className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20">
              {typeof tag === 'string' ? tag : tag.label}
            </span>
          ))}
        </div>
      </div>
    </GlassCard>
  );
});

ProjectCard.displayName = 'ProjectCard';

export default ProjectCard;
