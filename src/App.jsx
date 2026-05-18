import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Mail, ChevronDown } from 'lucide-react';
import { GooeyButton } from './components/atoms/GooeyButton';
import { Github, Linkedin, JavaIcon, SpringBootIcon, PhpIcon, LaravelIcon, NodeJsIcon, CppIcon, PostgresqlIcon, MysqlIcon, DockerIcon, GitIcon, GithubIcon, LinuxIcon, JavaScriptIcon, ReactIcon, TailwindIcon, ReactNativeIcon, BootstrapIcon, BashIcon, HtmlIcon, CssIcon, JsonIcon, ScrumIcon, GmailIcon } from './components/atoms/Icons';
import MagneticButton from './components/atoms/MagneticButton';
import ScrollReveal from './components/atoms/ScrollReveal';
import BlobButton from './components/atoms/BlobButton';
import GlassCard from './components/molecules/GlassCard';
import PretextParagraph from './components/atoms/PretextParagraph';

import LiquidNav from './components/organisms/LiquidNav';
import Background3D from './components/organisms/Background3D';
import HeroSection from './components/organisms/HeroSection';
import AboutSection from './components/organisms/AboutSection';
import SkillsSection from './components/organisms/SkillsSection';
import ProjectsSection from './components/organisms/ProjectsSection';
import ContactSection from './components/organisms/ContactSection';
import Footer from './components/organisms/Footer';

import { projects } from './data/projects';

const skills = {
  backend: [
    { name: 'Java', icon: <JavaIcon size={32} /> },
    { name: 'Spring Boot', icon: <SpringBootIcon size={32} /> },
    { name: 'PHP', icon: <PhpIcon size={32} /> },
    { name: 'Laravel', icon: <LaravelIcon size={32} /> },
    { name: 'Node.js', icon: <NodeJsIcon size={32} /> },
    { name: 'C++', icon: <CppIcon size={32} /> },
    { name: 'PostgreSQL', icon: <PostgresqlIcon size={32} /> },
    { name: 'MySQL', icon: <MysqlIcon size={32} /> },
  ],
  frontend: [
    { name: 'HTML5', icon: <HtmlIcon size={32} /> },
    { name: 'CSS3', icon: <CssIcon size={32} /> },
    { name: 'JavaScript', icon: <JavaScriptIcon size={32} /> },
    { name: 'React', icon: <ReactIcon size={32} /> },
    { name: 'React Native', icon: <ReactNativeIcon size={32} /> },
    { name: 'Tailwind', icon: <TailwindIcon size={32} /> },
    { name: 'Bootstrap', icon: <BootstrapIcon size={32} /> },
    { name: 'JSON', icon: <JsonIcon size={32} /> },
  ],
  devops: [
    { name: 'Docker', icon: <DockerIcon size={32} /> },
    { name: 'Git', icon: <GitIcon size={32} /> },
    { name: 'GitHub', icon: <GithubIcon size={32} /> },
    { name: 'Linux', icon: <LinuxIcon size={32} /> },
    { name: 'Bash', icon: <BashIcon size={32} /> },
    { name: 'Scrum', icon: <ScrumIcon size={32} /> },
  ],
};

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [activeSection, setActiveSection] = useState('inicio');
  const [isMounted, setIsMounted] = useState(false);
  const cursorGlowRef = useRef(null);
  const [isManualScrolling, setIsManualScrolling] = useState(false);
  const manualScrollTimeoutRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const handleNavClick = useCallback((sectionId) => {
    setIsManualScrolling(true);
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
    const handleScroll = () => {
      clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        if (isManualScrolling) return;

        const sections = ['inicio', 'sobre-mi', 'skills', 'proyectos', 'contacto'];
        let current = '';
        sections.forEach(section => {
          const element = document.getElementById(section);
          if (element && window.scrollY >= (element.offsetTop - 300)) {
            current = section;
          }
        });
        if (current && current !== activeSection) setActiveSection(current);
      }, 16);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeoutRef.current);
      clearTimeout(manualScrollTimeoutRef.current);
    };
  }, [activeSection, isManualScrolling]);

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

      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full px-4 flex justify-center">
        <ScrollReveal direction="down" delay={200}>
          <LiquidNav activeSection={activeSection} toggleTheme={toggleTheme} isDark={theme === 'dark'} onNavClick={handleNavClick} />
        </ScrollReveal>
      </div>

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