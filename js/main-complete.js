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

// 3D Portfolio Class with Northern Lights and Single-Axis Revolution
class Portfolio3D {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.models = [];
        this.revolutionAngle = 0;
        this.revolutionRadius = 35;
        this.revolutionCenter = new THREE.Vector3(0, 0, -25);
        this.scrollSensitivity = 0.005;
        this.stars = null;
        this.northernLights = null;
        
        this.setupRenderer();
        this.setupCamera();
        this.createStarField();
        this.createNorthernLights();
        this.loadAllGLTFModels();
        this.addEventListeners();
        this.animate();
    }

    setupRenderer() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Create and insert canvas
        const canvas = this.renderer.domElement;
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.zIndex = '-1';
        canvas.style.pointerEvents = 'none';
        document.body.appendChild(canvas);
        
        console.log('✅ Renderer setup complete');
    }

    setupCamera() {
        this.camera.position.set(0, 0, 10);
        this.camera.lookAt(0, 0, 0);
    }

    createStarField() {
        console.log('🌟 Creating star field...');
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 3000;
        const starPositions = new Float32Array(starCount * 3);
        const starColors = new Float32Array(starCount * 3);
        
        for (let i = 0; i < starCount; i++) {
            // Spherical distribution for natural star placement
            const radius = Math.random() * 200 + 100;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
            
            starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            starPositions[i * 3 + 2] = radius * Math.cos(phi);
            
            // Varied star colors (white to blue-white)
            const intensity = Math.random() * 0.5 + 0.7;
            starColors[i * 3] = intensity;
            starColors[i * 3 + 1] = intensity;
            starColors[i * 3 + 2] = Math.min(intensity + 0.2, 1.0);
        }
        
        starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
        
        const starMaterial = new THREE.PointsMaterial({
            size: 2,
            sizeAttenuation: true,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });
        
        this.stars = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(this.stars);
        console.log('✅ Star field created with', starCount, 'stars');
    }

    createNorthernLights() {
        console.log('🌌 Creating northern lights...');
        
        // Aurora Vertex Shader
        const auroraVertexShader = `
            varying vec2 vUv;
            varying vec3 vPosition;
            void main() {
                vUv = uv;
                vPosition = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;

        // Aurora Fragment Shader
        const auroraFragmentShader = `
            uniform float time;
            uniform vec3 color1;
            uniform vec3 color2;
            uniform vec3 color3;
            varying vec2 vUv;
            varying vec3 vPosition;
            
            float noise(vec2 p) {
                return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
            }
            
            float fbm(vec2 p) {
                float f = 0.0;
                f += 0.5 * noise(p); p *= 2.0;
                f += 0.25 * noise(p); p *= 2.0;
                f += 0.125 * noise(p); p *= 2.0;
                f += 0.0625 * noise(p);
                return f;
            }
            
            void main() {
                vec2 p = vUv * 3.0;
                p.x += time * 0.1;
                p.y += sin(time * 0.2) * 0.1;
                
                float wave1 = sin(p.y * 2.0 + time * 0.5) * 0.5 + 0.5;
                float wave2 = sin(p.y * 3.0 + time * 0.3) * 0.3 + 0.7;
                float wave3 = sin(p.y * 4.0 + time * 0.7) * 0.2 + 0.8;
                
                float noise1 = fbm(p + time * 0.1);
                float noise2 = fbm(p * 2.0 + time * 0.2);
                
                float intensity = wave1 * wave2 * wave3 * noise1 * noise2;
                intensity = pow(intensity, 2.0);
                
                vec3 aurora = mix(color1, color2, sin(p.y + time) * 0.5 + 0.5);
                aurora = mix(aurora, color3, sin(p.y * 2.0 + time * 1.5) * 0.5 + 0.5);
                
                float alpha = intensity * (1.0 - abs(vUv.y - 0.5) * 2.0);
                alpha = smoothstep(0.0, 0.3, alpha);
                
                gl_FragColor = vec4(aurora, alpha * 0.6);
            }
        `;

        // Create first aurora layer
        const auroraGeometry1 = new THREE.PlaneGeometry(400, 100, 1, 1);
        const aurora1Material = new THREE.ShaderMaterial({
            vertexShader: auroraVertexShader,
            fragmentShader: auroraFragmentShader,
            uniforms: {
                time: { value: 0 },
                color1: { value: new THREE.Color(0x00ff88) },  // Green
                color2: { value: new THREE.Color(0x0088ff) },  // Blue
                color3: { value: new THREE.Color(0x8800ff) }   // Purple
            },
            transparent: true,
            blending: THREE.AdditiveBlending
        });

        const aurora1 = new THREE.Mesh(auroraGeometry1, aurora1Material);
        aurora1.position.set(0, 20, -80);
        aurora1.rotation.x = -0.3;
        this.scene.add(aurora1);

        // Create second aurora layer
        const auroraGeometry2 = new THREE.PlaneGeometry(300, 80, 1, 1);
        const aurora2Material = new THREE.ShaderMaterial({
            vertexShader: auroraVertexShader,
            fragmentShader: auroraFragmentShader,
            uniforms: {
                time: { value: 0 },
                color1: { value: new THREE.Color(0xff4488) },  // Pink
                color2: { value: new THREE.Color(0x4488ff) },  // Light Blue
                color3: { value: new THREE.Color(0x88ff44) }   // Light Green
            },
            transparent: true,
            blending: THREE.AdditiveBlending
        });

        const aurora2 = new THREE.Mesh(auroraGeometry2, aurora2Material);
        aurora2.position.set(0, -10, -60);
        aurora2.rotation.x = 0.2;
        this.scene.add(aurora2);

        this.northernLights = { aurora1: aurora1, aurora2: aurora2 };
        console.log('✅ Northern lights created');
    }

    loadAllGLTFModels() {
        console.log('🎮 Loading GLTF models...');
        const loader = new THREE.GLTFLoader();
        const modelPaths = [
            'assets/sculpture_of_singapore_merlion/scene.gltf',
            'assets/norwegian_troll/scene.gltf', 
            'assets/brain_point_cloud/scene.gltf',
            'assets/india_marble_temple_pillar/scene.gltf',
            'assets/stylized_planet/scene.gltf',
            'assets/the_thinker_by_auguste_rodin/scene.gltf',
            'assets/zx_spectrum_128k__computer/scene.gltf',
            'assets/arduino_uno_r3_elegoo/scene.gltf',
            'assets/shiba/scene.gltf',
            'assets/badminton_racket/scene.gltf',
            'assets/badminton/scene.gltf',
            'assets/an-animated-cat/source/scene.gltf',
            'assets/vinyl_player_pioneer/scene.gltf'
        ];

        const modelScales = [1, 0.8, 2, 0.5, 3, 1.5, 2, 3, 2, 2, 2, 1.5, 1.5];
        
        let loadedCount = 0;
        
        modelPaths.forEach((path, index) => {
            loader.load(
                path,
                (gltf) => {
                    const model = gltf.scene;
                    model.scale.setScalar(modelScales[index]);
                    
                    // Position model on revolution orbit
                    const angle = (index / modelPaths.length) * Math.PI * 2;
                    const x = this.revolutionCenter.x + Math.cos(angle) * this.revolutionRadius;
                    const z = this.revolutionCenter.z + Math.sin(angle) * this.revolutionRadius;
                    model.position.set(x, this.revolutionCenter.y, z);
                    
                    // Make model look at center
                    model.lookAt(this.revolutionCenter);
                    
                    this.models.push({
                        mesh: model,
                        mixer: gltf.animations.length > 0 ? new THREE.AnimationMixer(model) : null,
                        initialAngle: angle
                    });
                    
                    if (gltf.animations.length > 0) {
                        gltf.animations.forEach(clip => {
                            this.models[this.models.length - 1].mixer.clipAction(clip).play();
                        });
                    }
                    
                    this.scene.add(model);
                    loadedCount++;
                    
                    console.log(`✅ Loaded model ${loadedCount}/${modelPaths.length}: ${path}`);
                    
                    if (loadedCount === modelPaths.length) {
                        console.log('🎉 All GLTF models loaded successfully!');
                    }
                },
                (progress) => {
                    console.log(`📦 Loading ${path}: ${Math.round((progress.loaded / progress.total) * 100)}%`);
                },
                (error) => {
                    console.error(`❌ Error loading ${path}:`, error);
                    loadedCount++;
                }
            );
        });
    }

    addEventListeners() {
        window.addEventListener('resize', () => this.onWindowResize());
        window.addEventListener('scroll', () => this.onScroll());
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onScroll() {
        const scrollY = window.scrollY;
        this.revolutionAngle = scrollY * this.scrollSensitivity;
        
        // Update model positions
        this.models.forEach((modelData, index) => {
            const totalAngle = modelData.initialAngle + this.revolutionAngle;
            const x = this.revolutionCenter.x + Math.cos(totalAngle) * this.revolutionRadius;
            const z = this.revolutionCenter.z + Math.sin(totalAngle) * this.revolutionRadius;
            
            modelData.mesh.position.set(x, this.revolutionCenter.y, z);
            modelData.mesh.lookAt(this.revolutionCenter);
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        const time = Date.now() * 0.001;
        
        // Update northern lights
        if (this.northernLights) {
            if (this.northernLights.aurora1.material.uniforms) {
                this.northernLights.aurora1.material.uniforms.time.value = time;
            }
            if (this.northernLights.aurora2.material.uniforms) {
                this.northernLights.aurora2.material.uniforms.time.value = time * 1.3;
            }
        }
        
        // Update model animations
        this.models.forEach(modelData => {
            if (modelData.mixer) {
                modelData.mixer.update(0.016);
            }
        });
        
        // Subtle star rotation
        if (this.stars) {
            this.stars.rotation.y += 0.0001;
        }
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Debug function to check Three.js status
function debugThreeJS() {
    console.log('=== Three.js Debug Info ===');
    console.log('THREE object available:', typeof THREE !== 'undefined');
    console.log('Window dimensions:', window.innerWidth, 'x', window.innerHeight);
    console.log('User agent:', navigator.userAgent);
    console.log('Prefers reduced motion:', window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    
    if (typeof THREE !== 'undefined') {
        console.log('THREE.js version:', THREE.REVISION);
    }
}

// Initialize Three.js when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Call debug function
    debugThreeJS();
    
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
        console.log('🚀 Initializing Three.js animated background...');
        try {
            new Portfolio3D();
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
