import React, { memo, useMemo, useCallback } from 'react';
import { Mail, Send } from 'lucide-react';
import { Github, Linkedin, GmailIcon } from '../atoms/Icons';
import ScrollReveal from '../atoms/ScrollReveal';
import GlassCard from '../atoms/GlassCard';
import GlassDock from '../molecules/GlassDock';
import { useTranslation } from '../../hooks/useTranslation';

const ContactSection = memo(({ socialLinks, theme }) => {
  const { t } = useTranslation();

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    // TODO: wire to a form-submission service (e.g. Formspree / EmailJS)
  }, []);

  return (
    <section
      id="contacto"
      className="min-h-screen py-20 md:py-28 px-5 sm:px-6 flex flex-col justify-center items-center w-full relative"
    >
      {/* ── Heading ── */}
      <ScrollReveal direction="up" className="w-full max-w-2xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-3 tracking-tight flex items-center justify-center gap-3">
          <Mail className="text-cyan-500 shrink-0" size={30} />
          <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 dark:from-cyan-400 dark:via-blue-500 dark:to-purple-500 text-gradient-animated text-transparent bg-clip-text pb-1">
            {t('contact.title')}
          </span>
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-300 mb-8 leading-relaxed">
          {t('contact.description')}
        </p>
      </ScrollReveal>

      {/* ── Social Links Bar (Glass Dock) ── */}
      <ScrollReveal direction="up" delay={150} className="w-fit mx-auto mb-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-400 mb-2">
          {t('contact.findMe') || 'Find me on'}
        </p>
        <GlassDock items={socialLinks} />
      </ScrollReveal>

      {/* ── Centered Form Container ── */}
      <ScrollReveal direction="up" delay={300} className="w-full max-w-2xl mx-auto relative">
        
        {/* Subtle ambient colorful glow behind the form */}
        <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 dark:from-cyan-500/10 dark:via-blue-500/10 dark:to-purple-500/10 blur-2xl rounded-[3rem] opacity-70 -z-10 pointer-events-none" />

        <GlassCard tilt={false} className="p-6 lg:p-10 border-t-2 border-t-cyan-500/20 group/inner">
          {/* Subtle inner spotlight tracking the mouse */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-0 group-hover/inner:opacity-100 transition-opacity duration-500 -z-10 rounded-[inherit]"
            style={{
              background: 'radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(14, 165, 233, 0.08), transparent 50%)'
            }}
          />
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            
            {/* Name + Email — side by side on sm+ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="c-field">
                <label htmlFor="c-name" className="c-label">{t('contact.name') || 'Name'}</label>
                <input
                  type="text"
                  id="c-name"
                  className="c-input"
                  placeholder={t('contact.namePlaceholder') || 'Fabián…'}
                  required
                  autoComplete="name"
                />
              </div>
              <div className="c-field">
                <label htmlFor="c-email" className="c-label">{t('contact.email') || 'Email'}</label>
                <input
                  type="email"
                  id="c-email"
                  className="c-input"
                  placeholder={t('contact.emailPlaceholder') || 'you@example.com'}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Subject */}
            <div className="c-field">
              <label htmlFor="c-subject" className="c-label">{t('contact.subject') || 'Subject'}</label>
              <input
                type="text"
                id="c-subject"
                className="c-input"
                placeholder={t('contact.subjectPlaceholder') || 'Project idea, collaboration…'}
              />
            </div>

            {/* Message */}
            <div className="c-field">
              <label htmlFor="c-message" className="c-label">{t('contact.message') || 'Message'}</label>
              <textarea
                id="c-message"
                rows={5}
                className="c-input"
                placeholder={t('contact.messagePlaceholder') || 'Tell me about your project…'}
                required
              />
            </div>

            {/* Footer row */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-2">
              <button type="submit" className="c-submit w-full sm:w-auto justify-center">
                {t('contact.send') || 'Send message'}
                <Send size={14} className="ml-1" />
              </button>
            </div>

          </form>
        </GlassCard>
      </ScrollReveal>

    </section>
  );
});

ContactSection.displayName = 'ContactSection';

export default ContactSection;
