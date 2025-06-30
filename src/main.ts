import { UIHandler } from './ui/UIHandler.js';
import { SceneManager } from './scene/SceneManager.js';
import { Utils } from './utils/Utils.js';

/**
 * Main application class that coordinates all components
 */
export class PortfolioApp {
  private static instance: PortfolioApp | null = null;
  private sceneManager?: SceneManager;
  private uiHandler?: UIHandler;

  private constructor() {
    this.initialize();
  }

  public static getInstance(): PortfolioApp {
    if (!PortfolioApp.instance) {
      PortfolioApp.instance = new PortfolioApp();
    }
    return PortfolioApp.instance;
  }

  /**
   * Initialize the entire application
   */
  private async initialize(): Promise<void> {
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
      } else {
        console.warn('⚠️ THREE.js not available, skipping 3D scene');
      }

      console.log('🎉 Portfolio Application fully initialized!');
      
      // Create success indicator
      Utils.createStatusIndicator(
        '🎉 Portfolio Ready!', 
        '#00ff00', 
        3000, 
        { bottom: '20px', right: '20px' }
      );

    } catch (error) {
      console.error('❌ Failed to initialize Portfolio Application:', error);
      
      Utils.createStatusIndicator(
        '❌ Initialization Error', 
        '#ff0000', 
        5000, 
        { bottom: '20px', right: '20px' }
      );
    }
  }

  /**
   * Check if THREE.js is available
   */
  private isThreeJSAvailable(): boolean {
    return typeof window !== 'undefined' && 
           (typeof window.THREE !== 'undefined' || typeof (window as any).THREE !== 'undefined');
  }

  /**
   * Get the scene manager instance
   */
  public getSceneManager(): SceneManager | undefined {
    return this.sceneManager;
  }

  /**
   * Get the UI handler instance
   */
  public getUIHandler(): UIHandler | undefined {
    return this.uiHandler;
  }

  /**
   * Debug method to check application status
   */
  public debug(): void {
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
  public static init(): PortfolioApp {
    return PortfolioApp.getInstance();
  }
}

// Global initialization function for backward compatibility
(window as any).debugThreeJS = Utils.debugThreeJS;

// Auto-initialize when script loads
if (typeof window !== 'undefined') {
  // Initialize immediately if DOM is ready, otherwise wait
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      PortfolioApp.init();
    });
  } else {
    PortfolioApp.init();
  }
}

// Export for external use
export { UIHandler, SceneManager, Utils };
export default PortfolioApp;
