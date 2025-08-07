/**
 * Utility functions for the portfolio application
 */
export declare class Utils {
    /**
     * Debounce function to limit the rate of function execution
     */
    static debounce<T extends (...args: any[]) => any>(func: T, wait: number, immediate?: boolean): (...args: Parameters<T>) => void;
    /**
     * Smooth lerp function for animations
     */
    static lerp(start: number, end: number, factor: number): number;
    /**
     * Map a value from one range to another
     */
    static map(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number;
    /**
     * Clamp a value between min and max
     */
    static clamp(value: number, min: number, max: number): number;
    /**
     * Generate random float between min and max
     */
    static randomFloat(min: number, max: number): number;
    /**
     * Generate random integer between min and max (inclusive)
     */
    static randomInt(min: number, max: number): number;
    /**
     * Check if an element is in viewport
     */
    static isInViewport(element: Element): boolean;
    /**
     * Get scroll progress (0-1)
     */
    static getScrollProgress(): number;
    /**
     * Create a status indicator element
     */
    static createStatusIndicator(message: string, color?: string, duration?: number, position?: {
        top?: string;
        right?: string;
        left?: string;
        bottom?: string;
    }): void;
    /**
     * Convert hex color to RGB
     */
    private static hexToRgb;
    /**
     * Create ripple effect at specified coordinates
     */
    static createRippleEffect(x: number, y: number, color?: string): void;
    /**
     * Debug Three.js status
     */
    static debugThreeJS(): void;
}
