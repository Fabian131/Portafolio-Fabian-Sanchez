import React, { memo } from 'react';
import { User } from 'lucide-react';
import ScrollReveal from '../../atoms/layout/ScrollReveal/ScrollReveal';
import DepthCarousel from '../../molecules/DepthCarousel/DepthCarousel';
import SectionHeader from '../../molecules/SectionHeader/SectionHeader';
import { useAboutSection } from '../../../hooks/useAboutSection';
import './AboutSection.css';

const BentoPanel = ({ children, className = '', delay = 200, direction = 'up' }) => (
  <ScrollReveal direction={direction} delay={delay} className={`h-full ${className}`}>
    <div className="h-full rounded-3xl p-6 lg:p-8 about-bento-panel relative overflow-hidden group flex flex-col">
      <div className="relative z-10 flex flex-col h-full">
        {children}
      </div>
    </div>
  </ScrollReveal>
);

const AboutSection = memo(() => {
  const { t, carouselItems } = useAboutSection();

  return (
    <section
      id="about"
      className="min-h-screen py-24 px-5 sm:px-6 max-w-7xl mx-auto flex flex-col items-center w-full relative"
    >
      <div className="w-full text-center mb-16">
        <SectionHeader 
          icon={User} 
          title={t('about.title')} 
          direction="down" 
          delay={100} 
          className="mb-0 lg:justify-center" 
        />
      </div>

      {/* The Parent Grid: 12 Columns, 2 Rows on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 lg:grid-rows-[auto_1fr] gap-6 lg:gap-8 w-full items-stretch">
        
        {/* div1: Profile (Top Left, Wider: 7/12) */}
        <div className="lg:col-span-7 lg:row-span-1 lg:col-start-1 lg:row-start-1">
          <BentoPanel delay={200} direction="right">
            <div className="about-text-block">
              <div className="about-accent-line" />
              <p className="about-text">{t('about.panel1')}</p>
            </div>
          </BentoPanel>
        </div>

        {/* div2: Right Column (All remaining info, Narrower: 5/12, Spans both rows) */}
        <div className="lg:col-span-5 lg:row-span-2 lg:col-start-8 lg:row-start-1">
          <BentoPanel delay={400} direction="left" className="h-full">
            <div className="flex flex-col h-full justify-evenly gap-2">
              
              {/* Focus */}
              <div className="about-text-block">
                <div className="about-accent-line" />
                <p className="about-text">{t('about.panel2')}</p>
              </div>

              <div className="about-divider" />

              {/* Tech Stack */}
              <div className="about-text-block">
                <div className="about-accent-line" />
                <p className="about-text">{t('about.panel3')}</p>
              </div>

              <div className="about-divider" />

              {/* Soft Skills */}
              <div className="about-text-block">
                <div className="about-accent-line" />
                <p className="about-text">{t('about.panel4')}</p>
              </div>

            </div>
          </BentoPanel>
        </div>

        {/* div3: Carousel (Bottom Left, Wider: 7/12) */}
        <div className="lg:col-span-7 lg:row-span-1 lg:col-start-1 lg:row-start-2 relative min-h-112.5 w-screen left-1/2 -translate-x-1/2 lg:w-full lg:left-0 lg:translate-x-0 lg:rounded-3xl lg:overflow-hidden flex items-center justify-center">
          <ScrollReveal 
            direction="up" 
            delay={300} 
            className="absolute inset-0 w-full h-full flex items-center justify-center"
          >
            <DepthCarousel
              items={carouselItems}
              depth={150}
              spread={80}
              tilt={15}
              tiltDirection="right"
              perspective={1000}
              visibleCards={3}
              falloff={0.15}
              blur={5.6}
              autoplay={true}
              loop
              cardWidth={280}
              cardHeight={380}
              radius={24}
              tint="#c8cde0"
              duration={700}
              ease="power3.out"
              autoplayDelay={2100}
              showControls={false}
              showIndicators={false}
            />
          </ScrollReveal>
        </div>

      </div>
    </section>
  );
});

AboutSection.displayName = 'AboutSection';

export default AboutSection;

