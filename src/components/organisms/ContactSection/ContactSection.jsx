import React, { memo } from 'react';
import { Mail } from 'lucide-react';
import ScrollReveal from '../../atoms/layout/ScrollReveal/ScrollReveal';
import GlassDock from '../../molecules/GlassDock/GlassDock';
import SectionHeader from '../../molecules/SectionHeader/SectionHeader';
import ContactForm from '../../molecules/ContactForm/ContactForm';
import { useContactSection } from '../../../hooks/useContactSection';

const ContactSection = memo((props) => {
  const { t, dockItems } = useContactSection(props);

  return (
    <section
      id="contact"
      className="min-h-screen py-20 md:py-28 px-5 sm:px-6 flex flex-col justify-center items-center w-full relative"
    >
      <SectionHeader icon={Mail} title={t('contact.title')} />

      <ScrollReveal direction="up" className="w-full max-w-2xl mx-auto text-center mb-8">
        <p className="text-sm text-gray-500 dark:text-gray-300 leading-relaxed">
          {t('contact.description')}
        </p>
      </ScrollReveal>

      {/* ── Social Links Bar (Glass Dock) ── */}
      <ScrollReveal direction="up" delay={150} className="w-fit mx-auto mb-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-400 mb-2">
          {t('contact.findMe') || 'Find me on'}
        </p>
        <GlassDock items={dockItems} scale={1.16} />
      </ScrollReveal>

      {/* ── Centered Form Container ── */}
      <ScrollReveal direction="up" delay={300} className="w-full max-w-2xl mx-auto relative">
        {/* Subtle ambient colorful glow behind the form */}
        <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 dark:from-cyan-500/10 dark:via-blue-500/10 dark:to-purple-500/10 blur-2xl rounded-[3rem] opacity-70 -z-10 pointer-events-none" />

        <ContactForm />
      </ScrollReveal>
    </section>
  );
});

ContactSection.displayName = 'ContactSection';

export default ContactSection;
