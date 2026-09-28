# 🚀 Portafolio Personal - Fabian Sanchez Salinas

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Threejs](https://img.shields.io/badge/threejs-black?style=for-the-badge&logo=three.js&logoColor=white)
![Netlify](https://img.shields.io/badge/netlify-%23000000.svg?style=for-the-badge&logo=netlify&logoColor=#00C7B7)

> Portfolio web moderno, interactivo y de alto rendimiento. Diseñado bajo los estándares de **Clean Architecture** y **Atomic Design** para una escalabilidad masiva y separación de responsabilidades a nivel empresarial.

**[🌐 Ver Portfolio Online](https://portafolio-fabian-sanchez-salinas.netlify.app/)**

---

## ✨ Características Técnicas Destacadas

* 🏎️ **Fondo WebGL Acelerado por GPU:** Renderizado de miles de partículas interactivas a 60 FPS fijos. El cálculo matemático (ondas trigonométricas de deformación) fue migrado totalmente de JavaScript a la Tarjeta Gráfica mediante la técnica avanzada de secuestro de Shaders (`material.onBeforeCompile`).
* 🏗️ **Clean Architecture:** Separación estricta entre la UI (*Dumb Components*) y la Lógica de Negocio. Todas las reglas de negocio, cálculos físicos, internacionalización y observadores residen en una bóveda de **Custom Hooks** (`src/hooks/`).
* ⚛️ **Atomic Design Estricto:** La UI está fragmentada jerárquicamente en **Átomos, Moléculas y Organismos**, garantizando componentes altamente reutilizables.
* 🧊 **Glassmorphism y Físicas:** Componentes translúcidos (`GlassCard`, `GlassDock`) con desenfoque nativo e interacciones de arrastre complejas controladas mediante `Framer Motion` y `GSAP`.
* 🔋 **Optimizaciones de Batería:** Uso de acumuladores delta-time limitados (capped deltaTime) para prevenir glitches al cambiar de pestaña, junto a `IntersectionObserver` y `React.lazy()` para el lazy-loading de texturas pesadas.

---

## 🛠️ Stack Tecnológico

| Categoría | Tecnologías |
| :--- | :--- |
| **Core** | React 19, Vite 8 |
| **Estilos & UI** | Tailwind CSS 4, Lucide React, Phosphor Icons |
| **Animaciones & 3D** | Three.js (v0.183.2), Framer Motion, GSAP |
| **Arquitectura** | Clean Architecture (Hooks), Atomic Design |
| **Deploy** | Netlify |

---

## 📂 Anatomía del Código Fuente (Arquitectura Completa)

A continuación, la representación exacta del código fuente del proyecto (`src/`), estructurado para separar responsabilidades de manera impecable:

```text
portafolio/
├── src/
│   ├── App.css
│   ├── App.jsx
│   ├── assets/
│   │   ├── hero.png
│   │   ├── img/
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── components/                 <-- CAPA DE VISTA (Atomic Design)
│   │   ├── atoms/                  <-- Piezas base indivisibles
│   │   │   ├── backgrounds/
│   │   │   │   └── Background3D/
│   │   │   │       └── Background3D.jsx
│   │   │   ├── buttons/
│   │   │   │   ├── BlobButton/
│   │   │   │   │   └── BlobButton.jsx
│   │   │   │   └── MagneticButton/
│   │   │   │       └── MagneticButton.jsx
│   │   │   ├── layout/
│   │   │   │   ├── GlassCard/
│   │   │   │   │   └── GlassCard.jsx
│   │   │   │   └── ScrollReveal/
│   │   │   │       └── ScrollReveal.jsx
│   │   │   ├── typography/
│   │   │   │   └── TypeAsync/
│   │   │   │       └── TypeAsync.jsx
│   │   │   └── ui/
│   │   │       ├── Icons/
│   │   │       │   └── Icons.jsx
│   │   │       └── LanguageSwitcher/
│   │   │           └── LanguageSwitcher.jsx
│   │   ├── molecules/              <-- Grupos de átomos con lógica visual simple
│   │   │   ├── ContactForm/
│   │   │   │   └── ContactForm.jsx
│   │   │   ├── DepthCarousel/
│   │   │   │   ├── DepthCarousel.css
│   │   │   │   └── DepthCarousel.jsx
│   │   │   ├── DraggableMarquee/
│   │   │   │   └── DraggableMarquee.jsx
│   │   │   ├── GlassDock/
│   │   │   │   └── GlassDock.jsx
│   │   │   ├── GlassToast/
│   │   │   │   └── GlassToast.jsx
│   │   │   ├── ImageLightbox/
│   │   │   │   ├── ImageLightbox.css
│   │   │   │   └── ImageLightbox.jsx
│   │   │   ├── ProjectCard/
│   │   │   │   └── ProjectCard.jsx
│   │   │   ├── SectionHeader/
│   │   │   │   └── SectionHeader.jsx
│   │   │   └── SkillCard/
│   │   │       ├── SkillCard.css
│   │   │       └── SkillCard.jsx
│   │   └── organisms/              <-- Secciones completas de la página
│   │       ├── AboutSection/
│   │       │   └── AboutSection.jsx
│   │       ├── BackgroundOrganism/
│   │       │   └── BackgroundOrganism.jsx
│   │       ├── ContactSection/
│   │       │   └── ContactSection.jsx
│   │       ├── Footer/
│   │       │   └── Footer.jsx
│   │       ├── HeroSection/
│   │       │   └── HeroSection.jsx
│   │       ├── LiquidNav/
│   │       │   ├── LiquidNav.css
│   │       │   └── LiquidNav.jsx
│   │       ├── ProjectsSection/
│   │       │   └── ProjectsSection.jsx
│   │       └── SkillsSection/
│   │           └── SkillsSection.jsx
│   ├── constants/                  <-- Configuraciones estáticas globales
│   │   └── background3D.js
│   ├── data/                       <-- CAPA DE DATOS E INTERNACIONALIZACIÓN
│   │   ├── navigation.js
│   │   ├── projects.js
│   │   ├── skills.jsx
│   │   ├── social.js
│   │   └── translations/
│   │       ├── en.js
│   │       ├── es.js
│   │       └── index.js
│   ├── hooks/                      <-- CAPA DE LÓGICA DE NEGOCIO (Clean Architecture)
│   │   ├── useAboutSection.js
│   │   ├── useBackground3D.js
│   │   ├── useContactForm.js
│   │   ├── useContactSection.js
│   │   ├── useDepthCarousel.js
│   │   ├── useDraggableMarquee.js
│   │   ├── useFooter.js
│   │   ├── useGlassCard.js
│   │   ├── useGlassDock.js
│   │   ├── useHeroSection.js
│   │   ├── useImageLightbox.js
│   │   ├── useIntersectionObserver.js
│   │   ├── useLanguageSwitcher.js
│   │   ├── useLiquidNav.js
│   │   ├── useMagneticButton.js
│   │   ├── usePerformanceMonitor.js
│   │   ├── useProjectCard.js
│   │   ├── useProjectsSection.js
│   │   ├── useReducedMotion.js
│   │   ├── useSkillsSection.js
│   │   ├── useThrottle.js
│   │   └── useTranslation.js
│   ├── index.css
│   ├── main.jsx
│   └── utils/                      <-- Funciones puras e independientes
│       ├── breakpoints.js
│       ├── performance.js
│       └── typography.js
```

---

## 💻 Instalación y Uso Local

Este proyecto utiliza `npm` como gestor de paquetes.

### Requisitos Previos
- Node.js (v18+)

### Comandos de Desarrollo

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/Portafolio-Fabian-Sanchez.git
cd Portafolio-Fabian-Sanchez

# 2. Instalar las dependencias exactas
npm install

# 3. Levantar el servidor de desarrollo ultra-rápido de Vite
npm run dev
```

### Compilación para Producción

```bash
# Genera los archivos estáticos minificados en la carpeta /dist
npm run build

# Levanta un servidor local simulando el entorno real de producción
npm run preview
```

### 📱 Pruebas de Rendimiento Móvil (GPU Test)
Para validar el rendimiento bruto de los shaders de Three.js en un dispositivo celular:
1. Asegúrate de que tu computadora y tu celular estén conectados a la misma red Wi-Fi.
2. Levanta el servidor exponiendo tu IP local en la red:
   ```bash
   npm run dev -- --host
   ```
3. Vite imprimirá una dirección IP en la terminal (ej. `http://192.168.1.5:5173`). Ábrela directamente en el navegador de tu celular.

---
*Diseñado y desarrollado con pasión por la estética visual y la optimización extrema del código.*