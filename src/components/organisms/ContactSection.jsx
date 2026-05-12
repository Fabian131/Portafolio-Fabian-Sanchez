import React, { memo } from 'react';
import { Mail, Send } from 'lucide-react';
import ScrollReveal from '../atoms/ScrollReveal';
import GlassCard from '../molecules/GlassCard';
import PretextParagraph from '../atoms/PretextParagraph';
import BlobButton from '../atoms/BlobButton';
import MagneticButton from '../atoms/MagneticButton';

const ContactSection = memo(({ socialLinks, theme }) => {
  return (
    <section id="contacto" className="min-h-screen py-20 md:py-24 px-5 sm:px-6 max-w-4xl mx-auto flex flex-col justify-center w-full">
      <ScrollReveal direction="up">
         <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-10 md:mb-16 tracking-tight flex items-center justify-center gap-3">
           <Mail className="text-cyan-500 shrink-0" size={32} />
           <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 dark:from-cyan-400 dark:via-blue-500 dark:to-purple-500 text-gradient-animated text-transparent bg-clip-text pb-1">
             Hablemos de Código
           </span>
         </h2>
      </ScrollReveal>

      <div className="grid md:grid-cols-2 gap-12">
        <ScrollReveal direction="left" delay={200} className="space-y-8">

          <PretextParagraph
            isDark={theme === 'dark'}
            text='Busco oportunidades en entornos tecnológicos desafiantes para aplicar mis habilidades, crecer profesionalmente y contribuir con soluciones innovadoras.'
          />

          <div className="flex flex-col gap-4 sm:gap-6">
            {socialLinks.map((link) => (
              <MagneticButton key={link.name}>
                <a href={link.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 sm:gap-4 text-base sm:text-lg font-medium text-gray-800 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors group">
                  <div className="w-auto shrink-0">
                    <GlassCard tilt={true} isNavbar={true} className="w-14 h-14 sm:w-16 sm:h-16 p-0 flex items-center justify-center">
                      {link.icon}
                    </GlassCard>
                  </div>
                  <span className="group-hover:translate-x-2 transition-transform">{link.name}</span>
                </a>
              </MagneticButton>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal direction="right" delay={400}>
          <GlassCard tilt={true} className="p-8">
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nombre</label>
                <input type="text" id="name" className="w-full px-4 py-3 rounded-xl bg-white/60 dark:bg-[#03050a]/50 border border-gray-300 dark:border-white/10 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all text-sm text-gray-900 dark:text-white" placeholder="Tu nombre" required />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <input type="email" id="email" className="w-full px-4 py-3 rounded-xl bg-white/60 dark:bg-[#03050a]/50 border border-gray-300 dark:border-white/10 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all text-sm text-gray-900 dark:text-white" placeholder="tu@email.com" required />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mensaje</label>
                <textarea id="message" rows="4" className="w-full px-4 py-3 rounded-xl bg-white/60 dark:bg-[#03050a]/50 border border-gray-300 dark:border-white/10 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all resize-none text-sm text-gray-900 dark:text-white" placeholder="¿En qué te puedo ayudar?" required></textarea>
              </div>
              <BlobButton darkTheme={theme === 'dark'} onClick={(e) => e.preventDefault()}>
                Enviar Mensaje <Send size={18} />
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