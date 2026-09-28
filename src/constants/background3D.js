import * as THREE from 'three';

export const BG_THEMES = {
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

export const PARTICLE_CONFIG = {
  mobileCount: 950,
  desktopCount: 2000,
  spreadX: 40,
  spreadY: 10,
  spreadZ: 40,
};

export const ANIMATION_CONFIG = {
  desktopTargetFPS: 60,
  mobileTargetFPS: 30,
  transitionSpeed: 0.015,
  timeMultiplier: 0.0002,
  waveSpeed: 0.5,
  waveAmplitude: 1.5,
};
