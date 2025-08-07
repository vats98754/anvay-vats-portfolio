/**
 * Manages the Three.js scene and all 3D components
 */
export declare class SceneManager {
    scene: any;
    camera: any;
    renderer: any;
    particles: any;
    private geometries;
    private gltfModels;
    private mouse;
    private targetMouse;
    private backgroundMaterial;
    private starMaterial;
    private northernLightsMaterial;
    private scrollY;
    private interactiveStars;
    private raycaster;
    private objectTrails;
    private thinkerModel?;
    private brainModel?;
    constructor();
    /**
     * Initialize the Three.js scene
     */
    private init;
    /**
     * Create the northern lights background
     */
    private createNorthernLightsBackground;
    /**
     * Get the northern lights fragment shader
     */
    private getNorthernLightsFragmentShader;
    /**
     * Create the blinking star field
     */
    private createBlinkingStarField;
    /**
     * Apply star color based on type
     */
    private applyStarColor;
    /**
     * Create star material with shaders
     */
    private createStarMaterial;
    /**
     * Get star vertex shader
     */
    private getStarVertexShader;
    /**
     * Get star fragment shader
     */
    private getStarFragmentShader;
    /**
     * Create blinking star texture
     */
    private createBlinkingStarTexture;
    /**
     * Load GLTF models
     */
    private loadGLTFModels;
    /**
     * Setup profile model
     */
    private setupProfileModel;
    /**
     * Setup revolving model
     */
    private setupRevolvingModel;
    /**
     * Setup Thinker profile picture
     */
    private setupThinkerProfilePicture;
    /**
     * Setup creative brain scroll effects with enhanced positioning
     */
    private setupCreativeBrainScrollEffects;
    /**
     * Create fallback models when GLTF loader is not available
     */
    private createFallbackModels;
    /**
     * Create revolving object trails
     */
    private createRevolvingObjectTrails;
    /**
     * Setup event listeners
     */
    private setupEventListeners;
    /**
     * Handle star interaction
     */
    private handleStarInteraction;
    /**
     * Handle background asset interaction
     */
    private handleBackgroundAssetInteraction;
    /**
     * Create shooting stars on click
     */
    private createClickShootingStars;
    /**
     * Create random shooting star
     */
    private createRandomShootingStar;
    /**
     * Main animation loop
     */
    private animate;
    /**
     * Animate revolving model
     */
    private animateRevolvingModel;
    /**
     * Animate floating model
     */
    private animateFloatingModel;
    /**
     * Animate creative brain with enhanced scroll effects
     */
    private animateCreativeBrain;
    /**
     * Create enhanced particle system around brain with neural firing effect
     */
    private createEnhancedBrainParticleSystem;
    /**
     * Animate brain particles with neural firing patterns
     */
    private animateBrainParticles;
    /**
     * Update camera position and rotation
     */
    private updateCamera;
}
