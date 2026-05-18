import React, { useRef, useEffect } from "react";

export function GooeyButton({
  text = "Go Ahead",
  onClick,
  lightest = "#f897d5",
  light = "#f567c2",
  dark = "#755ad0",
  darkest = "#1a2a6c"
}) {
  const innerRef = useRef(null);

  useEffect(() => {
    if (innerRef.current) {
      const rect = innerRef.current.getBoundingClientRect();
      innerRef.current.style.setProperty("--width", `${rect.width}px`);
      innerRef.current.style.setProperty("--height", `${rect.height}px`);
    }
  }, []);

  const handleMouseMove = (e) => {
    const inner = innerRef.current;
    if (!inner) return;

    const rect = inner.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    inner.style.setProperty("--x", `${x}px`);
    inner.style.setProperty("--y", `${y}px`);
    inner.style.setProperty("--height", `${rect.height}px`);
    inner.style.setProperty("--width", `${rect.width}px`);
  };

  return (
    <div
      className="gooey-container"
      style={{
        "--lightest": lightest,
        "--light": light,
        "--dark": dark,
        "--darkest": darkest
      }}
    >
      <style>{`
        @font-face {
          font-family: "Avant";
          src: url("https://assets.codepen.io/383755/avant-garde.woff2") format("woff2");
        }

        .gooey-container {
          --elastic: cubic-bezier(0.175, 0.885, 0.32, 1.275);
          --x: 0px;
          --y: 0px;
          --t: rgba(255, 255, 255, 0.001);
          --lightest: #f897d5;
          --light: #f567c2;
          --dark: #755ad0;
          --darkest: #1a2a6c;

          position: relative;
          width: auto;
          overflow: hidden;
          padding: 0.5rem;
          display: flex;
          justify-content: flex-end;
          z-index: 1;
          margin: 0 -1rem;
        }

        .gooey-container:hover {
          z-index: 2;
        }

        .gooey-inner {
          display: inline-block;
          position: relative;
          pointer-events: all;
          z-index: 2;
          cursor: pointer;
          filter: url(#remove-white);
          isolation: isolate;
        }

        .gooey-inner:hover:before {
          filter: blur(2px) brightness(1);
          background-size: 0px 0px, 100% 100%, 100%;
          transition: transform 0.5s var(--elastic), background-size 0.25s ease-in-out;
        }

        .gooey-inner:hover:active:before {
          background-size: 35% 60%, 100% 100%, 100%;
        }

        .gooey-inner:before {
          content: "";
          position: absolute;
          width: 200%;
          height: 200%;
          top: 0rem;
          left: 0rem;
          filter: blur(2px) brightness(0);
          background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.25) 0%, var(--t) 20%),
                      radial-gradient(circle at center, var(--lightest), var(--light) 5%, var(--dark) 30%, var(--darkest) 50%),
                      var(--darkest);
          background-size: 0px 0px, 0px 0px, 100%;
          background-position: 50% 50%;
          background-repeat: no-repeat;
          opacity: 1;
          mix-blend-mode: lighten;
          z-index: 2;
          transition: transform 0.5s var(--elastic), background-size 0.25s ease-in-out, filter 0.5s ease-in-out;
          transform: translate(calc(var(--x) - 50%), calc(var(--y) - 50%));
          pointer-events: none;
        }

        .gooey-inner button {
          padding: 3.5rem 6rem;
          border: none;
          font-size: 1.5rem;
          position: relative;
          background: transparent;
          color: #f0f0f0;
          z-index: 2;
          cursor: pointer;
          font-weight: 100;
          letter-spacing: 2px;
          text-transform: uppercase;
          font-family: "Avant", "Futura", sans-serif;
          text-shadow: clamp(-8px, calc((var(--width) / 2 - var(--x)) / 8), 8px) clamp(-8px, calc((var(--height) / 2 - var(--y)) / 8), 8px) 12px rgba(0, 0, 0, 0);
          transition: text-shadow 500ms var(--elastic);
        }

        .gooey-inner button:hover {
          --shadow: max(
            calc((var(--width) / 2 - var(--x)) / 8 + ((var(--height) / 2 - var(--y)) / 3)),
            calc((((var(--width) / 2 - var(--x)) / 8) + ((var(--height) / 2 - var(--y)) / 3)) * -1),
            5px
          );
          text-shadow: clamp(-6px, calc((var(--width) / 2 - var(--x)) / 12), 6px) clamp(-4px, calc((var(--height) / 2 - var(--y)) / 16), 4px) var(--shadow) #000;
        }

        .gooey-inner button:active {
          cursor: grab;
        }

        .gooey-inner button:hover ~ .gooey-blob:before {
          transition: transform 500ms var(--elastic), box-shadow 1000ms var(--elastic);
          transform: translate(clamp(5%, calc(var(--x) - 50%), 550%), clamp(1rem, calc(var(--y) - 50%), 5rem)) scale(1.25);
          box-shadow: 0 0 0 0.05rem #fff, 0 -6rem 0 1.25rem #fff, 0 6rem 0 1.25rem #fff;
        }

        .gooey-inner button:active:hover ~ .gooey-blob:before {
          box-shadow: 0 0 0 0rem #fff, 0 -5rem 0 1.75rem #fff, 0 5rem 0 1.75rem #fff;
          transition: transform 500ms var(--elastic), box-shadow 500ms var(--elastic);
          transform: translate(clamp(5%, calc(var(--x) - 50%), 550%), clamp(calc(50% + 1rem), calc(var(--y) - 50%), calc(50% + 1.5rem))) scale(1);
        }

        .gooey-blob {
          position: absolute;
          pointer-events: none;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          background: #fff;
          filter: blur(12px) contrast(25);
          z-index: 1;
        }

        .gooey-blob:before,
        .gooey-blob:after {
          content: "";
          position: absolute;
          background: #000;
        }

        .gooey-blob:before {
          width: 15%;
          height: auto;
          z-index: 2;
          transition: transform 750ms var(--elastic), box-shadow 500ms var(--elastic);
          aspect-ratio: 1/1;
          box-shadow: 0 0 0 0.75rem #fff, 0 -8rem 0 -2rem #fff, 0 8rem 0 -2rem #fff;
          left: 0;
          top: 0;
          border-radius: 100%;
          transform: translate(clamp(10%, calc(var(--x) - 50%), 550%), clamp(1rem, calc(var(--y) - 50%), 5rem)) scale(0);
        }

        .gooey-blob:after {
          width: calc(100% - 4rem);
          height: calc(100% - 4rem);
          top: 2rem;
          left: 2rem;
          border-radius: 5rem;
          box-shadow: 0 0 0 8rem #ffffff;
        }
      `}</style>

      <svg style={{ position: "absolute", width: 0, height: 0, pointerEvents: "none" }}>
        <filter id="remove-white" colorInterpolationFilters="sRGB">
          <feColorMatrix in="SourceGraphic" type="luminanceToAlpha" result="luma" />
          <feComponentTransfer in="luma" result="inv-alpha">
            <feFuncA type="table" tableValues="1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0" />
          </feComponentTransfer>
          <feComposite in="SourceGraphic" in2="inv-alpha" operator="in" />
        </filter>
      </svg>

      <div className="gooey-inner" ref={innerRef} onMouseMove={handleMouseMove}>
        <button type="button" onClick={onClick}>{text}</button>
        <div className="gooey-blob hidden md:block"></div>
      </div>
    </div>
  );
}

export default GooeyButton;