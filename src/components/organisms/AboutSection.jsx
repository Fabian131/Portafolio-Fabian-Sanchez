import React, { memo, useEffect, useRef } from 'react';
import { User, MonitorSmartphone } from 'lucide-react';
import ScrollReveal from '../atoms/ScrollReveal';
import GlassCard from '../atoms/GlassCard';
import { PROSE_CLASS } from '../../utils/typography';
import { useTranslation } from '../../hooks/useTranslation';

const AboutSection = memo(() => {
  const { t } = useTranslation();
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (!document.querySelector('script[id="model-viewer-script"]')) {
            const script = document.createElement('script');
            script.id = 'model-viewer-script';
            script.type = 'module';
            script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js';
            document.head.appendChild(script);
          }
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="sobre-mi"
      className="min-h-screen py-20 md:py-24 px-5 sm:px-6 max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16 w-full"
    >
      <div className="lg:w-5/12 flex justify-center">
        <ScrollReveal direction="left" delay={200}>
          <GlassCard
            tilt={true}
            className="p-2 w-60 h-60 sm:w-72 sm:h-72 lg:w-96 lg:h-96 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.15)] relative group flex items-center justify-center"
            tabIndex={0}
          >
            <model-viewer
              alt={t('about.laptopAlt')}
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

            <div className="absolute bottom-6 left-6 right-6 bg-white/80 dark:bg-black/60 backdrop-blur-md border border-white/40 dark:border-white/10 rounded-xl p-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 transition-all duration-500 pointer-events-none">
              <p className="text-gray-800 dark:text-white text-sm font-medium flex items-center gap-2">
                <MonitorSmartphone size={16} className="text-cyan-600 dark:text-cyan-400" /> {t('about.caption')}
              </p>
            </div>
          </GlassCard>
        </ScrollReveal>
      </div>

      <div className="lg:w-7/12 space-y-6 min-w-0">
        <ScrollReveal direction="right" delay={200}>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight flex items-center lg:justify-start justify-center gap-3">
            <User className="text-cyan-500 shrink-0" size={32} />
            <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 dark:from-cyan-400 dark:via-blue-500 dark:to-purple-500 text-gradient-animated text-transparent bg-clip-text pb-1">
              {t('about.title')}
            </span>
          </h2>
        </ScrollReveal>

        <ScrollReveal direction="right" delay={300}>
          <p className={PROSE_CLASS}>
            {t('about.p1')}
          </p>
        </ScrollReveal>

        <ScrollReveal direction="right" delay={400}>
          <p className={PROSE_CLASS}>
            {t('about.p2')}
          </p>
        </ScrollReveal>

        <ScrollReveal direction="right" delay={500}>
          <p className={PROSE_CLASS}>
            {t('about.p3')}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
});

AboutSection.displayName = 'AboutSection';

export default AboutSection;
