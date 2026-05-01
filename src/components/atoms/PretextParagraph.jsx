import React, { useRef, useEffect, memo } from 'react';
import { prepareWithSegments, layoutWithLines } from '@chenglou/pretext';

const PretextParagraph = memo(({ text, isDark, className = '' }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const preparedRef = useRef(null);
  const lastFontRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const container = containerRef.current;
    
    const textColor = isDark ? '#d1d5db' : '#374151';

    // Funci³n para obtener config actual basada en viewport
    const getConfig = () => {
      const fontSize = window.innerWidth < 768 ? 16 : 18;
      const lineHeight = window.innerWidth < 768 ? 26 : 28;
      // La fuente debe coincidir exactamente con el CSS nativo
      const font = `${fontSize}px system-ui, -apple-system, sans-serif`;
      return { fontSize, lineHeight, font };
    };

    // 2. Layout y render
    const renderText = () => {
      const width = container.clientWidth;
      if (width === 0) return;

      const { lineHeight, font } = getConfig();

      // Si el font cambi³, re-preparar el texto
      if (font !== lastFontRef.current) {
        lastFontRef.current = font;
        preparedRef.current = prepareWithSegments(text, font);
      }

      const { lines } = layoutWithLines(preparedRef.current, width, lineHeight);
      const height = lines.length * lineHeight;

      // Configurar canvas
      const scale = window.devicePixelRatio || 1;
      canvas.width = Math.floor(width * scale);
      canvas.height = Math.floor(height * scale);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      // Limpiar y renderizar
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(scale, scale);
      ctx.font = font;
      ctx.fillStyle = textColor;
      ctx.textBaseline = 'top';

      for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i].text, 0, i * lineHeight);
      }
    };

    // Render inicial
    renderText();

    // Re-render en resize
    let rafId;
    const handleResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(renderText);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafId);
    };
  }, [text, isDark]);

  // Limpiar refs cuando el texto cambia
  useEffect(() => {
    preparedRef.current = null;
    lastFontRef.current = null;
  }, [text]);

  return (
    <div ref={containerRef} className={`w-full ${className}`}>
      {/* Texto oculto para que Google y los lectores de pantalla puedan leerlo (SEO/Accesibilidad) */}
      <p className="sr-only">{text}</p>
      {/* Texto renderizado por hardware */}
      <canvas ref={canvasRef} className="block w-full pointer-events-none" />
    </div>
  );
});

export default PretextParagraph;
