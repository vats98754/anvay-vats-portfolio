/**
 * Handles all UI interactions and animations
 */
export declare class UIHandler {
    private static instance;
    private constructor();
    static getInstance(): UIHandler;
    /**
     * Initialize all jQuery-based components (keeping original behavior)
     */
    private initializeJQueryComponents;
    /**
     * Setup enhanced interactions
     */
    private setupEnhancedInteractions;
    /**
     * Create interactive cursor
     */
    private createInteractiveCursor;
    /**
     * Update cursor trail
     */
    private updateCursorTrail;
    /**
     * Create scroll indicator
     */
    private createScrollIndicator;
    /**
     * Enhance section cards with hover effects
     */
    private enhanceSectionCards;
    /**
     * Create particle burst effect
     */
    private createParticleBurst;
    /**
     * Enhanced name interaction
     */
    private enhanceNameInteraction;
    /**
     * Setup smooth scrolling for anchor links
     */
    private setupSmoothScrolling;
    /**
     * Initialize all UI components
     */
    static initialize(): void;
}
