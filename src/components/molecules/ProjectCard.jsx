import React, { memo, useState, useCallback } from 'react';
import { ExternalLink, Play } from 'lucide-react';
import { YoutubeIcon } from '../atoms/Icons';
import GlassCard from '../atoms/GlassCard';

const getYouTubeId = (url) => {
  if (!url || url === 'YOUTUBE_URL_AQUI') return null;
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
};

const ProjectCard = memo(({ project }) => {
  const { title, description, tags, link, imageUrl, videoUrl } = project;
  const [isPlaying, setIsPlaying] = useState(false);

  const videoId = getYouTubeId(videoUrl);
  const hasVideo = videoId !== null;
  const hasLink = link && link !== '#';

  const handlePlay = useCallback(() => setIsPlaying(true), []);

  return (
    <GlassCard tilt={true} className="p-3 sm:p-4 flex flex-col gap-3 sm:gap-4 cursor-pointer h-full border-t border-t-cyan-500/30">
      <div className="w-full h-28 sm:h-32 lg:h-36 rounded-xl overflow-hidden relative group-hover:shadow-[0_0_30px_rgba(14,165,233,0.3)] transition-shadow duration-500">
        {hasVideo && isPlaying ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={title}
          />
        ) : hasVideo ? (
          <>
            <img
              src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
              loading="lazy"
            />
            <button
              onClick={handlePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors z-10 cursor-pointer"
              aria-label="Reproducir video"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 dark:bg-white/20 backdrop-blur flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                <Play size={20} className="sm:w-5 sm:h-5 text-zinc-900 dark:text-white ml-0.5" fill="currentColor" />
              </div>
            </button>
            <div className="absolute inset-0 bg-gradient-to-t from-white/90 dark:from-[#0f111a]/90 to-transparent opacity-70 transition-opacity group-hover:opacity-40 pointer-events-none"></div>
            <h3 className="text-base sm:text-lg font-semibold absolute bottom-2 sm:bottom-3 left-3 right-3 drop-shadow-lg text-zinc-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 group-hover:-translate-y-1 transition-all duration-300 pointer-events-none">{title}</h3>
          </>
        ) : (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700"
              style={{ backgroundImage: `url('${imageUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop'}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/90 dark:from-[#0f111a]/90 to-transparent opacity-90 transition-opacity group-hover:opacity-60"></div>
            <h3 className="text-base sm:text-lg font-semibold absolute bottom-2 sm:bottom-3 left-3 right-3 drop-shadow-lg text-zinc-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 group-hover:-translate-y-1 transition-all duration-300">{title}</h3>
          </>
        )}
      </div>
      <div className="flex-1 flex flex-col">
        {(hasVideo || hasLink) && (
          <div className="flex items-center gap-2 mb-2">
            {hasVideo && (
              <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="text-red-500 hover:text-red-400 transition-colors" aria-label="Ver en YouTube">
                <YoutubeIcon size={16} />
              </a>
            )}
            {hasLink && (
              <a href={link} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-cyan-500 transition-colors" aria-label="Ver proyecto">
                <ExternalLink size={16} />
              </a>
            )}
          </div>
        )}

        <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mb-3 sm:mb-4 flex-1 leading-relaxed line-clamp-3">
          {description}
        </p>

        <div className="flex flex-wrap gap-1.5 text-[10px] sm:text-xs font-medium mt-auto">
          {tags.map((tag) => (
            <span key={tag.label || tag} className="px-2 py-1 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20">{typeof tag === 'string' ? tag : tag.label}</span>
          ))}
        </div>
      </div>
    </GlassCard>
  );
});

ProjectCard.displayName = 'ProjectCard';

export default ProjectCard;

