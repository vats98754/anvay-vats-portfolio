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
        // this.createFloatingGeometries(); // Removed cubes and rings
        this.loadGLTFModels();
        this.createRevolvingObjectTrails();
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
        
        const starCount = 3000; // Much more stars for a rich night sky
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        const sizes = new Float32Array(starCount);
        const phases = new Float32Array(starCount); // For individual blinking timing
        const sparklePhases = new Float32Array(starCount); // For sparkling effects
        
        // Store star data for interactive effects
        this.interactiveStars = [];
        
        for (let i = 0; i < starCount; i++) {
            const i3 = i * 3;
            
            // Distribute stars across a wider area
            const x = (Math.random() - 0.5) * 500;
            const y = (Math.random() - 0.5) * 400; 
            const z = (Math.random() - 0.5) * 400;
            
            positions[i3] = x;
            positions[i3 + 1] = y;
            positions[i3 + 2] = z;
            
            // Store for interaction detection
            this.interactiveStars.push({
                id: i,
                position: new THREE.Vector3(x, y, z),
                isShootingStar: false,
                shootingDirection: new THREE.Vector3(),
                shootingSpeed: 0,
                originalPosition: new THREE.Vector3(x, y, z)
            });
            
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
            
            // Individual phase for unique blinking and sparkling
            phases[i] = Math.random() * Math.PI * 2;
            sparklePhases[i] = Math.random() * Math.PI * 2;
        }
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1));
        geometry.setAttribute('sparklePhase', new THREE.BufferAttribute(sparklePhases, 1));
        
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
                attribute float sparklePhase;
                varying vec3 vColor;
                varying float vAlpha;
                varying float vSparkle;
                uniform float time;
                uniform vec2 mousePos;
                
                void main() {
                    vColor = color;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    
                    // Multiple blinking patterns for natural effect
                    float blink1 = sin(time * 2.0 + phase) * 0.5 + 0.5;
                    float blink2 = sin(time * 1.3 + phase * 1.7) * 0.3 + 0.7;
                    float blink3 = sin(time * 3.2 + phase * 0.8) * 0.2 + 0.8;
                    
                    // Sparkling effect - fast, intense twinkles
                    float sparkle1 = sin(time * 8.0 + sparklePhase) * 0.4 + 0.6;
                    float sparkle2 = sin(time * 12.0 + sparklePhase * 2.0) * 0.3 + 0.7;
                    float sparkleIntensity = sparkle1 * sparkle2;
                    
                    // Combine blinking and sparkling effects
                    float blinkEffect = blink1 * blink2 * blink3;
                    float finalEffect = blinkEffect * (1.0 + sparkleIntensity * 0.8);
                    
                    // Mouse interaction - brighten nearby stars for shooting star potential
                    vec2 screenPos = (mvPosition.xy / mvPosition.w) * 0.5 + 0.5;
                    float mouseDist = distance(screenPos, mousePos);
                    float mouseEffect = 1.0 + (1.0 - smoothstep(0.0, 0.3, mouseDist)) * 2.0;
                    
                    // Final size with perspective and effects
                    gl_PointSize = size * finalEffect * mouseEffect * (400.0 / -mvPosition.z);
                    
                    // Alpha variation for twinkling and sparkling
                    vAlpha = finalEffect * (0.5 + 0.5 * sin(time * 4.0 + phase));
                    vSparkle = sparkleIntensity;
                    
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform sampler2D pointTexture;
                varying vec3 vColor;
                varying float vAlpha;
                varying float vSparkle;
                
                void main() {
                    vec4 textureColor = texture2D(pointTexture, gl_PointCoord);
                    
                    // Add star glow effect
                    float distFromCenter = distance(gl_PointCoord, vec2(0.5));
                    float glow = 1.0 - smoothstep(0.0, 0.6, distFromCenter);
                    
                    // Enhanced sparkling color enhancement with mouse proximity
                    vec3 sparkleColor = vColor + vec3(0.3, 0.3, 0.3) * vSparkle;
                    
                    // Add constellation effect - bright connections near mouse
                    float mouseDistance = distance(gl_PointCoord, vec2(0.5));
                    float constellationGlow = 1.0 - smoothstep(0.1, 0.8, mouseDistance);
                    sparkleColor += vec3(0.2, 0.4, 0.8) * constellationGlow * 0.5;
                    
                    vec4 finalColor = vec4(sparkleColor * glow, vAlpha) * textureColor;
                    
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
        
        // Create particle trails for revolving objects
        this.createRevolvingObjectTrails();
        
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
        // Removed cubes and donut rings for cleaner background
        console.log('🚫 Floating geometries disabled for cleaner look');
    }
    
    setupEventListeners() {
        // Enhanced mouse movement with star interaction
        document.addEventListener('mousemove', (event) => {
            this.handleStarInteraction(event);
            this.handleBackgroundAssetInteraction(event);
        });
        
        // Mouse click for enhanced star interaction
        document.addEventListener('click', (event) => {
            this.createClickShootingStars(event);
        });
        
        // Touch support for mobile devices
        document.addEventListener('touchmove', (event) => {
            if (event.touches.length > 0) {
                const touch = event.touches[0];
                const fakeEvent = {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                };
                this.handleStarInteraction(fakeEvent);
                this.handleBackgroundAssetInteraction(fakeEvent);
            }
        });
        
        document.addEventListener('touchstart', (event) => {
            if (event.touches.length > 0) {
                const touch = event.touches[0];
                const fakeEvent = {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                };
                this.createClickShootingStars(fakeEvent);
            }
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
    
    handleBackgroundAssetInteraction(event) {
        // Create mouse influence on floating GLTF models
        const mouseInfluence = {
            x: (event.clientX / window.innerWidth - 0.5) * 2,
            y: -(event.clientY / window.innerHeight - 0.5) * 2
        };
        
        // Apply mouse influence to floating models
        this.gltfModels.forEach(model => {
            if (model.userData) {
                // Magnetic effect - models slightly follow the mouse
                const targetX = model.userData.originalX || model.position.x;
                const targetZ = model.userData.originalZ || model.position.z;
                
                if (!model.userData.originalX) {
                    model.userData.originalX = model.position.x;
                    model.userData.originalZ = model.position.z;
                }
                
                model.position.x += (targetX + mouseInfluence.x * 5 - model.position.x) * 0.02;
                model.position.z += (targetZ + mouseInfluence.y * 3 - model.position.z) * 0.02;
                
                // Slight rotation based on mouse position
                model.rotation.y += mouseInfluence.x * 0.001;
                model.rotation.x += mouseInfluence.y * 0.0005;
            }
        });
    }
    
    handleStarClick(event) {
        // Create a ripple effect where clicked
        const rippleEffect = this.createStarRipple(event.clientX, event.clientY);
        
        // Convert screen coordinates to world coordinates
        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Create multiple shooting stars from click point
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                this.createRandomShootingStar(mouse);
            }, i * 200);
        }
    }
    
    createStarRipple(screenX, screenY) {
        // Create visual ripple effect at click point
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: fixed;
            left: ${screenX - 25}px;
            top: ${screenY - 25}px;
            width: 50px;
            height: 50px;
            border: 2px solid rgba(255, 255, 255, 0.8);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            animation: rippleEffect 1s ease-out forwards;
        `;
        
        // Add ripple animation
        const style = document.createElement('style');
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
        document.body.appendChild(ripple);
        
        // Remove after animation
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 1000);
    }
    
    createRandomShootingStar(mousePos) {
        if (!this.interactiveStars || this.interactiveStars.length === 0) return;
        
        // Find a random star that's not already shooting
        const availableStars = this.interactiveStars.filter(star => !star.isShootingStar);
        if (availableStars.length === 0) return;
        
        const randomStar = availableStars[Math.floor(Math.random() * availableStars.length)];
        const index = this.interactiveStars.indexOf(randomStar);
        
        this.createShootingStar(randomStar, index);
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
            
            // Animate shooting stars
            if (this.interactiveStars && this.interactiveStars.length > 0) {
                const positions = this.particles.geometry.attributes.position.array;
                let needsUpdate = false;
                
                for (let i = 0; i < this.interactiveStars.length; i++) {
                    const star = this.interactiveStars[i];
                    
                    if (star.isShootingStar) {
                        // Move the star along its shooting direction
                        star.position.add(
                            star.shootingDirection.clone().multiplyScalar(star.shootingSpeed)
                        );
                        
                        // Update position in geometry
                        positions[i * 3] = star.position.x;
                        positions[i * 3 + 1] = star.position.y;
                        positions[i * 3 + 2] = star.position.z;
                        
                        needsUpdate = true;
                    }
                }
                
                if (needsUpdate) {
                    this.particles.geometry.attributes.position.needsUpdate = true;
                }
            }
        }
        
        // Animate GLTF models with scroll-based revolution
        const scrollProgress = Math.min(window.scrollY / (document.documentElement.scrollHeight - window.innerHeight), 1);
        this.scrollY = window.scrollY;
        
        this.gltfModels.forEach((model, index) => {
            const userData = model.userData;
            
            if (userData.isRevolvingObject) {
                // Calculate revolution based on scroll progress
                const scrollRange = userData.scrollTriggerEnd - userData.scrollTriggerStart;
                const scrollInRange = Math.max(0, Math.min(1, (scrollProgress - userData.scrollTriggerStart) / scrollRange));
                
                // Revolution angle progression
                userData.targetRevolutionAngle = userData.revolutionAngle + (scrollInRange * Math.PI * 2);
                
                // Update position based on revolution
                const revolutionX = Math.cos(userData.targetRevolutionAngle) * userData.revolutionRadius;
                const revolutionZ = Math.sin(userData.targetRevolutionAngle) * userData.revolutionRadius;
                
                model.position.x = revolutionX;
                model.position.z = revolutionZ - 30; // Offset to bring forward
                model.position.y = userData.originalY + Math.sin(time * userData.floatSpeed) * 3;
                
                // Face the camera as objects revolve
                model.lookAt(this.camera.position);
                
                // Scale based on distance to camera for depth effect
                const distanceToCamera = model.position.distanceTo(this.camera.position);
                const scaleMultiplier = Math.max(0.5, Math.min(2.0, 50 / distanceToCamera));
                const baseScale = model.userData.baseScale || 1;
                model.scale.setScalar(baseScale * scaleMultiplier);
            } else {
                // Regular floating animation for non-revolving objects
                model.position.y = userData.originalY + Math.sin(time * userData.floatSpeed) * 2;
                model.rotation.y += userData.rotationSpeed;
                
                // Update bubble position if it exists
                if (userData.bubble) {
                    userData.bubble.position.copy(model.position);
                    userData.bubble.rotation.y += userData.rotationSpeed * 0.5;
                    userData.bubble.material.opacity = 0.15 + Math.sin(time * 2) * 0.05;
                }
            }
            
            // Update animation mixer for animated models
            if (userData.mixer) {
                userData.mixer.update(deltaTime);
            } else {
                // Regular floating animation for non-revolving objects
                model.position.y = userData.originalY + Math.sin(time * userData.floatSpeed) * 2;
                model.rotation.y += userData.rotationSpeed;
                
                // Update bubble position if it exists
                if (userData.bubble) {
                    userData.bubble.position.copy(model.position);
                    userData.bubble.rotation.y += userData.rotationSpeed * 0.5;
                    userData.bubble.material.opacity = 0.15 + Math.sin(time * 2) * 0.05;
                }
            }
            
            // Update animation mixer for animated models
            if (userData.mixer) {
                userData.mixer.update(deltaTime);
            }
        });
        
        // Update particle trails for revolving objects
        if (this.objectTrails) {
            this.objectTrails.forEach(trailData => {
                const model = trailData.model;
                const positions = trailData.positions;
                const currentIndex = trailData.currentIndex;
                
                // Add current position to trail
                positions[currentIndex * 3] = model.position.x;
                positions[currentIndex * 3 + 1] = model.position.y;
                positions[currentIndex * 3 + 2] = model.position.z;
                
                // Move to next trail point
                trailData.currentIndex = (currentIndex + 1) % 100;
                
                // Update trail geometry
                trailData.trail.geometry.attributes.position.needsUpdate = true;
            });
        }
        
        // Handle shooting stars based on mouse interaction
        if (this.interactiveStars && this.particles) {
            const positions = this.particles.geometry.attributes.position.array;
            let needsUpdate = false;
            
            this.interactiveStars.forEach((star, index) => {
                if (star.isShootingStar) {
                    // Move shooting star
                    star.position.add(star.shootingDirection.clone().multiplyScalar(star.shootingSpeed));
                    
                    // Update position in geometry
                    if (index * 3 + 2 < positions.length) {
                        positions[index * 3] = star.position.x;
                        positions[index * 3 + 1] = star.position.y;
                        positions[index * 3 + 2] = star.position.z;
                        
                        needsUpdate = true;
                    }
                }
            });
            
            if (needsUpdate) {
                this.particles.geometry.attributes.position.needsUpdate = true;
            }
        }
        
        // Enhanced camera movement with mouse following
        this.camera.position.x += (this.mouse.x * 3 - this.camera.position.x) * 0.02;
        this.camera.position.y += (-this.mouse.y * 3 - this.camera.position.y) * 0.02;
        
        // Add subtle camera sway
        this.camera.position.x += Math.sin(time * 0.2) * 0.5;
        this.camera.position.y += Math.cos(time * 0.15) * 0.3;
        
        // Scroll-based camera distance for dynamic perspective
        const targetZ = 30 + (scrollProgress * 20);
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
        const totalModels = 8; // Increased number of models
        
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

        // Load The Thinker model for interactive profile picture
        loader.load(
            'assets/the_thinker_by_auguste_rodin/scene.gltf',
            (gltf) => {
                console.log('✅ Thinker model loaded:', gltf);
                
                this.thinkerModel = gltf.scene;
                this.thinkerModel.scale.set(0.15, 0.15, 0.15); // Appropriate size for profile
                this.thinkerModel.position.set(0, 0, 0); // Will be positioned by CSS
                this.thinkerModel.rotation.set(0, Math.PI / 4, 0); // Nice viewing angle
                
                // Store for interactive rotation
                this.thinkerModel.userData = {
                    isInteractive: true,
                    rotationSpeed: 0.005,
                    baseRotationY: Math.PI / 4,
                    hoverRotationY: 0,
                    targetRotationY: Math.PI / 4,
                    isHovered: false
                };
                
                // Add to scene but will be positioned using CSS
                this.scene.add(this.thinkerModel);
                
                // Replace profile pictures with 3D canvas
                this.setupThinkerProfilePicture();
                
                modelLoaded();
                console.log('🗿 The Thinker model ready for interaction');
            },
            (progress) => {
                console.log('Thinker loading progress:', (progress.loaded / progress.total * 100) + '%');
            },
            (error) => {
                console.error('❌ Error loading Thinker model:', error);
                modelLoaded();
            }
        );
        
        // Load brain point cloud model for interactive profile picture
        loader.load(
            'assets/brain_point_cloud/scene.gltf',
            (gltf) => {
                console.log('✅ Brain model loaded:', gltf);
                
                // Store the brain model for profile use
                this.brainModel = gltf.scene;
                this.brainModel.scale.set(0.2, 0.2, 0.2); // Appropriate size for profile
                this.brainModel.position.set(0, 0, 0); // Will be positioned by CSS
                this.brainModel.rotation.set(0, Math.PI / 4, 0); // Nice viewing angle
                
                // Store for interactive rotation
                this.brainModel.userData = {
                    isInteractive: true,
                    rotationSpeed: 0.008,
                    baseRotationY: Math.PI / 4,
                    hoverRotationY: 0,
                    targetRotationY: Math.PI / 4,
                    isHovered: false
                };
                
                // Replace profile pictures with 3D canvas
                this.setupBrainProfilePicture();
                
                modelLoaded();
                console.log('🧠 Brain model ready for interactive profile');
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
        
        // Load Shiba dog model - part of revolving background objects
        loader.load(
            'assets/shiba/scene.gltf',
            (gltf) => {
                console.log('✅ Shiba model loaded:', gltf);
                
                const shiba = gltf.scene;
                shiba.scale.set(1.2, 1.2, 1.2);
                shiba.position.set(40, -5, -40); // Start further back
                shiba.rotation.set(0, -Math.PI / 2, 0);
                
                // Store for scroll-based revolution animation
                shiba.userData = {
                    rotationSpeed: 0.01,
                    floatSpeed: 0.005,
                    originalY: shiba.position.y,
                    revolutionRadius: 60,
                    revolutionSpeed: 0.006,
                    revolutionAngle: 0, // Starting angle
                    targetRevolutionAngle: 0,
                    isRevolvingObject: true,
                    scrollTriggerStart: 0.2, // Starts revolving at 20% scroll
                    scrollTriggerEnd: 0.8,    // Finishes at 80% scroll
                    baseScale: 1.2
                };
                
                this.gltfModels.push(shiba);
                this.scene.add(shiba);
                modelLoaded();
                
                console.log('🐕 Shiba model added as revolving object');
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
        
        // Load animated cat model - part of revolving background objects
        loader.load(
            'assets/an-animated-cat/source/scene.gltf',
            (gltf) => {
                console.log('✅ Cat model loaded:', gltf);
                
                const cat = gltf.scene;
                cat.scale.set(4, 4, 4);
                cat.position.set(0, -15, -50); // Start much further back
                
                // Set up animation mixer if animations exist
                if (gltf.animations && gltf.animations.length > 0) {
                    const mixer = new THREE.AnimationMixer(cat);
                    const action = mixer.clipAction(gltf.animations[0]);
                    action.play();
                    
                    cat.userData.mixer = mixer;
                    console.log('🎬 Cat animations playing');
                }
                
                // Store for scroll-based revolution animation
                cat.userData = {
                    ...cat.userData,
                    rotationSpeed: 0.003,
                    floatSpeed: 0.008,
                    originalY: cat.position.y,
                    revolutionRadius: 70,
                    revolutionSpeed: 0.008,
                    revolutionAngle: Math.PI, // Start at opposite side
                    targetRevolutionAngle: Math.PI,
                    isRevolvingObject: true,
                    scrollTriggerStart: 0.4, // Starts revolving at 40% scroll
                    scrollTriggerEnd: 1.0,    // Finishes at 100% scroll
                    baseScale: 4
                };
                
                this.gltfModels.push(cat);
                this.scene.add(cat);
                modelLoaded();
                
                console.log('🐱 Cat model added as revolving object');
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
        
        // Load additional revolving objects
        
        // Load Arduino Uno model
        loader.load(
            'assets/arduino_uno_r3_elegoo/scene.gltf',
            (gltf) => {
                console.log('✅ Arduino model loaded:', gltf);
                
                const arduino = gltf.scene;
                arduino.scale.set(0.1, 0.1, 0.1);
                arduino.position.set(-50, 0, -60);
                arduino.rotation.set(0, Math.PI / 3, 0);
                
                arduino.userData = {
                    rotationSpeed: 0.015,
                    floatSpeed: 0.003,
                    originalY: arduino.position.y,
                    revolutionRadius: 80,
                    revolutionSpeed: 0.005,
                    revolutionAngle: Math.PI / 2,
                    targetRevolutionAngle: Math.PI / 2,
                    isRevolvingObject: true,
                    scrollTriggerStart: 0.1,
                    scrollTriggerEnd: 0.6,
                    baseScale: 0.1
                };
                
                this.gltfModels.push(arduino);
                this.scene.add(arduino);
                modelLoaded();
                
                console.log('🔧 Arduino model added as revolving object');
            },
            (progress) => {
                console.log('Arduino loading progress:', (progress.loaded / progress.total * 100) + '%');
            },
            (error) => {
                console.error('❌ Error loading Arduino model:', error);
                modelLoaded();
            }
        );
        
        // Load Stylized Planet model
        loader.load(
            'assets/stylized_planet/scene.gltf',
            (gltf) => {
                console.log('✅ Planet model loaded:', gltf);
                
                const planet = gltf.scene;
                planet.scale.set(2, 2, 2);
                planet.position.set(60, 20, -70);
                
                planet.userData = {
                    rotationSpeed: 0.02,
                    floatSpeed: 0.006,
                    originalY: planet.position.y,
                    revolutionRadius: 90,
                    revolutionSpeed: 0.004,
                    revolutionAngle: -Math.PI / 3,
                    targetRevolutionAngle: -Math.PI / 3,
                    isRevolvingObject: true,
                    scrollTriggerStart: 0.3,
                    scrollTriggerEnd: 0.9,
                    baseScale: 2
                };
                
                this.gltfModels.push(planet);
                this.scene.add(planet);
                modelLoaded();
                
                console.log('🪐 Planet model added as revolving object');
            },
            (progress) => {
                console.log('Planet loading progress:', (progress.loaded / progress.total * 100) + '%');
            },
            (error) => {
                console.error('❌ Error loading Planet model:', error);
                modelLoaded();
            }
        );
        
        // Load Norwegian Troll model
        loader.load(
            'assets/norwegian_troll/scene.gltf',
            (gltf) => {
                console.log('✅ Troll model loaded:', gltf);
                
                const troll = gltf.scene;
                troll.scale.set(0.05, 0.05, 0.05);
                troll.position.set(-40, -30, -80);
                troll.rotation.set(0, Math.PI, 0);
                
                troll.userData = {
                    rotationSpeed: 0.006,
                    floatSpeed: 0.004,
                    originalY: troll.position.y,
                    revolutionRadius: 100,
                    revolutionSpeed: 0.003,
                    revolutionAngle: Math.PI * 1.5,
                    targetRevolutionAngle: Math.PI * 1.5,
                    isRevolvingObject: true,
                    scrollTriggerStart: 0.5,
                    scrollTriggerEnd: 1.0,
                    baseScale: 0.05
                };
                
                this.gltfModels.push(troll);
                this.scene.add(troll);
                modelLoaded();
                
                console.log('👹 Troll model added as revolving object');
            },
            (progress) => {
                console.log('Troll loading progress:', (progress.loaded / progress.total * 100) + '%');
            },
            (error) => {
                console.error('❌ Error loading Troll model:', error);
                modelLoaded();
            }
        );
        
        // Load Vinyl Player model
        loader.load(
            'assets/vinyl_player_pioneer/scene.gltf',
            (gltf) => {
                console.log('✅ Vinyl Player model loaded:', gltf);
                
                const vinyl = gltf.scene;
                vinyl.scale.set(0.03, 0.03, 0.03);
                vinyl.position.set(70, 10, -50);
                vinyl.rotation.set(0, -Math.PI / 4, 0);
                
                vinyl.userData = {
                    rotationSpeed: 0.025, // Faster rotation for vinyl
                    floatSpeed: 0.002,
                    originalY: vinyl.position.y,
                    revolutionRadius: 75,
                    revolutionSpeed: 0.007,
                    revolutionAngle: -Math.PI / 6,
                    targetRevolutionAngle: -Math.PI / 6,
                    isRevolvingObject: true,
                    scrollTriggerStart: 0.15,
                    scrollTriggerEnd: 0.7,
                    baseScale: 0.03
                };
                
                this.gltfModels.push(vinyl);
                this.scene.add(vinyl);
                modelLoaded();
                
                console.log('🎵 Vinyl Player model added as revolving object');
            },
            (progress) => {
                console.log('Vinyl loading progress:', (progress.loaded / progress.total * 100) + '%');
            },
            (error) => {
                console.error('❌ Error loading Vinyl model:', error);
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
        brain.position.set(-20, 15, -15); // Much closer to the camera
        
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
    
    setupThinkerProfilePicture() {
        console.log('🗿 Setting up interactive Thinker profile picture...');
        
        // Wait a moment for the model to be fully loaded
        setTimeout(() => {
            this.createThinkerProfile();
        }, 1000);
    }
    
    setupBrainProfilePicture() {
        console.log('🧠 Setting up interactive Brain profile picture...');
        
        // Wait a moment for the model to be fully loaded
        setTimeout(() => {
            this.createBrainProfile();
        }, 1000);
    }
    
    createThinkerProfile() {
        const container = document.getElementById('thinker-profile-1');
        if (!container || !this.thinkerModel) {
            console.log('Thinker container or model not found, retrying...');
            setTimeout(() => this.createThinkerProfile(), 500);
            return;
        }
        
        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 300;
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.borderRadius = '50%';
        canvas.style.cursor = 'pointer';
        
        // Create separate scene for Thinker
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
        camera.position.set(0, 0, 6);
        
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setSize(300, 300);
        renderer.setClearColor(0x000000, 0);
        
        // Clone and position the Thinker model
        const thinker = this.thinkerModel.clone();
        thinker.scale.set(2.0, 2.0, 2.0);
        thinker.position.set(0, -1.5, 0);
        thinker.rotation.y = Math.PI / 4;
        
        // Create spherical bubble around thinker
        const bubbleGeometry = new THREE.SphereGeometry(2.8, 32, 32);
        const bubbleMaterial = new THREE.MeshPhongMaterial({
            color: 0xe6ff08,
            transparent: true,
            opacity: 0.15,
            side: THREE.DoubleSide,
            shininess: 100
        });
        const bubble = new THREE.Mesh(bubbleGeometry, bubbleMaterial);
        bubble.position.set(0, -1.5, 0);
        
        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.8);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
        directionalLight.position.set(5, 5, 5);
        scene.add(ambientLight);
        scene.add(directionalLight);
        scene.add(thinker);
        scene.add(bubble);
        
        // Add canvas to container
        container.appendChild(canvas);
        
        // Mouse interaction
        let isMouseDown = false;
        let mouseX = 0, mouseY = 0;
        let isHovered = false;
        
        canvas.addEventListener('mousedown', (e) => {
            isMouseDown = true;
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        canvas.addEventListener('mouseup', () => {
            isMouseDown = false;
        });
        
        canvas.addEventListener('mouseenter', () => {
            isHovered = true;
            canvas.style.transform = 'scale(1.05)';
            canvas.style.transition = 'transform 0.3s ease';
        });
        
        canvas.addEventListener('mouseleave', () => {
            isHovered = false;
            canvas.style.transform = 'scale(1)';
        });
        
        canvas.addEventListener('mousemove', (e) => {
            if (isMouseDown) {
                const deltaX = e.clientX - mouseX;
                const deltaY = e.clientY - mouseY;
                
                thinker.rotation.y += deltaX * 0.01;
                thinker.rotation.x += deltaY * 0.01;
                
                mouseX = e.clientX;
                mouseY = e.clientY;
            }
        });
        
        // Animation loop
        const animate = () => {
            const time = Date.now() * 0.001;
            
            // Auto-rotation when not being manually controlled
            if (!isMouseDown) {
                thinker.rotation.y += 0.005;
            }
            
            // Bubble animation
            bubble.rotation.y += 0.003;
            bubble.rotation.x += 0.002;
            bubble.material.opacity = 0.1 + Math.sin(time * 2) * 0.05;
            
            // Hover effects
            if (isHovered) {
                bubble.material.opacity = Math.min(0.25, bubble.material.opacity + 0.1);
                const hoverScale = 1 + Math.sin(time * 3) * 0.02;
                bubble.scale.setScalar(hoverScale);
            } else {
                const normalScale = 1 + Math.sin(time * 1.5) * 0.01;
                bubble.scale.setScalar(normalScale);
            }
            
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };
        animate();
        
        console.log('✅ Thinker profile with spherical bubble created and interactive');
    }
    
    createBrainProfile() {
        const container = document.getElementById('brain-profile-2');
        if (!container || !this.brainModel) {
            console.log('Brain container or model not found, retrying...');
            setTimeout(() => this.createBrainProfile(), 500);
            return;
        }
        
        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 400;
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.borderRadius = '15px';
        canvas.style.cursor = 'pointer';
        
        // Create separate scene for Brain
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
        camera.position.set(0, 0, 8);
        
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setSize(400, 400);
        renderer.setClearColor(0x000000, 0);
        
        // Clone and position the Brain model
        const brain = this.brainModel.clone();
        brain.scale.set(3.0, 3.0, 3.0);
        brain.position.set(0, 0, 0);
        brain.rotation.y = Math.PI / 4;
        
        // Create spherical bubble around brain
        const bubbleGeometry = new THREE.SphereGeometry(3.5, 32, 32);
        const bubbleMaterial = new THREE.MeshPhongMaterial({
            color: 0x0BCEAF,
            transparent: true,
            opacity: 0.15,
            side: THREE.DoubleSide,
            shininess: 100,
            emissive: 0x0BCEAF,
            emissiveIntensity: 0.05
        });
        const bubble = new THREE.Mesh(bubbleGeometry, bubbleMaterial);
        bubble.position.set(0, 0, 0);
        
        // Add inner glow effect
        const innerGlowGeometry = new THREE.SphereGeometry(3.2, 16, 16);
        const innerGlowMaterial = new THREE.MeshBasicMaterial({
            color: 0x0BCEAF,
            transparent: true,
            opacity: 0.08,
            side: THREE.BackSide
        });
        const innerGlow = new THREE.Mesh(innerGlowGeometry, innerGlowMaterial);
        innerGlow.position.set(0, 0, 0);
        
        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.8);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
        directionalLight.position.set(5, 5, 5);
        
        // Add special brain lighting
        const brainLight = new THREE.PointLight(0x0BCEAF, 0.5, 20);
        brainLight.position.set(0, 2, 5);
        
        scene.add(ambientLight);
        scene.add(directionalLight);
        scene.add(brainLight);
        scene.add(brain);
        scene.add(bubble);
        scene.add(innerGlow);
        
        // Add canvas to container
        container.appendChild(canvas);
        
        // Mouse interaction
        let isMouseDown = false;
        let mouseX = 0, mouseY = 0;
        let isHovered = false;
        
        canvas.addEventListener('mousedown', (e) => {
            isMouseDown = true;
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        canvas.addEventListener('mouseup', () => {
            isMouseDown = false;
        });
        
        canvas.addEventListener('mouseenter', () => {
            isHovered = true;
            canvas.style.transform = 'scale(1.05)';
            canvas.style.transition = 'transform 0.3s ease';
        });
        
        canvas.addEventListener('mouseleave', () => {
            isHovered = false;
            canvas.style.transform = 'scale(1)';
        });
        
        canvas.addEventListener('mousemove', (e) => {
            if (isMouseDown) {
                const deltaX = e.clientX - mouseX;
                const deltaY = e.clientY - mouseY;
                
                brain.rotation.y += deltaX * 0.01;
                brain.rotation.x += deltaY * 0.01;
                
                mouseX = e.clientX;
                mouseY = e.clientY;
            }
        });
        
        // Animation loop
        const animate = () => {
            const time = Date.now() * 0.001;
            
            // Auto-rotation when not being manually controlled
            if (!isMouseDown) {
                brain.rotation.y += 0.008;
                brain.rotation.x += Math.sin(time * 0.5) * 0.002;
            }
            
            // Bubble animation
            bubble.rotation.y += 0.004;
            bubble.rotation.x += 0.003;
            bubble.material.opacity = 0.12 + Math.sin(time * 2) * 0.05;
            
            // Inner glow animation
            innerGlow.rotation.y -= 0.002;
            innerGlow.rotation.z += 0.001;
            innerGlow.material.opacity = 0.06 + Math.sin(time * 3) * 0.03;
            
            // Brain light pulsing
            brainLight.intensity = 0.4 + Math.sin(time * 4) * 0.2;
            
            // Hover effects
            if (isHovered) {
                bubble.material.opacity = Math.min(0.25, bubble.material.opacity + 0.1);
                innerGlow.material.opacity = Math.min(0.15, innerGlow.material.opacity + 0.05);
                const hoverScale = 1 + Math.sin(time * 3) * 0.03;
                bubble.scale.setScalar(hoverScale);
                innerGlow.scale.setScalar(hoverScale * 0.95);
            } else {
                const normalScale = 1 + Math.sin(time * 1.5) * 0.01;
                bubble.scale.setScalar(normalScale);
                innerGlow.scale.setScalar(normalScale * 0.95);
            }
            
            // Brain floating effect
            brain.position.y = Math.sin(time * 1.2) * 0.1;
            
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };
        animate();
        
        console.log('✅ Brain profile with spherical bubble created and interactive');
    }
    
    handleStarInteraction(event) {
        // Update mouse position for star interactions
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Update star material mouse position for real-time shader effects
        if (this.starMaterial) {
            this.starMaterial.uniforms.mousePos.value.set(
                (event.clientX / window.innerWidth),
                1.0 - (event.clientY / window.innerHeight)
            );
        }
        
        // Simple distance-based shooting star creation
        if (this.interactiveStars && this.particles) {
            const mouseWorldPos = new THREE.Vector3();
            mouseWorldPos.x = this.mouse.x * 200; // Scale to world coordinates
            mouseWorldPos.y = this.mouse.y * 150;
            mouseWorldPos.z = 0;
            
            // Check nearby stars for shooting star effect
            for (let i = 0; i < this.interactiveStars.length; i++) {
                const star = this.interactiveStars[i];
                
                if (!star.isShootingStar) {
                    const distance = star.position.distanceTo(mouseWorldPos);
                    
                    // If mouse is close enough to a star, make it a shooting star
                    if (distance < 50) {
                        this.createShootingStar(star, i);
                        break; // Only create one shooting star at a time
                    }
                }
            }
        }
    }
    
    createShootingStar(star, index) {
        console.log('🌠 Creating shooting star!');
        
        star.isShootingStar = true;
        
        // Random shooting direction
        star.shootingDirection.set(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2
        ).normalize();
        
        star.shootingSpeed = 2 + Math.random() * 3;
        
        // Reset after 3 seconds
        setTimeout(() => {
            star.isShootingStar = false;
            star.position.copy(star.originalPosition);
            
            // Update position in geometry
            const positions = this.particles.geometry.attributes.position.array;
            positions[index * 3] = star.position.x;
            positions[index * 3 + 1] = star.position.y;
            positions[index * 3 + 2] = star.position.z;
            this.particles.geometry.attributes.position.needsUpdate = true;
        }, 3000);
    }
    
    // Create particle trails for revolving objects
    createRevolvingObjectTrails() {
        this.objectTrails = [];
        
        this.gltfModels.forEach((model, index) => {
            if (model.userData.isRevolvingObject) {
                const trailGeometry = new THREE.BufferGeometry();
                const trailPositions = new Float32Array(100 * 3); // 100 trail points
                const trailColors = new Float32Array(100 * 3);
                
                // Initialize trail
                for (let i = 0; i < 100; i++) {
                    trailPositions[i * 3] = model.position.x;
                    trailPositions[i * 3 + 1] = model.position.y;
                    trailPositions[i * 3 + 2] = model.position.z;
                    
                    const alpha = i / 100;
                    trailColors[i * 3] = 0.0 + alpha * 0.7; // R
                    trailColors[i * 3 + 1] = 0.8 + alpha * 0.2; // G
                    trailColors[i * 3 + 2] = 0.9 + alpha * 0.1; // B
                }
                
                trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
                trailGeometry.setAttribute('color', new THREE.BufferAttribute(trailColors, 3));
                
                const trailMaterial = new THREE.LineBasicMaterial({
                    vertexColors: true,
                    transparent: true,
                    opacity: 0.6,
                    linewidth: 2
                });
                
                const trail = new THREE.Line(trailGeometry, trailMaterial);
                this.scene.add(trail);
                
                this.objectTrails.push({
                    trail: trail,
                    model: model,
                    positions: trailPositions,
                    currentIndex: 0
                });
            }
        });
        
        console.log('✨ Particle trails created for revolving objects');
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

// Enhanced Interactive Features for Portfolio

// Create interactive cursor
function createInteractiveCursor() {
    const cursor = document.createElement('div');
    cursor.classList.add('interactive-cursor');
    document.body.appendChild(cursor);
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        
        cursor.style.left = cursorX - 10 + 'px';
        cursor.style.top = cursorY - 10 + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Enhance cursor on hover
    const interactiveElements = document.querySelectorAll('button, a, .service-box, .profile-image, .display-3');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2)';
            cursor.style.background = 'radial-gradient(circle, rgba(230, 255, 8, 0.8) 0%, transparent 70%)';
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.background = 'radial-gradient(circle, rgba(11, 206, 175, 0.8) 0%, transparent 70%)';
        });
    });
}

// Create scroll progress indicator
function createScrollIndicator() {
    const indicator = document.createElement('div');
    indicator.classList.add('scroll-indicator');
    document.body.appendChild(indicator);
    
    window.addEventListener('scroll', () => {
        const scrollProgress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        indicator.style.transform = `scaleX(${scrollProgress})`;
    });
}

// Enhanced section card interactions
function enhanceSectionCards() {
    const serviceBoxes = document.querySelectorAll('.service-box');
    
    serviceBoxes.forEach((box, index) => {
        // Add staggered hover effects
        box.style.transitionDelay = `${index * 0.1}s`;
        
        // Add magnetic effect
        box.addEventListener('mousemove', (e) => {
            const rect = box.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const deltaX = (e.clientX - centerX) * 0.1;
            const deltaY = (e.clientY - centerY) * 0.1;
            
            box.style.transform = `translateY(-10px) scale(1.02) translate(${deltaX}px, ${deltaY}px)`;
        });
        
        box.addEventListener('mouseleave', () => {
            box.style.transform = 'translateY(0) scale(1) translate(0, 0)';
        });
        
        // Add particle burst effect on click
        box.addEventListener('click', (e) => {
            createParticleBurst(e.clientX, e.clientY);
        });
    });
}

// Particle burst effect
function createParticleBurst(x, y) {
    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 4px;
            height: 4px;
            background: #0BCEAF;
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
        `;
        
        document.body.appendChild(particle);
        
        const angle = (i / 12) * Math.PI * 2;
        const velocity = 50 + Math.random() * 50;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        let posX = 0, posY = 0;
        let opacity = 1;
        
        function animateParticle() {
            posX += vx * 0.02;
            posY += vy * 0.02;
            opacity -= 0.02;
            
            particle.style.transform = `translate(${posX}px, ${posY}px)`;
            particle.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animateParticle);
            } else {
                particle.remove();
            }
        }
        animateParticle();
    }
}

// Enhanced name interaction
function enhanceNameInteraction() {
    const nameElement = document.querySelector('.display-3');
    if (nameElement) {
        nameElement.addEventListener('click', () => {
            // Create rainbow text effect
            const text = nameElement.textContent;
            const colors = ['#ff0000', '#ff8000', '#ffff00', '#80ff00', '#00ff00', '#00ff80', '#00ffff', '#0080ff', '#0000ff', '#8000ff', '#ff00ff', '#ff0080'];
            
            nameElement.innerHTML = text.split('').map((char, index) => 
                `<span style="color: ${colors[index % colors.length]}; transition: color 0.5s ease; display: inline-block;">${char}</span>`
            ).join('');
            
            // Reset after animation
            setTimeout(() => {
                nameElement.innerHTML = text;
            }, 2000);
        });
        
        // Add floating letters effect on hover
        nameElement.addEventListener('mouseenter', () => {
            const letters = nameElement.querySelectorAll('span');
            letters.forEach((letter, index) => {
                setTimeout(() => {
                    letter.style.transform = `translateY(${Math.random() * 10 - 5}px) rotate(${Math.random() * 10 - 5}deg)`;
                }, index * 50);
            });
        });
        
        nameElement.addEventListener('mouseleave', () => {
            const letters = nameElement.querySelectorAll('span');
            letters.forEach(letter => {
                letter.style.transform = 'translateY(0) rotate(0deg)';
            });
        });
    }
}

// Initialize all interactive features
document.addEventListener('DOMContentLoaded', () => {
    createInteractiveCursor();
    createScrollIndicator();
    enhanceSectionCards();
    enhanceNameInteraction();
    
    // Add smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

