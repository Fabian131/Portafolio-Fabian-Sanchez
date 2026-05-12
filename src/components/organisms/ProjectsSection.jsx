import React, { memo } from 'react';
import { Briefcase } from 'lucide-react';
import ScrollReveal from '../atoms/ScrollReveal';
import ProjectCard from '../molecules/ProjectCard';

const ProjectsSection = memo(({ projects, theme }) => {
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

      <div className="grid md:grid-cols-2 gap-12">
        {projects.map((project, index) => (
          <ScrollReveal key={project.title} direction="up" delay={200 + (index * 200)}>
            <ProjectCard project={project} theme={theme} />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
});

ProjectsSection.displayName = 'ProjectsSection';

export default ProjectsSection;