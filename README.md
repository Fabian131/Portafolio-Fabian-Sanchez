# Portafolio Personal — Fabián Sánchez Salinas

Portfolio profesional de desarrollo full stack. Aplicación de página única (SPA) construida con React 19 y Vite 8, con un sistema de partículas 3D interactivo acelerado por GPU como fondo global. Diseñado con una arquitectura de separación estricta entre lógica y presentación.

**Sitio en producción:** [portafolio-fabian-sanchez-salinas.netlify.app](https://portafolio-fabian-sanchez-salinas.netlify.app/)

---

## Tabla de contenidos

- [Stack tecnológico](#stack-tecnológico)
- [Arquitectura del proyecto](#arquitectura-del-proyecto)
- [Estructura de archivos](#estructura-de-archivos)
- [Decisiones técnicas relevantes](#decisiones-técnicas-relevantes)
- [Variables de entorno](#variables-de-entorno)
- [Instalación y desarrollo local](#instalación-y-desarrollo-local)
- [Despliegue](#despliegue)
- [Licencia](#licencia)

---

## Stack tecnológico

**Runtime y build:**
React 19 · Vite 8 · ES2022 target

**Estilos:**
Tailwind CSS 4 (plugin nativo de Vite, sin PostCSS plugin legacy) · LightningCSS

**3D y WebGL:**
Three.js 0.183 — sistema de partículas con shader injection vía `material.onBeforeCompile`

**Animación:**
Framer Motion 13 · GSAP 3.15

**Iconografía:**
Lucide React · Phosphor Icons

**Servicios externos:**
EmailJS (formulario de contacto)

**Infraestructura:**
Netlify (CDN + headers de cache inmutable para assets hasheados)

---

## Arquitectura del proyecto

El código sigue dos principios organizativos aplicados de forma estricta:

### Clean Architecture

Toda la lógica de negocio, gestión de estado, suscripciones a eventos del DOM, cálculos de física y efectos secundarios reside exclusivamente en custom hooks dentro de `src/hooks/`. Los componentes JSX son presentacionales: reciben datos y callbacks por props, renderizan HTML, y no contienen lógica propia. Esto permite testear, reemplazar o refactorizar la lógica sin tocar la UI, y viceversa.

### Atomic Design

La capa de presentación (`src/components/`) está segmentada en tres niveles jerárquicos:

- **Átomos** (`atoms/`): Elementos indivisibles — un botón, un icono, un wrapper de scroll-reveal. No dependen de otros componentes del proyecto.
- **Moléculas** (`molecules/`): Composiciones de átomos que forman una unidad funcional — una tarjeta de proyecto, un formulario de contacto, un lightbox de imagen.
- **Organismos** (`organisms/`): Secciones completas de la página que componen la aplicación final — Hero, About, Skills, Projects, Contact, Footer, y la navegación.

Cada componente vive en su propia carpeta con su nombre, lo que permite agregar estilos CSS colocados (`ComponentName.css`) o subcomponentes internos sin contaminar el árbol.

---

## Estructura de archivos

```
Portafolio-Fabian-Sanchez/
├── public/
│   ├── assets/
│   │   └── 3d/                                         # Modelos 3D (reservado)
│   ├── cv/
│   │   ├── Fabian_Sanchez_Salinas_CV_EN.pdf
│   │   └── Fabian_Sanchez_Salinas_CV_ES.pdf
│   ├── fonts/
│   │   └── avant-garde.woff2                            # Tipografía principal preloaded
│   ├── img/
│   │   └── photo.webp                                   # Foto de perfil preloaded
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   │   ├── img/                                         # Imágenes de proyectos y galería
│   │   │   ├── 1a47c9ba-828d-4ce8-918f-0a1006de19fb.jpeg
│   │   │   ├── 21af02dc-ff65-422f-ac65-98d939e25e3a.jpeg
│   │   │   ├── IMG_0158.JPG.jpeg
│   │   │   ├── IMG_0780.jpeg
│   │   │   ├── IMG_0869.jpeg
│   │   │   ├── IMG_0880.jpeg
│   │   │   └── WhatsApp Image 2025-10-29 at 18.55.54_1f1ca100.jpg
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── components/
│   │   ├── atoms/
│   │   │   ├── backgrounds/
│   │   │   │   └── Background3D/
│   │   │   │       └── Background3D.jsx                 # Monta el canvas WebGL via useBackground3D
│   │   │   ├── buttons/
│   │   │   │   ├── BlobButton/
│   │   │   │   │   └── BlobButton.jsx                   # Botón con deformación fluida SVG
│   │   │   │   └── MagneticButton/
│   │   │   │       └── MagneticButton.jsx               # Botón que sigue el cursor con física de resorte
│   │   │   ├── layout/
│   │   │   │   ├── GlassCard/
│   │   │   │   │   └── GlassCard.jsx                    # Tarjeta translúcida con inclinación 3D al cursor
│   │   │   │   └── ScrollReveal/
│   │   │   │       └── ScrollReveal.jsx                 # Wrapper de aparición animada al entrar en viewport
│   │   │   ├── typography/
│   │   │   │   └── TypeAsync/
│   │   │   │       └── TypeAsync.jsx                    # Efecto typewriter con borrado y ciclo de palabras
│   │   │   └── ui/
│   │   │       ├── Icons/
│   │   │       │   └── Icons.jsx                        # Mapa centralizado de iconos SVG
│   │   │       └── LanguageSwitcher/
│   │   │           └── LanguageSwitcher.jsx              # Selector de idioma ES/EN
│   │   ├── molecules/
│   │   │   ├── ContactForm/
│   │   │   │   └── ContactForm.jsx                      # Formulario de contacto con EmailJS
│   │   │   ├── DepthCarousel/
│   │   │   │   ├── DepthCarousel.css
│   │   │   │   └── DepthCarousel.jsx                    # Carrusel de imágenes con efecto de profundidad (GSAP)
│   │   │   ├── DraggableMarquee/
│   │   │   │   └── DraggableMarquee.jsx                 # Marquee de skills arrastrable con física de inercia
│   │   │   ├── GlassDock/
│   │   │   │   └── GlassDock.jsx                        # Dock flotante estilo macOS con Framer Motion
│   │   │   ├── GlassToast/
│   │   │   │   └── GlassToast.jsx                       # Notificación toast translúcida con auto-dismiss
│   │   │   ├── ImageLightbox/
│   │   │   │   ├── ImageLightbox.css
│   │   │   │   └── ImageLightbox.jsx                    # Lightbox a pantalla completa con zoom y cierre
│   │   │   ├── ProjectCard/
│   │   │   │   └── ProjectCard.jsx                      # Card de proyecto con galería, tags y enlaces
│   │   │   ├── SectionHeader/
│   │   │   │   └── SectionHeader.jsx                    # Header de sección con subtítulo y animación
│   │   │   └── SkillCard/
│   │   │       ├── SkillCard.css
│   │   │       └── SkillCard.jsx                        # Card de habilidad técnica con icono y nivel
│   │   └── organisms/
│   │       ├── AboutSection/
│   │       │   └── AboutSection.jsx                     # Sección "Sobre Mí" con carrusel y biografía
│   │       ├── BackgroundOrganism/
│   │       │   └── BackgroundOrganism.jsx               # Wrapper con React.lazy y Suspense para Background3D
│   │       ├── ContactSection/
│   │       │   └── ContactSection.jsx                   # Sección de contacto con formulario y redes sociales
│   │       ├── Footer/
│   │       │   └── Footer.jsx                           # Footer con créditos y enlaces
│   │       ├── HeroSection/
│   │       │   └── HeroSection.jsx                      # Hero con foto, typewriter, dock y descarga de CV
│   │       ├── LiquidNav/
│   │       │   ├── LiquidNav.css                        # Animaciones SVG del indicador líquido
│   │       │   └── LiquidNav.jsx                        # Navegación flotante con gota líquida indicadora
│   │       ├── ProjectsSection/
│   │       │   └── ProjectsSection.jsx                  # Grid de proyectos con lightbox integrado
│   │       └── SkillsSection/
│   │           └── SkillsSection.jsx                    # Sección de habilidades con marquee y cards
│   ├── constants/
│   │   └── background3D.js                              # Temas de color, conteo de partículas, config de onda
│   ├── data/
│   │   ├── translations/
│   │   │   ├── en.js                                    # Diccionario inglés completo
│   │   │   ├── es.js                                    # Diccionario español completo
│   │   │   └── index.js                                 # Barrel de exportación de idiomas
│   │   ├── navigation.js                                # IDs de secciones (single source of truth)
│   │   ├── projects.js                                  # Datos de proyectos (título, descripción, imágenes, tags)
│   │   ├── skills.jsx                                   # Definición de habilidades por categoría
│   │   └── social.js                                    # Enlaces a GitHub, LinkedIn, email
│   ├── hooks/
│   │   ├── useAboutSection.js                           # Lógica de IntersectionObserver para About
│   │   ├── useBackground3D.js                           # Motor Three.js completo: escena, shader, animación
│   │   ├── useContactForm.js                            # Integración con EmailJS y validación
│   │   ├── useContactSection.js                         # Lógica de estado de la sección de contacto
│   │   ├── useDepthCarousel.js                          # Control de GSAP para el carrusel de profundidad
│   │   ├── useDraggableMarquee.js                       # Física de arrastre y velocidad para el marquee
│   │   ├── useFooter.js                                 # Lógica del footer
│   │   ├── useGlassCard.js                              # Cálculos de inclinación 3D por posición del cursor
│   │   ├── useGlassDock.js                              # Escalado por proximidad estilo macOS dock
│   │   ├── useHeroSection.js                            # Orquestación del Hero (typewriter, dock, descarga)
│   │   ├── useImageLightbox.js                          # Apertura, cierre y navegación del lightbox
│   │   ├── useIntersectionObserver.js                   # Hook genérico de IntersectionObserver reutilizable
│   │   ├── useLanguageSwitcher.js                       # Gestión de idioma activo con persistencia
│   │   ├── useLiquidNav.js                              # Cálculo de posición de la gota líquida en el nav
│   │   ├── useMagneticButton.js                         # Física de atracción magnética del cursor
│   │   ├── usePerformanceMonitor.js                     # Monitor de FPS para degradación automática
│   │   ├── useProjectCard.js                            # Lógica de expansión y galería de ProjectCard
│   │   ├── useProjectsSection.js                        # Filtrado y layout de la grilla de proyectos
│   │   ├── useReducedMotion.js                          # Detección de prefers-reduced-motion del SO
│   │   ├── useSkillsSection.js                          # Lógica de filtrado por categoría de skills
│   │   ├── useThrottle.js                               # Utilidad de throttling reutilizable
│   │   └── useTranslation.js                            # Hook global de internacionalización (ES/EN)
│   ├── utils/
│   │   ├── breakpoints.js                               # Breakpoints sincronizados con Tailwind (sm/md/lg)
│   │   ├── performance.js                               # debounce, throttle, lazyLoad genéricos
│   │   └── typography.js                                # Utilidades tipográficas
│   ├── App.css                                          # Estilos globales de la aplicación
│   ├── App.jsx                                          # Layout raíz, providers de tema e idioma
│   ├── index.css                                        # Reset CSS y variables de diseño
│   └── main.jsx                                         # Punto de entrada de React (StrictMode)
├── .env.example                                         # Plantilla de variables de entorno requeridas
├── .gitignore
├── README.md
├── eslint.config.mjs                                    # ESLint 9 flat config con React hooks
├── index.html                                           # Shell HTML con preloads, meta OG y anti-FOUC
├── netlify.toml                                         # Headers de cache inmutable para assets hasheados
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── tailwind.config.mjs
└── vite.config.mjs                                      # Code-splitting manual (vendor/three/icons chunks)
```

---

## Decisiones técnicas relevantes

### Renderizado 3D: de CPU a GPU

El fondo de partículas renderiza entre 950 (móvil) y 2000 (escritorio) esferas con ondas trigonométricas. En la implementación inicial, un bucle `for` en JavaScript calculaba `Math.sin` y `Math.cos` por cada partícula en cada frame, forzando una resubida completa del buffer de posiciones a la VRAM (`needsUpdate = true`). Esto asfixiaba la CPU en dispositivos de gama baja.

La solución fue inyectar la fórmula directamente en el vertex shader del `PointsMaterial` de Three.js mediante `material.onBeforeCompile`. JavaScript ahora solo envía un único número (`uTime`) a la GPU por frame. La tarjeta gráfica calcula las 2000 posiciones en paralelo con costo prácticamente nulo. Se conserva el `PointsMaterial` nativo intacto (atenuación por perspectiva, blending aditivo, textura alfa), evitando cualquier regresión visual.

El tiempo se acumula con un delta capado a 50ms para prevenir saltos cuando el usuario regresa de otra pestaña.

### Internacionalización sin librerías externas

En lugar de usar `react-i18next` o `react-intl` (que agregan peso al bundle), se implementó un sistema propio con diccionarios estáticos (`data/translations/`) y un hook global (`useTranslation`) que resuelve claves anidadas por punto. Los labels de navegación se resuelven como `t('nav.home')`.

### Build y code-splitting

Vite está configurado con `manualChunks` para separar el bundle en:
- `vendor` — React y ReactDOM
- `three` — Three.js (~500kb, cargado diferido con `React.lazy`)
- `icons` — Lucide React

El `BackgroundOrganism` envuelve a `Background3D` en `React.lazy` + `Suspense`, de modo que Three.js no bloquea el renderizado inicial. En móvil, la carga del fondo 3D se retrasa hasta la primera interacción del usuario o 3.5 segundos, lo que ocurra primero.

### Caching en producción

`netlify.toml` configura headers de cache diferenciados:
- `index.html`: `max-age=0, must-revalidate` (siempre fresco)
- `/assets/*`: `max-age=31536000, immutable` (los hashes de Vite garantizan invalidación automática)
- `/fonts/*` y `/img/*`: `max-age=31536000, immutable`

---

## Variables de entorno

El formulario de contacto requiere credenciales de [EmailJS](https://www.emailjs.com/). Copia `.env.example` a `.env` y completa los valores:

```
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
```

El sitio funciona completamente sin estas variables — simplemente el envío del formulario no se ejecutará.

---

## Instalación y desarrollo local

**Requisitos:** Node.js 18+

```bash
git clone https://github.com/Fabian131/Portafolio-Fabian-Sanchez.git
cd Portafolio-Fabian-Sanchez
npm install
npm run dev
```

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo con HMR (`--host` habilitado) |
| `npm run build` | Compila para producción en `dist/` |
| `npm run preview` | Sirve el build de producción localmente |
| `npm run lint` | Ejecuta ESLint con flat config |

Para probar en un dispositivo móvil conectado a la misma red, abre la dirección IP que Vite imprime en la terminal (ej. `http://192.168.1.x:5173`).

---

## Despliegue

El proyecto está configurado para despliegue automático en Netlify. Cada push a la rama principal dispara un build con los siguientes parámetros (definidos en `netlify.toml`):

- **Build command:** `vite build`
- **Publish directory:** `dist`

---

## Licencia

Proyecto personal de portafolio. Uso libre como referencia arquitectónica.