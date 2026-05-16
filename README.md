# Portafolio Personal - Fabian Sanchez Salinas

Portfolio web moderno e interactivo construido con React, Vite y tecnologías de vanguardia.

**[Ver online](https://portafolio-fabian-sanchez-salinas.netlify.app/)**

---

## Tecnologías

### Core
- **React 19** - Librería principal de UI
- **Vite 8** - Herramienta de build y desarrollo (HMR)
- **Tailwind CSS 4** - Framework CSS via `@tailwindcss/vite`

### 3D y Efectos Visuales
- **Three.js 0.183** - Sistema de partículas 3D interactivas (2000 partículas con interacción de mouse)
- **@developer-hub/liquid-glass** - Efectos glassmorphism avanzados
- **liquid-glass-react** - Componentes con efecto cristal

### Animaciones
- **Framer Motion 12** - Animaciones fluidas y transiciones
- **react-magic-ui** - Componentes UI con efectos mágicos

### Texto y Renderizado
- **@chenglou/pretext** - Motor de renderizado ultra-rápido basado en Canvas (evita reflows del DOM, segmentación inteligente de texto)

### Iconos y UI
- **Lucide React** - Iconos modernos
- **ESLint** - Linting con flat config

---

## Estructura del Proyecto

```
portafolio/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/                 # Logos e imágenes (hero.png, react.svg, vite.svg)
│   ├── components/
│   │   ├── atoms/             # Componentes base
│   │   │   ├── BlobButton.jsx       # Botones con morfismo fluido
│   │   │   ├── GooeyButton.jsx      # Botones con efecto gooey
│   │   │   ├── Icons.jsx            # Iconos SVG personalizados
│   │   │   ├── MagneticButton.jsx   # Botones con efecto magnético
│   │   │   ├── PretextParagraph.jsx # Renderizado ultra-rápido de texto
│   │   │   ├── ScrollReveal.jsx     # Animaciones al hacer scroll
│   │   │   └── TypeAsync.jsx        # Efecto typewriter asíncrono
│   │   ├── molecules/
│   │   │   ├── GlassCard.jsx        # Tarjetas con tilt 3D y glassmorfismo
│   │   │   ├── ProjectCard.jsx       # Card de proyecto
│   │   │   ├── SectionHeader.jsx    # Header con animaciones
│   │   │   └── SkillCard.jsx        # Card de habilidad
│   │   └── organisms/
│   │       ├── AboutSection.jsx     # Sección "Sobre mí"
│   │       ├── Background3D.jsx      # Fondo con partículas 3D (Three.js)
│   │       ├── ContactSection.jsx   # Sección de contacto
│   │       ├── DraggableMarquee.jsx  # Carrusel de skills arrastrable
│   │       ├── Footer.jsx           # Footer
│   │       ├── HeroSection.jsx      # Hero principal
│   │       ├── LiquidNav.jsx        # Navegación líquida con indicadores
│   │       ├── ProjectsSection.jsx   # Galería de proyectos
│   │       └── SkillsSection.jsx     # Sección de habilidades
│   ├── data/                   # Datos del portfolio
│   │   ├── navigation.js       # Rutas de navegación
│   │   ├── projects.js         # Información de proyectos
│   │   ├── skills.js          # Habilidades (backend, frontend, devops)
│   │   └── social.js           # Redes sociales
│   ├── hooks/                  # Hooks personalizados
│   │   ├── useIntersectionObserver.js  # Lazy loading optimizado
│   │   ├── usePerformanceMonitor.js    # Monitor de FPS
│   │   └── useThrottle.js            # Control de frecuencia de eventos
│   ├── utils/
│   │   └── performance.js      # Utilidades de rendimiento
│   ├── App.jsx                 # Componente principal
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── eslint.config.js
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## Comandos Disponibles

```bash
npm run dev      # Servidor desarrollo (http://localhost:5173)
npm run build    # Build de producción
npm run preview  # Previsualizar build
npm run lint     # Verificar código con ESLint
```

---

## Como Clonar y Ejecutar

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/Portafolio-Fabian-Sanchez.git
cd Portafolio-Fabian-Sanchez

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

---

## Como Verlo en Móvil

### Opción 1: Ver online
**[https://portafolio-fabian-sanchez-salinas.netlify.app/](https://portafolio-fabian-sanchez-salinas.netlify.app/)**

### Opción 2: Ver en tu dispositivo local
1. Ejecuta `npm run dev` en tu computadora
2. Anota tu IP local (ej: `192.168.1.x`)
3. En tu móvil, conecta a la misma red WiFi
4. Abre `http://tu-ip:5173` en el navegador del móvil

### Opción 3: Usando ngrok (para testing externo)
```bash
npm run dev
# En otra terminal:
npx ngrok http 5173
# Abre la URL que ngrok te da en tu móvil
```

---

## Secciones del Portfolio

1. **Hero** - Introducción con efecto typewriter y fondo 3D interactivo
2. **Sobre Mí** - Información personal con animaciones scroll-reveal
3. **Habilidades** - Tecnologías divididas en backend, frontend y devops
4. **Proyectos** - Portfolio de trabajos con glassmorfismo
5. **Contacto** - Formulario y enlaces a redes sociales

---

## Detalle de Características Técnicas

### Three.js - Sistema de Partículas 3D
- 2000 partículas con interacción de mouse
- Efecto de niebla atmosférica (fog exp2)
- Optimización de memoria con cleanup adecuado
- Frame limiting a 60 FPS

### @chenglou/pretext - Pretext
- Motor de renderizado basado en Canvas
- Evita reflows del DOM
- Segmentación inteligente para análisis ultra-rápido de texto
- SEO friendly con contenido accesible via sr-only

### Liquid Navigation
- Navegación con efecto líquido
- Indicadores dinámicos animados
- Transiciones fluidas entre secciones

### Magnetic Buttons
- Botones con efecto de atracción magnética al pasar el cursor
- Uso de requestAnimationFrame para animaciones suaves

### Glass Cards
- Tarjetas con efecto glassmorfismo
- Transformaciones 3D (tilt) al interactuar
- Sombras y profundidad

### Scroll Reveal
- Animaciones de aparición al hacer scroll
- Uso de Intersection Observer para detección eficiente

### Code Splitting (Build Optimizado)
- **vendor**: ~187 KB (React core)
- **three**: ~502 KB (Three.js)
- **framer**: ~129 KB (Framer Motion)
- **icons**: Lucide icons

---

## Uso y Créditos

Este proyecto fue creado por **Fabian Sanchez Salinas**.

Cualquier persona puede usar, modificar y adaptar este código para sus propios propósitos, dando el crédito apropiado al autor original.

---

Desarrollado por **Fabian Sanchez Salinas**