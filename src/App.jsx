import React, { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import { motion, useInView } from 'framer-motion';
import { Moon, Sun, Mail, Code2, Cpu, Globe, Database, Layout, Server, Send, User, Briefcase, Wrench, ExternalLink, Download, ChevronDown, ChevronLeft, ChevronRight, MonitorSmartphone, Terminal } from 'lucide-react';
import * as THREE from 'three';
// Importamos la librerÃ­a revolucionaria de Cheng Lou
import { prepareWithSegments, layoutWithLines } from '@chenglou/pretext';
import { GooeyButton } from './components/GooeyButton';
import { Github, Linkedin, JavaIcon, SpringBootIcon, PhpIcon, LaravelIcon, NodeJsIcon, CppIcon, PostgresqlIcon, MysqlIcon, DockerIcon, GitIcon, GithubIcon, LinuxIcon, JavaScriptIcon, ReactIcon, TailwindIcon, ReactNativeIcon, BootstrapIcon, BashIcon, HtmlIcon, CssIcon, JsonIcon } from './components/atoms/Icons';
import MagneticButton from './components/atoms/MagneticButton';
import GlassCard from './components/atoms/GlassCard';
import ScrollReveal from './components/atoms/ScrollReveal';
import TypeAsync from './components/atoms/TypeAsync';
import BlobButton from './components/atoms/BlobButton';
import PretextParagraph from './components/atoms/PretextParagraph';
// --- COMPONENTE PRETEXT CORREGIDO ---
// Basado en https://github.com/chenglou/pretext

const DraggableMarquee = memo(({ items, direction = 'left', color = 'cyan' }) => {
  const trackRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const animationRef = useRef(null);
  const positionRef = useRef(0);
  const dragStartX = useRef(0);
  const dragStartPos = useRef(0);
  const [setWidth, setSetWidth] = useState(0);
  const isReady = useRef(false);
  const lastFrameTime = useRef(0);

  // 6 duplications for maximum coverage - ensures no gaps even with long drag
  const duplicatedItems = useMemo(() => [
    ...items, ...items, ...items, ...items, ...items, ...items
  ], [items]);

  const getColorClasses = useCallback((colorName) => {
    const colors = {
      cyan: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
      purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
      emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    };
    return colors[colorName] || colors.cyan;
  }, []);

  // Measure width once and set initial position for right direction
  useEffect(() => {
    if (trackRef.current && !isReady.current) {
      requestAnimationFrame(() => {
        if (trackRef.current) {
          const totalWidth = trackRef.current.scrollWidth;
          const oneSetWidth = totalWidth / 6; // 6 duplications
          setSetWidth(oneSetWidth);
          
          // For right direction, start at -setWidth so items appear from right
          if (direction === 'right') {
            positionRef.current = -oneSetWidth;
            trackRef.current.style.transform = `translate3d(${positionRef.current}px, 0, 0)`;
          }
          
          isReady.current = true;
        }
      });
    }
  }, [direction]);

  // Animation
  useEffect(() => {
    if (isDragging || setWidth === 0) {
      cancelAnimationFrame(animationRef.current);
      return;
    }

    // For right direction: we move positive but stay in negative range [-setWidth, 0]
    // This avoids the visual jump when resetting
    // Speed increased by 20% (0.75 -> 0.90)
    const speed = direction === 'left' ? -0.9 : 0.9;
    const targetFPS = 45; // Increased from 30 for smoother animation
    const frameInterval = 1000 / targetFPS;

    const animate = (timestamp) => {
      if (timestamp - lastFrameTime.current < frameInterval) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrameTime.current = timestamp;

      positionRef.current += speed;

      // Seamless reset logic
      if (direction === 'left') {
        // Range: [0, -setWidth] - moving toward negative
        if (positionRef.current <= -setWidth) {
          positionRef.current += setWidth;
        } else if (positionRef.current > 0) {
          positionRef.current -= setWidth;
        }
      } else {
        // Range: [-setWidth, 0] - moving toward positive (less negative)
        if (positionRef.current >= 0) {
          positionRef.current -= setWidth;
        } else if (positionRef.current < -setWidth) {
          positionRef.current += setWidth;
        }
      }

      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${positionRef.current}px, 0, 0)`;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isDragging, setWidth, direction]);

  const normalizePosition = useCallback((pos) => {
    let normalized = pos;
    const maxDrag = setWidth * 2; // Allow dragging up to 2 sets
    
    if (direction === 'left') {
      // Range for left: [-maxDrag, setWidth]
      while (normalized < -maxDrag) normalized += setWidth;
      while (normalized > setWidth) normalized -= setWidth;
    } else {
      // Range for right: [-setWidth - maxDrag, 0]
      // Effective range: [-3*setWidth, 0]
      while (normalized > 0) normalized -= setWidth;
      while (normalized < -maxDrag) normalized += setWidth;
    }
    return normalized;
  }, [setWidth, direction]);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartX.current = e.clientX;
    dragStartPos.current = positionRef.current;
    cancelAnimationFrame(animationRef.current);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || setWidth === 0) return;
    e.preventDefault();

    const deltaX = e.clientX - dragStartX.current;
    positionRef.current = normalizePosition(dragStartPos.current + deltaX);

    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${positionRef.current}px, 0, 0)`;
    }
  }, [isDragging, setWidth, normalizePosition]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (isDragging) setIsDragging(false);
  }, [isDragging]);

  const handleTouchStart = useCallback((e) => {
    setIsDragging(true);
    dragStartX.current = e.touches[0].clientX;
    dragStartPos.current = positionRef.current;
    cancelAnimationFrame(animationRef.current);
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!isDragging || setWidth === 0) return;
    const deltaX = e.touches[0].clientX - dragStartX.current;
    positionRef.current = normalizePosition(dragStartPos.current + deltaX);

    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${positionRef.current}px, 0, 0)`;
    }
  }, [isDragging, setWidth, normalizePosition]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const SkillCard = memo(({ skill, index }) => {
    const cardRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);

    return (
      <div 
        ref={cardRef}
        className="flex-shrink-0 relative"
        style={{ contain: 'layout style paint' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="sketch-card px-4 py-3 flex items-center gap-2.5 rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 h-full relative overflow-hidden">
          {/* Sketch lines effect - only visible on hover */}
          <div className={`sketch-lines absolute inset-0 pointer-events-none z-10 ${isHovered ? 'animate' : 'opacity-0'}`}>
            <svg className="absolute inset-0 w-full h-full dark:hidden" preserveAspectRatio="none">
              <rect x="0" y="0" width="100%" height="100%" rx="16" ry="16" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="4 8" pathLength="10" className="sketch-line"/>
            </svg>
            <svg className="absolute inset-0 w-full h-full dark:hidden" preserveAspectRatio="none" style={{ filter: 'blur(6px)' }}>
              <rect x="0" y="0" width="100%" height="100%" rx="16" ry="16" fill="none" stroke="#38bdf8" strokeWidth="4" strokeDasharray="4 8" pathLength="10" className="sketch-line-blur"/>
            </svg>
            <svg className="absolute inset-0 w-full h-full hidden dark:block" preserveAspectRatio="none">
              <rect x="0" y="0" width="100%" height="100%" rx="16" ry="16" fill="none" stroke="#c9e9ff" strokeWidth="2" strokeDasharray="4 8" pathLength="10" className="sketch-line"/>
            </svg>
            <svg className="absolute inset-0 w-full h-full hidden dark:block" preserveAspectRatio="none" style={{ filter: 'blur(8px)' }}>
              <rect x="0" y="0" width="100%" height="100%" rx="16" ry="16" fill="none" stroke="#f8fcff" strokeWidth="4" strokeDasharray="4 8" pathLength="10" className="sketch-line-blur"/>
            </svg>
          </div>
          
          <div className={`p-2 rounded-full ${getColorClasses(color)} relative z-20 transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}>
            {skill.icon}
          </div>
          <span className={`font-medium text-sm whitespace-nowrap relative z-20 transition-colors duration-300 ${isHovered ? 'text-cyan-600 dark:text-cyan-400' : 'text-gray-700 dark:text-gray-300'}`}>{skill.name}</span>
        </div>
      </div>
    );
  });

  SkillCard.displayName = 'SkillCard';

  return (
    <div 
      className="relative overflow-hidden cursor-grab active:cursor-grabbing select-none h-16"
      style={{ contain: 'layout' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        ref={trackRef} 
        className="absolute top-0 left-0 flex gap-3"
        style={{ 
          transform: 'translate3d(0, 0, 0)',
          willChange: 'transform',
          backfaceVisibility: 'hidden'
        }}
      >
        {duplicatedItems.map((skill, i) => (
          <SkillCard key={`${skill.name}-${i}`} skill={skill} index={i} />
        ))}
      </div>
    </div>
  );
});

// NAVBAR RESPONSIVE: Desktop = pill nav, Mobile = hamburger menu
const LiquidNav = memo(({ activeSection, toggleTheme, isDark, onNavClick }) => {
  const navRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const [mobileOpen, setMobileOpen] = useState(false);
  const resizeTimeoutRef = useRef(null);

  const links = useMemo(() => [
    { id: 'inicio', label: 'Inicio' },
    { id: 'sobre-mi', label: 'Sobre MÃ­' },
    { id: 'skills', label: 'Skills' },
    { id: 'proyectos', label: 'Proyectos' },
    { id: 'contacto', label: 'Contacto' }
  ], []);

  const updateIndicator = useCallback((activeId) => {
    if (!navRef.current) return;
    const activeEl = navRef.current.querySelector(`li[data-id="${activeId}"]`);
    if (!activeEl) return;
    
    setIndicatorStyle({
      left: activeEl.offsetLeft,
      width: activeEl.offsetWidth
    });
  }, []);

  useEffect(() => {
    updateIndicator(activeSection || 'inicio');
  }, [activeSection, updateIndicator]);

  useEffect(() => {
    const handleResize = () => {
      clearTimeout(resizeTimeoutRef.current);
      resizeTimeoutRef.current = setTimeout(() => {
        updateIndicator(activeSection || 'inicio');
        if (window.innerWidth >= 768) setMobileOpen(false);
      }, 150);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    setTimeout(handleResize, 150);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeoutRef.current);
    };
  }, [activeSection, updateIndicator]);

  useEffect(() => {
    const closeOnScroll = () => setMobileOpen(false);
    window.addEventListener('scroll', closeOnScroll, { passive: true });
    return () => window.removeEventListener('scroll', closeOnScroll);
  }, []);

  return (
    <>
      {/* DESKTOP NAV (hidden on mobile) */}
      <nav className="liquid-nav max-w-[95vw] overflow-x-auto hide-scrollbar desktop-nav-only">
        <ul ref={navRef} className="liquid-nav-container">
          <div 
             className="liquid-nav-pill" 
             style={{
               transform: `translateX(${indicatorStyle.left}px)`, 
               width: `${indicatorStyle.width}px` 
             }} 
          />
          
          {links.map(link => (
            <li key={link.id} data-id={link.id} className={activeSection === link.id ? 'active' : ''}>
              <a href={`#${link.id}`} onClick={(e) => { e.preventDefault(); onNavClick(link.id); document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' }); }} className="liquid-nav-link text-base">
                 {link.label}
              </a>
            </li>
          ))}
          
          <li className="theme-toggle-li">
             <button onClick={toggleTheme} className="liquid-nav-link theme-btn flex justify-center items-center h-full px-2" aria-label="Toggle Theme">
                {isDark ? <Sun size={20} className="stroke-[2.5]" /> : <Moon size={20} className="stroke-[2.5]" />}
             </button>
          </li>
        </ul>
      </nav>

      {/* MOBILE NAV (visible only on mobile) */}
      <div className="md:hidden relative">
        <div className="mobile-nav-bar">
          <button onClick={toggleTheme} className="mobile-nav-theme" aria-label="Toggle Theme">
            {isDark ? <Sun size={18} className="stroke-[2.5]" /> : <Moon size={18} className="stroke-[2.5]" />}
          </button>
          <span className="mobile-nav-title">{links.find(l => l.id === activeSection)?.label || 'Inicio'}</span>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="mobile-nav-hamburger" aria-label="Menu">
            <span className={`hamburger-line ${mobileOpen ? 'rotate-45 translate-y-[6px]' : ''}`}></span>
            <span className={`hamburger-line ${mobileOpen ? 'opacity-0' : ''}`}></span>
            <span className={`hamburger-line ${mobileOpen ? '-rotate-45 -translate-y-[6px]' : ''}`}></span>
          </button>
        </div>

        {/* Mobile dropdown */}
        <div className={`mobile-nav-dropdown ${mobileOpen ? 'mobile-nav-open' : 'mobile-nav-closed'}`}>
          {links.map(link => (
            <a 
              key={link.id}
              href={`#${link.id}`} 
              onClick={(e) => { e.preventDefault(); onNavClick(link.id); document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth' }); setMobileOpen(false); }}
              className={`mobile-nav-item ${activeSection === link.id ? 'mobile-nav-active' : ''}`}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </>
  );
});

// --- MOTOR 3D SENIOR (Optimizacion de memoria RAM aplicada) ---
const Background3D = memo(({ theme }) => {
  const mountRef = useRef(null);
  const animationFrameRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);

  const createParticleTexture = useCallback(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;
    
    mountRef.current.innerHTML = '';

    const isDark = theme === 'dark';
    const bgColor = isDark ? '#03050a' : '#f8fafc'; 
    
    const scene = new THREE.Scene();
    scene.background = null; 
    scene.fog = new THREE.FogExp2(bgColor, 0.03);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 15);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;
    
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    
    mountRef.current.appendChild(renderer.domElement);

    const particleCount = 2000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color(isDark ? 0x0ea5e9 : 0x0284c7); 
    const color2 = new THREE.Color(isDark ? 0x8b5cf6 : 0x7e22ce); 
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 40;     
      positions[i + 1] = (Math.random() - 0.5) * 10; 
      positions[i + 2] = (Math.random() - 0.5) * 40; 

      const mixedColor = color1.clone().lerp(color2, Math.random());
      colors[i] = mixedColor.r;
      colors[i + 1] = mixedColor.g;
      colors[i + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleTexture = createParticleTexture();
    const material = new THREE.PointsMaterial({
      size: isDark ? 0.3 : 0.4, // Restaurado
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      opacity: isDark ? 0.8 : 0.4, // Restaurado
      blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    let scrollY = window.scrollY;
    let targetScrollY = window.scrollY;
    const onScroll = () => { targetScrollY = window.scrollY; };
    window.addEventListener('scroll', onScroll, { passive: true });

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize, { passive: true });

    const clock = new THREE.Clock();
    let lastTime = 0;
    const targetFPS = 60;
    const frameInterval = 1000 / targetFPS;

    const animate = (currentTime) => {
      animationFrameRef.current = requestAnimationFrame(animate);
      
      const deltaTime = currentTime - lastTime;
      if (deltaTime < frameInterval) return;
      
      lastTime = currentTime - (deltaTime % frameInterval);
      const time = clock.getElapsedTime() * 0.2; // Restaurado a 0.2

      scrollY += (targetScrollY - scrollY) * 0.05; // Restaurado a 0.05
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = scrollY / maxScroll;

      const positions = particles.geometry.attributes.position.array;
      // Restaurar actualizaciÃ³n en cada frame pero con optimizaciÃ³n interna
      for (let i = 0; i < particleCount * 3; i += 3) {
        const x = positions[i];
        const z = positions[i + 2];
        positions[i + 1] = Math.sin(x * 0.5 + time) * 1.5 + Math.cos(z * 0.5 + time) * 1.5; // Restaurado
      }
      particles.geometry.attributes.position.needsUpdate = true;

      camera.position.x += (mouseX * 5 - camera.position.x) * 0.05; // Restaurado
      camera.position.y += (-mouseY * 2 + 5 - camera.position.y) * 0.05; // Restaurado
      camera.position.z = THREE.MathUtils.lerp(15, 5, progress); 
      
      particles.rotation.y = progress * Math.PI; // Restaurado

      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    };
    animate(0);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      
      if (geometry) geometry.dispose();
      if (material) material.dispose();
      if (particleTexture) particleTexture.dispose();
      if (renderer) renderer.dispose();
      
      const currentMountRef = mountRef.current;
      if (currentMountRef) currentMountRef.innerHTML = '';
    };
  }, [theme, createParticleTexture]);

  return <div ref={mountRef} className="fixed inset-0 z-[0] w-full h-screen overflow-hidden pointer-events-none" />;
});


export default function App() {
  const [theme, setTheme] = useState('dark');
  const [activeSection, setActiveSection] = useState('inicio');
  const [isMounted, setIsMounted] = useState(false);
  const cursorGlowRef = useRef(null); 
  const [isManualScrolling, setIsManualScrolling] = useState(false);
  const manualScrollTimeoutRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  // Set mounted state after component mounts
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const handleNavClick = useCallback((sectionId) => {
    setIsManualScrolling(true);
    clearTimeout(manualScrollTimeoutRef.current);
    
    // Actualizar inmediatamente la secciÃ³n activa para que la burbuja vaya directo
    setActiveSection(sectionId);
    
    // Reactivar la detecciÃ³n por scroll despuÃ©s de que termine el smooth scroll
    manualScrollTimeoutRef.current = setTimeout(() => {
      setIsManualScrolling(false);
    }, 1000); // Tiempo suficiente para el smooth scroll
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
        // No actualizar activeSection si estamos haciendo scroll manual por clic
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

  // Detectar si es mÃ³vil (menor a 768px)
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

  if (!isMounted) return null;

  return (
    <div className={`min-h-screen font-sans text-gray-900 dark:text-white bg-[#f8fafc] dark:bg-[#03050a] transition-colors duration-700 ease-in-out selection:bg-cyan-500/30 relative`}>
      
      {/* Resplandor interactivo del mouse */}
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
        
        {/* INICIO SECTION */}
        <section id="inicio" className="min-h-screen flex flex-col items-center justify-center px-4 pt-20 w-full">
          <div className="text-center max-w-5xl mx-auto space-y-6 relative z-10">
            <ScrollReveal direction="up" delay={100} className="mb-8">
               <div className="w-32 h-32 md:w-44 md:h-44 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 mx-auto shadow-[0_0_60px_rgba(14,165,233,0.3)] border-4 border-white/40 dark:border-white/10 relative p-1 group">
                <div className="w-full h-full rounded-full overflow-hidden">
                    <img src="/img/photo.jpg" alt="FabiÃ¡n SÃ¡nchez" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
               </div>
            </ScrollReveal>

            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter leading-tight">
              <ScrollReveal direction="up" delay={300}>
                <span className="block bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 dark:from-cyan-400 dark:via-blue-500 dark:to-purple-500 text-gradient-animated text-transparent bg-clip-text pb-2">
                  FabiÃ¡n SÃ¡nchez
                </span>
              </ScrollReveal>
              <ScrollReveal direction="up" delay={500}>
                <span className="block text-xl sm:text-2xl md:text-5xl mt-2 font-bold bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 dark:from-cyan-400 dark:via-blue-500 dark:to-purple-500 text-gradient-animated text-transparent bg-clip-text">
                  <span className="font-light text-gray-500 dark:text-gray-400 mr-3">Full Stack</span> 
                  <TypeAsync words={['Developer', 'Software Engineer', 'Architect', 'Problem Solver']} />
                </span>
              </ScrollReveal>
            </h1>
            
            <ScrollReveal direction="up" delay={700}>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
                Estudiante de IngenierÃ­a en Sistemas en la UNA. Construyendo aplicaciones robustas, escalables y arquitecturas de alto rendimiento con cÃ³digo limpio.
              </p>
            </ScrollReveal>
            
            <ScrollReveal direction="up" delay={900}>
              <div className="pt-10 flex flex-col items-center justify-center gap-8">
                
                {isMobile ? (
                  <BlobButton darkTheme={theme === 'dark'} onClick={() => window.open('/cv.pdf', '_blank')}>
                    Descargar CV
                  </BlobButton>
                ) : (
                  <GooeyButton 
                    text="Descargar CV" 
                    onClick={() => window.open('/cv.pdf', '_blank')}
                  />
                )}

                <div className="flex gap-6 mt-4">
                  {socialLinks.map((link) => (
                    <MagneticButton key={link.name}>
                      <GlassCard tilt={true} isNavbar={true} className="p-4 flex items-center justify-center">
                        <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.name} className="text-gray-700 dark:text-gray-300 group-hover:text-cyan-500 transition-colors">
                          {link.icon}
                        </a>
                      </GlassCard>
                    </MagneticButton>
                  ))}
                </div>
              </div>
            </ScrollReveal> 
          </div>
          
          <div className="absolute bottom-10 animate-bounce text-gray-400">
            <ChevronDown size={32} />
          </div>
        </section>

        {/* SOBRE MÃ SECTION */}
        <section id="sobre-mi" className="min-h-screen py-20 md:py-24 px-5 sm:px-6 max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-16 w-full">
          <div className="md:w-5/12 flex justify-center">
            <ScrollReveal direction="left" delay={200}>
              {/* RESTAURADO: Exactamente como tenÃ­as el renderizador de la Laptop 3D */}
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
                      <MonitorSmartphone size={16} className="text-cyan-600 dark:text-cyan-400" /> IngenierÃ­a en Sistemas, UNA
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
                  Sobre MÃ­
                </span>
              </h2>
            </ScrollReveal>
            
            {/* IMPLEMENTACIÃ“N DE PRETEXT: PÃ¡rrafos ultra rÃ¡pidos en Canvas */}
            <ScrollReveal direction="right" delay={300}>
              <PretextParagraph 
                isDark={theme === 'dark'}
                text='Estudiante de Ãºltimo aÃ±o de IngenierÃ­a en Sistemas de InformaciÃ³n en la Universidad Nacional (UNA) en bÃºsqueda de una empresa para realizar mi PrÃ¡ctica Profesional Supervisada (PPS). Me especializo en el desarrollo backend, con un enfoque principal en el diseÃ±o, construcciÃ³n y optimizaciÃ³n de APIs RESTful.'
              />
            </ScrollReveal>
            
            <ScrollReveal direction="right" delay={400}>
               <PretextParagraph 
                isDark={theme === 'dark'}
                text='Mi trabajo se define por el rigor tÃ©cnico y la calidad del cÃ³digo. Desarrollo software aplicando estrictamente los principios SOLID, la regla DRY (Do not Repeat Yourself) y patrones de diseÃ±o, garantizando arquitecturas limpias, escalables y mantenibles a largo plazo. Redacto la documentaciÃ³n tÃ©cnica de mis proyectos y repositorios Ã­ntegramente en inglÃ©s.'
              />
            </ScrollReveal>

            <ScrollReveal direction="right" delay={500}>
               <PretextParagraph 
                isDark={theme === 'dark'}
                text='Especialista en Java (Spring Boot) y PHP (Laravel). Experiencia en bases de datos PostgreSQL, SQL Server y MySQL. Manejo de Docker, CI/CD, servidores Ubuntu y HTTPS. Desarrollo mÃ³vil con Kotlin (MVVM) y React Native. Scrum Master certificado con enfoque en QA y revisiÃ³n rigurosa de cÃ³digo. Aporto disciplina de ingenierÃ­a y capacidad para resolver problemas complejos en entornos empresariales exigentes.'
              />
            </ScrollReveal>
          </div>
        </section>

        {/* SKILLS SECTION */}
        <section id="skills" className="min-h-screen py-20 md:py-24 px-5 sm:px-6 max-w-6xl mx-auto w-full">
          <ScrollReveal direction="up">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-10 md:mb-16 tracking-tight flex justify-center items-center gap-3">
              <Wrench className="text-blue-500 shrink-0" size={32} />
              <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 dark:from-cyan-400 dark:via-blue-500 dark:to-purple-500 text-gradient-animated text-transparent bg-clip-text pb-1">
                Stack TecnolÃ³gico
              </span>
            </h2>
          </ScrollReveal>
          
          {/* Backend & Core Marquee */}
          <div className="mb-16">
            <ScrollReveal direction="up" delay={200}>
              <h3 className="text-2xl font-bold flex items-center justify-center gap-2 text-cyan-600 dark:text-cyan-500 mb-6"><Server /> Backend & Core</h3>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={300}>
              <DraggableMarquee 
                items={[
                  { name: 'Java', icon: <JavaIcon size={24} /> },
                  { name: 'Spring Boot', icon: <SpringBootIcon size={24} /> },
                  { name: 'PHP', icon: <PhpIcon size={24} /> },
                  { name: 'Laravel', icon: <LaravelIcon size={24} /> },
                  { name: 'Node.js', icon: <NodeJsIcon size={24} /> },
                  { name: 'C++', icon: <CppIcon size={24} /> },
                  { name: 'PostgreSQL', icon: <PostgresqlIcon size={24} /> },
                  { name: 'MySQL', icon: <MysqlIcon size={24} /> },
                ]}
                direction="left"
                color="cyan"
              />
            </ScrollReveal>
          </div>

          {/* Frontend & Web Marquee */}
          <div className="mb-16">
            <ScrollReveal direction="up" delay={400}>
              <h3 className="text-2xl font-bold flex items-center justify-center gap-2 text-purple-600 dark:text-purple-500 mb-6"><Layout /> Frontend & Web</h3>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={500}>
              <DraggableMarquee 
                items={[
                  { name: 'HTML5', icon: <HtmlIcon size={24} /> },
                  { name: 'CSS3', icon: <CssIcon size={24} /> },
                  { name: 'JavaScript', icon: <JavaScriptIcon size={24} /> },
                  { name: 'React', icon: <ReactIcon size={24} /> },
                  { name: 'React Native', icon: <ReactNativeIcon size={24} /> },
                  { name: 'Tailwind', icon: <TailwindIcon size={24} /> },
                  { name: 'Bootstrap', icon: <BootstrapIcon size={24} /> },
                  { name: 'JSON', icon: <JsonIcon size={24} /> },
                ]}
                direction="right"
                color="purple"
              />
            </ScrollReveal>
          </div>

          {/* DevOps & Tools Marquee */}
          <div className="mb-16">
            <ScrollReveal direction="up" delay={600}>
              <h3 className="text-2xl font-bold flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-500 mb-6"><Wrench /> DevOps & Tools</h3>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={700}>
              <DraggableMarquee 
                items={[
                  { name: 'Docker', icon: <DockerIcon size={24} /> },
                  { name: 'Git', icon: <GitIcon size={24} /> },
                  { name: 'GitHub', icon: <GithubIcon size={24} /> },
                  { name: 'Linux', icon: <LinuxIcon size={24} /> },
                  { name: 'Bash', icon: <BashIcon size={24} /> },
                  { name: 'Scrum', icon: <User size={24} /> },
                ]}
                direction="left"
                color="emerald"
              />
            </ScrollReveal>
          </div>
        </section>

        {/* PROYECTOS SECTION */}
        <section id="proyectos" className="min-h-screen py-20 md:py-24 px-5 sm:px-6 max-w-6xl mx-auto w-full">
          <ScrollReveal direction="up">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-10 md:mb-16 tracking-tight flex items-center justify-center gap-3">
              <Briefcase className="text-purple-500 shrink-0" size={32} />
              <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 dark:from-cyan-400 dark:via-blue-500 dark:to-purple-500 text-gradient-animated text-transparent bg-clip-text pb-1">
                Proyectos Destacados
              </span>
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-12">
            <ScrollReveal direction="up" delay={200}>
              <GlassCard tilt={true} className="p-6 flex flex-col gap-6 cursor-pointer h-full border-t border-t-cyan-500/30">
                <div className="w-full h-40 sm:h-52 md:h-64 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center overflow-hidden relative group-hover:shadow-[0_0_30px_rgba(14,165,233,0.3)] transition-shadow duration-500">
                   <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700"></div>
                   <div className="absolute inset-0 bg-gradient-to-t from-white/90 dark:from-[#0f111a]/90 to-transparent opacity-90 transition-opacity group-hover:opacity-60"></div>
                   <h3 className="text-2xl sm:text-3xl font-black z-10 drop-shadow-lg text-gray-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 group-hover:-translate-y-2 transition-all duration-300">Sistema Gestor Empresarial</h3>
                </div>
                <div className="flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold mb-4 flex justify-between items-center text-gray-900 dark:text-white">
                    ERP Modular
                    <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-cyan-500 transition-colors"><ExternalLink size={20} /></a>
                  </h3>
                  
                  {/* PRETEXT AQUÃ */}
                  <PretextParagraph 
                    className="mb-6 flex-1"
                    isDark={theme === 'dark'}
                    text='Arquitectura limpia implementada en Spring Boot y React. GestiÃ³n integral de recursos humanos, inventario y facturaciÃ³n usando SQL Server.'
                  />

                  <div className="flex flex-wrap gap-2 text-xs font-medium mt-auto">
                    <span className="px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20">Java / Spring Boot</span>
                    <span className="px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20">React</span>
                    <span className="px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20">SQL Server</span>
                  </div>
                </div>
              </GlassCard>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={400}>
              <GlassCard tilt={true} className="p-6 flex flex-col gap-6 cursor-pointer h-full border-t border-t-purple-500/30">
                <div className="w-full h-40 sm:h-52 md:h-64 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center overflow-hidden relative group-hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-shadow duration-500">
                   <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618761714954-0b8cd0026356?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700"></div>
                   <div className="absolute inset-0 bg-gradient-to-t from-white/90 dark:from-[#0f111a]/90 to-transparent opacity-90 transition-opacity group-hover:opacity-60"></div>
                   <h3 className="text-2xl sm:text-3xl font-black z-10 drop-shadow-lg text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-300 group-hover:-translate-y-2 transition-all duration-300">E-Commerce Core</h3>
                </div>
                <div className="flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold mb-4 flex justify-between items-center text-gray-900 dark:text-white">
                    Plataforma de Ventas
                    <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-purple-500 transition-colors"><ExternalLink size={20} /></a>
                  </h3>
                  
                  {/* PRETEXT AQUÃ */}
                  <PretextParagraph 
                    className="mb-6 flex-1"
                    isDark={theme === 'dark'}
                    text='Desarrollo de una API RESTful con Laravel y MySQL. Manejo de autenticaciÃ³n, carrito de compras, pasarela de pagos y panel administrativo completo.'
                  />

                  <div className="flex flex-wrap gap-2 text-xs font-medium mt-auto">
                    <span className="px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">PHP / Laravel</span>
                    <span className="px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">MySQL</span>
                    <span className="px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">REST API</span>
                  </div>
                </div>
              </GlassCard>
            </ScrollReveal>
          </div>
        </section>

        {/* CONTACTO SECTION */}
        <section id="contacto" className="min-h-screen py-20 md:py-24 px-5 sm:px-6 max-w-4xl mx-auto flex flex-col justify-center w-full">
          <ScrollReveal direction="up">
             <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-10 md:mb-16 tracking-tight flex items-center justify-center gap-3">
              <Mail className="text-cyan-500 shrink-0" size={32} />
              <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 dark:from-cyan-400 dark:via-blue-500 dark:to-purple-500 text-gradient-animated text-transparent bg-clip-text pb-1">
                Hablemos de CÃ³digo
              </span>
            </h2>
          </ScrollReveal>
          
          <div className="grid md:grid-cols-2 gap-12">
            <ScrollReveal direction="left" delay={200} className="space-y-8">
              
              <PretextParagraph 
                isDark={theme === 'dark'}
                text='Busco oportunidades en entornos tecnolÃ³gicos desafiantes para aplicar mis habilidades, crecer profesionalmente y contribuir con soluciones innovadoras.'
              />

              <div className="flex flex-col gap-4 sm:gap-6">
                {socialLinks.map((link) => (
                  <MagneticButton key={link.name}>
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 sm:gap-4 text-base sm:text-lg font-medium text-gray-800 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors group">
                      <div className="w-auto shrink-0">
                        <GlassCard tilt={true} isNavbar={true} className="p-2.5 sm:p-3">
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
                    <textarea id="message" rows="4" className="w-full px-4 py-3 rounded-xl bg-white/60 dark:bg-[#03050a]/50 border border-gray-300 dark:border-white/10 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all resize-none text-sm text-gray-900 dark:text-white" placeholder="Â¿En quÃ© te puedo ayudar?" required></textarea>
                  </div>
                  <BlobButton darkTheme={theme === 'dark'} onClick={(e) => e.preventDefault()}>
                    Enviar Mensaje <Send size={18} />
                  </BlobButton>
                </form>
              </GlassCard>
            </ScrollReveal>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-12 text-center text-gray-500 dark:text-gray-500 relative z-10 w-full border-t border-gray-200 dark:border-white/5">
          <p>Â© {new Date().getFullYear()} FabiÃ¡n SÃ¡nchez. Universidad Nacional de Costa Rica.</p>
        </footer>

      </main>

      {/* --- ESTILOS INYECTADOS --- */}
      <style dangerouslySetInnerHTML={{__html: `
        html { scroll-behavior: smooth; }
        
        @keyframes animated-gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .text-gradient-animated {
          background-size: 200% 200%;
          animation: animated-gradient 6s linear infinite;
        }

        /* Sketch button animation */
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

        /* Ocultar barra de scroll en el Navbar para mÃ³viles */
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }

        /* MOBILE NAV CSS */
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
        
        .mobile-nav-title {
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--c-content, #2a2a35);
          letter-spacing: 0.3px;
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

        .mobile-nav-open {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
          max-height: 300px;
          padding: 8px 0;
        }

        .mobile-nav-closed {
          opacity: 0;
          transform: translateY(-10px);
          pointer-events: none;
          max-height: 0;
          padding: 0;
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

        /* BLOB BUTTON CSS */
        .blob-container {
          --elastic: cubic-bezier(0.175, 0.885, 0.32, 1.275);
          --x: 0px;
          --y: 0px;
          --t: rgba(255, 255, 255, 0.001);
          --lightest: rgba(14, 165, 233, 0.8);
          --light: rgba(59, 130, 246, 0.8);
          --dark: rgba(139, 92, 246, 0.8);
          --darkest: transparent;
          position: relative;
          display: inline-flex;
          justify-content: center;
          z-index: 1;
        }

        .blob-inner {
          display: inline-block;
          position: relative;
          pointer-events: all;
          z-index: 2;
          cursor: pointer;
          border-radius: 999px;
        }

        .blob-inner:hover::before {
          filter: blur(4px) brightness(1.2);
          background-size: 0px 0px, 100% 100%, 100%;
          transition: transform 0.5s var(--elastic), background-size 0.25s ease-in-out;
        }

        .blob-inner::before {
          content: "";
          position: absolute;
          width: 200%;
          height: 200%;
          top: 0rem;
          left: 0rem;
          filter: blur(4px) brightness(0.8);
          background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.5) 0%, var(--t) 20%),
                      radial-gradient(circle at center, var(--lightest), var(--light) 15%, var(--dark) 40%, var(--darkest) 70%),
                      var(--darkest);
          background-size: 0px 0px, 0px 0px, 100%;
          background-position: 50% 50%;
          background-repeat: no-repeat;
          opacity: 1;
          mix-blend-mode: screen;
          transition: transform 0.5s var(--elastic), background-size 0.25s ease-in-out, filter 0.5s ease-in-out;
          transform: translate(calc(var(--x) - 50%), calc(var(--y) - 50%));
          z-index: 2;
          pointer-events: none;
        }

        .blob-container.blob-light .blob-inner::before {
           mix-blend-mode: normal;
           filter: blur(6px) brightness(0.9);
        }

        .blob-inner button {
          padding: 1rem 2.5rem;
          border: none;
          font-size: 1rem;
          font-weight: 600;
          position: relative;
          background: rgba(15, 23, 42, 0.6);
          color: #fff;
          z-index: 3;
          cursor: pointer;
          border-radius: 99px;
          border: 1px solid rgba(14, 165, 233, 0.4);
          backdrop-filter: blur(12px);
          transition: transform 0.2s, box-shadow 0.2s, background 0.3s;
          letter-spacing: 0.5px;
        }
        
        .blob-container.blob-light .blob-inner button {
           background: rgba(255, 255, 255, 0.9);
           color: #0f172a;
           border: 1px solid rgba(14, 165, 233, 0.6);
        }

        .blob-inner:hover button {
           transform: scale(1.02);
           background: rgba(15, 23, 42, 0.8);
           box-shadow: 0 0 25px rgba(14, 165, 233, 0.3);
        }
        
        .blob-container.blob-light .blob-inner:hover button {
           background: #ffffff;
           box-shadow: 0 0 25px rgba(14, 165, 233, 0.5);
        }

        .blob {
          position: absolute;
          pointer-events: none;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          background: transparent;
          filter: blur(10px);
          z-index: 1;
          border-radius: 99px;
          overflow: hidden;
        }

        .blob::before {
          content: "";
          position: absolute;
          background: rgba(14, 165, 233, 0.4);
          width: 20%;
          height: auto;
          z-index: 2;
          transition: transform 750ms var(--elastic);
          aspect-ratio: 1/1;
          left: 0;
          top: 0;
          border-radius: 100%;
          transform: translate(clamp(10%, calc(var(--x) - 50%), 550%), clamp(1rem, calc(var(--y) - 50%), 5rem)) scale(0);
        }
        
        .blob-inner:hover .blob::before {
          transform: translate(clamp(5%, calc(var(--x) - 50%), 550%), clamp(0.5rem, calc(var(--y) - 50%), 2rem)) scale(1.5);
        }

        /* BLOB BUTTON MOBILE - Clean & Professional (no hover effects) */
        @media (max-width: 767px) {
          .blob-container {
            --x: 50%;
            --y: 50%;
          }
          
          .blob-inner::before {
            display: none;
          }
          
          .blob-inner button {
            padding: 0.875rem 1.75rem;
            font-size: 0.9rem;
            font-weight: 500;
            background: rgba(15, 23, 42, 0.85);
            border: 1px solid rgba(14, 165, 233, 0.5);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(8px);
          }
          
          .blob-container.blob-light .blob-inner button {
            background: rgba(255, 255, 255, 0.95);
            border: 1px solid rgba(14, 165, 233, 0.6);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          }
          
          /* Disable all hover effects on mobile */
          .blob-inner:hover::before,
          .blob-inner:hover button,
          .blob-container.blob-light .blob-inner:hover button {
            transform: none;
            background: inherit;
            box-shadow: inherit;
            filter: none;
          }
          
          .blob,
          .blob::before {
            display: none;
          }
        }

        /* BLINKING CURSOR CSS */
        .blinking-cursor {
          user-select: none;
          animation: blink 1s steps(2, start) infinite;
        }
        
        @keyframes blink {
          to {
            visibility: hidden;
          }
        }

        /* LIQUID NAV CSS */
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

        .liquid-nav {
           display: inline-flex;
        }

        /* Responsive nav visibility via CSS media queries to prevent Tailwind conflicts */
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
          padding: 10px 20px;
          border-radius: 99em;
          min-height: 56px;
          list-style: none;
          background-color: color-mix(in srgb, var(--c-glass) 22%, transparent);
          backdrop-filter: blur(20px) saturate(var(--saturation));
          -webkit-backdrop-filter: blur(20px) saturate(var(--saturation));
          border: 1px solid color-mix(in srgb, var(--c-light) calc(var(--glass-reflex-light) * 25%), transparent);
          transition: background-color 400ms cubic-bezier(1, 0.0, 0.4, 1);
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
          /* Liquid glass effect: spring physics with subtle scale */
          transition: transform 550ms cubic-bezier(0.34, 1.56, 0.64, 1), 
                      width 550ms cubic-bezier(0.34, 1.56, 0.64, 1),
                      scale 200ms ease-out;
          will-change: transform, width;
        }
        
        /* Liquid morph animation during movement */
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
      `}} />
    </div>
  );
}



