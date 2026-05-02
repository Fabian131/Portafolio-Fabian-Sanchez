# Plan de Refactorización: App.jsx

Este documento detalla los pasos para refactorizar `App.jsx` y alinearlo con una arquitectura de Componentes Atómicos, mejorando su estructura y mantenibilidad.

## Fase 0: Preparación
- [ ] **Control de Versiones**: Asegúrate de que todos los cambios actuales estén en un commit de `git`. Crea una nueva rama para la refactorización (ej: `feature/refactor-atomic-design`).
- [ ] **Linter/Formatter**: Verifica que las herramientas de calidad de código (ESLint, Prettier) estén funcionando correctamente.

## Fase 1: Estructura de Carpetas

- [ ] Crear la carpeta `src/components/molecules`.
- [ ] Crear la carpeta `src/components/organisms`.

## Fase 2: Creación de Componentes (Moléculas)

El objetivo es extraer la lógica en componentes reutilizables, dejando a `App.jsx` como el ensamblador principal.

### 2.1 Refactorizar `GlassCard`
- [ ] **Mover `GlassCard.jsx`**: El componente `GlassCard` es más una molécula que un átomo. Mover el archivo de `src/components/atoms/GlassCard.jsx` a `src/components/molecules/GlassCard.jsx`.
- [ ] Actualizar las importaciones en todos los archivos donde se utilice.

### 2.2 Crear `SectionHeader.jsx` (Molécula)
- [ ] Crear el archivo `src/components/molecules/SectionHeader.jsx`.
- [ ] Extraer el JSX que se usa como título en las secciones (ej. líneas `~120-125` en `App.jsx`).
- [ ] El componente debe aceptar props como `title` y `subtitle`.
- [ ] Reemplazar los títulos estáticos en `App.jsx` con `<SectionHeader title="..." subtitle="..." />`.

### 2.3 Crear `ProjectCard.jsx` (Molécula)
- [ ] Crear `src/components/molecules/ProjectCard.jsx`.
- [ ] Mover la lógica y JSX para renderizar una tarjeta de proyecto (líneas `~234-315`) a este componente.
- [ ] El componente recibirá `project` como prop.
- [ ] Dentro del loop `.map` de proyectos en `App.jsx`, renderizar `<ProjectCard />` en lugar del código actual.

## Fase 3: Creación de Organismos

Los organismos son las secciones principales de tu página. Vivirán en `src/components/organisms`.

### 3.1 Crear `Header.jsx`
- [ ] Crear `src/components/organisms/Header.jsx`.
- [ ] Mover el JSX del `header` de `App.jsx` (líneas `~33-68`) a este archivo.
- [ ] Importar y usar `<Header />` en `App.jsx`.

### 3.2 Crear `Hero.jsx`
- [ ] Crear `src/components/organisms/Hero.jsx`.
- [ ] Mover el JSX de la sección "Hero" (líneas `~70-117`) a este archivo.
- [ ] Este componente probablemente necesite importar `TypeAsync`.
- [ ] Importar y usar `<Hero />` en `App.jsx`.

### 3.3 Crear `Skills.jsx`
- [ ] Crear `src/components/organisms/Skills.jsx`.
- [ ] Mover la lógica y el JSX de la sección de "Skills" (líneas `~119-218`) a este archivo.
- [ ] Pasar `skills` como una prop desde `App.jsx`.
- [ ] Importar y usar `<Skills skills={skills} />` en `App.jsx`.

### 3.4 Crear `Projects.jsx`
- [ ] Crear `src/components/organisms/Projects.jsx`.
- [ ] Mover la lógica y el JSX de la sección de "Projects" (líneas `~220-319`) a este archivo.
- [ ] Usar el componente `ProjectCard.jsx` creado en la Fase 2.
- [ ] Pasar `projects` como una prop desde `App.jsx`.
- [ ] Importar y usar `<Projects projects={projects} />` en `App.jsx`.

### 3.5 Crear `Footer.jsx`
- [ ] Crear `src/components/organisms/Footer.jsx`.
- [ ] Mover el JSX del `footer` (líneas `~321-365`) a este archivo.
- [ ] Pasar `social` como una prop desde `App.jsx`.
- [ ] Importar y usar `<Footer social={social} />` en `App.jsx`.

## Fase 4: Limpieza Final

- [ ] Revisar `App.jsx`. Ahora debería ser un archivo mucho más pequeño y legible, compuesto principalmente por la carga de datos y la renderización de los organismos.
- [ ] Eliminar todas las importaciones que ya no se usan en `App.jsx` (como `GlassCard`, `TypeAsync`, etc.).
- [ ] Ejecutar el formateador de código (ej. `prettier --write .`) para asegurar consistencia.

## Fase 5: Verificación y Cierre

- [ ] **Verificación Funcional**: Navegar por la aplicación y confirmar que todo funciona y se ve exactamente igual que antes.
- [ ] **Revisión de Estilos**: Asegurarse de que los estilos no se hayan roto. Si algún componente nuevo necesita sus propios estilos, crear un archivo `.css` o `.module.css` en la misma carpeta del componente.
- [ ] **Merge**: Una vez verificado, hacer un commit final y fusionar la rama de vuelta a `main` o `develop`.
- [ ] Marcar todas las casillas de este plan.
