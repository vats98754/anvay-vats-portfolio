/**
 * Utility functions for the portfolio application
 */
export class Utils {
  /**
   * Debounce function to limit the rate of function execution
   */
  public static debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number,
    immediate?: boolean
  ): (...args: Parameters<T>) => void {
    let timeout: number | null = null;
    
    return function executedFunction(...args: Parameters<T>) {
      const later = () => {
        timeout = null;
        if (!immediate) func(...args);
      };
      
      const callNow = immediate && !timeout;
      
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      
      if (callNow) func(...args);
    };
  }

  /**
   * Smooth lerp function for animations
   */
  public static lerp(start: number, end: number, factor: number): number {
    return start + (end - start) * factor;
  }

  /**
   * Map a value from one range to another
   */
  public static map(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  }

  /**
   * Clamp a value between min and max
   */
  public static clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  /**
   * Generate random float between min and max
   */
  public static randomFloat(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  /**
   * Generate random integer between min and max (inclusive)
   */
  public static randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Check if an element is in viewport
   */
  public static isInViewport(element: Element): boolean {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  /**
   * Get scroll progress (0-1)
   */
  public static getScrollProgress(): number {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    return Math.min(scrollTop / docHeight, 1);
  }

  /**
   * Create a status indicator element
   */
  public static createStatusIndicator(
    message: string,
    color: string = '#00ff00',
    duration: number = 4000,
    position: { top?: string; right?: string; left?: string; bottom?: string } = { top: '20px', right: '20px' }
  ): void {
    const statusDiv = document.createElement('div');
    statusDiv.innerHTML = message;
    
    const positionStyles = Object.entries(position)
      .map(([key, value]) => `${key}: ${value}`)
      .join('; ');
    
    statusDiv.style.cssText = `
      position: fixed;
      ${positionStyles};
      background: rgba(${this.hexToRgb(color)}, 0.9);
      color: white;
      padding: 10px 15px;
      border-radius: 5px;
      font-size: 14px;
      z-index: 1000;
      font-family: Arial, sans-serif;
      animation: pulse 2s infinite;
    `;
    
    // Add pulsing animation if not already added
    if (!document.head.querySelector('#status-animation')) {
      const style = document.createElement('style');
      style.id = 'status-animation';
      style.textContent = `
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
      `;
      document.head.appendChild(style);
    }
    
    document.body.appendChild(statusDiv);
    
    // Remove after specified duration
    setTimeout(() => {
      if (statusDiv.parentNode) {
        statusDiv.parentNode.removeChild(statusDiv);
      }
    }, duration);
  }

  /**
   * Convert hex color to RGB
   */
  private static hexToRgb(hex: string): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return '0, 255, 0'; // Default to green
    
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    
    return `${r}, ${g}, ${b}`;
  }

  /**
   * Create ripple effect at specified coordinates
   */
  public static createRippleEffect(x: number, y: number, color: string = 'rgba(255, 255, 255, 0.8)'): void {
    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: fixed;
      left: ${x - 25}px;
      top: ${y - 25}px;
      width: 50px;
      height: 50px;
      border: 2px solid ${color};
      border-radius: 50%;
      pointer-events: none;
      z-index: 1000;
      animation: rippleEffect 1s ease-out forwards;
    `;
    
    // Add ripple animation if not already added
    if (!document.head.querySelector('#ripple-animation')) {
      const style = document.createElement('style');
      style.id = 'ripple-animation';
      style.textContent = `
        @keyframes rippleEffect {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(4);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    document.body.appendChild(ripple);
    
    // Remove after animation
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 1000);
  }

  /**
   * Debug Three.js status
   */
  public static debugThreeJS(): void {
    console.log('=== Three.js Debug Info ===');
    console.log('THREE object available:', typeof window.THREE !== 'undefined');
    console.log('Canvas element found:', !!document.getElementById('threejs-canvas'));
    console.log('Window dimensions:', window.innerWidth, 'x', window.innerHeight);
    console.log('User agent:', navigator.userAgent);
    console.log('Prefers reduced motion:', window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    
    if (typeof window.THREE !== 'undefined') {
      console.log('THREE.js version:', window.THREE.REVISION);
    }
  }
}
