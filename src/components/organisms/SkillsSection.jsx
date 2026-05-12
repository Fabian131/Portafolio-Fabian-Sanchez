import React, { memo } from 'react';
import { Wrench, Server, Layout, User } from 'lucide-react';
import ScrollReveal from '../atoms/ScrollReveal';
import DraggableMarquee from './DraggableMarquee';

const SkillsSection = memo(({ skills }) => {
  return (
    <section id="skills" className="min-h-screen py-20 md:py-24 px-5 sm:px-6 max-w-6xl mx-auto w-full">
      <ScrollReveal direction="up">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-10 md:mb-16 tracking-tight flex justify-center items-center gap-3">
          <Wrench className="text-blue-500 shrink-0" size={32} />
          <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 dark:from-cyan-400 dark:via-blue-500 dark:to-purple-500 text-gradient-animated text-transparent bg-clip-text pb-1">
            Stack Tecnológico
          </span>
        </h2>
      </ScrollReveal>

      <div className="mb-16">
        <ScrollReveal direction="up" delay={200}>
          <h3 className="text-2xl font-bold flex items-center justify-center gap-2 text-cyan-600 dark:text-cyan-500 mb-6"><Server /> Backend & Core</h3>
        </ScrollReveal>
        <ScrollReveal direction="up" delay={300}>
          <DraggableMarquee
            items={skills.backend}
            direction="left"
            color="cyan"
          />
        </ScrollReveal>
      </div>

      <div className="mb-16">
        <ScrollReveal direction="up" delay={400}>
          <h3 className="text-2xl font-bold flex items-center justify-center gap-2 text-purple-600 dark:text-purple-500 mb-6"><Layout /> Frontend & Web</h3>
        </ScrollReveal>
        <ScrollReveal direction="up" delay={500}>
          <DraggableMarquee
            items={skills.frontend}
            direction="right"
            color="purple"
          />
        </ScrollReveal>
      </div>

      <div className="mb-16">
        <ScrollReveal direction="up" delay={600}>
          <h3 className="text-2xl font-bold flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-500 mb-6"><Wrench /> DevOps & Tools</h3>
        </ScrollReveal>
        <ScrollReveal direction="up" delay={700}>
          <DraggableMarquee
            items={skills.devops}
            direction="left"
            color="emerald"
          />
        </ScrollReveal>
      </div>
    </section>
  );
});

SkillsSection.displayName = 'SkillsSection';

export default SkillsSection;