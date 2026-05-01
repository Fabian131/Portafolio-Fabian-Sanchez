# Portafolio Personal Desarrollado con React

Un portafolio web moderno e interactivo construido con React, Vite y tecnologías de vanguardia. Este proyecto showcase presenta un diseño elegante con animaciones sofisticadas, efectos 3D y una experiencia de usuario premium.

## 🚀 Características Principales

### 🎨 Diseño y UX
- **Tema Claro/Oscuro**: Sistema de temas personalizable con transiciones suaves
- **Diseño Responsivo**: Adaptación perfecta para móviles, tablets y desktop
- **Animaciones Fluidas**: Micro-interacciones y transiciones elegantes
- **Efectos Glassmorphism**: Tarjetas con efecto cristal y efectos de profundidad

### ⚡ Tecnologías Avanzadas
- **Renderizado 3D con Three.js**: Sistema de partículas interactivas en el fondo
- **Pretext de Cheng Lou**: Motor de renderizado ultra-rápido usando Canvas
- **Liquid Navigation**: Navegación líquida con indicadores dinámicos
- **Magnetic Buttons**: Botones con efecto magnético interactivos

### 🎯 Componentes Premium
- **Typewriter Effect**: Efecto de máquina de escribir para texto dinámico
- **Scroll Reveal**: Animaciones de aparición al hacer scroll
- **Blob Buttons**: Botones con efectos de morfismo fluido
- **Glass Cards**: Tarjetas con efectos de tilt 3D y glassmorfismo

## 🛠️ Stack Tecnológico

### Frontend
- **React 19.2.4** - Librería principal de UI
- **Vite 8.0.1** - Herramienta de build y desarrollo
- **TailwindCSS 4.2.2** - Framework de CSS utility-first
- **PostCSS** - Procesador de CSS

### Librerías Especializadas
- **Three.js 0.183.2** - Gráficos 3D y WebGL (2000 partículas optimizadas)
- **@chenglou/pretext 0.0.3** - Motor de renderizado de texto ultra-rápido
- **liquid-glass-react 1.1.1** - Efectos de glassmorfismo
- **react-magic-ui 1.0.9** - Componentes UI mágicos
- **lucide-react 1.7.0** - Iconos modernos
- **framer-motion 12.38.0** - Animaciones y transiciones fluidas

### Desarrollo
- **ESLint** - Linting y calidad de código
- **Autoprefixer** - Compatibility de CSS
- **TypeScript Support** - Tipado opcional disponible

## 📁 Estructura del Proyecto

```
portafolio/
├── public/
│   ├── favicon.svg          # Favicon personalizado
│   ├── icons.svg           # Iconos SVG
│   └── img/                # Imágenes estáticas
├── src/
│   ├── assets/
│   │   ├── hero.png        # Imagen principal
│   │   ├── react.svg       # Logo React
│   │   └── vite.svg        # Logo Vite
│   ├── hooks/              # Hooks personalizados optimizados
│   │   ├── useIntersectionObserver.js
│   │   └── useThrottle.js
│   ├── utils/              # Utilidades de performance
│   │   └── performance.js
│   ├── App.jsx             # Componente principal optimizado (1300+ líneas)
│   ├── App.css             # Estilos personalizados
│   ├── index.css           # Estilos globales
│   └── main.jsx            # Punto de entrada
├── dist/                   # Build de producción
└──配置文件/
    ├── package.json        # Dependencias y scripts
    ├── vite.config.js      # Configuración de Vite
    ├── tailwind.config.js  # Configuración de Tailwind
    └── eslint.config.js    # Configuración de ESLint
```

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd portafolio

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### Scripts Disponibles
```bash
npm run dev      # Servidor de desarrollo con HMR
npm run build    # Build de producción optimizado
npm run preview  # Previsualizar build de producción
npm run lint     # Ejecutar ESLint
```

## 🎨 Características Técnicas Destacadas

### Motor 3D Optimizado
- **Sistema de partículas**: 2000 partículas con interacción mouse
- **Optimización de memoria**: Gestión eficiente de buffers y geometrías
- **Efectos de niebla**: Atmósfera 3D con fog exp2
- **Renderizado adaptativo**: Ajuste dinámico de calidad según dispositivo

### Pretext Rendering System
- **Canvas-based rendering**: Evita reflows del DOM
- **Segmentación inteligente**: Análisis ultra-rápido de texto
- **SEO Friendly**: Contenido accesible via sr-only
- **Responsive typography**: Ajuste automático de fuentes

### Componentes Interactivos
- **Magnetic interactions**: Efectos de atracción magnética
- **3D tilt effects**: Transformaciones 3D en tarjetas
- **Smooth scroll**: Navegación suave entre secciones
- **Liquid animations**: Transiciones fluidas y orgánicas

## 📱 Responsive Design

El portafolio está optimizado para todos los dispositivos:

- **Mobile (< 768px)**: Navegación hamburguesa, layouts apilados
- **Tablet (768px - 1024px)**: Diseño adaptativo con navegación simplificada
- **Desktop (> 1024px)**: Experiencia completa con todos los efectos

## 🎯 Secciones del Portafolio

1. **Inicio**: Hero section con efecto typewriter y fondo 3D
2. **Sobre Mí**: Información personal con animaciones scroll-reveal
3. **Habilidades**: Tecnologías y competencias con iconos interactivos
4. **Proyectos**: Portfolio de trabajos con cards glassmórficos
5. **Contacto**: Formulario de contacto y redes sociales

## 🌟 Optimizaciones de Rendimiento (Actualizado 2026)

### 🚀 Mejoras Implementadas
- **React.memo**: Memoización de componentes para evitar re-renders innecesarios
- **useCallback**: Event handlers optimizados con caching de funciones
- **useMemo**: Datos estáticos cacheados para mejor rendimiento
- **Frame Limiting**: Motor 3D limitado a 60 FPS para consistencia
- **Debouncing**: Scroll y resize events con debouncing inteligente
- **RequestAnimationFrame**: Animaciones sincronizadas con el navegador
- **Memory Management**: Cleanup proper de timeouts, listeners y recursos Three.js
- **Code Splitting**: División inteligente con manualChunks en Vite
- **Lazy Loading**: Componentes cargados bajo demanda
- **Intersection Observer**: Detección eficiente de visibilidad

### 📊 Métricas de Build Optimizado
- **vendor**: 186.99 kB (React core) gzipped
- **three**: 501.75 kB (Three.js) gzipped  
- **framer**: 129.14 kB (Framer Motion) gzipped
- **Total**: ~255KB gzipped para producción

### 🎯 Hooks Personalizados Creados
- `useIntersectionObserver`: Lazy loading optimizado
- `useThrottle`: Control de frecuencia de eventos
- Utilidades de performance en `/src/utils/performance.js`

### ⚡ Mejoras Técnicas
- **Canvas Rendering**: Pretext optimizado con debouncing y cleanup
- **3D Engine**: 2000 partículas manteniendo alto rendimiento
- **Event Handlers**: Magnetic buttons y glass cards con RAF
- **Navigation**: Liquid nav con indicadores optimizados
- **Scroll Performance**: Throttle y debounce en scroll events

## 🔧 Configuración y Personalización

### Temas
El proyecto incluye soporte para temas claro/oscuro:
```javascript
const [theme, setTheme] = useState('dark');
```

### Colores y Estilos
Los colores están definidos mediante TailwindCSS y pueden personalizarse en `tailwind.config.js`.

### Efectos 3D
La configuración del sistema de partículas puede ajustarse en el componente `Background3D`.

## 📄 Licencia

Este proyecto es de uso personal y demostrativo.

## 🤝 Contribuciones

Las sugerencias y mejoras son bienvenidas. Por favor, crea un issue para discutir cambios significativos.

---

**Desarrollado con ❤️ usando React, Vite y tecnologías de vanguardia**
