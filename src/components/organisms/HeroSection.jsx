import React, { memo, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { Github, Linkedin, GmailIcon } from '../atoms/Icons';
import ScrollReveal from '../atoms/ScrollReveal';
import TypeAsync from '../atoms/TypeAsync';
import GooeyButton from '../atoms/GooeyButton';
import BlobButton from '../atoms/BlobButton';
import GlassDock from '../molecules/GlassDock';
import { useTranslation } from '../../hooks/useTranslation';

const HeroSection = memo(({ socialLinks, isMobile, theme, onCVDownload }) => {
  const { t, lang } = useTranslation();

  return (
    <section id="inicio" className="min-h-screen flex flex-col items-center justify-center px-4 pt-20 w-full relative">
      <div className="text-center max-w-5xl mx-auto space-y-6 relative z-10">
        <div className="mb-8 hero-photo-reveal">
           <div className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-44 lg:h-44 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 mx-auto shadow-[0_0_60px_rgba(14,165,233,0.3)] border-4 border-white/40 dark:border-white/10 relative p-1 group">
            <div className="w-full h-full rounded-full overflow-hidden">
                <img src="/img/photo.jpg" alt={t('hero.photoAlt')} width="176" height="176" fetchPriority="high" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
           </div>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tighter leading-tight">
          <ScrollReveal direction="up" delay={300}>
            <span className="block bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 dark:from-cyan-400 dark:via-blue-500 dark:to-purple-500 text-gradient-animated text-transparent bg-clip-text pb-2">
Fabián Sánchez
            </span>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={500}>
            <span className="block text-xl sm:text-2xl md:text-3xl lg:text-5xl mt-2 font-bold bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 dark:from-cyan-400 dark:via-blue-500 dark:to-purple-500 text-gradient-animated text-transparent bg-clip-text">
              <span className="font-light text-gray-500 dark:text-gray-400 mr-3">{t('hero.fullStack')}</span>
              <TypeAsync words={[t('hero.role1'), t('hero.role2'), t('hero.role3'), t('hero.role4')]} />
            </span>
          </ScrollReveal>
        </h1>

        <ScrollReveal direction="up" delay={700}>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
            {t('hero.description')}
          </p>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={900}>
          <div className="pt-10 flex flex-col items-center justify-center gap-8">

            {isMobile ? (
              <BlobButton darkTheme={theme === 'dark'} onClick={onCVDownload}>
                {t('hero.downloadCV')}
              </BlobButton>
            ) : (
              <GooeyButton
                text={t('hero.downloadCV')}
                onClick={onCVDownload}
              />
            )}

            <div className="flex flex-wrap justify-center mt-6 w-full max-w-sm mx-auto">
              <GlassDock items={socialLinks} />
            </div>
          </div>
        </ScrollReveal>
      </div>

      <div className="absolute bottom-10 animate-bounce text-gray-400" aria-hidden="true">
        <ChevronDown size={32} />
      </div>
    </section>
  );
});

HeroSection.displayName = 'HeroSection';

export default HeroSection;