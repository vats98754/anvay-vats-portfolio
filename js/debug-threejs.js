// Enhanced Three.js Debug Script
console.log('🔍 Starting comprehensive Three.js background verification...');

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('📋 DOM loaded, beginning verification...');
    
    setTimeout(() => {
        // Check for Three.js
        if (typeof THREE === 'undefined') {
            console.error('❌ THREE.js not loaded');
            return;
        }
        console.log('✅ THREE.js loaded, version:', THREE.REVISION);
        
        // Check for canvas
        const canvas = document.getElementById('threejs-canvas');
        if (!canvas) {
            console.error('❌ Canvas element not found');
            return;
        }
        console.log('✅ Canvas element found');
        
        // Check for Portfolio3D instance
        if (typeof Portfolio3D === 'undefined') {
            console.error('❌ Portfolio3D class not defined');
            return;
        }
        console.log('✅ Portfolio3D class available');
        
        // Try to access scene elements
        setTimeout(() => {
            if (window.portfolio3D && window.portfolio3D.scene) {
                const scene = window.portfolio3D.scene;
                console.log('✅ Scene active with', scene.children.length, 'objects');
                
                // Log all scene objects
                scene.children.forEach((child, index) => {
                    console.log(`  Object ${index}:`, child.type, child.name || 'unnamed');
                });
                
                // Check for specific components
                if (window.portfolio3D.backgroundMaterial) {
                    console.log('✅ Northern lights background material found');
                } else {
                    console.warn('⚠️ Northern lights background material not found');
                }
                
                if (window.portfolio3D.starMaterial) {
                    console.log('✅ Star field material found');
                } else {
                    console.warn('⚠️ Star field material not found');
                }
                
                if (window.portfolio3D.particles) {
                    console.log('✅ Star field particles found');
                } else {
                    console.warn('⚠️ Star field particles not found');
                }
                
                if (window.portfolio3D.gltfModels.length > 0) {
                    console.log('✅ GLTF models loaded:', window.portfolio3D.gltfModels.length);
                } else {
                    console.warn('⚠️ No GLTF models found');
                }
                
            } else {
                console.error('❌ Portfolio3D scene not accessible');
            }
        }, 2000);
        
    }, 1000);
});

// Add performance monitoring
let frameCount = 0;
let lastTime = performance.now();

function monitorPerformance() {
    frameCount++;
    const currentTime = performance.now();
    
    if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        console.log(`📊 Performance: ${fps} FPS`);
        
        if (fps < 30) {
            console.warn('⚠️ Low FPS detected, consider optimizations');
        }
        
        frameCount = 0;
        lastTime = currentTime;
    }
    
    requestAnimationFrame(monitorPerformance);
}

// Start monitoring after a delay
setTimeout(monitorPerformance, 3000);

// Export for global access
window.debugThreeJS = function() {
    console.log('🔍 Manual debug triggered...');
    
    if (window.portfolio3D) {
        console.log('Portfolio3D instance:', window.portfolio3D);
        console.log('Scene children:', window.portfolio3D.scene?.children.length || 0);
        console.log('GLTF models:', window.portfolio3D.gltfModels?.length || 0);
        console.log('Background material:', !!window.portfolio3D.backgroundMaterial);
        console.log('Star material:', !!window.portfolio3D.starMaterial);
    } else {
        console.log('❌ No Portfolio3D instance found');
    }
};

console.log('🎯 Debug script loaded. Call debugThreeJS() for manual check.');
