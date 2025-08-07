import { UIHandler } from './ui/UIHandler.js';
import { SceneManager } from './scene/SceneManager.js';
import { Utils } from './utils/Utils.js';
import { Config } from './config/Config.js';
/**
 * Main application class that coordinates all components
 */
export class PortfolioApp {
    constructor() {
        this.initialize();
    }
    static getInstance() {
        if (!PortfolioApp.instance) {
            PortfolioApp.instance = new PortfolioApp();
        }
        return PortfolioApp.instance;
    }
    /**
     * Initialize the entire application
     */
    async initialize() {
        try {
            console.log('🚀 Initializing Portfolio Application...');
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }
            // Initialize UI components first
            this.uiHandler = UIHandler.getInstance();
            console.log('✅ UI Handler initialized');
            // Initialize 3D scene if THREE.js is available
            if (this.isThreeJSAvailable()) {
                this.sceneManager = new SceneManager();
                console.log('✅ Scene Manager initialized');
            }
            else {
                console.warn('⚠️ THREE.js not available, skipping 3D scene');
            }
            console.log('🎉 Portfolio Application fully initialized!');
            // Add debug information to console
            Utils.debugThreeJS();
            // Create success indicator
            Utils.createStatusIndicator('🎉 Portfolio Ready!', '#00ff00', 3000, { bottom: '20px', right: '20px' });
            // Add global debug functions for troubleshooting
            window.debugPortfolio = {
                reloadModels: () => {
                    if (this.sceneManager) {
                        console.log('🔄 Manually reloading GLTF models...');
                        this.sceneManager.loadGLTFModels();
                    }
                },
                testAssetPaths: () => {
                    console.log('🧪 Testing asset paths...');
                    console.log('Base URL:', Config.getAssetBaseUrl());
                    console.log('GLTF Models:', Config.getGLTFModels());
                },
                getSceneInfo: () => {
                    if (this.sceneManager) {
                        console.log('🎬 Scene info:', this.sceneManager);
                    }
                }
            };
            console.log('🛠️  Debug functions available: window.debugPortfolio');
        }
        catch (error) {
            console.error('❌ Failed to initialize Portfolio Application:', error);
            Utils.createStatusIndicator('❌ Initialization Error', '#ff0000', 5000, { bottom: '20px', right: '20px' });
        }
    }
    /**
     * Check if THREE.js is available
     */
    isThreeJSAvailable() {
        return typeof window !== 'undefined' &&
            (typeof window.THREE !== 'undefined' || typeof window.THREE !== 'undefined');
    }
    /**
     * Get the scene manager instance
     */
    getSceneManager() {
        return this.sceneManager;
    }
    /**
     * Get the UI handler instance
     */
    getUIHandler() {
        return this.uiHandler;
    }
    /**
     * Debug method to check application status
     */
    debug() {
        console.log('=== Portfolio App Debug Info ===');
        console.log('Scene Manager available:', !!this.sceneManager);
        console.log('UI Handler available:', !!this.uiHandler);
        console.log('THREE.js available:', this.isThreeJSAvailable());
        if (this.isThreeJSAvailable()) {
            Utils.debugThreeJS();
        }
    }
    /**
     * Public method to initialize the application
     * This is called from the global scope
     */
    static init() {
        return PortfolioApp.getInstance();
    }
}
PortfolioApp.instance = null;
// Global initialization function for backward compatibility
window.debugThreeJS = Utils.debugThreeJS;
// Auto-initialize when script loads
if (typeof window !== 'undefined') {
    // Initialize immediately if DOM is ready, otherwise wait
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            PortfolioApp.init();
        });
    }
    else {
        PortfolioApp.init();
    }
}
// Export for external use
export { UIHandler, SceneManager, Utils };
export default PortfolioApp;
