import React, { memo, useMemo } from 'react';

import { Github, Linkedin, GmailIcon } from '../atoms/Icons';
import ScrollReveal from '../atoms/ScrollReveal';
import TypeAsync from '../atoms/TypeAsync';
import GooeyButton from '../atoms/GooeyButton';
import BlobButton from '../atoms/BlobButton';
import GlassCard from '../atoms/GlassCard';
import MagneticButton from '../atoms/MagneticButton';

const HeroSection = memo(({ socialLinks, isMobile, theme, onCVDownload }) => {
  const iconMap = useMemo(() => ({
    github: <Github size={36} />,
    linkedin: <Linkedin size={36} />,
    email: <GmailIcon size={36} />,
  }), []);

  return (
    <section id="inicio" className="min-h-screen flex flex-col items-center justify-center px-4 pt-20 w-full relative">
      <div className="text-center max-w-5xl mx-auto space-y-6 relative z-10">
        <ScrollReveal direction="up" delay={100} className="mb-8">
           <div className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-44 lg:h-44 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 mx-auto shadow-[0_0_60px_rgba(14,165,233,0.3)] border-4 border-white/40 dark:border-white/10 relative p-1 group">
            <div className="w-full h-full rounded-full overflow-hidden">
                <img src="/img/photo.jpg" alt="Fabián Sánchez" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
           </div>
        </ScrollReveal>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tighter leading-tight">
          <ScrollReveal direction="up" delay={300}>
            <span className="block bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 dark:from-cyan-400 dark:via-blue-500 dark:to-purple-500 text-gradient-animated text-transparent bg-clip-text pb-2">
Fabián Sánchez
            </span>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={500}>
            <span className="block text-xl sm:text-2xl md:text-3xl lg:text-5xl mt-2 font-bold bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 dark:from-cyan-400 dark:via-blue-500 dark:to-purple-500 text-gradient-animated text-transparent bg-clip-text">
              <span className="font-light text-gray-500 dark:text-gray-400 mr-3">Full Stack</span>
              <TypeAsync words={['Developer', 'Software Engineer', 'Architect', 'Problem Solver']} />
            </span>
          </ScrollReveal>
        </h1>

        <ScrollReveal direction="up" delay={700}>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
            Estudiante de Ingeniería en Sistemas en la UNA. Construyendo aplicaciones robustas, escalables y arquitecturas de alto rendimiento con código limpio.
          </p>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={900}>
          <div className="pt-10 flex flex-col items-center justify-center gap-8">

            {isMobile ? (
              <BlobButton darkTheme={theme === 'dark'} onClick={onCVDownload}>
                Descargar CV
              </BlobButton>
            ) : (
              <GooeyButton
                text="Descargar CV"
                onClick={onCVDownload}
              />
            )}

            <div className="flex flex-wrap justify-center gap-4 mt-6">
              {socialLinks.map((link) => (
                <MagneticButton key={link.name}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.name} className="block group">
                    <div className="p-3 sm:p-4 flex items-center justify-center rounded-xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 group-hover:border-cyan-500/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(14,165,233,0.15)] text-gray-700 dark:text-gray-300 group-hover:text-cyan-500">
                      <div className="group-hover:scale-110 transition-transform duration-300">
                        {iconMap[link.iconKey]}
                      </div>
                    </div>
                  </a>
                </MagneticButton>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>


    </section>
  );
});

HeroSection.displayName = 'HeroSection';

export default HeroSection;