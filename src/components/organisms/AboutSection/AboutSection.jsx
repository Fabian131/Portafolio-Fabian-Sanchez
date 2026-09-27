import React, { memo } from 'react';
import { User } from 'lucide-react';
import ScrollReveal from '../../atoms/ScrollReveal';
import DepthCarousel from '../../molecules/DepthCarousel/DepthCarousel';
import SectionHeader from '../../molecules/SectionHeader';
import { PROSE_CLASS } from '../../../utils/typography';
import { useTranslation } from '../../../hooks/useTranslation';

import img1 from '../../../assets/img/1a47c9ba-828d-4ce8-918f-0a1006de19fb.jpeg';
import img2 from '../../../assets/img/21af02dc-ff65-422f-ac65-98d939e25e3a.jpeg';
import img3 from '../../../assets/img/IMG_0158.JPG.jpeg';
import img4 from '../../../assets/img/IMG_0780.jpeg';
import img5 from '../../../assets/img/IMG_0869.jpeg';
import img6 from '../../../assets/img/IMG_0880.jpeg';
import img7 from '../../../assets/img/WhatsApp Image 2025-10-29 at 18.55.54_1f1ca100.jpg';

const carouselItems = [
  { image: img1, alt: 'Foto personal 1' },
  { image: img2, alt: 'Foto personal 2' },
  { image: img3, alt: 'Foto personal 3' },
  { image: img4, alt: 'Foto personal 4' },
  { image: img5, alt: 'Foto personal 5' },
  { image: img6, alt: 'Foto personal 6' },
  { image: img7, alt: 'Foto personal 7' },
];

const AboutSection = memo(() => {
  const { t } = useTranslation();

  return (
    <section
      id="sobre-mi"
      className="min-h-screen py-20 md:py-24 px-5 sm:px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16 w-full"
    >
      <div className="lg:w-7/12 flex justify-center w-full">
        <ScrollReveal direction="left" delay={200} className="w-full">
          <div style={{ height: '530px', position: 'relative', width: '100%', minWidth: '340px' }}>
            <DepthCarousel
              items={carouselItems}
              depth={170}
              spread={85}
              tilt={18}
              tiltDirection="right"
              perspective={1200}
              visibleCards={3}
              falloff={0.13}
              blur={5.6}
              autoplay={true}
              loop
              cardWidth={271}
              cardHeight={402}
              radius={20}
              tint="#c8cde0"
              duration={700}
              ease="power3.out"
              autoplayDelay={2100}
              showControls={false}
              showIndicators
            />
          </div>
        </ScrollReveal>
      </div>

      <div className="lg:w-5/12 space-y-6 min-w-0 text-center lg:text-left">
        <SectionHeader 
          icon={User} 
          title={t('about.title')} 
          direction="right" 
          delay={200} 
          className="mb-0! lg:justify-start" 
        />

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

