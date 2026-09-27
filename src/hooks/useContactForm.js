import { useState, useRef, useCallback } from 'react';
import emailjs from '@emailjs/browser';
import { useTranslation } from './useTranslation';

export const useContactForm = () => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toasts, setToasts] = useState([]);
  const idCounter = useRef(0);

  const addToast = useCallback((variant, title, description) => {
    const id = `toast-${++idCounter.current}`;
    setToasts((prev) => {
      const next = [...prev, { id, variant, title, description }];
      if (next.length > 3) return next.slice(next.length - 3);
      return next;
    });
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleSubmit = useCallback(
    (e, formRef) => {
      e.preventDefault();
      if (!formRef.current) return;

      if (!formRef.current.checkValidity()) {
        formRef.current.classList.add('was-validated');
        addToast(
          'error',
          t('contact.toast.invalidFieldsTitle') || 'Campos inválidos',
          t('contact.toast.invalidFieldsDesc') || 'Por favor, revisa los campos en rojo.'
        );
        return;
      }

      setIsSubmitting(true);

      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        console.error('Faltan credenciales de EmailJS en el archivo .env');
        addToast(
          'error',
          t('contact.toast.configErrorTitle') || 'Error de configuración',
          t('contact.toast.configErrorDesc') || 'Faltan credenciales del servidor.'
        );
        setIsSubmitting(false);
        return;
      }

      try {
        emailjs
          .sendForm(serviceId, templateId, formRef.current, publicKey)
          .then(
            (result) => {
              console.log(result.text);
              addToast(
                'success',
                t('contact.toast.successTitle') || '¡Mensaje enviado!',
                t('contact.toast.successDesc') || 'Te responderé lo antes posible.'
              );
              formRef.current.reset();
              formRef.current.classList.remove('was-validated');
            },
            (error) => {
              console.error(error.text);
              addToast(
                'error',
                t('contact.toast.sendErrorTitle') || 'Hubo un error',
                t('contact.toast.sendErrorDesc') || 'No se pudo enviar el mensaje.'
              );
            }
          )
          .finally(() => {
            setIsSubmitting(false);
          });
      } catch (err) {
        console.error(err);
        addToast(
          'error',
          t('contact.toast.unexpectedErrorTitle') || 'Hubo un error',
          t('contact.toast.unexpectedErrorDesc') || 'Error inesperado al enviar.'
        );
        setIsSubmitting(false);
      }
    },
    [addToast, t]
  );

  return {
    isSubmitting,
    toasts,
    dismissToast,
    handleSubmit,
  };
};
