import { UIHandler } from './ui/UIHandler.js';
import { SceneManager } from './scene/SceneManager.js';
import { Utils } from './utils/Utils.js';
/**
 * Main application class that coordinates all components
 */
export declare class PortfolioApp {
    private static instance;
    private sceneManager?;
    private uiHandler?;
    private constructor();
    static getInstance(): PortfolioApp;
    /**
     * Initialize the entire application
     */
    private initialize;
    /**
     * Check if THREE.js is available
     */
    private isThreeJSAvailable;
    /**
     * Get the scene manager instance
     */
    getSceneManager(): SceneManager | undefined;
    /**
     * Get the UI handler instance
     */
    getUIHandler(): UIHandler | undefined;
    /**
     * Debug method to check application status
     */
    debug(): void;
    /**
     * Public method to initialize the application
     * This is called from the global scope
     */
    static init(): PortfolioApp;
}
export { UIHandler, SceneManager, Utils };
export default PortfolioApp;
