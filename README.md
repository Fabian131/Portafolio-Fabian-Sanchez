# Portafolio Personal - Fabian Sanchez Salinas

Portfolio web moderno, interactivo y de alto rendimiento construido con React, Vite y tecnologías de vanguardia. Diseñado siguiendo estrictamente **Clean Architecture** y **Atomic Design** para una máxima escalabilidad y separación de responsabilidades.

**[Ver online](https://portafolio-fabian-sanchez-salinas.netlify.app/)**

---

## 🚀 Tecnologías

### Core
- **React 19** - Librería principal de UI
- **Vite 8** - Herramienta de build y desarrollo ultra-rápida
- **Tailwind CSS 4** - Framework CSS utilitario para diseño responsivo y moderno

### Efectos Visuales y 3D
- **Three.js 0.183** - Sistema de partículas 3D interactivas. Optimizado agresivamente delegando cálculos trigonométricos masivos a la GPU mediante `material.onBeforeCompile`.
- **Framer Motion 12** - Animaciones fluidas, físicas de resorte y transiciones complejas.
- **Glassmorphism** - Componentes translúcidos con efectos de desenfoque nativos.

### Funcionalidades Avanzadas
- **i18n Nativo** - Sistema de internacionalización propio (Inglés/Español) gestionado globalmente.
- **Lucide React** - Iconografía moderna y ligera.

---

## 🏗️ Arquitectura y Diseño

El proyecto ha sido completamente refactorizado para separar la lógica de negocio de la interfaz de usuario:

1. **Clean Architecture:** Toda la lógica pesada, estados, llamadas de ciclos de vida y animaciones complejas residen exclusivamente en **Hooks** (`src/hooks/`). Los componentes son "tontos" (dumb components) y solo se encargan del renderizado visual.
2. **Atomic Design:** La interfaz se descompone en piezas reutilizables y escalables:
   - **Átomos:** Botones, iconos, tipografías, componentes base (Ej. `BlobButton`, `Background3D`).
   - **Moléculas:** Composiciones simples de átomos (Ej. `GlassCard`, `ProjectCard`, `SectionHeader`).
   - **Organismos:** Secciones complejas de la página que agrupan moléculas y manejan su propio lazy loading (Ej. `HeroSection`, `AboutSection`, `BackgroundOrganism`).

---

## 📂 Estructura del Proyecto

```text
portafolio/
├── src/
│   ├── assets/                 # Recursos estáticos e imágenes
│   ├── components/             # Capa de Vista (Atomic Design)
│   │   ├── atoms/              # Botones, fondos, iconos, textos
│   │   ├── molecules/          # Cards, carruseles, formularios, headers
│   │   └── organisms/          # Secciones completas (Hero, About, Projects, etc.)
│   ├── constants/              # Variables globales y configuraciones (Ej. config 3D)
│   ├── data/                   # Capa de Datos
│   │   ├── translations/       # Diccionarios de idiomas (en.js, es.js)
│   │   └── ...                 # Datos duros (proyectos, skills, redes sociales)
│   ├── hooks/                  # Capa de Lógica de Negocio (Clean Architecture)
│   │   └── ...                 # useBackground3D, useHeroSection, useTranslation, etc.
│   ├── utils/                  # Utilidades puras (breakpoints, optimización)
│   ├── App.jsx                 # Layout principal
│   └── main.jsx                # Punto de entrada de React
├── public/                     # Archivos estáticos
├── dist/                       # Build de producción (generado)
├── package.json
└── tailwind.config.mjs
```

---

## ✨ Características Técnicas Destacadas

*   **Fondo WebGL Acelerado por GPU:** El lienzo 3D de esferas está optimizado a nivel de *shaders*. En lugar de usar la CPU para iterar cálculos matemáticos en cada fotograma, se modifican los shaders de Three.js dinámicamente (`onBeforeCompile`), logrando 60 FPS estables incluso en móviles de gama baja.
*   **Lazy Loading:** Componentes pesados (como el lienzo 3D) se cargan de forma diferida (`React.lazy`).
*   **Time Accumulator:** El fondo 3D utiliza un acumulador dinámico basado en `deltaTime` capado a 50ms, evitando saltos bruscos en las olas si el usuario cambia de pestaña.
*   **Navegación Líquida:** El `LiquidNav` incluye un sistema físico de arrastre que mapea dinámicamente la sección activa usando el contexto global de scroll.

---

## 💻 Instalación y Uso

### Comandos Disponibles

```bash
npm run dev      # Iniciar servidor de desarrollo (http://localhost:5173)
npm run build    # Compilar aplicación para producción en la carpeta /dist
npm run preview  # Servir localmente la versión de producción compilada
npm run lint     # Ejecutar análisis estático de código
```

### Cómo ejecutarlo localmente

1. Clona este repositorio:
   ```bash
   git clone https://github.com/tu-usuario/Portafolio-Fabian-Sanchez.git
   ```
2. Entra al directorio del proyecto:
   ```bash
   cd Portafolio-Fabian-Sanchez
   ```
3. Instala las dependencias:
   ```bash
   npm install
   ```
4. Inicia el entorno de desarrollo:
   ```bash
   npm run dev
   ```

### Pruebas en Móvil
Para probar el rendimiento de GPU en tu celular:
1. Conecta tu móvil a la misma red WiFi que tu computadora.
2. En tu computadora corre `npm run dev -- --host` o simplemente mira la IP que te da Vite en la terminal (ej: `http://192.168.1.5:5173`).
3. Ingresa esa IP en el navegador de tu teléfono celular.