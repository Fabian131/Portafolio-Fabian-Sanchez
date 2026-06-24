import React, { useEffect, useRef, memo, useCallback } from 'react';
import * as THREE from 'three';

const Background3D = memo(({ theme }) => {
  const mountRef = useRef(null);
  const animationFrameRef = useRef(null);

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

    const isDark = theme === 'dark';
    const isMobile = window.innerWidth < 768;
    const bgColor = isDark ? '#03050a' : '#f8fafc';

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

    let particleCount = isMobile ? 950 : 2000;

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
      size: isDark ? 0.3 : 0.4,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      opacity: isDark ? 0.8 : 0.4,
      blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    if (!isMobile) {
      scene.fog = new THREE.FogExp2(bgColor, 0.03);
    }

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

      const clock = new THREE.Clock();
      let lastTime = 0;
      const targetFPS = 60;
      const frameInterval = 1000 / targetFPS;

      const animate = (currentTime) => {
        animationFrameRef.current = requestAnimationFrame(animate);

        const deltaTime = currentTime - lastTime;
        if (deltaTime < frameInterval) return;

        lastTime = currentTime - (deltaTime % frameInterval);
        const time = clock.getElapsedTime() * 0.2;

        scrollY += (targetScrollY - scrollY) * 0.05;
        const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const progress = scrollY / maxScroll;

        const positions = particles.geometry.attributes.position.array;
        for (let i = 0; i < particleCount * 3; i += 3) {
          const x = positions[i];
          const z = positions[i + 2];
          positions[i + 1] = Math.sin(x * 0.5 + time) * 1.5 + Math.cos(z * 0.5 + time) * 1.5;
        }
        particles.geometry.attributes.position.needsUpdate = true;

        camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
        camera.position.y += (-mouseY * 2 + 5 - camera.position.y) * 0.05;
        camera.position.z = THREE.MathUtils.lerp(15, 5, progress);
        particles.rotation.y = progress * Math.PI;

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

        if (mountElement) mountElement.innerHTML = '';
      };
    }

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize, { passive: true });

    const clock = new THREE.Clock();
    let lastTime = 0;
    const targetFPS = 30;
    const frameInterval = 1000 / targetFPS;

    const animate = (currentTime) => {
      animationFrameRef.current = requestAnimationFrame(animate);

      const deltaTime = currentTime - lastTime;
      if (deltaTime < frameInterval) return;

      lastTime = currentTime - (deltaTime % frameInterval);
      const time = clock.getElapsedTime() * 0.2;

      const positions = particles.geometry.attributes.position.array;
      for (let i = 0; i < particleCount * 3; i += 3) {
        const x = positions[i];
        const z = positions[i + 2];
        positions[i + 1] = Math.sin(x * 0.5 + time) * 1.5 + Math.cos(z * 0.5 + time) * 1.5;
      }
      particles.geometry.attributes.position.needsUpdate = true;

      camera.lookAt(scene.position);
      renderer.render(scene, camera);
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
  }, [theme, createParticleTexture]);

  return <div ref={mountRef} className="fixed inset-0 z-[0] w-full h-screen overflow-hidden pointer-events-none" />;
});

Background3D.displayName = 'Background3D';

export default Background3D;