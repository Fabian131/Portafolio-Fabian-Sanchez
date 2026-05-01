import React, { useRef, useCallback, memo } from 'react';

const BlobButton = memo(({ children, onClick, darkTheme }) => {
  const btnRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if(!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    btnRef.current.style.setProperty("--x", `${x}px`);
    btnRef.current.style.setProperty("--y", `${y}px`);
    btnRef.current.style.setProperty("--height", `${rect.height}px`);
    btnRef.current.style.setProperty("--width", `${rect.width}px`);
  }, []);

  return (
    <div className={`blob-container ${darkTheme ? 'blob-dark' : 'blob-light'}`}>
      <div className="blob-inner" ref={btnRef} onMouseMove={handleMouseMove} onClick={onClick}>
        <button type="button" className="flex items-center gap-2">
          {children}
        </button>
        <div className="blob"></div>
      </div>
    </div>
  );
});

export default BlobButton;
