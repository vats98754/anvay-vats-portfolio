/**
 * Core configuration for the Portfolio 3D scene
 */
export class Config {
    /**
     * Get the base URL for assets
     */
    static getAssetBaseUrl() {
        // Check if we're on GitHub Pages with custom domain
        if (window.location.hostname === 'anvay.blog') {
            return 'https://anvay.blog/';
        }
        // Check if we're on GitHub Pages default domain
        if (window.location.hostname.includes('github.io')) {
            return window.location.origin + '/anvay-vats-portfolio/';
        }
        // Local development or other hosting
        return window.location.origin + '/';
    }
    /**
     * Get GLTF models with absolute URLs
     */
    static getGLTFModels() {
        const baseUrl = this.getAssetBaseUrl();
        return this.GLTF_MODELS.map(model => ({
            ...model,
            path: baseUrl + model.path
        }));
    }
    static isMobile() {
        return window.innerWidth <= 768;
    }
    static getPixelRatio() {
        return Math.min(window.devicePixelRatio, this.isMobile() ? 1 : 2);
    }
    static getPowerPreference() {
        return this.isMobile() ? 'low-power' : 'high-performance';
    }
}
Config.DEFAULT_CONFIG = {
    enableNorthernLights: true,
    enableStars: true,
    enableGLTFModels: true,
    starCount: 3000,
    enableMobileOptimizations: true,
};
Config.CAMERA_CONFIG = {
    fov: 75,
    near: 0.1,
    far: 1000,
    initialZ: 30,
};
Config.LIGHTING_CONFIG = {
    ambientColor: 0x404040,
    ambientIntensity: 0.3,
    directionalColor: 0xffffff,
    directionalIntensity: 0.5,
    directionalPosition: { x: 10, y: 10, z: 5 },
};
Config.ANIMATION_CONFIG = {
    starRotationSpeed: { x: 0.005, y: 0.003 },
    breathingSpeed: 0.8,
    breathingIntensity: 0.03,
    cameraFollowSpeed: 0.02,
    cameraSwaySpeed: { x: 0.2, y: 0.15 },
    cameraSwayIntensity: { x: 0.5, y: 0.3 },
    scrollCameraDistance: 20,
    scrollCameraSpeed: 0.03,
};
Config.STAR_CONFIG = {
    count: 3000,
    positionRange: { x: 500, y: 400, z: 400 },
    sizeRange: { min: 2, max: 8 },
    colors: {
        white: { weight: 0.3, color: { r: 1.0, g: 1.0, b: 1.0 } },
        blueWhite: { weight: 0.2, color: { r: 0.8, g: 0.9, b: 1.0 } },
        yellow: { weight: 0.2, color: { r: 1.0, g: 0.8, b: 0.6 } },
        aurora: { weight: 0.3, color: { r: 0.4, g: 0.8, b: 0.7 } },
    },
};
Config.GLTF_MODELS = [
    {
        path: 'assets/the_thinker_by_auguste_rodin/scene.gltf',
        name: 'thinker',
        scale: 0.15,
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: Math.PI / 4, z: 0 },
        isProfile: true,
    },
    {
        path: 'assets/brain_point_cloud/scene.gltf',
        name: 'brain',
        scale: 12.0,
        position: { x: 8, y: 2, z: -5 },
        rotation: { x: 0, y: Math.PI / 4, z: 0 },
        isRevolving: true,
        revolutionRadius: 15,
        scrollTrigger: { start: 0.0, end: 1.0 },
    },
    {
        path: 'assets/shiba/scene.gltf',
        name: 'shiba',
        scale: 1.2,
        position: { x: 40, y: -5, z: -40 },
        rotation: { x: 0, y: -Math.PI / 2, z: 0 },
        isRevolving: true,
        revolutionRadius: 60,
        scrollTrigger: { start: 0.2, end: 0.8 },
    },
    {
        path: 'assets/an-animated-cat/source/scene.gltf',
        name: 'cat',
        scale: 6,
        position: { x: 0, y: -20, z: -80 },
        isRevolving: true,
        revolutionRadius: 90,
        scrollTrigger: { start: 0.1, end: 0.9 },
        hasAnimation: true,
    },
    {
        path: 'assets/arduino_uno_r3_elegoo/scene.gltf',
        name: 'arduino',
        scale: 8,
        position: { x: -45, y: 5, z: -30 },
        isRevolving: true,
        revolutionRadius: 55,
        scrollTrigger: { start: 0.3, end: 0.7 },
    },
    {
        path: 'assets/stylized_planet/scene.gltf',
        name: 'planet',
        scale: 2,
        position: { x: 30, y: 10, z: -45 },
        isRevolving: true,
        revolutionRadius: 65,
        scrollTrigger: { start: 0.15, end: 0.85 },
    },
];
