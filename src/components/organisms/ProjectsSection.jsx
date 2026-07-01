import React, { memo } from 'react';
import { Briefcase } from 'lucide-react';
import ScrollReveal from '../atoms/ScrollReveal';
import ProjectCard from '../molecules/ProjectCard';
import { BREAKPOINTS } from '../../utils/breakpoints';

const CARD_WIDTHS = {
  sm: 'calc((100% - 1.5rem) / 2)',
  lg: 'calc((100% - 3rem) / 3)',
  xl: 'calc((100% - 4.5rem) / 4)',
};

const ProjectsSection = memo(({ projects }) => {
  return (
    <section id="proyectos" className="min-h-screen py-20 md:py-24 px-5 sm:px-6 max-w-6xl mx-auto w-full">
      <ScrollReveal direction="up">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-10 md:mb-16 tracking-tight flex items-center justify-center gap-3">
          <Briefcase className="text-purple-500 shrink-0" size={32} />
          <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 dark:from-cyan-400 dark:via-blue-500 dark:to-purple-500 text-gradient-animated text-transparent bg-clip-text pb-1">
            Proyectos Destacados
          </span>
        </h2>
      </ScrollReveal>

      <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
        {projects.map((project, index) => (
          <ScrollReveal
            key={project.title}
            direction="up"
            delay={200 + (index * 200)}
            className="w-full sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]"
          >
            <ProjectCard project={project} />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
});

ProjectsSection.displayName = 'ProjectsSection';

export default ProjectsSection;
