import React, { memo } from 'react';
import { Briefcase } from 'lucide-react';
import ScrollReveal from '../../atoms/layout/ScrollReveal/ScrollReveal';
import ProjectCard from '../../molecules/ProjectCard/ProjectCard';
import SectionHeader from '../../molecules/SectionHeader/SectionHeader';
import { useProjectsSection } from '../../../hooks/useProjectsSection';

const ProjectsSection = memo((props) => {
  const { t, projects, cols } = useProjectsSection(props);

  return (
    <section id="proyectos" className="min-h-screen py-20 md:py-24 px-5 sm:px-6 max-w-[1400px] mx-auto w-full overflow-hidden">
      <SectionHeader
        icon={Briefcase}
        title={t('projects.title')}
      />

      <div
        className="projects-grid grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6"
        style={{ '--project-cols': cols }}
      >
        {projects.map((project, index) => (
          <ScrollReveal
            key={project.title}
            direction="up"
            delay={200 + (index * 200)}
            className="h-full"
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
