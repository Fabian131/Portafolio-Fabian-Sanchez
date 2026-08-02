import React, { memo, useMemo, useCallback } from 'react';
import { Mail, Send } from 'lucide-react';
import { Github, Linkedin, GmailIcon } from '../atoms/Icons';
import ScrollReveal from '../atoms/ScrollReveal';
import GlassCard from '../atoms/GlassCard';
import BlobButton from '../atoms/BlobButton';
import MagneticButton from '../atoms/MagneticButton';
import { PROSE_CLASS } from '../../utils/typography';
import { useTranslation } from '../../hooks/useTranslation';

const ContactSection = memo(({ socialLinks, theme }) => {
  const { t } = useTranslation();
  const iconMap = useMemo(() => ({
    github: <Github size={36} />,
    linkedin: <Linkedin size={36} />,
    email: <GmailIcon size={36} />,
  }), []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
  }, []);

  return (
    <section id="contacto" className="min-h-screen py-20 md:py-24 px-5 sm:px-6 max-w-4xl lg:max-w-6xl mx-auto flex flex-col justify-center w-full">
      <ScrollReveal direction="up">
         <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-10 md:mb-16 tracking-tight flex items-center justify-center gap-3">
           <Mail className="text-cyan-500 shrink-0" size={32} />
           <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 dark:from-cyan-400 dark:via-blue-500 dark:to-purple-500 text-gradient-animated text-transparent bg-clip-text pb-1">
             {t('contact.title')}
           </span>
         </h2>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <ScrollReveal direction="left" delay={200} className="space-y-8">

          <p className={`${PROSE_CLASS} text-center`}>
            {t('contact.description')}
          </p>

          <div className="flex flex-wrap gap-4 sm:gap-6">
            {socialLinks.map((link) => (
              <MagneticButton key={link.name}>
                <a href={link.href} target="_blank" rel="noopener noreferrer" className="block group w-max">
                  <div className="p-3 sm:p-4 flex items-center justify-center rounded-xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 group-hover:border-cyan-500/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(14,165,233,0.15)] text-gray-700 dark:text-gray-300 group-hover:text-cyan-500">
                    <div className="group-hover:scale-110 transition-transform duration-300">
                      {iconMap[link.iconKey]}
                    </div>
                  </div>
                </a>
              </MagneticButton>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal direction="right" delay={400}>
          <GlassCard tilt={true} className="p-6 lg:p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('contact.name')}</label>
                <input type="text" id="name" className="w-full px-4 py-3.5 rounded-xl bg-white/60 dark:bg-[#03050a]/50 border border-gray-300 dark:border-white/10 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all text-base text-gray-900 dark:text-white" placeholder={t('contact.namePlaceholder')} required />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('contact.email')}</label>
                <input type="email" id="email" className="w-full px-4 py-3.5 rounded-xl bg-white/60 dark:bg-[#03050a]/50 border border-gray-300 dark:border-white/10 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all text-base text-gray-900 dark:text-white" placeholder={t('contact.emailPlaceholder')} required />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('contact.message')}</label>
                <textarea id="message" rows="4" className="w-full px-4 py-3.5 rounded-xl bg-white/60 dark:bg-[#03050a]/50 border border-gray-300 dark:border-white/10 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all resize-y text-base text-gray-900 dark:text-white min-h-[44px]" placeholder={t('contact.messagePlaceholder')} required></textarea>
              </div>
              <BlobButton darkTheme={theme === 'dark'} onClick={handleSubmit}>
                {t('contact.send')} <Send size={18} />
              </BlobButton>
            </form>
          </GlassCard>
        </ScrollReveal>
      </div>
    </section>
  );
});

ContactSection.displayName = 'ContactSection';

export default ContactSection;
