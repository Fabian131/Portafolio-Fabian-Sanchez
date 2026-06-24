import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Github, Linkedin, GmailIcon } from './components/atoms/Icons';

import LiquidNav from './components/organisms/LiquidNav';
import Background3D from './components/atoms/Background3D';
import HeroSection from './components/organisms/HeroSection';
import AboutSection from './components/organisms/AboutSection';
import SkillsSection from './components/organisms/SkillsSection';
import ProjectsSection from './components/organisms/ProjectsSection';
import ContactSection from './components/organisms/ContactSection';
import Footer from './components/organisms/Footer';

import { projects } from './data/projects';
import { skills } from './data/skills.jsx';

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [activeSection, setActiveSection] = useState('inicio');
  const [isMounted, setIsMounted] = useState(false);
  const cursorGlowRef = useRef(null);
  const [isManualScrolling, setIsManualScrolling] = useState(false);
  const manualScrollTimeoutRef = useRef(null);
  const isManualRef = useRef(false);
  const activeSectionRef = useRef('inicio');

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const handleNavClick = useCallback((sectionId) => {
    setIsManualScrolling(true);
    isManualRef.current = true;
    clearTimeout(manualScrollTimeoutRef.current);
    setActiveSection(sectionId);
    manualScrollTimeoutRef.current = setTimeout(() => {
      setIsManualScrolling(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    if (!document.querySelector('script[id="model-viewer-script"]')) {
      const script = document.createElement('script');
      script.id = 'model-viewer-script';
      script.type = 'module';
      script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js';
      document.head.appendChild(script);
    }
  }, []);

  useEffect(() => {
    isManualRef.current = isManualScrolling;
  }, [isManualScrolling]);

  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  useEffect(() => {
    let ticking = false;

    const sections = ['inicio', 'sobre-mi', 'skills', 'proyectos', 'contacto'];

    const getCurrentSection = () => {
      let current = '';
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 300) {
            current = id;
          }
        }
      }
      return current || sections[0];
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          if (isManualRef.current) {
            ticking = false;
            return;
          }

          const current = getCurrentSection();
          if (current && current !== activeSectionRef.current) {
            setActiveSection(current);
          }
          ticking = false;
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const check = () => {
      const current = getCurrentSection();
      if (current && current !== activeSectionRef.current) {
        setActiveSection(current);
      }
    };
    setTimeout(check, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      ticking = false;
    };
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleGlobalMouseMove = (e) => {
      if (!ticking && cursorGlowRef.current) {
        ticking = true;
        requestAnimationFrame(() => {
          if (cursorGlowRef.current) {
            cursorGlowRef.current.style.setProperty('--mouse-x', `${e.clientX}px`);
            cursorGlowRef.current.style.setProperty('--mouse-y', `${e.clientY}px`);
          }
          ticking = false;
        });
      }
    };
    window.addEventListener('mousemove', handleGlobalMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, []);

  const toggleTheme = useCallback(() => setTheme(theme === 'dark' ? 'light' : 'dark'), [theme]);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const socialLinks = useMemo(() => [
    { name: 'GitHub', href: 'https://github.com/Fabian131', icon: <Github size={36} /> },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/in/fabian-sanchez-salinas-270862361/', icon: <Linkedin size={36} /> },
    { name: 'Email', href: 'mailto:fabian.sanchez.salinas@est.una.ac.cr', icon: <GmailIcon size={36} /> },
  ], []);

  const handleCVDownload = useCallback(() => {  
    window.open('/cv.pdf', '_blank');
  }, []);

  if (!isMounted) return null;

  return (
    <div className={`min-h-screen font-sans text-gray-900 dark:text-white bg-[#f8fafc] dark:bg-[#03050a] transition-colors duration-700 ease-in-out selection:bg-cyan-500/30 relative`}>

      {!isMobile && (
        <div
          ref={cursorGlowRef}
          className="pointer-events-none fixed inset-0 z-[1] h-full w-full bg-[radial-gradient(circle_at_var(--mouse-x,_0)_var(--mouse-y,_0),rgba(14,165,233,0.15)_0%,transparent_50%)] transition-opacity duration-700"
        ></div>
      )}

      <Background3D theme={theme} />

      <LiquidNav activeSection={activeSection} toggleTheme={toggleTheme} isDark={theme === 'dark'} onNavClick={handleNavClick} />

      <main className="relative z-10 w-full overflow-x-hidden">
        <HeroSection
          socialLinks={socialLinks}
          isMobile={isMobile}
          theme={theme}
          onCVDownload={handleCVDownload}
        />

        <AboutSection theme={theme} />

        <SkillsSection skills={skills} />

        <ProjectsSection projects={projects} theme={theme} />

        <ContactSection socialLinks={socialLinks} theme={theme} />

        <Footer />
      </main>

      
    </div>
  );
}