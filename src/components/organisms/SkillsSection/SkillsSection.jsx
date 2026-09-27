import React, { memo } from 'react';
import { Wrench, Server, Layout } from 'lucide-react';
import ScrollReveal from '../../atoms/layout/ScrollReveal/ScrollReveal';
import DraggableMarquee from '../../molecules/DraggableMarquee/DraggableMarquee';
import SectionHeader from '../../molecules/SectionHeader/SectionHeader';
import { useSkillsSection } from '../../../hooks/useSkillsSection';

const SkillsSection = memo((props) => {
  const { t, skills, performanceTier } = useSkillsSection(props);

  return (
    <section id="skills" className="min-h-screen py-20 md:py-24 px-5 sm:px-6 max-w-6xl mx-auto w-full overflow-x-hidden">
      <SectionHeader
        icon={Wrench}
        title={t('skills.title')}
      />

      <div className="mb-16">
        <ScrollReveal direction="up" delay={200}>
           <h3 className="text-xl sm:text-2xl font-bold flex items-center justify-center gap-2 text-cyan-600 dark:text-cyan-500 mb-6"><Server /> {t('skills.backend')}</h3>
        </ScrollReveal>
        <ScrollReveal direction="up" delay={300}>
          <div className="w-screen relative left-1/2 -translate-x-1/2">
            <DraggableMarquee
              items={skills.backend}
              direction="left"
              color="cyan"
              performanceTier={performanceTier}
            />
          </div>
        </ScrollReveal>
      </div>

      <div className="mb-16">
        <ScrollReveal direction="up" delay={400}>
           <h3 className="text-xl sm:text-2xl font-bold flex items-center justify-center gap-2 text-purple-600 dark:text-purple-500 mb-6"><Layout /> {t('skills.frontend')}</h3>
        </ScrollReveal>
        <ScrollReveal direction="up" delay={500}>
          <div className="w-screen relative left-1/2 -translate-x-1/2">
            <DraggableMarquee
              items={skills.frontend}
              direction="right"
              color="purple"
              performanceTier={performanceTier}
            />
          </div>
        </ScrollReveal>
      </div>

      <div className="mb-16">
        <ScrollReveal direction="up" delay={600}>
           <h3 className="text-xl sm:text-2xl font-bold flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-500 mb-6"><Wrench /> {t('skills.devops')}</h3>
        </ScrollReveal>
        <ScrollReveal direction="up" delay={700}>
          <div className="w-screen relative left-1/2 -translate-x-1/2">
            <DraggableMarquee
              items={skills.devops}
              direction="left"
              color="emerald"
              performanceTier={performanceTier}
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
});

SkillsSection.displayName = 'SkillsSection';

export default SkillsSection;