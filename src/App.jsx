import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Mail, ChevronDown } from 'lucide-react';
import { GooeyButton } from './components/atoms/GooeyButton';
import { Github, Linkedin, JavaIcon, SpringBootIcon, PhpIcon, LaravelIcon, NodeJsIcon, CppIcon, PostgresqlIcon, MysqlIcon, DockerIcon, GitIcon, GithubIcon, LinuxIcon, JavaScriptIcon, ReactIcon, TailwindIcon, ReactNativeIcon, BootstrapIcon, BashIcon, HtmlIcon, CssIcon, JsonIcon } from './components/atoms/Icons';
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
    { name: 'Java', icon: <JavaIcon size={24} /> },
    { name: 'Spring Boot', icon: <SpringBootIcon size={24} /> },
    { name: 'PHP', icon: <PhpIcon size={24} /> },
    { name: 'Laravel', icon: <LaravelIcon size={24} /> },
    { name: 'Node.js', icon: <NodeJsIcon size={24} /> },
    { name: 'C++', icon: <CppIcon size={24} /> },
    { name: 'PostgreSQL', icon: <PostgresqlIcon size={24} /> },
    { name: 'MySQL', icon: <MysqlIcon size={24} /> },
  ],
  frontend: [
    { name: 'HTML5', icon: <HtmlIcon size={24} /> },
    { name: 'CSS3', icon: <CssIcon size={24} /> },
    { name: 'JavaScript', icon: <JavaScriptIcon size={24} /> },
    { name: 'React', icon: <ReactIcon size={24} /> },
    { name: 'React Native', icon: <ReactNativeIcon size={24} /> },
    { name: 'Tailwind', icon: <TailwindIcon size={24} /> },
    { name: 'Bootstrap', icon: <BootstrapIcon size={24} /> },
    { name: 'JSON', icon: <JsonIcon size={24} /> },
  ],
  devops: [
    { name: 'Docker', icon: <DockerIcon size={24} /> },
    { name: 'Git', icon: <GitIcon size={24} /> },
    { name: 'GitHub', icon: <GithubIcon size={24} /> },
    { name: 'Linux', icon: <LinuxIcon size={24} /> },
    { name: 'Bash', icon: <BashIcon size={24} /> },
    { name: 'Scrum', icon: <span className="text-cyan-500" size={24}>&#9899;</span> },
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
    { name: 'GitHub', href: 'https://github.com/Fabian131', icon: <Github size={20} /> },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/in/fabian-sanchez-salinas-270862361/', icon: <Linkedin size={20} /> },
    { name: 'Email', href: 'mailto:fabian.sanchez.salinas@est.una.ac.cr', icon: <Mail size={20} /> },
  ], []);

  const handleCVDownload = useCallback(() => {
    window.open('/cv.pdf', '_blank');
  }, []);

  if (!isMounted) return null;

  return (
    <div className={`min-h-screen font-sans text-gray-900 dark:text-white bg-[#f8fafc] dark:bg-[#03050a] transition-colors duration-700 ease-in-out selection:bg-cyan-500/30 relative`}>

      <div
        ref={cursorGlowRef}
        className="pointer-events-none fixed inset-0 z-[1] h-full w-full bg-[radial-gradient(circle_at_var(--mouse-x,_0)_var(--mouse-y,_0),rgba(14,165,233,0.15)_0%,transparent_50%)] transition-opacity duration-700"
      ></div>

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

      <style dangerouslySetInnerHTML={{__html: `
html { scroll-behavior: smooth; }

        :root {
          --c-glass: #bbbbbc;
          --c-light: #fff;
          --c-dark: #000;
          --c-content: #2a2a35;
          --c-action: #0ea5e9;
          --glass-reflex-dark: 1;
          --glass-reflex-light: 1;
          --saturation: 150%;
        }

        html.dark {
          --c-content: #e1e1e1;
          --c-action: #38bdf8;
          --glass-reflex-dark: 2;
          --glass-reflex-light: 0.3;
          --c-glass: #bbbbbc;
          --saturation: 150%;
        }

        @keyframes animated-gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .text-gradient-animated {
          background-size: 200% 200%;
          animation: animated-gradient 6s linear infinite;
        }

        @keyframes sketchStroke {
          0% {
            stroke-dashoffset: 20;
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            stroke-dashoffset: 4;
            opacity: 0;
          }
        }

        .sketch-lines.animate .sketch-line,
        .sketch-lines.animate .sketch-line-blur {
          animation: sketchStroke 0.8s ease-out forwards;
        }

        .sketch-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .sketch-card:hover {
          transform: scale(1.02);
        }

        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }

        .mobile-nav-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 20px;
          border-radius: 99em;
          min-height: 48px;
          background-color: color-mix(in srgb, var(--c-glass, #bbbbbc) 18%, transparent);
          backdrop-filter: blur(16px) saturate(150%);
          -webkit-backdrop-filter: blur(16px) saturate(150%);
          box-shadow: 0px 6px 16px 0px rgba(0,0,0,0.15);
          gap: 12px;
        }

        .mobile-nav-theme {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--c-content, #2a2a35);
          padding: 6px;
          display: flex;
          align-items: center;
        }

        .mobile-nav-title {
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--c-content, #2a2a35);
          letter-spacing: 0.3px;
        }

        .mobile-nav-hamburger {
          background: none;
          border: none;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 6px;
        }

        .hamburger-line {
          display: block;
          width: 20px;
          height: 2px;
          background: var(--c-content, #2a2a35);
          border-radius: 2px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: center;
        }

        .mobile-nav-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          right: 0;
          border-radius: 20px;
          background-color: color-mix(in srgb, var(--c-glass, #bbbbbc) 24%, transparent);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          box-shadow: 0px 12px 32px 0px rgba(0,0,0,0.2);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .mobile-nav-closed {
          opacity: 0;
          transform: translateY(-10px);
          pointer-events: none;
          max-height: 0;
          padding: 0;
        }

        .mobile-nav-open {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
          max-height: 300px;
          padding: 8px 0;
        }

        .mobile-nav-item {
          padding: 14px 24px;
          font-weight: 500;
          font-size: 0.95rem;
          color: var(--c-content, #2a2a35);
          text-decoration: none;
          transition: background 0.2s, color 0.2s;
        }

        .mobile-nav-item:hover {
          background: rgba(14,165,233,0.08);
          color: var(--c-action, #0ea5e9);
        }

        .mobile-nav-active {
          color: var(--c-action, #0ea5e9);
          font-weight: 700;
          background: rgba(14,165,233,0.06);
        }

        .liquid-nav {
           display: inline-flex;
        }

        .desktop-nav-only {
          display: none !important;
        }
        @media (min-width: 768px) {
          .desktop-nav-only {
            display: inline-flex !important;
          }
        }

        .liquid-nav-container {
          position: relative;
          display: flex;
          align-items: stretch;
          margin: 0;
          padding: 8px 12px;
          border-radius: 99em;
          min-height: 56px;
          list-style: none;
          background-color: color-mix(in srgb, var(--c-glass) 18%, transparent);
          backdrop-filter: blur(16px) saturate(var(--saturation));
          -webkit-backdrop-filter: blur(16px) saturate(var(--saturation));
          box-shadow:
            inset 0 0 0 1px color-mix(in srgb, var(--c-light) calc(var(--glass-reflex-light) * 10%), transparent),
            inset 1.8px 3px 0px -2px color-mix(in srgb, var(--c-light) calc(var(--glass-reflex-light) * 90%), transparent),
            inset -2px -2px 0px -2px color-mix(in srgb, var(--c-light) calc(var(--glass-reflex-light) * 80%), transparent),
            inset -3px -8px 1px -6px color-mix(in srgb, var(--c-light) calc(var(--glass-reflex-light) * 60%), transparent),
            inset -0.3px -1px 4px 0px color-mix(in srgb, var(--c-dark) calc(var(--glass-reflex-dark) * 12%), transparent),
            inset -1.5px 2.5px 0px -2px color-mix(in srgb, var(--c-dark) calc(var(--glass-reflex-dark) * 20%), transparent),
            inset 0px 3px 4px -2px color-mix(in srgb, var(--c-dark) calc(var(--glass-reflex-dark) * 20%), transparent),
            inset 2px -6.5px 1px -4px color-mix(in srgb, var(--c-dark) calc(var(--glass-reflex-dark) * 10%), transparent),
            0px 1px 5px 0px color-mix(in srgb, var(--c-dark) calc(var(--glass-reflex-dark) * 10%), transparent),
            0px 6px 16px 0px color-mix(in srgb, var(--c-dark) calc(var(--glass-reflex-dark) * 8%), transparent);
          transition: background-color 400ms cubic-bezier(1, 0.0, 0.4, 1), box-shadow 400ms cubic-bezier(1, 0.0, 0.4, 1);
        }

        .liquid-nav-pill {
          position: absolute;
          top: 8px;
          bottom: 8px;
          left: 0;
          z-index: 0;
          border-radius: 99em;
          pointer-events: none;
          background-color: color-mix(in srgb, var(--c-glass) 36%, transparent);
          box-shadow:
            inset 0 0 0 1px color-mix(in srgb, var(--c-light) calc(var(--glass-reflex-light) * 10%), transparent),
            inset 2px 1px 0px -1px color-mix(in srgb, var(--c-light) calc(var(--glass-reflex-light) * 90%), transparent),
            inset -1.5px -1px 0px -1px color-mix(in srgb, var(--c-light) calc(var(--glass-reflex-light) * 80%), transparent),
            inset -2px -6px 1px -5px color-mix(in srgb, var(--c-light) calc(var(--glass-reflex-light) * 60%), transparent),
            inset -1px 2px 3px -1px color-mix(in srgb, var(--c-dark) calc(var(--glass-reflex-dark) * 20%), transparent),
            inset 0px -4px 1px -2px color-mix(in srgb, var(--c-dark) calc(var(--glass-reflex-dark) * 10%), transparent),
            0px 3px 6px 0px color-mix(in srgb, var(--c-dark) calc(var(--glass-reflex-dark) * 8%), transparent);
          transition: transform 550ms cubic-bezier(0.34, 1.56, 0.64, 1),
                      width 550ms cubic-bezier(0.34, 1.56, 0.64, 1),
                      scale 200ms ease-out;
          will-change: transform, width;
        }

        .liquid-nav-pill.moving {
          scale: 0.98 1.02;
          transition: transform 550ms cubic-bezier(0.34, 1.56, 0.64, 1),
                      width 550ms cubic-bezier(0.34, 1.56, 0.64, 1),
                      scale 200ms ease-in;
        }

        .liquid-nav-container li {
          display: flex;
          align-items: center;
          position: relative;
          z-index: 10;
        }

        .liquid-nav-link {
          padding: 0 18px;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 500;
          font-size: 0.96rem;
          color: var(--c-content);
          text-decoration: none;
          white-space: nowrap;
          transition: scale 200ms cubic-bezier(0.5, 0, 0, 1), color 200ms;
        }

        .liquid-nav-link.theme-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          outline: none;
          padding: 0 16px;
        }

        .liquid-nav-container li:not(.active) a:hover,
        .liquid-nav-container li:not(.active) button:hover {
          color: var(--c-action);
          scale: 1.15;
          cursor: pointer;
        }

        .liquid-nav-container li.active .liquid-nav-link {
           color: var(--c-content);
           scale: 1;
           font-weight: 700;
           cursor: default;
        }

        .blinking-cursor {
          animation: blink 1s step-end infinite;
        }

        @keyframes blink {
          50% { opacity: 0; }
        }
      `}} />
    </div>
  );
}