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

// Three.js Background with GLTF Models and Scroll Animation
class Portfolio3D {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.gltfModels = [];
        this.particles = null;
        this.scrollY = 0;
        this.clock = new THREE.Clock();
        this.lastDebugTime = 0;
        
        this.init();
        this.createParticles();
        this.loadGLTFModels();
        this.setupEventListeners();
        this.animate();
        
        console.log('✅ Portfolio3D initialized with scroll animations');
    }

    init() {
        console.log('🌌 Initializing Three.js with northern lights gradient...');
        
        // Scene setup
        this.scene = new THREE.Scene();
        
        // Create northern lights gradient background
        this.createNorthernLightsBackground();
        
        // Enhanced fog with northern lights colors
        this.scene.fog = new THREE.Fog(0x001122, 20, 150); // Deep blue fog
        
        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000
        );
        this.camera.position.set(0, 0, 10);
        
        // Get canvas
        const canvas = document.getElementById('threejs-canvas');
        if (!canvas) {
            console.error('❌ Canvas element not found!');
            return;
        }
        
        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: canvas,
            antialias: true,
            alpha: false,
            powerPreference: "high-performance"
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        
        // Lighting setup - enhanced for better model visibility
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
        
        // Northern lights themed point lights
        const pointLight1 = new THREE.PointLight(0x00ff88, 0.8, 60); // Green aurora
        pointLight1.position.set(10, 0, 10);
        this.scene.add(pointLight1);
        
        const pointLight2 = new THREE.PointLight(0x0088ff, 0.8, 60); // Blue aurora
        pointLight2.position.set(-10, 0, 10);
        this.scene.add(pointLight2);
        
        const pointLight3 = new THREE.PointLight(0x8800ff, 0.6, 40); // Purple aurora
        pointLight3.position.set(0, 15, 5);
        this.scene.add(pointLight3);
        
        console.log('✅ Scene initialized with enhanced lighting and northern lights background');
    }
    
    createNorthernLightsBackground() {
        console.log('🌌 Creating northern lights gradient background...');
        
        // Create a large sphere geometry for the background
        const sphereGeometry = new THREE.SphereGeometry(500, 32, 32);
        
        // Create shader material for northern lights gradient
        const vertexShader = `
            varying vec3 vWorldPosition;
            void main() {
                vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                vWorldPosition = worldPosition.xyz;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;
        
        const fragmentShader = `
            uniform float time;
            varying vec3 vWorldPosition;
            
            void main() {
                vec3 direction = normalize(vWorldPosition);
                float height = direction.y;
                
                // Enhanced northern lights base colors
                vec3 deepSpace = vec3(0.0, 0.02, 0.08);    // Very deep blue-black
                vec3 nightSky = vec3(0.02, 0.08, 0.25);    // Deep blue
                vec3 horizon = vec3(0.05, 0.15, 0.4);      // Medium blue
                
                // Vibrant aurora colors
                vec3 aurora1 = vec3(0.2, 1.0, 0.6);       // Bright green
                vec3 aurora2 = vec3(0.1, 0.8, 1.0);       // Bright cyan
                vec3 aurora3 = vec3(0.8, 0.3, 1.0);       // Bright purple
                vec3 aurora4 = vec3(0.9, 0.9, 0.3);       // Soft yellow
                
                // Create base gradient from space to horizon
                float heightFactor = (height + 1.0) * 0.5;
                vec3 baseColor = mix(deepSpace, nightSky, heightFactor);
                baseColor = mix(baseColor, horizon, pow(heightFactor, 2.0));
                
                // Enhanced aurora waves with more complexity
                float wave1 = sin(direction.x * 4.0 + time * 1.2) * 0.5 + 0.5;
                float wave2 = sin(direction.z * 3.5 + time * 0.8) * 0.5 + 0.5;
                float wave3 = sin((direction.x + direction.z) * 2.5 + time * 1.5) * 0.5 + 0.5;
                float wave4 = sin(direction.y * 2.0 + time * 0.6) * 0.3 + 0.7;
                float wave5 = sin((direction.x - direction.z) * 1.8 + time * 2.0) * 0.4 + 0.6;
                
                // Aurora intensity with better coverage
                float auroraHeight = smoothstep(-0.2, 1.0, height);
                float auroraIntensity = auroraHeight * 
                                       (wave1 * 0.2 + wave2 * 0.25 + wave3 * 0.2 + wave4 * 0.15 + wave5 * 0.2) * 0.9;
                
                // Mix multiple aurora colors for richness
                vec3 auroraColor = mix(aurora1, aurora2, wave1);
                auroraColor = mix(auroraColor, aurora3, wave2 * 0.6);
                auroraColor = mix(auroraColor, aurora4, wave3 * 0.3);
                
                // Add some shimmer effect
                float shimmer = sin(time * 3.0 + direction.x * 10.0 + direction.z * 8.0) * 0.1 + 0.9;
                auroraColor *= shimmer;
                
                // Final color mixing with enhanced aurora presence
                vec3 finalColor = mix(baseColor, auroraColor, auroraIntensity);
                
                // Add subtle stars effect in the shader
                float starNoise = fract(sin(dot(direction.xy * 50.0, vec2(12.9898, 78.233))) * 43758.5453);
                if (starNoise > 0.998 && height > 0.3) {
                    finalColor += vec3(0.5, 0.5, 0.8) * (starNoise - 0.998) * 500.0;
                }
                
                gl_FragColor = vec4(finalColor, 1.0);
            }
        `;
        
        const backgroundMaterial = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: {
                time: { value: 0.0 }
            },
            side: THREE.BackSide,
            depthWrite: false
        });
        
        const backgroundSphere = new THREE.Mesh(sphereGeometry, backgroundMaterial);
        this.scene.add(backgroundSphere);
        
        // Store reference for animation
        this.backgroundMaterial = backgroundMaterial;
        
        console.log('✅ Northern lights background created');
    }
    
    createParticles() {
        const starCount = 200; // Reduced from 1000 to create fewer, more prominent stars
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
        
        const texture = new THREE.CanvasTexture(canvas);
        return texture;
    }
    
    loadGLTFModels() {
        const loader = new THREE.GLTFLoader();
        
        // Define models configuration for lateral circular arrangement with better spacing
        const modelsConfig = [
            {
                path: 'assets/brain_point_cloud/scene.gltf',
                name: 'brain',
                scale: 5,  // Increased scale for better visibility
                scrollOffset: 0,
                angle: 0, // Starting angle (0°)
                radius: 35 // Increased radius for better visibility
            },
            {
                path: 'assets/shiba/scene.gltf',
                name: 'shiba',
                scale: 1.5,  // Increased scale
                scrollOffset: 600, // Reduced scroll offset for better pacing
                angle: Math.PI * 0.8, // 144 degrees (better spacing)
                radius: 35
            },
            {
                path: 'assets/an-animated-cat/source/scene.gltf',
                name: 'cat',
                scale: 4,  // Increased scale
                scrollOffset: 1200, // Reduced scroll offset
                angle: Math.PI * 1.2, // 216 degrees
                radius: 35
            },
            {
                path: 'assets/badminton/scene.gltf',
                name: 'badminton',
                scale: 25,  // Increased scale
                scrollOffset: 1800, // Reduced scroll offset
                angle: Math.PI * 1.6, // 288 degrees
                radius: 35
            },
            {
                path: 'assets/badminton_racket/scene.gltf',
                name: 'badminton_racket',
                scale: 1,  // Increased scale
                scrollOffset: 2400, // Reduced scroll offset
                angle: Math.PI * 0.4, // 72 degrees (completing the circle)
                radius: 35
            }
        ];

        modelsConfig.forEach((config, index) => {
            loader.load(
                config.path,
                (gltf) => {
                    const model = gltf.scene;
                    model.scale.set(config.scale, config.scale, config.scale);
                    
                    // Calculate initial lateral position based on angle and radius
                    const x = Math.cos(config.angle) * config.radius;
                    const z = Math.sin(config.angle) * config.radius;
                    
                    model.position.set(x, 0, z - 60); // Start closer to view
                    
                    model.userData = {
                        name: config.name,
                        originalPosition: model.position.clone(),
                        rotationSpeed: { 
                            x: 0.001 + index * 0.0005, 
                            y: 0.008 + index * 0.003, // Primary Y-axis rotation (parallel to screen)
                            z: 0.0005 + index * 0.0002 
                        },
                        scrollOffset: config.scrollOffset,
                        lateralAngle: config.angle,
                        radius: config.radius,
                        targetPosition: { x: x, y: 0, z: z },
                        currentRadius: config.radius,
                        mixer: null,
                        baseScale: config.scale
                    };
                    
                    // Setup animation mixer if available
                    if (gltf.animations && gltf.animations.length > 0) {
                        model.userData.mixer = new THREE.AnimationMixer(model);
                        gltf.animations.forEach((clip) => {
                            model.userData.mixer.clipAction(clip).play();
                        });
                        console.log(`🎬 Animations found for ${config.name}:`, gltf.animations.length);
                    }
                    
                    this.gltfModels.push(model);
                    this.scene.add(model);
                    console.log(`✅ ${config.name} model loaded and positioned at angle ${config.angle}`);
                },
                (progress) => {
                    const percent = Math.round((progress.loaded / progress.total) * 100);
                    console.log(`${config.name} loading: ${percent}%`);
                },
                (error) => {
                    console.error(`❌ ${config.name} model error:`, error);
                    // Create fallback geometry
                    this.createFallbackModel(config);
                }
            );
        });
    }
    
    createFallbackModel(config) {
        console.log(`🔄 Creating fallback for ${config.name}...`);
        
        let geometry, material;
        
        switch(config.name) {
            case 'brain':
                geometry = new THREE.SphereGeometry(2, 16, 16);
                material = new THREE.MeshLambertMaterial({ color: 0xff6b9d });
                break;
            case 'shiba':
                geometry = new THREE.CapsuleGeometry(1, 2, 8, 16);
                material = new THREE.MeshLambertMaterial({ color: 0xffd700 });
                break;
            case 'cat':
                geometry = new THREE.BoxGeometry(2, 2, 2);
                material = new THREE.MeshLambertMaterial({ color: 0x888888 });
                break;
            case 'badminton':
                geometry = new THREE.SphereGeometry(1, 12, 12);
                material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
                break;
            case 'badminton_racket':
                geometry = new THREE.CylinderGeometry(0.5, 0.5, 3, 8);
                material = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
                break;
        }
        
        const fallback = new THREE.Mesh(geometry, material);
        
        // Calculate lateral position
        const x = Math.cos(config.angle) * config.radius;
        const z = Math.sin(config.angle) * config.radius;
        
        fallback.position.set(x, 0, z - 60);
        fallback.scale.set(config.scale * 0.5, config.scale * 0.5, config.scale * 0.5);
        
        fallback.userData = {
            name: config.name + '_fallback',
            originalPosition: fallback.position.clone(),
            rotationSpeed: { x: 0.005, y: 0.015, z: 0.002 }, // Y-axis primary rotation
            scrollOffset: config.scrollOffset,
            lateralAngle: config.angle,
            radius: config.radius,
            targetPosition: { x: x, y: 0, z: z },
            currentRadius: config.radius,
            mixer: null,
            baseScale: config.scale * 0.5
        };
        
        this.gltfModels.push(fallback);
        this.scene.add(fallback);
        console.log('✅ ' + config.name + ' fallback created');
    }

    setupEventListeners() {
        // Scroll event for model animations
        window.addEventListener('scroll', () => {
            this.scrollY = window.pageYOffset;
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
        
        console.log('✅ Event listeners set up');
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const deltaTime = this.clock.getDelta();
        const elapsedTime = this.clock.getElapsedTime();
        
        // Animate northern lights background
        if (this.backgroundMaterial) {
            this.backgroundMaterial.uniforms.time.value = elapsedTime;
        }
        
        // Animate twinkling stars
        if (this.starMaterial) {
            this.starMaterial.uniforms.time.value = elapsedTime;
        }
        
        // Gentle rotation for stars
        if (this.particles) {
            this.particles.rotation.x = elapsedTime * 0.002;
            this.particles.rotation.y = elapsedTime * 0.001;
        }
        
        // Animate GLTF models with lateral circular movement based on scroll
        this.gltfModels.forEach((model) => {
            if (!model.userData) return;
            
            const { 
                rotationSpeed, 
                scrollOffset, 
                originalPosition, 
                mixer, 
                lateralAngle, 
                radius, 
                targetPosition,
                baseScale
            } = model.userData;
            
            // Rotation animation - individual model spinning
            if (rotationSpeed) {
                model.rotation.x += rotationSpeed.x;
                model.rotation.y += rotationSpeed.y;
                model.rotation.z += rotationSpeed.z;
            }
            
            // Calculate scroll progress for this model with improved timing
            const scrollProgress = Math.max(0, (this.scrollY - scrollOffset) / 600); // Faster activation for better spacing
            const easedProgress = this.easeInOutCubic(Math.min(scrollProgress, 1));
            
            // Enhanced lateral circular movement with better spacing
            const scrollBasedRotation = this.scrollY * 0.0015; // Slightly slower rotation for better control
            const currentAngle = lateralAngle + scrollBasedRotation;
            
            // Calculate lateral position with dynamic radius for optimal viewing
            const dynamicRadius = radius * (0.8 + easedProgress * 0.4); // Better radius variation
            const lateralX = Math.cos(currentAngle) * dynamicRadius;
            const lateralZ = Math.sin(currentAngle) * dynamicRadius;
            
            // Improved positioning logic for better individual model visibility
            if (scrollProgress > 0) {
                // Smooth interpolation with enhanced forward movement
                model.position.x = originalPosition.x + (lateralX - originalPosition.x) * easedProgress;
                model.position.z = originalPosition.z + (lateralZ - originalPosition.z) * easedProgress;
                
                // Enhanced forward movement for optimal viewing distance
                const targetZ = lateralZ + 25; // Bring models closer to camera
                model.position.z = originalPosition.z + (targetZ - originalPosition.z) * easedProgress;
                
                // Add slight vertical staggering for better 3D effect
                const verticalOffset = Math.sin(currentAngle * 2) * 3;
                model.position.y = originalPosition.y + verticalOffset * easedProgress;
            } else {
                // Better default positioning when not scrolled
                model.position.x = originalPosition.x * 0.7;
                model.position.z = originalPosition.z * 0.7; // Closer starting position
            }
            
            // Enhanced floating animation with individual phase offsets
            const floatPhase = elapsedTime * 0.8 + scrollOffset * 0.001;
            const floatAmplitude = 2 + easedProgress * 3; // Larger floating when closer
            model.position.y = originalPosition.y + Math.sin(floatPhase) * floatAmplitude;
            
            // Dynamic scaling - make models larger and more visible
            const distanceFromCenter = Math.sqrt(
                Math.pow(model.position.x, 2) + Math.pow(model.position.z, 2)
            );
            const proximityScale = 1 + (1 - Math.min(distanceFromCenter / radius, 1)) * 0.4;
            const scrollScale = 0.3 + easedProgress * 1.0; // Start larger, grow to full size
            const finalScale = (baseScale || 1) * scrollScale * proximityScale;
            
            model.scale.setScalar(finalScale);
            
            // Update animation mixer for animated models
            if (mixer) {
                mixer.update(deltaTime);
            }
        });
        
        // Camera movement based on scroll
        this.camera.position.y = -this.scrollY * 0.01;
        this.camera.lookAt(0, 0, 0);
        
        // Debug logging every 5 seconds
        if (Math.floor(elapsedTime) % 5 === 0 && Math.floor(elapsedTime) !== this.lastDebugTime) {
            this.lastDebugTime = Math.floor(elapsedTime);
            console.log('🔄 Scroll position:', this.scrollY, 'Models loaded:', this.gltfModels.length);
            if (this.gltfModels.length > 0) {
                this.logModelPositions();
            }
        }
        
        this.renderer.render(this.scene, this.camera);
    }
    
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    // Debug function to log model positions
    logModelPositions() {
        if (this.gltfModels.length > 0) {
            console.log('📍 Model Positions:');
            this.gltfModels.forEach((model, index) => {
                const pos = model.position;
                const userData = model.userData;
                console.log(index + ': ' + userData.name + ' - Position: (' + pos.x.toFixed(2) + ', ' + pos.y.toFixed(2) + ', ' + pos.z.toFixed(2) + ') - Angle: ' + userData.lateralAngle.toFixed(2));
            });
        }
    }
}

// Document ready with Three.js initialization
$(document).ready(function() {
    console.log('📄 Document ready event fired');
    console.log('🔍 Checking THREE availability:', typeof THREE !== 'undefined');
    
    if (typeof THREE !== 'undefined') {
        console.log('✅ THREE.js version:', THREE.REVISION);
        
        try {
            // Check if GLTFLoader is available
            if (typeof THREE.GLTFLoader === 'undefined') {
                console.warn('⚠️ GLTFLoader not found, creating fallback...');
                
                // Simple fallback GLTFLoader for testing
                THREE.GLTFLoader = function() {
                    return {
                        load: function(url, onLoad, onProgress, onError) {
                            console.log('📦 Fallback GLTFLoader attempting to load:', url);
                            if (onError) onError(new Error('GLTFLoader fallback - model not loaded'));
                        }
                    };
                };
                
                console.log('✅ Fallback GLTFLoader created');
            } else {
                console.log('✅ GLTFLoader available');
            }
            
            console.log('🚀 Creating Portfolio3D instance...');
            const portfolio = new Portfolio3D();
            console.log('✅ Portfolio3D initialized successfully', portfolio);
            
        } catch (error) {
            console.error('❌ Failed to create Portfolio3D:', error);
        }
    } else {
        console.error('❌ THREE.js not loaded');
    }
});
