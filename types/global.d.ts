// Global type declarations for Three.js and external libraries
declare global {
  interface Window {
    THREE: typeof import('three');
    jQuery: typeof import('jquery');
    $: typeof import('jquery');
    Typed: typeof import('typed.js');
  }
  
  // Make THREE globally available
  const THREE: typeof import('three');
}

// Three.js types
export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface Mouse {
  x: number;
  y: number;
}

export interface InteractiveStar {
  id: number;
  position: THREE.Vector3;
  isShootingStar: boolean;
  shootingDirection: THREE.Vector3;
  shootingSpeed: number;
  originalPosition: THREE.Vector3;
}

export interface ModelUserData {
  rotationSpeed?: number;
  floatSpeed?: number;
  originalY?: number;
  revolutionRadius?: number;
  revolutionSpeed?: number;
  revolutionAngle?: number;
  targetRevolutionAngle?: number;
  isRevolvingObject?: boolean;
  scrollTriggerStart?: number;
  scrollTriggerEnd?: number;
  baseScale?: number;
  isInteractive?: boolean;
  baseRotationY?: number;
  hoverRotationY?: number;
  targetRotationY?: number;
  isHovered?: boolean;
  mixer?: THREE.AnimationMixer;
  bubble?: THREE.Mesh;
  originalX?: number;
  originalZ?: number;
}

export interface TrailData {
  model: THREE.Object3D;
  positions: Float32Array;
  currentIndex: number;
  trail: THREE.Line;
}

export interface Portfolio3DConfig {
  enableNorthernLights?: boolean;
  enableStars?: boolean;
  enableGLTFModels?: boolean;
  starCount?: number;
  enableMobileOptimizations?: boolean;
}

export {};
