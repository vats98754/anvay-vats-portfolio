declare global {
    interface Window {
        THREE: typeof import('three');
        GLTFLoader: any;
        Typed: any;
    }
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
    position: any;
    isShootingStar: boolean;
    shootingDirection: any;
    shootingSpeed: number;
    originalPosition: any;
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
    mixer?: any;
    bubble?: any;
    originalX?: number;
    originalZ?: number;
    isCreativeBrain?: boolean;
    originalScale?: number;
    scrollProgress?: number;
    brainPhase?: number;
    particleSystem?: any;
}
export interface TrailData {
    model: any;
    positions: Float32Array;
    currentIndex: number;
    trail: any;
}
export interface Portfolio3DConfig {
    enableNorthernLights?: boolean;
    enableStars?: boolean;
    enableGLTFModels?: boolean;
    starCount?: number;
    enableMobileOptimizations?: boolean;
}
