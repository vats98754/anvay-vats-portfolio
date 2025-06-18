(function ($) {
    "use strict";

    // Navbar on scrolling
    $(window).scroll(function () {
        if ($(this).scrollTop() > 200) {
            $('.navbar').fadeIn('slow').css('display', 'flex');
        } else {
            $('.navbar').fadeOut('slow').css('display', 'none');
        }
    });


    // Smooth scrolling on the navbar links
    $(".navbar-nav a").on('click', function (event) {
        if (this.hash !== "") {
            event.preventDefault();
            
            $('html, body').animate({
                scrollTop: $(this.hash).offset().top - 45
            }, 1500, 'easeInOutExpo');
            
            if ($(this).parents('.navbar-nav').length) {
                $('.navbar-nav .active').removeClass('active');
                $(this).closest('a').addClass('active');
            }
        }
    });


    // Typed Initiate
    if ($('.typed-text-output').length == 1) {
        var typed_strings = $('.typed-text').text();
        var typed = new Typed('.typed-text-output', {
            strings: typed_strings.split(', '),
            typeSpeed: 100,
            backSpeed: 20,
            smartBackspace: false,
            loop: true
        });
    }


    // Modal Video
    $(document).ready(function () {
        var $videoSrc;
        $('.btn-play').click(function () {
            $videoSrc = $(this).data("src");
        });
        console.log($videoSrc);

        $('#videoModal').on('shown.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
        })

        $('#videoModal').on('hide.bs.modal', function (e) {
            $("#video").attr('src', $videoSrc);
        })
    });


    // Scroll to Bottom
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.scroll-to-bottom').fadeOut('slow');
        } else {
            $('.scroll-to-bottom').fadeIn('slow');
        }
    });


    // Skills
    $('.skill').waypoint(function () {
        $('.progress .progress-bar').each(function () {
            $(this).css("width", $(this).attr("aria-valuenow") + '%');
        });
    }, {offset: '80%'});


    // Portfolio isotope and filter
    var portfolioIsotope = $('.portfolio-container').isotope({
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
    });
    $('#portfolio-flters li').on('click', function () {
        $("#portfolio-flters li").removeClass('active');
        $(this).addClass('active');

        portfolioIsotope.isotope({filter: $(this).data('filter')});
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 200) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        dots: true,
        loop: true,
        items: 1
    });
    
})(jQuery);

// Debug function to check Three.js status
function debugThreeJS() {
    console.log('=== Three.js Debug Info ===');
    console.log('THREE object available:', typeof THREE !== 'undefined');
    console.log('Canvas element found:', !!document.getElementById('threejs-canvas'));
    console.log('Window dimensions:', window.innerWidth, 'x', window.innerHeight);
    console.log('User agent:', navigator.userAgent);
    console.log('Prefers reduced motion:', window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    
    if (typeof THREE !== 'undefined') {
        console.log('THREE.js version:', THREE.REVISION);
    }
}

// Three.js Animated Background Implementation with Northern Lights and Stars
class Portfolio3D {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.geometries = [];
        this.gltfModels = [];
        this.mouse = { x: 0, y: 0 };
        this.targetMouse = { x: 0, y: 0 };
        this.backgroundMaterial = null;
        this.starMaterial = null;
        this.northernLightsMaterial = null;
        this.scrollY = 0;
        this.interactiveStars = [];
        this.raycaster = new THREE.Raycaster();
        
        this.init();
        this.createNorthernLightsBackground();
        this.createBlinkingStarField();
        this.createFloatingGeometries();
        this.loadGLTFModels();
        this.setupEventListeners();
        this.animate();
    }

    init() {
        console.log('🚀 Initializing Three.js with Northern Lights background...');
        
        // Scene setup - NO background color so we can see the northern lights
        this.scene = new THREE.Scene();
        // Don't set scene.background - let the northern lights shader be the background
        
        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000
        );
        this.camera.position.z = 30;
        
        // Renderer setup
        const canvas = document.getElementById('threejs-canvas');
        if (!canvas) {
            console.error('❌ Canvas element not found!');
            return;
        }
        
        const isMobile = window.innerWidth <= 768;
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: canvas,
            alpha: true,
            antialias: !isMobile,
            powerPreference: isMobile ? "low-power" : "high-performance"
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 2));
        
        // Basic lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(10, 10, 5);
        this.scene.add(directionalLight);
        
        console.log('✅ Scene initialized, ready for northern lights...');
        
        // Force an immediate render
        this.renderer.render(this.scene, this.camera);
    }
    
    createNorthernLightsBackground() {
        console.log('🌌 Creating spectacular northern lights background...');
        
        // Create a large background sphere that will be visible
        const sphereGeometry = new THREE.SphereGeometry(800, 64, 64);
        
        // Northern lights shader - this WILL be visible
        const vertexShader = `
            varying vec3 vWorldPosition;
            varying vec2 vUv;
            
            void main() {
                vUv = uv;
                vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                vWorldPosition = worldPosition.xyz;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;
        
        const fragmentShader = `
            uniform float time;
            varying vec3 vWorldPosition;
            varying vec2 vUv;
            
            // Noise function for organic aurora movement
            float noise(vec2 p) {
                return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
            }
            
            float smoothNoise(vec2 p) {
                vec2 i = floor(p);
                vec2 f = fract(p);
                float a = noise(i);
                float b = noise(i + vec2(1.0, 0.0));
                float c = noise(i + vec2(0.0, 1.0));
                float d = noise(i + vec2(1.0, 1.0));
                vec2 u = f * f * (3.0 - 2.0 * f);
                return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
            }
            
            void main() {
                vec3 direction = normalize(vWorldPosition);
                float height = direction.y;
                
                // Base night sky colors - deep space
                vec3 deepSpace = vec3(0.005, 0.01, 0.05);      // Very dark blue-black
                vec3 nightSky = vec3(0.02, 0.05, 0.15);        // Dark blue
                vec3 horizon = vec3(0.05, 0.1, 0.25);          // Lighter blue at horizon
                
                // Dynamic aurora colors that change over time
                vec3 auroraGreen = vec3(
                    0.1 + 0.2 * sin(time * 0.8),
                    0.8 + 0.2 * sin(time * 0.6),
                    0.3 + 0.3 * sin(time * 0.4)
                );
                
                vec3 auroraCyan = vec3(
                    0.1 + 0.2 * sin(time * 0.5),
                    0.7 + 0.3 * sin(time * 0.7),
                    0.9 + 0.1 * sin(time * 0.9)
                );
                
                vec3 auroraPurple = vec3(
                    0.6 + 0.4 * sin(time * 1.1),
                    0.2 + 0.3 * sin(time * 0.8),
                    0.8 + 0.2 * sin(time * 0.6)
                );
                
                vec3 auroraPink = vec3(
                    0.9 + 0.1 * sin(time * 0.3),
                    0.4 + 0.4 * sin(time * 1.2),
                    0.6 + 0.3 * sin(time * 0.7)
                );
                
                // Create height-based gradient
                float heightFactor = (height + 1.0) * 0.5;
                vec3 baseColor = mix(deepSpace, nightSky, heightFactor);
                baseColor = mix(baseColor, horizon, pow(heightFactor, 4.0));
                
                // Complex aurora wave patterns
                float wave1 = sin(direction.x * 2.0 + time * 1.8 + smoothNoise(direction.xz * 3.0 + time * 0.5) * 4.0);
                float wave2 = sin(direction.z * 3.0 + time * 1.2 + smoothNoise(direction.xy * 2.0 + time * 0.3) * 3.0);
                float wave3 = sin((direction.x + direction.z) * 1.5 + time * 2.2 + smoothNoise(direction.yz * 4.0 + time * 0.8) * 5.0);
                float wave4 = sin(direction.y * 2.5 + time * 0.9 + smoothNoise(direction.xz * 1.5 + time * 0.4) * 2.0);
                
                // Aurora curtain effects - vertical bands
                float curtain1 = sin(direction.x * 8.0 + time * 3.0) * sin(direction.y * 4.0 + time * 1.5);
                float curtain2 = cos(direction.z * 6.0 + time * 2.5) * cos(direction.x * 5.0 + time * 2.0);
                float curtain3 = sin((direction.x - direction.z) * 7.0 + time * 1.8) * sin(direction.y * 3.0 + time * 2.8);
                
                // Calculate aurora visibility based on height and waves
                float auroraHeight = smoothstep(-0.4, 1.5, height);
                float auroraIntensity = auroraHeight * 
                    ((wave1 + wave2 + wave3 + wave4) * 0.2 + 
                     (curtain1 + curtain2 + curtain3) * 0.3) * 
                    (0.6 + 0.4 * sin(time * 0.5)); // Breathing effect
                
                // Enhance intensity for better visibility
                auroraIntensity = max(0.0, auroraIntensity) * 1.5;
                
                // Color mixing with time-based transitions
                float colorCycle = time * 0.2;
                vec3 auroraColor = mix(auroraGreen, auroraCyan, sin(colorCycle) * 0.5 + 0.5);
                auroraColor = mix(auroraColor, auroraPurple, sin(colorCycle + 2.0) * 0.5 + 0.5);
                auroraColor = mix(auroraColor, auroraPink, sin(colorCycle + 4.0) * 0.3 + 0.7);
                
                // Add shimmer and sparkle effects
                float shimmer = sin(time * 5.0 + direction.x * 20.0 + direction.z * 15.0) * 0.2 + 0.8;
                float sparkle = sin(time * 8.0 + direction.y * 25.0) * sin(time * 6.0 + direction.x * 18.0) * 0.3 + 0.7;
                auroraColor *= shimmer * sparkle;
                
                // Final color blending - make sure aurora is visible
                vec3 finalColor = mix(baseColor, auroraColor, auroraIntensity);
                
                // Add extra aurora glow at the horizon
                float horizonGlow = smoothstep(-0.2, 0.3, height) * (1.0 - smoothstep(0.3, 0.8, height));
                finalColor += auroraGreen * horizonGlow * 0.4 * sin(time * 1.2);
                
                // Add some stars directly in the shader
                float starField = smoothNoise(direction.xy * 80.0);
                if (starField > 0.95 && height > 0.1) {
                    float starBrightness = (starField - 0.95) * 20.0;
                    finalColor += vec3(0.8, 0.9, 1.0) * starBrightness * (0.7 + 0.3 * sin(time * 3.0 + direction.x * 50.0));
                }
                
                gl_FragColor = vec4(finalColor, 1.0);
            }
        `;
        
        // Create the shader material
        this.northernLightsMaterial = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: {
                time: { value: 0.0 }
            },
            side: THREE.BackSide,
            depthWrite: false,
            transparent: false
        });
        
        // Create the background sphere
        const backgroundSphere = new THREE.Mesh(sphereGeometry, this.northernLightsMaterial);
        this.scene.add(backgroundSphere);
        
        console.log('✅ Northern lights background created and added to scene');
        
        // Create a status indicator
        const statusDiv = document.createElement('div');
        statusDiv.innerHTML = '🌌 Northern Lights Active!';
        statusDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 255, 100, 0.9);
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            font-size: 14px;
            z-index: 1000;
            font-family: Arial, sans-serif;
            animation: pulse 2s infinite;
        `;
        
        // Add pulsing animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.7; transform: scale(1.05); }
                100% { opacity: 1; transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(statusDiv);
        
        // Remove status after 5 seconds
        setTimeout(() => {
            if (statusDiv.parentNode) {
                statusDiv.parentNode.removeChild(statusDiv);
            }
        }, 5000);
    }
    
    createBlinkingStarField() {
        console.log('⭐ Creating beautiful blinking star field...');
        
        const starCount = 1500; // More stars for a rich night sky
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        const sizes = new Float32Array(starCount);
        const phases = new Float32Array(starCount); // For individual blinking timing
        
        for (let i = 0; i < starCount; i++) {
            const i3 = i * 3;
            
            // Distribute stars across a wide area
            positions[i3] = (Math.random() - 0.5) * 400;     // X
            positions[i3 + 1] = (Math.random() - 0.5) * 300; // Y  
            positions[i3 + 2] = (Math.random() - 0.5) * 300; // Z
            
            // Star colors with variety
            const starType = Math.random();
            if (starType < 0.3) {
                // Brilliant white stars
                colors[i3] = 1.0;
                colors[i3 + 1] = 1.0;
                colors[i3 + 2] = 1.0;
            } else if (starType < 0.5) {
                // Blue-white giants
                colors[i3] = 0.8 + Math.random() * 0.2;
                colors[i3 + 1] = 0.9 + Math.random() * 0.1;
                colors[i3 + 2] = 1.0;
            } else if (starType < 0.7) {
                // Warm yellow stars
                colors[i3] = 1.0;
                colors[i3 + 1] = 0.8 + Math.random() * 0.2;
                colors[i3 + 2] = 0.6 + Math.random() * 0.3;
            } else {
                // Aurora-tinted stars
                colors[i3] = 0.4 + Math.random() * 0.4;
                colors[i3 + 1] = 0.8 + Math.random() * 0.2;
                colors[i3 + 2] = 0.7 + Math.random() * 0.3;
            }
            
            // Variable star sizes
            sizes[i] = 2 + Math.random() * 8;
            
            // Individual phase for unique blinking
            phases[i] = Math.random() * Math.PI * 2;
        }
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1));
        
        // Enhanced star shader for beautiful blinking effects
        const starMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0.0 },
                mousePos: { value: new THREE.Vector2(0, 0) },
                pointTexture: { value: this.createBlinkingStarTexture() }
            },
            vertexShader: `
                attribute float size;
                attribute float phase;
                varying vec3 vColor;
                varying float vAlpha;
                uniform float time;
                uniform vec2 mousePos;
                
                void main() {
                    vColor = color;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    
                    // Multiple blinking patterns for natural effect
                    float blink1 = sin(time * 2.0 + phase) * 0.5 + 0.5;
                    float blink2 = sin(time * 1.3 + phase * 1.7) * 0.3 + 0.7;
                    float blink3 = sin(time * 3.2 + phase * 0.8) * 0.2 + 0.8;
                    
                    // Combine blinking effects
                    float blinkEffect = blink1 * blink2 * blink3;
                    
                    // Mouse interaction - brighten nearby stars
                    vec2 screenPos = (mvPosition.xy / mvPosition.w) * 0.5 + 0.5;
                    float mouseDist = distance(screenPos, mousePos);
                    float mouseEffect = 1.0 + (1.0 - smoothstep(0.0, 0.4, mouseDist)) * 1.5;
                    
                    // Final size with perspective
                    gl_PointSize = size * blinkEffect * mouseEffect * (300.0 / -mvPosition.z);
                    
                    // Alpha variation for twinkling
                    vAlpha = blinkEffect * (0.6 + 0.4 * sin(time * 3.5 + phase));
                    
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform sampler2D pointTexture;
                varying vec3 vColor;
                varying float vAlpha;
                
                void main() {
                    vec4 textureColor = texture2D(pointTexture, gl_PointCoord);
                    
                    // Add star glow effect
                    float distFromCenter = distance(gl_PointCoord, vec2(0.5));
                    float glow = 1.0 - smoothstep(0.0, 0.6, distFromCenter);
                    
                    vec4 finalColor = vec4(vColor * glow, vAlpha) * textureColor;
                    
                    gl_FragColor = finalColor;
                }
            `,
            transparent: true,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        this.particles = new THREE.Points(geometry, starMaterial);
        this.scene.add(this.particles);
        
        // Store reference for animation
        this.starMaterial = starMaterial;
        
        console.log('✅ Blinking star field created with', starCount, 'stars');
        
        // Create status indicator
        const statusDiv = document.createElement('div');
        statusDiv.innerHTML = '⭐ Blinking Stars Active!';
        statusDiv.style.cssText = `
            position: fixed;
            top: 70px;
            right: 20px;
            background: rgba(255, 200, 0, 0.9);
            color: white;
            padding: 8px 12px;
            border-radius: 5px;
            font-size: 12px;
            z-index: 1000;
            font-family: Arial, sans-serif;
        `;
        document.body.appendChild(statusDiv);
        
        setTimeout(() => {
            if (statusDiv.parentNode) {
                statusDiv.parentNode.removeChild(statusDiv);
            }
        }, 4000);
    }
    
    createBlinkingStarTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const context = canvas.getContext('2d');
        
        const centerX = 32;
        const centerY = 32;
        
        // Create radial gradient for star
        const gradient = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, 32);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        context.fillStyle = gradient;
        context.fillRect(0, 0, 64, 64);
        
        // Add star spikes
        context.fillStyle = 'rgba(255, 255, 255, 0.9)';
        
        // Main spikes
        context.fillRect(30, 4, 4, 56); // Vertical
        context.fillRect(4, 30, 56, 4); // Horizontal
        
        // Diagonal spikes
        context.save();
        context.translate(centerX, centerY);
        context.rotate(Math.PI / 4);
        context.fillRect(-2, -20, 4, 40);
        context.fillRect(-20, -2, 40, 4);
        context.restore();
        
        return new THREE.CanvasTexture(canvas);
    }
    
    createStarField() {
        console.log('🌟 Creating realistic star field...');
        
        const starCount = 800; // Optimized count for performance
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        const sizes = new Float32Array(starCount);
        
        for (let i = 0; i < starCount; i++) {
            const i3 = i * 3;
            
            // Create a more spread out distribution for stars
            positions[i3] = (Math.random() - 0.5) * 200;     // X position
            positions[i3 + 1] = (Math.random() - 0.5) * 150; // Y position  
            positions[i3 + 2] = (Math.random() - 0.5) * 150; // Z position
            
            // Star-like colors - whites, blues, and soft yellows
            const starType = Math.random();
            if (starType < 0.3) {
                // White/blue stars
                colors[i3] = 0.8 + Math.random() * 0.2;     // R
                colors[i3 + 1] = 0.9 + Math.random() * 0.1; // G
                colors[i3 + 2] = 1.0;                       // B
            } else if (starType < 0.6) {
                // Warm white stars
                colors[i3] = 1.0;                           // R
                colors[i3 + 1] = 0.9 + Math.random() * 0.1; // G
                colors[i3 + 2] = 0.7 + Math.random() * 0.3; // B
            } else {
                // Aurora-colored accent stars
                colors[i3] = 0.3 + Math.random() * 0.4;     // R
                colors[i3 + 1] = 0.8 + Math.random() * 0.2; // G
                colors[i3 + 2] = 0.9 + Math.random() * 0.1; // B
            }
            
            // Variable star sizes for twinkling effect
            sizes[i] = 2 + Math.random() * 4;
        }
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        // Create star material with custom shader for twinkling effect
        const starMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0.0 },
                pointTexture: { value: this.createStarTexture() }
            },
            vertexShader: `
                attribute float size;
                varying vec3 vColor;
                uniform float time;
                
                void main() {
                    vColor = color;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    
                    // Twinkling effect - vary size based on time and position
                    float twinkle = sin(time * 2.0 + position.x * 0.1 + position.y * 0.1) * 0.3 + 0.7;
                    gl_PointSize = size * twinkle * (300.0 / -mvPosition.z);
                    
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform sampler2D pointTexture;
                varying vec3 vColor;
                
                void main() {
                    vec4 textureColor = texture2D(pointTexture, gl_PointCoord);
                    gl_FragColor = vec4(vColor, 1.0) * textureColor;
                }
            `,
            transparent: true,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        this.particles = new THREE.Points(geometry, starMaterial);
        this.scene.add(this.particles);
        
        // Store reference to update time uniform
        this.starMaterial = starMaterial;
        
        console.log('✅ Shining stars created (', starCount, 'stars)');
        
        // Update status
        const updateStatus = (type, message) => {
            const element = document.getElementById(`${type}-status`);
            if (element) {
                element.textContent = message;
                element.style.color = '#00ff00';
            }
        };
        updateStatus('stars', 'Active ✅');
    }
    
    createStarTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const context = canvas.getContext('2d');
        
        // Create radial gradient for star glow
        const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.4)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        context.fillStyle = gradient;
        context.fillRect(0, 0, 64, 64);
        
        // Add cross-shaped spikes to make it look more star-like
        context.fillStyle = 'rgba(255, 255, 255, 0.8)';
        
        // Vertical spike
        context.fillRect(31, 8, 2, 48);
        // Horizontal spike  
        context.fillRect(8, 31, 48, 2);
        // Diagonal spikes
        context.save();
        context.translate(32, 32);
        context.rotate(Math.PI / 4);
        context.fillRect(-1, -24, 2, 48);
        context.fillRect(-24, -1, 48, 2);
        context.restore();
        
        const texture = new THREE.CanvasTexture(canvas);
        return texture;
    }
    
    createInteractiveStarField() {
        console.log('🌟 Creating interactive blinking star field...');
        
        const starCount = 1200; // More stars for a rich sky
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        const sizes = new Float32Array(starCount);
        const phases = new Float32Array(starCount); // For individual star timing
        const intensities = new Float32Array(starCount); // For brightness variation
        
        for (let i = 0; i < starCount; i++) {
            const i3 = i * 3;
            
            // Create a more spread out distribution for stars
            positions[i3] = (Math.random() - 0.5) * 300;     // X position - wider spread
            positions[i3 + 1] = (Math.random() - 0.5) * 200; // Y position  
            positions[i3 + 2] = (Math.random() - 0.5) * 200; // Z position
            
            // Enhanced star colors with more variety
            const starType = Math.random();
            if (starType < 0.2) {
                // Brilliant white stars
                colors[i3] = 1.0;                           // R
                colors[i3 + 1] = 1.0;                       // G
                colors[i3 + 2] = 1.0;                       // B
            } else if (starType < 0.4) {
                // Blue-white giants
                colors[i3] = 0.7 + Math.random() * 0.3;     // R
                colors[i3 + 1] = 0.8 + Math.random() * 0.2; // G
                colors[i3 + 2] = 1.0;                       // B
            } else if (starType < 0.6) {
                // Warm yellow stars
                colors[i3] = 1.0;                           // R
                colors[i3 + 1] = 0.8 + Math.random() * 0.2; // G
                colors[i3 + 2] = 0.6 + Math.random() * 0.3; // B
            } else if (starType < 0.8) {
                // Aurora-colored accent stars
                colors[i3] = 0.2 + Math.random() * 0.5;     // R
                colors[i3 + 1] = 0.7 + Math.random() * 0.3; // G
                colors[i3 + 2] = 0.8 + Math.random() * 0.2; // B
            } else {
                // Red giants and special stars
                colors[i3] = 0.9 + Math.random() * 0.1;     // R
                colors[i3 + 1] = 0.4 + Math.random() * 0.3; // G
                colors[i3 + 2] = 0.3 + Math.random() * 0.4; // B
            }
            
            // Variable star sizes with more dramatic range
            sizes[i] = 1.5 + Math.random() * 6;
            
            // Individual phase offsets for unique blinking patterns
            phases[i] = Math.random() * Math.PI * 2;
            
            // Base intensity for each star
            intensities[i] = 0.3 + Math.random() * 0.7;
        }
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1));
        geometry.setAttribute('intensity', new THREE.BufferAttribute(intensities, 1));
        
        // Enhanced star material with complex blinking and interactive effects
        const starMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0.0 },
                mousePos: { value: new THREE.Vector2(0, 0) },
                pointTexture: { value: this.createEnhancedStarTexture() }
            },
            vertexShader: `
                attribute float size;
                attribute float phase;
                attribute float intensity;
                varying vec3 vColor;
                varying float vAlpha;
                uniform float time;
                uniform vec2 mousePos;
                
                void main() {
                    vColor = color;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    
                    // Complex blinking patterns
                    float primaryBlink = sin(time * 1.5 + phase) * 0.4 + 0.6;
                    float secondaryBlink = sin(time * 0.8 + phase * 2.0) * 0.2 + 0.8;
                    float tertiaryBlink = sin(time * 2.2 + phase * 0.5) * 0.3 + 0.7;
                    
                    // Combine blinking effects
                    float blinkIntensity = primaryBlink * secondaryBlink * tertiaryBlink * intensity;
                    
                    // Mouse interaction - stars brighten when mouse is near
                    vec2 screenPos = (mvPosition.xy / mvPosition.w) * 0.5 + 0.5;
                    float mouseDist = distance(screenPos, mousePos);
                    float mouseEffect = 1.0 + (1.0 - smoothstep(0.0, 0.3, mouseDist)) * 0.8;
                    
                    // Pulsing effect for some stars
                    float pulse = sin(time * 3.0 + phase * 3.0) * 0.15 + 0.85;
                    
                    // Final size calculation
                    gl_PointSize = size * blinkIntensity * mouseEffect * pulse * (400.0 / -mvPosition.z);
                    
                    // Vary alpha for twinkling
                    vAlpha = blinkIntensity * (0.7 + 0.3 * sin(time * 2.5 + phase));
                    
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform sampler2D pointTexture;
                varying vec3 vColor;
                varying float vAlpha;
                
                void main() {
                    vec4 textureColor = texture2D(pointTexture, gl_PointCoord);
                    
                    // Add corona effect
                    float distFromCenter = distance(gl_PointCoord, vec2(0.5));
                    float corona = 1.0 - smoothstep(0.1, 0.5, distFromCenter);
                    
                    vec4 finalColor = vec4(vColor, vAlpha) * textureColor;
                    finalColor.rgb += corona * vColor * 0.3;
                    
                    gl_FragColor = finalColor;
                }
            `,
            transparent: true,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        this.particles = new THREE.Points(geometry, starMaterial);
        this.scene.add(this.particles);
        
        // Store reference to update uniforms
        this.starMaterial = starMaterial;
        
        // Create interactive star tracking
        this.interactiveStars = [];
        for (let i = 0; i < Math.min(starCount, 50); i++) {
            this.interactiveStars.push({
                index: i,
                originalSize: sizes[i],
                highlightIntensity: 0
            });
        }
        
        console.log('✅ Interactive blinking stars created (', starCount, 'stars)');
        
        // Update status
        const updateStatus = (type, message) => {
            const element = document.getElementById(`${type}-status`);
            if (element) {
                element.textContent = message;
                element.style.color = '#00ff00';
            }
        };
        updateStatus('stars', 'Interactive & Blinking ✅');
    }
    
    createEnhancedStarTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const context = canvas.getContext('2d');
        
        const centerX = 64;
        const centerY = 64;
        
        // Create multiple gradient layers for more realistic star appearance
        
        // Outer glow
        const outerGradient = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, 64);
        outerGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        outerGradient.addColorStop(0.1, 'rgba(255, 255, 255, 0.6)');
        outerGradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.3)');
        outerGradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.1)');
        outerGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        context.fillStyle = outerGradient;
        context.fillRect(0, 0, 128, 128);
        
        // Inner bright core
        const coreGradient = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, 20);
        coreGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        coreGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.9)');
        coreGradient.addColorStop(1, 'rgba(255, 255, 255, 0.2)');
        
        context.fillStyle = coreGradient;
        context.fillRect(0, 0, 128, 128);
        
        // Add star spikes for more dramatic effect
        context.fillStyle = 'rgba(255, 255, 255, 0.9)';
        
        // Main cross spikes
        context.fillRect(62, 10, 4, 108); // Vertical
        context.fillRect(10, 62, 108, 4); // Horizontal
        
        // Diagonal spikes
        context.save();
        context.translate(centerX, centerY);
        context.rotate(Math.PI / 4);
        context.fillRect(-2, -50, 4, 100);
        context.fillRect(-50, -2, 100, 4);
        context.restore();
        
        // Add smaller secondary spikes
        context.fillStyle = 'rgba(255, 255, 255, 0.6)';
        context.save();
        context.translate(centerX, centerY);
        context.rotate(Math.PI / 8);
        context.fillRect(-1, -30, 2, 60);
        context.fillRect(-30, -1, 60, 2);
        context.restore();
        
        const texture = new THREE.CanvasTexture(canvas);
        return texture;
    }
      createParticles() {
        // This method is now simplified since we have a dedicated star field
        // Just create some basic floating particles for atmosphere
        const particleCount = 100;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount * 3; i += 3) {
            // Positions
            positions[i] = (Math.random() - 0.5) * 60;
            positions[i + 1] = (Math.random() - 0.5) * 60;
            positions[i + 2] = (Math.random() - 0.5) * 60;
            
            // Subtle colors
            colors[i] = 0.3 + Math.random() * 0.2; // R
            colors[i + 1] = 0.5 + Math.random() * 0.3; // G
            colors[i + 2] = 0.8 + Math.random() * 0.2; // B
        }
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 1,
            vertexColors: true,
            transparent: true,
            opacity: 0.6
        });
        
        this.floatingParticles = new THREE.Points(geometry, material);
        this.scene.add(this.floatingParticles);
    }
    
    createFloatingGeometries() {
        // Neural Network Nodes
        for (let i = 0; i < 8; i++) {
            const geometry = new THREE.SphereGeometry(0.5, 16, 16);
            const material = new THREE.MeshPhongMaterial({ 
                color: 0x0BCEAF,
                transparent: true,
                opacity: 0.7,
                emissive: 0x022222
            });
            const sphere = new THREE.Mesh(geometry, material);
            
            sphere.position.set(
                (Math.random() - 0.5) * 50,
                (Math.random() - 0.5) * 50,
                (Math.random() - 0.5) * 50
            );
            
            sphere.userData = {
                originalY: sphere.position.y,
                speed: Math.random() * 0.02 + 0.01
            };
            
            this.geometries.push(sphere);
            this.scene.add(sphere);
        }
        
        // Tech-inspired wireframe cubes
        for (let i = 0; i < 5; i++) {
            const geometry = new THREE.BoxGeometry(2, 2, 2);
            const material = new THREE.MeshBasicMaterial({ 
                color: 0x6c757d,
                wireframe: true,
                transparent: true,
                opacity: 0.3
            });
            const cube = new THREE.Mesh(geometry, material);
            
            cube.position.set(
                (Math.random() - 0.5) * 60,
                (Math.random() - 0.5) * 60,
                (Math.random() - 0.5) * 60
            );
            
            cube.userData = {
                rotationSpeed: Math.random() * 0.02 + 0.005
            };
            
            this.geometries.push(cube);
            this.scene.add(cube);
        }
        
        // Data flow rings
        for (let i = 0; i < 3; i++) {
            const geometry = new THREE.RingGeometry(3, 4, 32);
            const material = new THREE.MeshBasicMaterial({ 
                color: 0x078571,
                transparent: true,
                opacity: 0.4,
                side: THREE.DoubleSide
            });
            const ring = new THREE.Mesh(geometry, material);
            
            ring.position.set(
                (Math.random() - 0.5) * 40,
                (Math.random() - 0.5) * 40,
                (Math.random() - 0.5) * 40
            );
            
            ring.rotation.x = Math.random() * Math.PI;
            ring.rotation.y = Math.random() * Math.PI;
            
            ring.userData = {
                rotationSpeed: Math.random() * 0.01 + 0.005
            };
            
            this.geometries.push(ring);
            this.scene.add(ring);
        }
    }
    
    setupEventListeners() {
        // Enhanced mouse movement with star interaction
        document.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            
            // Update mouse position for star shader interaction
            if (this.starMaterial && this.starMaterial.uniforms.mousePos) {
                this.starMaterial.uniforms.mousePos.value.set(
                    event.clientX / window.innerWidth,
                    1.0 - event.clientY / window.innerHeight
                );
            }
        });
        
        // Mouse click for star interaction
        document.addEventListener('click', (event) => {
            this.handleStarClick(event);
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
        
        // Scroll-based effects
        window.addEventListener('scroll', () => {
            this.scrollY = window.scrollY;
        });
    }
    
    handleStarClick(event) {
        // Convert mouse coordinates to normalized device coordinates
        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Update the raycaster
        this.raycaster.setFromCamera(mouse, this.camera);
        
        // Check for intersections with star particles
        if (this.particles) {
            const intersects = this.raycaster.intersectObject(this.particles);
            
            if (intersects.length > 0) {
                // Create a ripple effect or constellation connection
                this.createStarRipple(intersects[0].point);
            }
        }
    }
    
    createStarRipple(position) {
        // Create a temporary ripple effect at the clicked star position
        const rippleGeometry = new THREE.RingGeometry(0.1, 2, 16);
        const rippleMaterial = new THREE.MeshBasicMaterial({
            color: 0x88ff88,
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide
        });
        
        const ripple = new THREE.Mesh(rippleGeometry, rippleMaterial);
        ripple.position.copy(position);
        ripple.lookAt(this.camera.position);
        
        this.scene.add(ripple);
        
        // Animate the ripple
        const startTime = Date.now();
        const animateRipple = () => {
            const elapsed = (Date.now() - startTime) / 1000;
            if (elapsed < 2) {
                ripple.scale.setScalar(1 + elapsed * 3);
                ripple.material.opacity = 0.8 * (1 - elapsed / 2);
                requestAnimationFrame(animateRipple);
            } else {
                this.scene.remove(ripple);
                rippleGeometry.dispose();
                rippleMaterial.dispose();
            }
        };
        animateRipple();
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        const time = Date.now() * 0.001;
        const deltaTime = 0.016;
        
        // Update northern lights animation - THIS IS CRUCIAL
        if (this.northernLightsMaterial) {
            this.northernLightsMaterial.uniforms.time.value = time;
        }
        
        // Update blinking star animation
        if (this.starMaterial) {
            this.starMaterial.uniforms.time.value = time;
        }
        
        // Animate star field with gentle movement
        if (this.particles) {
            this.particles.rotation.x = time * 0.005;
            this.particles.rotation.y = time * 0.003;
            
            // Breathing effect
            const breathingScale = 1 + Math.sin(time * 0.8) * 0.03;
            this.particles.scale.setScalar(breathingScale);
        }
        
        // Enhanced camera movement with mouse following
        this.camera.position.x += (this.mouse.x * 5 - this.camera.position.x) * 0.02;
        this.camera.position.y += (-this.mouse.y * 5 - this.camera.position.y) * 0.02;
        
        // Add subtle camera sway
        this.camera.position.x += Math.sin(time * 0.2) * 0.8;
        this.camera.position.y += Math.cos(time * 0.15) * 0.6;
        
        // Scroll-based camera distance
        const targetZ = 30 + (this.scrollY * 0.02);
        this.camera.position.z += (targetZ - this.camera.position.z) * 0.03;
        
        this.camera.lookAt(this.scene.position);
        
        // Render the scene
        this.renderer.render(this.scene, this.camera);
    }
    
    loadGLTFModels() {
        // Check if GLTFLoader is available
        if (typeof THREE.GLTFLoader === 'undefined') {
            console.error('❌ GLTFLoader not available');
            this.createFallbackModels();
            return;
        }
        
        console.log('🎮 Loading GLTF models...');
        
        const loader = new THREE.GLTFLoader();
        let modelsLoaded = 0;
        const totalModels = 3;
        
        const updateStatus = (type, message) => {
            const element = document.getElementById(`${type}-status`);
            if (element) {
                element.textContent = message;
                element.style.color = modelsLoaded === totalModels ? '#00ff00' : '#ffff00';
            }
        };
        
        const modelLoaded = () => {
            modelsLoaded++;
            updateStatus('models', `${modelsLoaded}/${totalModels} loaded`);
            if (modelsLoaded === totalModels) {
                updateStatus('models', 'All loaded ✅');
            }
        };
        
        // Load brain point cloud model - positioned much further away
        loader.load(
            'assets/brain_point_cloud/scene.gltf',
            (gltf) => {
                console.log('✅ Brain model loaded:', gltf);
                
                const brain = gltf.scene;
                brain.scale.set(5, 5, 5); // Made larger for visibility
                brain.position.set(-40, 20, -35); // Closer for better visibility
                brain.rotation.set(0, Math.PI / 4, 0);
                
                // Store for animation
                brain.userData = {
                    rotationSpeed: 0.005,
                    floatSpeed: 0.01,
                    originalY: brain.position.y,
                    revolutionRadius: 50, // Smaller revolution radius
                    revolutionSpeed: 0.003
                };
                
                this.gltfModels.push(brain);
                this.scene.add(brain);
                modelLoaded();
                
                console.log('🧠 Brain model added to scene');
            },
            (progress) => {
                console.log('Brain loading progress:', (progress.loaded / progress.total * 100) + '%');
            },
            (error) => {
                console.error('❌ Error loading brain model:', error);
                this.createFallbackBrain();
                modelLoaded();
            }
        );
        
        // Load Shiba dog model - positioned much further away
        loader.load(
            'assets/shiba/scene.gltf',
            (gltf) => {
                console.log('✅ Shiba model loaded:', gltf);
                
                const shiba = gltf.scene;
                shiba.scale.set(0.8, 0.8, 0.8); // Larger for visibility
                shiba.position.set(30, -10, -25); // Closer for better visibility
                shiba.rotation.set(0, -Math.PI / 2, 0);
                
                // Store for animation
                shiba.userData = {
                    rotationSpeed: 0.01,
                    floatSpeed: 0.005,
                    originalY: shiba.position.y,
                    revolutionRadius: 40,
                    revolutionSpeed: 0.004
                };
                
                this.gltfModels.push(shiba);
                this.scene.add(shiba);
                modelLoaded();
                
                console.log('🐕 Shiba model added to scene');
            },
            (progress) => {
                console.log('Shiba loading progress:', (progress.loaded / progress.total * 100) + '%');
            },
            (error) => {
                console.error('❌ Error loading Shiba model:', error);
                this.createFallbackShiba();
                modelLoaded();
            }
        );
        
        // Load animated cat model - positioned much further away
        loader.load(
            'assets/an-animated-cat/source/scene.gltf',
            (gltf) => {
                console.log('✅ Cat model loaded:', gltf);
                
                const cat = gltf.scene;
                cat.scale.set(3, 3, 3); // Larger for visibility
                cat.position.set(0, -20, -20); // Closer for better visibility
                
                // Set up animation mixer if animations exist
                if (gltf.animations && gltf.animations.length > 0) {
                    const mixer = new THREE.AnimationMixer(cat);
                    const action = mixer.clipAction(gltf.animations[0]);
                    action.play();
                    
                    cat.userData.mixer = mixer;
                    console.log('🎬 Cat animations playing');
                }
                
                // Store for animation
                cat.userData = {
                    ...cat.userData,
                    rotationSpeed: 0.003,
                    floatSpeed: 0.008,
                    originalY: cat.position.y,
                    revolutionRadius: 35,
                    revolutionSpeed: 0.005
                };
                
                this.gltfModels.push(cat);
                this.scene.add(cat);
                modelLoaded();
                
                console.log('🐱 Cat model added to scene');
            },
            (progress) => {
                console.log('Cat loading progress:', (progress.loaded / progress.total * 100) + '%');
            },
            (error) => {
                console.error('❌ Error loading Cat model:', error);
                this.createFallbackCat();
                modelLoaded();
            }
        );
    }
    
    createFallbackModels() {
        console.log('🎭 Creating fallback models instead of GLTF...');
        this.createFallbackBrain();
        this.createFallbackShiba();
        this.createFallbackCat();
        
        const updateStatus = (type, message) => {
            const element = document.getElementById(`${type}-status`);
            if (element) {
                element.textContent = message;
                element.style.color = '#00ff00';
            }
        };
        updateStatus('models', 'Fallback models ✅');
    }
    
    createFallbackBrain() {
        // Create a glowing sphere with wireframe to represent brain
        const geometry = new THREE.SphereGeometry(8, 16, 16);
        const material = new THREE.MeshPhongMaterial({ 
            color: 0xff6b9d,
            wireframe: true,
            transparent: true,
            opacity: 0.8,
            emissive: 0x331122
        });
        const brain = new THREE.Mesh(geometry, material);
        brain.position.set(-40, 20, -35);
        
        brain.userData = {
            rotationSpeed: 0.005,
            floatSpeed: 0.01,
            originalY: brain.position.y,
            revolutionRadius: 50,
            revolutionSpeed: 0.003
        };
        
        this.gltfModels.push(brain);
        this.scene.add(brain);
        console.log('🧠 Fallback brain created');
    }
    
    createFallbackShiba() {
        // Create a golden cube to represent Shiba
        const geometry = new THREE.BoxGeometry(6, 6, 6);
        const material = new THREE.MeshPhongMaterial({ 
            color: 0xdaa520,
            transparent: true,
            opacity: 0.9
        });
        const shiba = new THREE.Mesh(geometry, material);
        shiba.position.set(30, -10, -25);
        
        shiba.userData = {
            rotationSpeed: 0.01,
            floatSpeed: 0.005,
            originalY: shiba.position.y,
            revolutionRadius: 40,
            revolutionSpeed: 0.004
        };
        
        this.gltfModels.push(shiba);
        this.scene.add(shiba);
        console.log('🐕 Fallback shiba created');
    }
    
    createFallbackCat() {
        // Create a purple octahedron to represent cat
        const geometry = new THREE.OctahedronGeometry(5);
        const material = new THREE.MeshPhongMaterial({ 
            color: 0x9966cc,
            transparent: true,
            opacity: 0.8,
            emissive: 0x221133
        });
        const cat = new THREE.Mesh(geometry, material);
        cat.position.set(0, -20, -20);
        
        cat.userData = {
            rotationSpeed: 0.003,
            floatSpeed: 0.008,
            originalY: cat.position.y,
            revolutionRadius: 35,
            revolutionSpeed: 0.005
        };
        
        this.gltfModels.push(cat);
        this.scene.add(cat);
        console.log('🐱 Fallback cat created');
    }
}

// Debug function to check Three.js status
function debugThreeJS() {
    console.log('=== Three.js Debug Info ===');
    console.log('THREE object available:', typeof THREE !== 'undefined');
    console.log('Canvas element found:', !!document.getElementById('threejs-canvas'));
    console.log('Window dimensions:', window.innerWidth, 'x', window.innerHeight);
    console.log('User agent:', navigator.userAgent);
    console.log('Prefers reduced motion:', window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    
    if (typeof THREE !== 'undefined') {
        console.log('THREE.js version:', THREE.REVISION);
    }
}

// Call debug function
debugThreeJS();

// Initialize Three.js when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Update debug info
    const updateDebugInfo = (type, message) => {
        const element = document.getElementById(`${type}-status`);
        if (element) element.textContent = `${type}: ${message}`;
    };
    
    updateDebugInfo('canvas', document.getElementById('threejs-canvas') ? 'Found' : 'NOT FOUND');
    updateDebugInfo('threejs', typeof THREE !== 'undefined' ? 'Loaded' : 'Not loaded');
    
    // Call debug function
    debugThreeJS();
      // Check if user prefers reduced motion (temporarily disabled for debugging)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    console.log('🔍 Prefers reduced motion:', prefersReducedMotion);
    // Temporarily comment out to test Three.js
    // if (prefersReducedMotion) {
    //     console.log('⚠️ Reduced motion preferred, skipping Three.js background');
    //     return;
    // }
    
    // Show loading indicator
    const loader = document.getElementById('threejs-loader');
    if (loader) {
        loader.style.display = 'block';
    }
      // Wait for Three.js to load with timeout fallback
    if (typeof THREE !== 'undefined') {
        console.log('🚀 Three.js available immediately, initializing...');
        initializeThreeJS();
    } else {
        console.log('⏳ Waiting for Three.js to load...');
        // Try again after a short delay
        setTimeout(() => {
            if (typeof THREE !== 'undefined') {
                console.log('🚀 Three.js loaded after delay, initializing...');
                initializeThreeJS();
            } else {
                console.error('❌ Three.js still not available after delay');
                if (loader) {
                    loader.innerHTML = '❌ Three.js Failed to Load';
                    loader.style.background = 'rgba(211, 47, 47, 0.9)';
                    setTimeout(() => {
                        loader.style.display = 'none';
                    }, 3000);
                }
            }
        }, 1000);
    }
    
    function initializeThreeJS() {
        console.log('🚀 Initializing Three.js animated background...');        try {
            const portfolio = new Portfolio3D();
            window.portfolio3D = portfolio; // Make globally accessible for debugging
            console.log('✅ Three.js background initialized successfully');
            if (loader) {
                loader.innerHTML = '✅ 3D Background Active';
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 2000);
            }
        } catch (error) {
            console.error('❌ Failed to initialize Three.js background:', error);
            if (loader) {
                loader.innerHTML = '❌ 3D Background Failed';
                loader.style.background = 'rgba(211, 47, 47, 0.9)';
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 3000);
            }
        }
    }
});

