// Simple type declarations without Three.js namespace issues
declare global {
  interface Window {
    THREE: any;
    jQuery: any;
    $: any;
    Typed: any;
  }
  
  const THREE: any;
}

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
  position: any; // THREE.Vector3
  isShootingStar: boolean;
  shootingDirection: any; // THREE.Vector3
  shootingSpeed: number;
  originalPosition: any; // THREE.Vector3
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
  mixer?: any; // THREE.AnimationMixer
  bubble?: any; // THREE.Mesh
  originalX?: number;
  originalZ?: number;
}

export interface TrailData {
  model: any; // THREE.Object3D
  positions: Float32Array;
  currentIndex: number;
  trail: any; // THREE.Line
}

export interface Portfolio3DConfig {
  enableNorthernLights?: boolean;
  enableStars?: boolean;
  enableGLTFModels?: boolean;
  starCount?: number;
  enableMobileOptimizations?: boolean;
}
