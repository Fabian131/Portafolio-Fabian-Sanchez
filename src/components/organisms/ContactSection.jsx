import React, { memo, useRef, useState, useCallback } from 'react';
import { Mail, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { Github, Linkedin, GmailIcon } from '../atoms/Icons';
import ScrollReveal from '../atoms/ScrollReveal';
import GlassCard from '../atoms/GlassCard';
import GlassDock from '../molecules/GlassDock';
import { useTranslation } from '../../hooks/useTranslation';

const ContactSection = memo(({ socialLinks, theme }) => {
  const { t } = useTranslation();
  const formRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (!formRef.current) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    // Make sure you define these variables in your .env file
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    emailjs.sendForm(serviceId, templateId, formRef.current, publicKey)
      .then((result) => {
          console.log(result.text);
          setSubmitStatus('success');
          formRef.current.reset();
      }, (error) => {
          console.error(error.text);
          setSubmitStatus('error');
      })
      .finally(() => {
        setIsSubmitting(false);
        // Hide status message after 5 seconds
        setTimeout(() => setSubmitStatus(null), 5000);
      });
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
          <form ref={formRef} className="space-y-6" onSubmit={handleSubmit} noValidate>
            
            {/* Name + Email — side by side on sm+ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="c-field">
                <label htmlFor="c-name" className="c-label">{t('contact.name') || 'Name'}</label>
                <input
                  type="text"
                  name="user_name"
                  id="c-name"
                  className="c-input"
                  placeholder={t('contact.namePlaceholder') || 'Fabián…'}
                  required
                  autoComplete="name"
                  disabled={isSubmitting}
                />
              </div>
              <div className="c-field">
                <label htmlFor="c-email" className="c-label">{t('contact.email') || 'Email'}</label>
                <input
                  type="email"
                  name="user_email"
                  id="c-email"
                  className="c-input"
                  placeholder={t('contact.emailPlaceholder') || 'you@example.com'}
                  required
                  autoComplete="email"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Subject */}
            <div className="c-field">
              <label htmlFor="c-subject" className="c-label">{t('contact.subject') || 'Subject'}</label>
              <input
                type="text"
                name="subject"
                id="c-subject"
                className="c-input"
                placeholder={t('contact.subjectPlaceholder') || 'Project idea, collaboration…'}
                disabled={isSubmitting}
              />
            </div>

            {/* Message */}
            <div className="c-field">
              <label htmlFor="c-message" className="c-label">{t('contact.message') || 'Message'}</label>
              <textarea
                name="message"
                id="c-message"
                rows={5}
                className="c-input"
                placeholder={t('contact.messagePlaceholder') || 'Tell me about your project…'}
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Footer row */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="w-full sm:w-auto text-sm h-6">
                {submitStatus === 'success' && (
                  <p className="text-green-500 dark:text-green-400 flex items-center gap-2">
                    <CheckCircle size={16} /> ¡Mensaje enviado con éxito!
                  </p>
                )}
                {submitStatus === 'error' && (
                  <p className="text-red-500 dark:text-red-400 flex items-center gap-2">
                    <AlertCircle size={16} /> Hubo un error al enviar el mensaje.
                  </p>
                )}
              </div>
              <button type="submit" className="c-submit w-full sm:w-auto justify-center" disabled={isSubmitting}>
                {isSubmitting ? 'Enviando...' : (t('contact.send') || 'Send message')}
                {isSubmitting ? <Loader2 size={14} className="ml-1 animate-spin" /> : <Send size={14} className="ml-1" />}
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
