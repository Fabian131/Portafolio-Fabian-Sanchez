import React, { memo, useRef } from 'react';
import { Send, Loader2 } from 'lucide-react';
import GlassCard from '../../atoms/GlassCard';
import { ToastContainer } from '../GlassToast';
import { useTranslation } from '../../../hooks/useTranslation';
import { useContactForm } from '../../../hooks/useContactForm';

const ContactForm = memo(() => {
  const { t } = useTranslation();
  const formRef = useRef(null);
  
  // Consumimos el hook que tiene la lógica de negocio
  const { isSubmitting, toasts, dismissToast, handleSubmit } = useContactForm();

  return (
    <>
      <GlassCard tilt={false} className="p-6 lg:p-10 border-t-2 border-t-cyan-500/20 group/inner">
        {/* Subtle inner spotlight tracking the mouse */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-0 group-hover/inner:opacity-100 transition-opacity duration-500 -z-10 rounded-[inherit]"
          style={{
            background: 'radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(14, 165, 233, 0.08), transparent 50%)'
          }}
        />
        <form ref={formRef} className="space-y-6" onSubmit={(e) => handleSubmit(e, formRef)} noValidate>
          
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
          <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-2">
            <button type="submit" className="c-submit w-full sm:w-auto justify-center" disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : (t('contact.send') || 'Send message')}
              {isSubmitting ? <Loader2 size={14} className="ml-1 animate-spin" /> : <Send size={14} className="ml-1" />}
            </button>
          </div>
        </form>
      </GlassCard>
      
      {/* Container de Toasts pertenece a la molécula del formulario */}
      <ToastContainer toasts={toasts} dismissToast={dismissToast} />
    </>
  );
});

ContactForm.displayName = 'ContactForm';

export default ContactForm;
