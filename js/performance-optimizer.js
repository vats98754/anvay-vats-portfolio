// Portfolio Performance Optimizer
// Handles loading optimization, lazy loading, and resource management

class PortfolioOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupLazyLoading();
        this.optimizeImages();
        this.setupResourceHints();
        this.monitorPerformance();
        console.log('🚀 Portfolio optimization initialized');
    }
    
    setupLazyLoading() {
        // Lazy load images for better performance
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    optimizeImages() {
        // Add loading attributes for better performance
        const images = document.querySelectorAll('img');
        images.forEach((img, index) => {
            if (index > 2) { // First 3 images load immediately
                img.loading = 'lazy';
            }
            img.decoding = 'async';
        });
    }
    
    setupResourceHints() {
        // Preload critical GLTF assets
        const criticalAssets = [
            'assets/brain_point_cloud/scene.gltf',
            'assets/shiba/scene.gltf'
        ];
        
        criticalAssets.forEach(asset => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = asset;
            document.head.appendChild(link);
        });
    }
    
    monitorPerformance() {
        // Monitor and log performance metrics
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    console.log('📊 Performance Metrics:', {
                        domContentLoaded: Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart),
                        loadComplete: Math.round(perfData.loadEventEnd - perfData.loadEventStart),
                        totalTime: Math.round(perfData.loadEventEnd - perfData.fetchStart)
                    });
                }, 1000);
            });
        }
    }
    
    // Preload next section's content based on scroll
    preloadOnScroll() {
        let currentSection = 0;
        const sections = document.querySelectorAll('section');
        
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionIndex = Array.from(sections).indexOf(entry.target);
                    if (sectionIndex > currentSection) {
                        currentSection = sectionIndex;
                        this.preloadNextSectionAssets(sectionIndex + 1);
                    }
                }
            });
        }, { threshold: 0.5 });
        
        sections.forEach(section => sectionObserver.observe(section));
    }
    
    preloadNextSectionAssets(nextSectionIndex) {
        // Preload assets for the next section
        const sections = document.querySelectorAll('section');
        if (nextSectionIndex < sections.length) {
            const nextSection = sections[nextSectionIndex];
            const images = nextSection.querySelectorAll('img[data-src]');
            images.forEach(img => {
                const tempImg = new Image();
                tempImg.src = img.dataset.src;
            });
        }
    }
}

// Initialize optimizer when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new PortfolioOptimizer();
    });
} else {
    new PortfolioOptimizer();
}

// Service Worker registration for caching (if available)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
