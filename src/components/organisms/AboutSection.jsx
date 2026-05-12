import React, { memo } from 'react';
import { User, MonitorSmartphone } from 'lucide-react';
import ScrollReveal from '../atoms/ScrollReveal';
import GlassCard from '../molecules/GlassCard';
import PretextParagraph from '../atoms/PretextParagraph';

const AboutSection = memo(({ theme }) => {
  return (
    <section id="sobre-mi" className="min-h-screen py-20 md:py-24 px-5 sm:px-6 max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-16 w-full">
      <div className="md:w-5/12 flex justify-center">
        <ScrollReveal direction="left" delay={200}>
          <GlassCard tilt={true} className="p-2 w-60 h-60 sm:w-72 sm:h-72 md:w-96 md:h-96 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.15)] relative group flex items-center justify-center">
             <model-viewer
                alt="laptop 3D"
                src="https://raw.githubusercontent.com/Smit-Prajapati/prajapatismit/b5f434ae4d45d10fe1664d5606ad28e4d9c739af/images/laptop.glb"
                shadow-intensity="1"
                camera-controls="true"
                touch-action="pan-y"
                environment-image="https://raw.githubusercontent.com/Smit-Prajapati/prajapatismit/b5f434ae4d45d10fe1664d5606ad28e4d9c739af/images/dancing_hall_2k.hdr"
                exposure="1.5"
                disable-zoom="true"
                disable-tap="true"
                camera-orbit="-45deg 60deg 9m"
                autoplay="true"
                style={{ width: '100%', height: '100%', '--poster-color': 'transparent' }}
             ></model-viewer>

             <div className="absolute inset-0 bg-gradient-to-tr from-cyan-600/20 to-purple-600/20 mix-blend-overlay rounded-2xl pointer-events-none"></div>

             <div className="absolute bottom-6 left-6 right-6 bg-white/80 dark:bg-black/60 backdrop-blur-md border border-white/40 dark:border-white/10 rounded-xl p-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
                <p className="text-gray-800 dark:text-white text-sm font-medium flex items-center gap-2">
                  <MonitorSmartphone size={16} className="text-cyan-600 dark:text-cyan-400" /> Ingeniería en Sistemas, UNA
                </p>
             </div>
          </GlassCard>
        </ScrollReveal>
      </div>

      <div className="md:w-7/12 space-y-6">
        <ScrollReveal direction="right" delay={200}>
           <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight flex items-center md:justify-start justify-center gap-3">
            <User className="text-cyan-500 shrink-0" size={32} />
            <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 dark:from-cyan-400 dark:via-blue-500 dark:to-purple-500 text-gradient-animated text-transparent bg-clip-text pb-1">
              Sobre Mí
            </span>
          </h2>
        </ScrollReveal>

        <ScrollReveal direction="right" delay={300}>
          <PretextParagraph
            isDark={theme === 'dark'}
            text='Estudiante de último año de Ingeniería en Sistemas de Información en la Universidad Nacional (UNA) en búsqueda de una empresa para realizar mi Práctica Profesional Supervisada (PPS). Me especializo en el desarrollo backend, con un enfoque principal en el diseño, construcción y optimización de APIs RESTful.'
          />
        </ScrollReveal>

        <ScrollReveal direction="right" delay={400}>
           <PretextParagraph
            isDark={theme === 'dark'}
            text='Mi trabajo se define por el rigor técnico y la calidad del código. Desarrollo software aplicando estrictamente los principios SOLID, la regla DRY (Do not Repeat Yourself) y patrones de diseño, garantizando arquitecturas limpias, escalables y mantenibles a largo plazo. Redacto la documentación técnica de mis proyectos y repositorios íntegramente en inglés.'
          />
        </ScrollReveal>

        <ScrollReveal direction="right" delay={500}>
           <PretextParagraph
            isDark={theme === 'dark'}
            text='Especialista en Java (Spring Boot) y PHP (Laravel). Experiencia en bases de datos PostgreSQL, SQL Server y MySQL. Manejo de Docker, CI/CD, servidores Ubuntu y HTTPS. Desarrollo móvil con Kotlin (MVVM) y React Native. Scrum Master certificado con enfoque en QA y revisión rigurosa de código. Aporto disciplina de ingeniería y capacidad para resolver problemas complejos en entornos empresariales exigentes.'
          />
        </ScrollReveal>
      </div>
    </section>
  );
});

AboutSection.displayName = 'AboutSection';

export default AboutSection;