import React, { memo } from 'react';
import { ExternalLink } from 'lucide-react';
import GlassCard from './GlassCard';
import PretextParagraph from '../atoms/PretextParagraph';

const ProjectCard = memo(({ project, theme }) => {
  const { title, description, tags, link } = project;

  return (
    <GlassCard tilt={true} className="p-6 flex flex-col gap-6 cursor-pointer h-full border-t border-t-cyan-500/30">
      <div className="w-full h-40 sm:h-52 md:h-64 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center overflow-hidden relative group-hover:shadow-[0_0_30px_rgba(14,165,233,0.3)] transition-shadow duration-500">
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700"></div>
         <div className="absolute inset-0 bg-gradient-to-t from-white/90 dark:from-[#0f111a]/90 to-transparent opacity-90 transition-opacity group-hover:opacity-60"></div>
         <h3 className="text-2xl sm:text-3xl font-semibold z-10 drop-shadow-lg text-zinc-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 group-hover:-translate-y-2 transition-all duration-300">{title}</h3>
      </div>
      <div className="flex-1 flex flex-col">
        <h3 className="text-2xl font-semibold mb-4 flex justify-between items-center text-zinc-900 dark:text-white">
          {title}
          <a href={link || '#'} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-cyan-500 transition-colors"><ExternalLink size={20} /></a>
        </h3>

        <PretextParagraph
          className="mb-6 flex-1"
          isDark={theme === 'dark'}
          text={description}
        />

        <div className="flex flex-wrap gap-2 text-xs font-medium mt-auto">
          {tags.map((tag) => (
            <span key={tag.label || tag} className="px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20">{typeof tag === 'string' ? tag : tag.label}</span>
          ))}
        </div>
      </div>
    </GlassCard>
  );
});

ProjectCard.displayName = 'ProjectCard';

export default ProjectCard;