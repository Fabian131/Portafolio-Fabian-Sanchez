# LiquidNav Component - Documentación Completa

## Componente React (LiquidNav.jsx)

```jsx
// NAVBAR RESPONSIVE: Desktop = pill nav, Mobile = hamburger menu
const LiquidNav = memo(({ activeSection, toggleTheme, isDark, onNavClick }) => {
  const navRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const [mobileOpen, setMobileOpen] = useState(false);
  const resizeTimeoutRef = useRef(null);

  const links = useMemo(() => [
    { id: 'inicio', label: 'Inicio' },
    { id: 'sobre-mi', label: 'Sobre Mí' },
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
```

## Props del Componente

| Prop | Tipo | Descripción |
|------|------|-------------|
| `activeSection` | `string` | ID de la sección actualmente activa ('inicio', 'sobre-mi', etc.) |
| `toggleTheme` | `function` | Función para alternar entre tema oscuro/claro |
| `isDark` | `boolean` | Indica si el tema actual es oscuro |
| `onNavClick` | `function` | Callback que recibe el ID de la sección al hacer click |

## Estilos CSS (Liquid Nav)

```css
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

/* Hide scrollbar */
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
```

## Estilos CSS (Mobile Nav)

```css
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
```

## Uso en App.jsx

```jsx
// En el componente App
const [theme, setTheme] = useState('dark');
const [activeSection, setActiveSection] = useState('inicio');
const [isManualScrolling, setIsManualScrolling] = useState(false);
const manualScrollTimeoutRef = useRef(null);
const scrollTimeoutRef = useRef(null);

const handleNavClick = useCallback((sectionId) => {
  setIsManualScrolling(true);
  clearTimeout(manualScrollTimeoutRef.current);
  
  // Actualizar inmediatamente la sección activa para que la burbuja vaya directo
  setActiveSection(sectionId);
  
  // Reactivar la detección por scroll después de que termine el smooth scroll
  manualScrollTimeoutRef.current = setTimeout(() => {
    setIsManualScrolling(false);
  }, 1000);
}, []);

const toggleTheme = useCallback(() => setTheme(theme === 'dark' ? 'light' : 'dark'), [theme]);

// Efecto para manejar scroll y detectar sección activa
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

// En el JSX
<LiquidNav 
  activeSection={activeSection} 
  toggleTheme={toggleTheme} 
  isDark={theme === 'dark'} 
  onNavClick={handleNavClick} 
/>
```

## Características del Efecto Liquid Glass

1. **Pill Indicator**: El indicador que se mueve entre secciones es un div `.liquid-nav-pill` posicionado absolutamente dentro del contenedor.

2. **Transición Spring Physics**: La transición usa `cubic-bezier(0.34, 1.56, 0.64, 1)` que es una curva de spring con overshoot, dando ese efecto "gelatinoso" cuando se mueve.

3. **Variables CSS para Theme**:
   - `:root` define los valores para modo claro
   - `html.dark` redefine las variables para modo oscuro

4. **Efecto de Escala durante movimiento**: La clase `.liquid-nav-pill.moving` aplica un scale sutil (0.98, 1.02) durante el movimiento para dar efecto de "weight" al indicator.

5. **Glass Morphism**: Usa `color-mix()` con backdrop-filter blur para crear el efecto de glass líquido.

6. **Hover Effects**: Los links tienen efecto de scale al hover (1.15x) con transición suave.