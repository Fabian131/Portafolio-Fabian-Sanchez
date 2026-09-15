import React, { useEffect, useRef, memo, useCallback, useState } from 'react';
import * as THREE from 'three';
import { MOBILE_MAX } from '../../utils/breakpoints';

const THEMES = {
  dark: {
    bg: new THREE.Color('#03050a'),
    color1: new THREE.Color(0x0ea5e9),
    color2: new THREE.Color(0x8b5cf6),
    particleSize: 0.3,
    opacity: 0.8,
    fogDensity: 0.03,
  },
  light: {
    bg: new THREE.Color('#DADADC'), // Apple-style light gray
    color1: new THREE.Color(0x0284c7), // sky-600
    color2: new THREE.Color(0x7e22ce), // purple-700
    particleSize: 0.45,
    opacity: 0.85,
    fogDensity: 0.02,
  },
};

const Background3D = memo(({ theme, performanceTier = 'high' }) => {
  const mountRef = useRef(null);
  const animationFrameRef = useRef(null);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= MOBILE_MAX);
  const perfRef = useRef(performanceTier);
  perfRef.current = performanceTier;

  // Track theme as a ref so the animate loop can read it without re-creating the scene
  const themeRef = useRef(theme);
  themeRef.current = theme;

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= MOBILE_MAX;
      setIsMobile(prev => prev !== mobile ? mobile : prev);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

    const mountElement = mountRef.current;
    mountElement.innerHTML = '';

    // Start with current theme
    const isDark = theme === 'dark';
    const initialTheme = THEMES[isDark ? 'dark' : 'light'];

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 15);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 2));

    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';

    mountElement.appendChild(renderer.domElement);

    const isLowPerf = perfRef.current === 'low';
    let particleCount = isMobile ? 950 : 2000;

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    // Store per-particle random mix factors so we can re-lerp on theme change
    const mixFactors = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 40;
      positions[i3 + 1] = (Math.random() - 0.5) * 10;
      positions[i3 + 2] = (Math.random() - 0.5) * 40;

      mixFactors[i] = Math.random();
      const mixedColor = initialTheme.color1.clone().lerp(initialTheme.color2, mixFactors[i]);
      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleTexture = createParticleTexture();
    const material = new THREE.PointsMaterial({
      size: initialTheme.particleSize,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      opacity: initialTheme.opacity,
      blending: (isDark && !isLowPerf) ? THREE.AdditiveBlending : THREE.NormalBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Fog — only on desktop
    let fog = null;
    if (!isMobile) {
      fog = new THREE.FogExp2(initialTheme.bg.getHex(), initialTheme.fogDensity);
      scene.fog = fog;
    }

    // --- Transition state ---
    let currentOpacity = initialTheme.opacity;
    let currentSize = initialTheme.particleSize;
    const currentColor1 = initialTheme.color1.clone();
    const currentColor2 = initialTheme.color2.clone();
    const currentFogColor = initialTheme.bg.clone();
    let currentBlending = material.blending;

    // Start state for lerping
    let startOpacity = currentOpacity;
    let startSize = currentSize;
    const startColor1 = currentColor1.clone();
    const startColor2 = currentColor2.clone();
    const startFogColor = currentFogColor.clone();

    let activeThemeTarget = themeRef.current;
    let transitionProgress = 1.0; // 1.0 means no transition is active

    // Transition speed (0 to 1 per frame) — 0.015 is ~1.1s at 60fps
    const TRANSITION_SPEED = 0.015;
    // Reusable temp color to avoid GC pressure
    const tmpColor = new THREE.Color();

    let scrollY = window.scrollY;
    let targetScrollY = window.scrollY;
    const onScroll = () => { targetScrollY = window.scrollY; };
    window.addEventListener('scroll', onScroll, { passive: true });

    if (!isMobile) {
      let mouseX = 0;
      let mouseY = 0;
      const onMouseMove = (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      };
      window.addEventListener('mousemove', onMouseMove, { passive: true });

      const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', onResize, { passive: true });

      let lastTime = 0;
      const targetFPS = 60;
      const frameInterval = 1000 / targetFPS;
      let firstFrame = true;
      const startTime = performance.now();

      const animate = (currentTime) => {
        animationFrameRef.current = requestAnimationFrame(animate);

        const deltaTime = currentTime - lastTime;
        if (deltaTime < frameInterval) return;

        lastTime = currentTime - (deltaTime % frameInterval);
        const time = (currentTime - startTime) * 0.0002;

        // --- Animate theme transition ---
        if (activeThemeTarget !== themeRef.current) {
          activeThemeTarget = themeRef.current;
          transitionProgress = 0.0;
          
          startOpacity = currentOpacity;
          startSize = currentSize;
          startColor1.copy(currentColor1);
          startColor2.copy(currentColor2);
          startFogColor.copy(currentFogColor);
        }

        if (transitionProgress < 1.0) {
          transitionProgress += TRANSITION_SPEED;
          if (transitionProgress > 1.0) transitionProgress = 1.0;

          // Smooth step easing
          const ease = transitionProgress * transitionProgress * (3 - 2 * transitionProgress);
          const target = THEMES[activeThemeTarget === 'dark' ? 'dark' : 'light'];

          currentColor1.copy(startColor1).lerp(target.color1, ease);
          currentColor2.copy(startColor2).lerp(target.color2, ease);
          currentOpacity = THREE.MathUtils.lerp(startOpacity, target.opacity, ease);
          currentSize = THREE.MathUtils.lerp(startSize, target.particleSize, ease);

          // Update particle colors only when transitioning to save performance
          const colorsArr = particles.geometry.attributes.color.array;
          for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            tmpColor.copy(currentColor1).lerp(currentColor2, mixFactors[i]);
            colorsArr[i3] = tmpColor.r;
            colorsArr[i3 + 1] = tmpColor.g;
            colorsArr[i3 + 2] = tmpColor.b;
          }
          particles.geometry.attributes.color.needsUpdate = true;

          material.opacity = currentOpacity;
          material.size = currentSize;

          // Switch blending mode in the middle of transition
          const targetBlending = (activeThemeTarget === 'dark' && !isLowPerf) ? THREE.AdditiveBlending : THREE.NormalBlending;
          if (currentBlending !== targetBlending && transitionProgress > 0.5) {
            currentBlending = targetBlending;
            material.blending = targetBlending;
            material.needsUpdate = true;
          }

          // Animate fog color
          if (fog) {
            currentFogColor.copy(startFogColor).lerp(target.bg, ease);
            fog.color.copy(currentFogColor);
          }
        }

        // --- Standard animation ---
        scrollY += (targetScrollY - scrollY) * 0.05;
        const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const progress = scrollY / maxScroll;

        const positionsArr = particles.geometry.attributes.position.array;
        for (let i = 0; i < particleCount * 3; i += 3) {
          const x = positionsArr[i];
          const z = positionsArr[i + 2];
          positionsArr[i + 1] = Math.sin(x * 0.5 + time) * 1.5 + Math.cos(z * 0.5 + time) * 1.5;
        }
        particles.geometry.attributes.position.needsUpdate = true;

        camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
        camera.position.y += (-mouseY * 2 + 5 - camera.position.y) * 0.05;
        camera.position.z = THREE.MathUtils.lerp(15, 5, progress);
        particles.rotation.y = progress * Math.PI;

        camera.lookAt(scene.position);
        renderer.render(scene, camera);
        if (firstFrame) {
          firstFrame = false;
          document.documentElement.classList.add('bg-loaded');
        }
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

        if (mountElement) mountElement.innerHTML = '';
      };
    }

    // --- Mobile path ---
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize, { passive: true });

    let lastTime = 0;
    const targetFPS = 30;
    const frameInterval = 1000 / targetFPS;
    let firstFrame = true;
    const startTime = performance.now();

    const animate = (currentTime) => {
      animationFrameRef.current = requestAnimationFrame(animate);

      const deltaTime = currentTime - lastTime;
      if (deltaTime < frameInterval) return;

      lastTime = currentTime - (deltaTime % frameInterval);
      const time = (currentTime - startTime) * 0.0002;

      // --- Animate theme transition (mobile) ---
      if (activeThemeTarget !== themeRef.current) {
        activeThemeTarget = themeRef.current;
        transitionProgress = 0.0;
        
        startOpacity = currentOpacity;
        startSize = currentSize;
        startColor1.copy(currentColor1);
        startColor2.copy(currentColor2);
      }

      if (transitionProgress < 1.0) {
        transitionProgress += TRANSITION_SPEED;
        if (transitionProgress > 1.0) transitionProgress = 1.0;

        const ease = transitionProgress * transitionProgress * (3 - 2 * transitionProgress);
        const target = THEMES[activeThemeTarget === 'dark' ? 'dark' : 'light'];

        currentColor1.copy(startColor1).lerp(target.color1, ease);
        currentColor2.copy(startColor2).lerp(target.color2, ease);
        currentOpacity = THREE.MathUtils.lerp(startOpacity, target.opacity, ease);
        currentSize = THREE.MathUtils.lerp(startSize, target.particleSize, ease);

        const colorsArr = particles.geometry.attributes.color.array;
        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          tmpColor.copy(currentColor1).lerp(currentColor2, mixFactors[i]);
          colorsArr[i3] = tmpColor.r;
          colorsArr[i3 + 1] = tmpColor.g;
          colorsArr[i3 + 2] = tmpColor.b;
        }
        particles.geometry.attributes.color.needsUpdate = true;

        material.opacity = currentOpacity;
        material.size = currentSize;

        const targetBlending = (activeThemeTarget === 'dark') ? THREE.AdditiveBlending : THREE.NormalBlending;
        if (currentBlending !== targetBlending && transitionProgress > 0.5) {
          currentBlending = targetBlending;
          material.blending = targetBlending;
          material.needsUpdate = true;
        }
      }

      // --- Standard mobile animation ---
      const positionsArr = particles.geometry.attributes.position.array;
      for (let i = 0; i < particleCount * 3; i += 3) {
        const x = positionsArr[i];
        const z = positionsArr[i + 2];
        positionsArr[i + 1] = Math.sin(x * 0.5 + time) * 1.5 + Math.cos(z * 0.5 + time) * 1.5;
      }
      particles.geometry.attributes.position.needsUpdate = true;

      camera.lookAt(scene.position);
      renderer.render(scene, camera);
      if (firstFrame) {
        firstFrame = false;
        document.documentElement.classList.add('bg-loaded');
      }
    };
    animate(0);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);

      if (geometry) geometry.dispose();
      if (material) material.dispose();
      if (particleTexture) particleTexture.dispose();
      if (renderer) renderer.dispose();

      if (mountElement) mountElement.innerHTML = '';
    };
  }, [isMobile, createParticleTexture]); // NOTE: `theme` removed — transitions are animated in-place

  return <div ref={mountRef} className="fixed inset-0 z-[0] w-full h-screen overflow-hidden pointer-events-none" />;
});

Background3D.displayName = 'Background3D';

export default Background3D;