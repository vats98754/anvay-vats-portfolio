import { Portfolio3DConfig } from '../types.js';
/**
 * Core configuration for the Portfolio 3D scene
 */
export declare class Config {
    static readonly DEFAULT_CONFIG: Portfolio3DConfig;
    static readonly CAMERA_CONFIG: {
        fov: number;
        near: number;
        far: number;
        initialZ: number;
    };
    /**
     * Get the base URL for assets
     */
    static getAssetBaseUrl(): string;
    static readonly LIGHTING_CONFIG: {
        ambientColor: number;
        ambientIntensity: number;
        directionalColor: number;
        directionalIntensity: number;
        directionalPosition: {
            x: number;
            y: number;
            z: number;
        };
    };
    static readonly ANIMATION_CONFIG: {
        starRotationSpeed: {
            x: number;
            y: number;
        };
        breathingSpeed: number;
        breathingIntensity: number;
        cameraFollowSpeed: number;
        cameraSwaySpeed: {
            x: number;
            y: number;
        };
        cameraSwayIntensity: {
            x: number;
            y: number;
        };
        scrollCameraDistance: number;
        scrollCameraSpeed: number;
    };
    static readonly STAR_CONFIG: {
        count: number;
        positionRange: {
            x: number;
            y: number;
            z: number;
        };
        sizeRange: {
            min: number;
            max: number;
        };
        colors: {
            white: {
                weight: number;
                color: {
                    r: number;
                    g: number;
                    b: number;
                };
            };
            blueWhite: {
                weight: number;
                color: {
                    r: number;
                    g: number;
                    b: number;
                };
            };
            yellow: {
                weight: number;
                color: {
                    r: number;
                    g: number;
                    b: number;
                };
            };
            aurora: {
                weight: number;
                color: {
                    r: number;
                    g: number;
                    b: number;
                };
            };
        };
    };
    static readonly GLTF_MODELS: ({
        path: string;
        name: string;
        scale: number;
        position: {
            x: number;
            y: number;
            z: number;
        };
        rotation: {
            x: number;
            y: number;
            z: number;
        };
        isProfile: boolean;
        isRevolving?: undefined;
        revolutionRadius?: undefined;
        scrollTrigger?: undefined;
        hasAnimation?: undefined;
    } | {
        path: string;
        name: string;
        scale: number;
        position: {
            x: number;
            y: number;
            z: number;
        };
        rotation: {
            x: number;
            y: number;
            z: number;
        };
        isRevolving: boolean;
        revolutionRadius: number;
        scrollTrigger: {
            start: number;
            end: number;
        };
        isProfile?: undefined;
        hasAnimation?: undefined;
    } | {
        path: string;
        name: string;
        scale: number;
        position: {
            x: number;
            y: number;
            z: number;
        };
        isRevolving: boolean;
        revolutionRadius: number;
        scrollTrigger: {
            start: number;
            end: number;
        };
        hasAnimation: boolean;
        rotation?: undefined;
        isProfile?: undefined;
    } | {
        path: string;
        name: string;
        scale: number;
        position: {
            x: number;
            y: number;
            z: number;
        };
        isRevolving: boolean;
        revolutionRadius: number;
        scrollTrigger: {
            start: number;
            end: number;
        };
        rotation?: undefined;
        isProfile?: undefined;
        hasAnimation?: undefined;
    })[];
    /**
     * Get GLTF models with absolute URLs
     */
    static getGLTFModels(): ({
        path: string;
        name: string;
        scale: number;
        position: {
            x: number;
            y: number;
            z: number;
        };
        rotation: {
            x: number;
            y: number;
            z: number;
        };
        isProfile: boolean;
        isRevolving?: undefined;
        revolutionRadius?: undefined;
        scrollTrigger?: undefined;
        hasAnimation?: undefined;
    } | {
        path: string;
        name: string;
        scale: number;
        position: {
            x: number;
            y: number;
            z: number;
        };
        rotation: {
            x: number;
            y: number;
            z: number;
        };
        isRevolving: boolean;
        revolutionRadius: number;
        scrollTrigger: {
            start: number;
            end: number;
        };
        isProfile?: undefined;
        hasAnimation?: undefined;
    } | {
        path: string;
        name: string;
        scale: number;
        position: {
            x: number;
            y: number;
            z: number;
        };
        isRevolving: boolean;
        revolutionRadius: number;
        scrollTrigger: {
            start: number;
            end: number;
        };
        hasAnimation: boolean;
        rotation?: undefined;
        isProfile?: undefined;
    } | {
        path: string;
        name: string;
        scale: number;
        position: {
            x: number;
            y: number;
            z: number;
        };
        isRevolving: boolean;
        revolutionRadius: number;
        scrollTrigger: {
            start: number;
            end: number;
        };
        rotation?: undefined;
        isProfile?: undefined;
        hasAnimation?: undefined;
    })[];
    static isMobile(): boolean;
    static getPixelRatio(): number;
    static getPowerPreference(): 'low-power' | 'high-performance';
}
