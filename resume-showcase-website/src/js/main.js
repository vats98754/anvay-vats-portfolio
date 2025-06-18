// Anvay Vats - Modern Three.js Portfolio
(function() {
    'use strict';

    // Three.js Scene Setup
    class Portfolio3D {
        constructor() {
            console.log('🚀 Portfolio3D constructor called');
            
            const canvas = document.getElementById('hero-canvas');
            if (!canvas) {
                console.error('❌ Canvas element #hero-canvas not found!');
                return;
            }
            console.log('✅ Canvas element found:', canvas);

            // Check Three.js availability
            if (typeof THREE === 'undefined') {
                console.error('❌ THREE.js is not loaded!');
                this.updateDebugInfo('threejs-status', '❌ Not Loaded');
                return;
            }
            console.log('✅ THREE.js is available, version:', THREE.REVISION);
            this.updateDebugInfo('threejs-status', '✅ Loaded v' + THREE.REVISION);

            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            this.renderer = new THREE.WebGLRenderer({ 
                canvas: canvas,
                antialias: true,
                alpha: true
            });
            
            this.geometries = [];
            this.models = []; // Array to store loaded GLTF models
            this.mouse = { x: 0, y: 0 };
            this.targetRotation = { x: 0, y: 0 };
            this.currentRotation = { x: 0, y: 0 };
            this.isInitialized = false;
            this.isPaused = false;
            
            console.log('📐 Initializing Three.js components...');
            this.init();
            
            console.log('🎯 Creating geometries...');
            this.createGeometries();
            
            console.log('✨ Creating particles...');
            this.createParticles();
            
            console.log('📦 Loading GLTF models...');
            this.loadGLTFModels();
            
            console.log('🎧 Setting up event listeners...');
            this.setupEventListeners();
            
            console.log('🎬 Starting animation loop...');
            this.animate();
            
            // Mark as initialized
            this.isInitialized = true;
            console.log('🎉 Portfolio3D initialized successfully!');
            
            // Hide loading screen after a short delay
            setTimeout(() => {
                this.hideLoadingScreen();
            }, 2000);
        }

        hideLoadingScreen() {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                console.log('Hiding loading screen...');
                loadingScreen.classList.add('hidden');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    console.log('Loading screen hidden successfully');
                }, 500);
            }
        }

        init() {
            console.log('Initializing Three.js scene...');
            
            // Renderer setup
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setClearColor(0x000000, 0); // Transparent background
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            this.renderer.outputColorSpace = THREE.SRGBColorSpace;

            console.log('📺 Renderer configured:');
            console.log('  - Size:', this.renderer.getSize(new THREE.Vector2()));
            console.log('  - Clear color: transparent');
            console.log('  - Canvas element:', this.renderer.domElement);
            console.log('  - Canvas parent:', this.renderer.domElement.parentElement);

            // Camera position
            this.camera.position.set(0, 0, 15); // Move camera further back
            this.camera.lookAt(0, 0, 0);
            console.log('📷 Camera positioned at:', this.camera.position);

            // Enhanced Lighting Setup
            const ambientLight = new THREE.AmbientLight(0x404040, 0.8);
            this.scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
            directionalLight.position.set(10, 10, 5);
            directionalLight.castShadow = true;
            directionalLight.shadow.mapSize.width = 2048;
            directionalLight.shadow.mapSize.height = 2048;
            directionalLight.shadow.camera.near = 0.1;
            directionalLight.shadow.camera.far = 50;
            this.scene.add(directionalLight);

            // Point light for dramatic effect
            const pointLight = new THREE.PointLight(0x333333, 1.0, 100);
            pointLight.position.set(-10, -10, -10);
            this.scene.add(pointLight);

            // Additional rim light
            const rimLight = new THREE.PointLight(0x666666, 0.7, 50);
            rimLight.position.set(5, 5, 10);
            this.scene.add(rimLight);

            console.log('Three.js scene initialized successfully');
            console.log('Scene children count:', this.scene.children.length);
            console.log('Camera position:', this.camera.position);
            console.log('Renderer size:', this.renderer.getSize(new THREE.Vector2()));
            console.log('Canvas element:', this.renderer.domElement);
            
            // Update debug info
            this.updateDebugInfo('canvas-size', this.renderer.domElement.width + 'x' + this.renderer.domElement.height);
            this.updateDebugInfo('scene-objects', this.scene.children.length.toString());
            
            // Force an initial render
            this.renderer.render(this.scene, this.camera);
        }

        createGeometries() {
            console.log('Creating Three.js geometries...');
            
            try {
                // Neural Network Node - Sphere representing neurons
                const neuralNodeGeometry = new THREE.SphereGeometry(0.8, 32, 32);
                const neuralNodeMaterial = new THREE.MeshPhongMaterial({ 
                    color: 0x000000,
                    transparent: true,
                    opacity: 0.8,
                    emissive: 0x111111
                });
                this.neuralNode = new THREE.Mesh(neuralNodeGeometry, neuralNodeMaterial);
                this.neuralNode.position.set(-4, 2, 0);
                this.neuralNode.castShadow = true;
                this.neuralNode.userData = { type: 'neuralNode', baseY: 2 };
                this.scene.add(this.neuralNode);
                this.geometries.push(this.neuralNode);
                console.log('Neural node created');

                // Convolution Kernel - Rotating cube for CNN operations
                const kernelGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
                const kernelMaterial = new THREE.MeshPhongMaterial({ 
                    color: 0x333333,
                    wireframe: true,
                    transparent: true,
                    opacity: 0.7
                });
                this.convKernel = new THREE.Mesh(kernelGeometry, kernelMaterial);
                this.convKernel.position.set(4, -1, -2);
                this.convKernel.castShadow = true;
                this.convKernel.userData = { type: 'convKernel' };
                this.scene.add(this.convKernel);
                this.geometries.push(this.convKernel);
                console.log('Convolution kernel created');

                // Attention Mechanism - Torus representing transformer attention
                const attentionGeometry = new THREE.TorusGeometry(1.2, 0.3, 16, 100);
                const attentionMaterial = new THREE.MeshPhongMaterial({ 
                    color: 0x666666,
                    transparent: true,
                    opacity: 0.6,
                    emissive: 0x0a0a0a
                });
                this.attentionRing = new THREE.Mesh(attentionGeometry, attentionMaterial);
                this.attentionRing.position.set(0, 3, -3);
                this.attentionRing.castShadow = true;
                this.attentionRing.userData = { type: 'attentionRing' };
                this.scene.add(this.attentionRing);
                this.geometries.push(this.attentionRing);
                console.log('Attention ring created');

                // Feature Map - Plane for image processing visualization
                const featureMapGeometry = new THREE.PlaneGeometry(2, 2, 8, 8);
                const featureMapMaterial = new THREE.MeshPhongMaterial({ 
                    color: 0x222222,
                    wireframe: true,
                    transparent: true,
                    opacity: 0.8,
                    side: THREE.DoubleSide
                });
                this.featureMap = new THREE.Mesh(featureMapGeometry, featureMapMaterial);
                this.featureMap.position.set(-2, -3, 1);
                this.featureMap.castShadow = true;
                this.featureMap.userData = { type: 'featureMap' };
                this.scene.add(this.featureMap);
                this.geometries.push(this.featureMap);
                console.log('Feature map created');

                // Data Flow - Cylinder representing data pipeline
                const dataFlowGeometry = new THREE.CylinderGeometry(0.3, 0.3, 2, 8);
                const dataFlowMaterial = new THREE.MeshPhongMaterial({ 
                    color: 0x111111,
                    transparent: true,
                    opacity: 0.9,
                    emissive: 0x0f0f0f
                });
                this.dataFlow = new THREE.Mesh(dataFlowGeometry, dataFlowMaterial);
                this.dataFlow.position.set(3, 2, 2);
                this.dataFlow.rotation.z = Math.PI / 4;
                this.dataFlow.castShadow = true;
                this.dataFlow.userData = { type: 'dataFlow' };
                this.scene.add(this.dataFlow);
                this.geometries.push(this.dataFlow);
                console.log('Data flow created');

                // Neural Network Connections - Lines between nodes
                this.createNeuralConnections();

                // Weight Matrix - Grid of small spheres
                this.createWeightMatrix();
                
                console.log('All geometries created successfully. Total objects:', this.geometries.length);
                
            } catch (error) {
                console.error('Error creating geometries:', error);
            }
        }

        createParticles() {
            const particleCount = 200;
            const particles = new THREE.BufferGeometry();
            const positions = new Float32Array(particleCount * 3);
            const colors = new Float32Array(particleCount * 3);

            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                
                // Random positions in a sphere
                const radius = Math.random() * 20 + 5;
                const phi = Math.random() * Math.PI * 2;
                const theta = Math.random() * Math.PI;
                
                positions[i3] = radius * Math.sin(theta) * Math.cos(phi);
                positions[i3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
                positions[i3 + 2] = radius * Math.cos(theta);

                // Black and gray colors
                const colorIntensity = Math.random() * 0.5;
                colors[i3] = colorIntensity;
                colors[i3 + 1] = colorIntensity;
                colors[i3 + 2] = colorIntensity;
            }

            particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

            const particleMaterial = new THREE.PointsMaterial({
                size: 0.05,
                transparent: true,
                opacity: 0.6,
                vertexColors: true,
                blending: THREE.AdditiveBlending
            });

            this.particleSystem = new THREE.Points(particles, particleMaterial);
            this.scene.add(this.particleSystem);
        }

        setupEventListeners() {
            // Mouse movement
            document.addEventListener('mousemove', (event) => {
                this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
                
                this.targetRotation.x = this.mouse.y * 0.1;
                this.targetRotation.y = this.mouse.x * 0.1;
            });

            // Window resize
            window.addEventListener('resize', () => this.onWindowResize());

            // Scroll events
            window.addEventListener('scroll', () => this.onScroll());

            // Visibility change for performance
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    this.isPaused = true;
                } else {
                    this.isPaused = false;
                }
            });

            // Pause animations when window is out of focus
            window.addEventListener('blur', () => {
                this.isPaused = true;
            });

            window.addEventListener('focus', () => {
                this.isPaused = false;
            });
        }

        onWindowResize() {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        }

        onScroll() {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.0005;
            
            // Move camera based on scroll
            this.camera.position.y = parallax;
            
            // Rotate geometries based on scroll
            this.geometries.forEach((geo, index) => {
                geo.rotation.z += 0.001 * (index + 1);
            });
        }

        animate() {
            requestAnimationFrame(() => this.animate());

            // Skip animation if paused for performance
            if (this.isPaused) {
                return;
            }

            try {
                // Smooth camera rotation based on mouse
                this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * 0.05;
                this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * 0.05;
                
                this.camera.position.x = Math.sin(this.currentRotation.y) * 10;
                this.camera.position.z = Math.cos(this.currentRotation.y) * 10;
                this.camera.lookAt(0, 0, 0);

                // Animate ML-specific geometries
                const time = Date.now() * 0.001;

                // Test cube rotation - RED CUBE at center
                if (this.testCube) {
                    this.testCube.rotation.x += 0.02;
                    this.testCube.rotation.y += 0.02;
                    this.testCube.rotation.z += 0.01;
                }
                
                // Bright cube rotation - GREEN WIREFRAME on right
                if (this.brightCube) {
                    this.brightCube.rotation.x += 0.03;
                    this.brightCube.rotation.y += 0.03;
                    this.brightCube.position.y = Math.sin(time) * 1.0;
                }
                
                // Test sphere rotation - BLUE SPHERE on left
                if (this.testSphere) {
                    this.testSphere.rotation.x += 0.01;
                    this.testSphere.rotation.y += 0.02;
                    this.testSphere.position.y = Math.cos(time) * 1.0;
                }

                // Neural Node - pulsing like a neuron firing
                if (this.neuralNode) {
                    this.neuralNode.rotation.x += 0.005;
                    this.neuralNode.rotation.y += 0.01;
                    this.neuralNode.scale.setScalar(1 + Math.sin(time * 2) * 0.1);
                    this.neuralNode.position.y = 2 + Math.sin(time * 0.5) * 0.3;
                }

                // Convolution Kernel - rotating like a filter operation
                if (this.convKernel) {
                    this.convKernel.rotation.x += 0.02;
                    this.convKernel.rotation.y += 0.015;
                    this.convKernel.rotation.z += 0.01;
                    this.convKernel.position.x = 4 + Math.cos(time * 0.3) * 0.5;
                }

                // Attention Ring - rotating like attention mechanism
                if (this.attentionRing) {
                    this.attentionRing.rotation.x += 0.01;
                    this.attentionRing.rotation.y += 0.025;
                    this.attentionRing.position.z = -3 + Math.sin(time * 0.4) * 0.5;
                }

                // Feature Map - wave-like distortion
                if (this.featureMap) {
                    this.featureMap.rotation.x = Math.sin(time * 0.7) * 0.5;
                    this.featureMap.rotation.y += 0.008;
                    this.featureMap.position.y = -3 + Math.cos(time * 0.6) * 0.3;
                }

                // Data Flow - rotating like data streaming
                if (this.dataFlow) {
                    this.dataFlow.rotation.x += 0.03;
                    this.dataFlow.rotation.y += 0.02;
                    this.dataFlow.position.x = 3 + Math.sin(time * 0.7) * 0.4;
                }

                // Animate neural connections
                if (this.connections && this.connections.length > 0) {
                    this.connections.forEach((connection, index) => {
                        if (connection && connection.material) {
                            connection.rotation.z += 0.001 * (index + 1);
                            connection.material.opacity = 0.2 + Math.sin(time + index) * 0.2;
                        }
                    });
                }

                // Animate weight matrix - simulate training updates
                if (this.weightNodes && this.weightNodes.length > 0) {
                    this.weightNodes.forEach((node, index) => {
                        if (node && node.scale && node.material) {
                            node.scale.setScalar(0.8 + Math.sin(time * 3 + index * 0.5) * 0.3);
                            node.material.opacity = 0.5 + Math.sin(time * 2 + index * 0.3) * 0.3;
                        }
                    });
                }

                // Animate particles
                if (this.particleSystem) {
                    this.particleSystem.rotation.y += 0.0005;
                    this.particleSystem.rotation.x += 0.0002;
                }

                // Animate GLTF models
                if (this.models && this.models.length > 0) {
                    this.models.forEach((model) => {
                        if (model && model.userData) {
                            const userData = model.userData;
                            
                            // Brain rotation
                            if (userData.type === 'brain') {
                                model.rotation.y += userData.rotationSpeed;
                                model.rotation.x = Math.sin(time * 0.3) * 0.2;
                            }
                            
                            // Shiba bobbing animation
                            if (userData.type === 'shiba') {
                                model.position.y = userData.baseY + Math.sin(time * userData.bobSpeed * 100) * 0.3;
                                model.rotation.y = Math.PI / 4 + Math.sin(time * 0.5) * 0.1;
                            }
                            
                            // Badminton spinning
                            if (userData.type === 'badminton') {
                                model.rotation.y += userData.rotationSpeed;
                                model.rotation.z = Math.sin(time * 0.4) * 0.3;
                            }
                            
                            // Cat animation
                            if (userData.type === 'cat') {
                                model.position.y = userData.baseY + Math.sin(time * userData.animationSpeed * 100) * 0.2;
                                model.rotation.y = Math.sin(time * 0.6) * 0.2;
                                
                                // Update animation mixer if available
                                if (userData.mixer) {
                                    userData.mixer.update(0.016); // ~60fps
                                }
                                
                                // Animate cat tail (if it exists)
                                if (model.children && model.children.length > 4) {
                                    const tail = model.children[4];
                                    if (tail) {
                                        tail.rotation.z = Math.sin(time * 2) * 0.3;
                                    }
                                }
                            }
                        }
                    });
                }                this.renderer.render(this.scene, this.camera);

                // Debug: Log render info occasionally
                if (Math.floor(time) % 5 === 0 && Math.floor(time * 10) % 10 === 0) {
                    console.log('🎬 Rendering scene with', this.scene.children.length, 'objects');
                    console.log('🎯 Camera position:', this.camera.position);
                    console.log('📦 Test objects status:');
                    console.log('  - Red cube:', !!this.testCube, this.testCube ? this.testCube.position : 'N/A');
                    console.log('  - Green cube:', !!this.brightCube, this.brightCube ? this.brightCube.position : 'N/A');
                    console.log('  - Blue sphere:', !!this.testSphere, this.testSphere ? this.testSphere.position : 'N/A');
                    this.updateDebugInfo('scene-objects', this.scene.children.length.toString());
                }
            } catch (error) {
                console.error('❌ Animation error:', error);
            }
        }

        // Method to animate geometries when sections are viewed
        animateGeometriesOnScroll() {
            this.geometries.forEach((geo, index) => {
                if (typeof gsap !== 'undefined') {
                    gsap.to(geo.scale, {
                        duration: 1,
                        x: 1.3,
                        y: 1.3,
                        z: 1.3,
                        yoyo: true,
                        repeat: 1,
                        delay: index * 0.1,
                        ease: "power2.inOut"
                    });
                }
            });
        }

        // Method to highlight specific models when scrolling to related sections
        highlightModelOnScroll(sectionId) {
            if (!this.models) return;
            
            this.models.forEach((model) => {
                if (model && model.userData) {
                    const userData = model.userData;
                    
                    // Reset all models to normal state
                    if (model.material) {
                        model.material.emissive = new THREE.Color(0x000000);
                    } else if (model.children) {
                        model.children.forEach(child => {
                            if (child.material) {
                                child.material.emissive = new THREE.Color(0x000000);
                            }
                        });
                    }
                    
                    // Highlight relevant model based on section
                    if ((sectionId === 'about' && userData.type === 'brain') ||
                        (sectionId === 'experience' && userData.type === 'badminton') ||
                        (sectionId === 'skills' && userData.type === 'cat') ||
                        (sectionId === 'contact' && userData.type === 'shiba')) {
                        
                        // Add glow effect
                        if (model.material) {
                            model.material.emissive = new THREE.Color(0x333333);
                        } else if (model.children) {
                            model.children.forEach(child => {
                                if (child.material) {
                                    child.material.emissive = new THREE.Color(0x333333);
                                }
                            });
                        }
                        
                        // Animate the highlighted model
                        if (typeof gsap !== 'undefined') {
                            gsap.to(model.scale, {
                                duration: 0.5,
                                x: model.scale.x * 1.2,
                                y: model.scale.y * 1.2,
                                z: model.scale.z * 1.2,
                                yoyo: true,
                                repeat: 1,
                                ease: "power2.inOut"
                            });
                        }
                    }
                }
            });
        }

        updateDebugInfo(elementId, text) {
            const element = document.getElementById(elementId);
            if (element) {
                element.textContent = text;
            }
        }

        createNeuralConnections() {
            // Create connections between neural nodes
            const connectionMaterial = new THREE.LineBasicMaterial({ 
                color: 0x333333, 
                transparent: true, 
                opacity: 0.4 
            });
            
            this.connections = [];
            const connectionCount = 8;
            
            for (let i = 0; i < connectionCount; i++) {
                const points = [];
                points.push(new THREE.Vector3(
                    (Math.random() - 0.5) * 8,
                    (Math.random() - 0.5) * 6,
                    (Math.random() - 0.5) * 4
                ));
                points.push(new THREE.Vector3(
                    (Math.random() - 0.5) * 8,
                    (Math.random() - 0.5) * 6,
                    (Math.random() - 0.5) * 4
                ));
                
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.Line(geometry, connectionMaterial);
                this.scene.add(line);
                this.connections.push(line);
            }
        }

        createWeightMatrix() {
            // Create a grid of small spheres representing weights
            this.weightNodes = [];
            const weightGeometry = new THREE.SphereGeometry(0.1, 8, 8);
            const weightMaterial = new THREE.MeshPhongMaterial({ 
                color: 0x444444,
                transparent: true,
                opacity: 0.7
            });
            
            for (let x = -2; x <= 2; x += 0.8) {
                for (let y = -1; y <= 1; y += 0.8) {
                    const weight = new THREE.Mesh(weightGeometry, weightMaterial);
                    weight.position.set(x, y, -5);
                    this.scene.add(weight);
                    this.weightNodes.push(weight);
                }
            }
        }

        loadGLTFModels() {
            console.log('Loading GLTF models...');
            
            // Check if GLTFLoader is available
            if (typeof THREE.GLTFLoader === 'undefined') {
                console.error('GLTFLoader not available! Make sure it is loaded correctly.');
                console.log('Available THREE loaders:', Object.keys(THREE).filter(key => key.includes('Loader')));
                this.updateDebugInfo('gltf-status', '❌ Not Available');
                this.createFallbackModels();
                return;
            }
            
            this.updateDebugInfo('gltf-status', '✅ Available');
            
            const loader = new THREE.GLTFLoader();
            
            // DEBUG: Add test cubes to verify rendering (comment out when models are working)
            // this.addTestCube();
            
            // Load Brain Point Cloud
            loader.load(
                'src/assets/brain_point_cloud/scene.gltf',
                (gltf) => {
                    console.log('✅ Brain model loaded successfully');
                    const brain = gltf.scene;
                    brain.scale.setScalar(0.5);
                    brain.position.set(-6, 3, -2);
                    brain.userData = { type: 'brain', rotationSpeed: 0.005 };
                    
                    // Ensure materials are visible
                    brain.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                            if (child.material) {
                                child.material.needsUpdate = true;
                            }
                        }
                    });
                    
                    this.scene.add(brain);
                    this.models.push(brain);
                    console.log('Brain added to scene at position:', brain.position);
                },
                (progress) => {
                    console.log('Brain loading progress:', (progress.loaded / progress.total * 100) + '%');
                },
                (error) => {
                    console.error('❌ Error loading brain model:', error);
                    this.createBrainPlaceholder();
                }
            );
            
            // Load Shiba Inu
            loader.load(
                'src/assets/shiba/scene.gltf',
                (gltf) => {
                    console.log('✅ Shiba model loaded successfully');
                    const shiba = gltf.scene;
                    shiba.scale.setScalar(0.8);
                    shiba.position.set(5, -2, 1);
                    shiba.rotation.y = Math.PI / 4;
                    shiba.userData = { type: 'shiba', bobSpeed: 0.01, baseY: -2 };
                    
                    // Ensure materials are visible
                    shiba.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                            if (child.material) {
                                child.material.needsUpdate = true;
                            }
                        }
                    });
                    
                    this.scene.add(shiba);
                    this.models.push(shiba);
                    console.log('Shiba added to scene at position:', shiba.position);
                },
                (progress) => {
                    console.log('Shiba loading progress:', (progress.loaded / progress.total * 100) + '%');
                },
                (error) => {
                    console.error('❌ Error loading shiba model:', error);
                    this.createShibaPlaceholder();
                }
            );
            
            // Load Badminton
            loader.load(
                'src/assets/badminton/scene.gltf',
                (gltf) => {
                    console.log('✅ Badminton model loaded successfully');
                    const badminton = gltf.scene;
                    badminton.scale.setScalar(1.2);
                    badminton.position.set(-3, -3, 2);
                    badminton.rotation.x = Math.PI / 6;
                    badminton.userData = { type: 'badminton', rotationSpeed: 0.02 };
                    
                    // Ensure materials are visible
                    badminton.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                            if (child.material) {
                                child.material.needsUpdate = true;
                            }
                        }
                    });
                    
                    this.scene.add(badminton);
                    this.models.push(badminton);
                    console.log('Badminton added to scene at position:', badminton.position);
                },
                (progress) => {
                    console.log('Badminton loading progress:', (progress.loaded / progress.total * 100) + '%');
                },
                (error) => {
                    console.error('❌ Error loading badminton model:', error);
                    this.createBadmintonPlaceholder();
                }
            );
            
            // Load Animated Cat
            loader.load(
                'src/assets/an-animated-cat/source/scene.gltf',
                (gltf) => {
                    console.log('✅ Animated cat model loaded successfully');
                    const cat = gltf.scene;
                    cat.scale.setScalar(0.6);
                    cat.position.set(3, 3, -1);
                    cat.rotation.y = Math.PI / 6;
                    cat.userData = { type: 'cat', animationSpeed: 0.03, baseY: 3 };
                    
                    // If the model has animations, set them up
                    if (gltf.animations && gltf.animations.length > 0) {
                        const mixer = new THREE.AnimationMixer(cat);
                        gltf.animations.forEach((clip) => {
                            const action = mixer.clipAction(clip);
                            action.play();
                        });
                        cat.userData.mixer = mixer;
                        console.log('Cat animations setup:', gltf.animations.length);
                    }
                    
                    // Ensure materials are visible
                    cat.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                            if (child.material) {
                                child.material.needsUpdate = true;
                            }
                        }
                    });
                    
                    this.scene.add(cat);
                    this.models.push(cat);
                    console.log('Cat added to scene at position:', cat.position);
                },
                (progress) => {
                    console.log('Cat loading progress:', (progress.loaded / progress.total * 100) + '%');
                },
                (error) => {
                    console.error('❌ Error loading animated cat model:', error);
                    this.createAnimatedCatPlaceholder();
                }
            );
            
            console.log('GLTF loading initiated for all 4 models');
        }

        addTestCube() {
            // Add a VERY visible rotating cube to test if Three.js rendering works
            const geometry = new THREE.BoxGeometry(4, 4, 4);
            const material = new THREE.MeshBasicMaterial({ 
                color: 0xff0000,
                wireframe: false
            });
            this.testCube = new THREE.Mesh(geometry, material);
            this.testCube.position.set(0, 0, 0); // Center it
            this.testCube.userData = { type: 'testCube' };
            this.scene.add(this.testCube);
            console.log('🟥 LARGE Test cube added to scene at position:', this.testCube.position);
            
            // Also add a bright green wireframe cube
            const brightGeometry = new THREE.BoxGeometry(3, 3, 3);
            const brightMaterial = new THREE.MeshBasicMaterial({ 
                color: 0x00ff00,
                wireframe: true
            });
            this.brightCube = new THREE.Mesh(brightGeometry, brightMaterial);
            this.brightCube.position.set(5, 0, 0); // To the right
            this.scene.add(this.brightCube);
            console.log('🟢 Bright green test cube added at position:', this.brightCube.position);
            
            // Add a blue sphere for more visibility
            const sphereGeometry = new THREE.SphereGeometry(2, 32, 32);
            const sphereMaterial = new THREE.MeshBasicMaterial({ 
                color: 0x0088ff
            });
            this.testSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            this.testSphere.position.set(-5, 0, 0); // To the left
            this.scene.add(this.testSphere);
            console.log('🔵 Blue test sphere added at position:', this.testSphere.position);
        }

        createFallbackModels() {
            console.log('Creating fallback models since GLTF loading failed');
            this.createBrainPlaceholder();
            this.createShibaPlaceholder();
            this.createBadmintonPlaceholder();
            this.createAnimatedCatPlaceholder();
        }

        createBrainPlaceholder() {
            const brainGroup = new THREE.Group();
            const brainGeometry = new THREE.SphereGeometry(0.8, 16, 16);
            const brainMaterial = new THREE.MeshPhongMaterial({ 
                color: 0xffaaaa,
                wireframe: true,
                transparent: true,
                opacity: 0.8
            });
            const brain = new THREE.Mesh(brainGeometry, brainMaterial);
            brainGroup.add(brain);
            brainGroup.position.set(-6, 3, -2);
            brainGroup.userData = { type: 'brain', rotationSpeed: 0.005 };
            this.scene.add(brainGroup);
            this.models.push(brainGroup);
            console.log('🧠 Brain placeholder created');
        }

        createShibaPlaceholder() {
            const shibaGroup = new THREE.Group();
            
            // Body
            const bodyGeometry = new THREE.CapsuleGeometry(0.4, 0.8, 4, 8);
            const shibaMaterial = new THREE.MeshPhongMaterial({ color: 0xffa500 });
            const body = new THREE.Mesh(bodyGeometry, shibaMaterial);
            shibaGroup.add(body);
            
            // Head
            const headGeometry = new THREE.SphereGeometry(0.3, 16, 16);
            const head = new THREE.Mesh(headGeometry, shibaMaterial);
            head.position.set(0, 0.6, 0);
            shibaGroup.add(head);
            
            // Tail
            const tailGeometry = new THREE.CylinderGeometry(0.05, 0.1, 0.6, 8);
            const tail = new THREE.Mesh(tailGeometry, shibaMaterial);
            tail.position.set(0, 0.3, -0.5);
            tail.rotation.x = Math.PI / 3;
            shibaGroup.add(tail);
            
            shibaGroup.position.set(5, -2, 1);
            shibaGroup.rotation.y = Math.PI / 4;
            shibaGroup.userData = { type: 'shiba', bobSpeed: 0.01, baseY: -2 };
            this.scene.add(shibaGroup);
            this.models.push(shibaGroup);
            console.log('🐕 Shiba placeholder created');
        }

        createBadmintonPlaceholder() {
            const badmintonGroup = new THREE.Group();
            
            // Racket handle
            const handleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 8);
            const handleMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
            const handle = new THREE.Mesh(handleGeometry, handleMaterial);
            badmintonGroup.add(handle);
            
            // Racket head
            const headGeometry = new THREE.TorusGeometry(0.3, 0.02, 8, 16);
            const headMaterial = new THREE.MeshPhongMaterial({ color: 0x666666 });
            const head = new THREE.Mesh(headGeometry, headMaterial);
            head.position.set(0, 0.6, 0);
            badmintonGroup.add(head);
            
            // Strings
            for (let i = -3; i <= 3; i++) {
                const stringGeometry = new THREE.CylinderGeometry(0.005, 0.005, 0.6, 4);
                const stringMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
                const string = new THREE.Mesh(stringGeometry, stringMaterial);
                string.position.set(i * 0.1, 0.6, 0);
                string.rotation.z = Math.PI / 2;
                badmintonGroup.add(string);
            }
            
            badmintonGroup.position.set(-3, -3, 2);
            badmintonGroup.rotation.x = Math.PI / 6;
            badmintonGroup.userData = { type: 'badminton', rotationSpeed: 0.02 };
            this.scene.add(badmintonGroup);
            this.models.push(badmintonGroup);
            console.log('🏸 Badminton placeholder created');
        }

        // ...existing code...
    }

    // Portfolio functionality
    class Portfolio {
        constructor() {
            this.navbar = document.querySelector('.navbar');
            this.navLinks = document.querySelectorAll('.nav-link');
            this.backToTop = document.querySelector('.back-to-top');
            this.hamburger = document.querySelector('.hamburger');
            this.navMenu = document.querySelector('.nav-menu');
            this.typedInstance = null; // Track typed instance
            
            this.initializePortfolio();
            this.setupEventListeners();
            this.initializeTyped();
        }

        initializePortfolio() {
            // Skip Three.js initialization since it's handled in DOMContentLoaded
            console.log('Portfolio: Skipping Three.js initialization (handled globally)');
            
            // Add scroll animations
            this.observeElements();
        }

        hideLoadingScreenFallback() {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                console.log('Fallback: Hiding loading screen...');
                setTimeout(() => {
                    loadingScreen.classList.add('hidden');
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                        console.log('Fallback: Loading screen hidden successfully');
                    }, 500);
                }, 100);
            }
        }

        setupEventListeners() {
            // Navbar scroll behavior
            window.addEventListener('scroll', () => {
                if (window.scrollY > 100) {
                    this.navbar.classList.add('scrolled');
                    this.backToTop.classList.add('show');
                } else {
                    this.navbar.classList.remove('scrolled');
                    this.backToTop.classList.remove('show');
                }
            });

            // Smooth scrolling for navigation links
            this.navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const target = document.querySelector(link.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                        
                        // Update active nav link
                        this.navLinks.forEach(navLink => navLink.classList.remove('active'));
                        link.classList.add('active');
                        
                        // Close mobile menu if open
                        this.navMenu.classList.remove('active');
                        this.hamburger.classList.remove('active');
                    }
                });
            });

            // Mobile menu toggle
            if (this.hamburger) {
                this.hamburger.addEventListener('click', () => {
                    this.hamburger.classList.toggle('active');
                    this.navMenu.classList.toggle('active');
                });
            }

            // Back to top button
            if (this.backToTop) {
                this.backToTop.addEventListener('click', () => {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                });
            }
        }

        initializeTyped() {
            // Destroy any existing typed instances first
            if (this.typedInstance) {
                this.typedInstance.destroy();
                this.typedInstance = null;
            }
            
            if (typeof Typed !== 'undefined' && document.querySelector('.typed-text-output')) {
                this.typedInstance = new Typed('.typed-text-output', {
                    strings: [
                        'Machine Learning Engineer',
                        'Computer Vision Specialist', 
                        'Deep Learning Researcher',
                        'Neural Network Architect',
                        'AI Systems Developer'
                    ],
                    typeSpeed: 100,
                    backSpeed: 50,
                    backDelay: 2000,
                    loop: true,
                    showCursor: true,
                    cursorChar: '|'
                });
                console.log('Typed.js initialized successfully');
            } else {
                console.warn('Typed.js not available or element not found');
            }
        }

        observeElements() {
            // Intersection Observer for scroll animations
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in-up');
                        
                        // Trigger Three.js animations when skills section is viewed
                        if (entry.target.id === 'skills' && window.portfolio3D && window.portfolio3D.animateGeometriesOnScroll) {
                            window.portfolio3D.animateGeometriesOnScroll();
                        }
                        
                        // Highlight relevant 3D models based on section
                        if (window.portfolio3D && window.portfolio3D.highlightModelOnScroll) {
                            window.portfolio3D.highlightModelOnScroll(entry.target.id);
                        }
                    }
                });
            }, observerOptions);

            // Observe sections
            document.querySelectorAll('.section').forEach(section => {
                observer.observe(section);
            });
        }
    }

    // Resume functionality - ML Engineer focus
    window.openResume = function(type) {
        const resumeFiles = {
            'mle': 'Anvay_Vats_Resume_MLE_External.pdf'
        };
        
        if (resumeFiles[type]) {
            window.open(resumeFiles[type], '_blank');
        } else {
            // Default to MLE resume
            window.open('Anvay_Vats_Resume_MLE_External.pdf', '_blank');
        }
    };

    // Scroll to top function
    window.scrollToTop = function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Global function for skip loading button
    window.skipLoading = function() {
        console.log('User clicked skip loading');
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    };

    // Initialize everything when DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
        console.log('🌐 DOM loaded, initializing portfolio...');
        
        // Wait for scripts to load
        setTimeout(() => {
            // Check if Three.js is available
            if (typeof THREE === 'undefined') {
                console.error('❌ THREE.js is not loaded!');
                // Force hide loading screen if Three.js fails to load
                setTimeout(() => {
                    const loadingScreen = document.getElementById('loading-screen');
                    if (loadingScreen) {
                        loadingScreen.style.display = 'none';
                    }
                }, 1000);
                return;
            }
            
            console.log('✅ THREE.js is available, version:', THREE.REVISION);
            
            try {
                // Initialize Three.js scene
                window.portfolio3D = new Portfolio3D();
                console.log('✅ Portfolio3D initialized successfully!');
                
                // Initialize portfolio functionality
                window.portfolio = new Portfolio();
                console.log('✅ Portfolio functionality initialized!');
                
            } catch (error) {
                console.error('❌ Error initializing portfolio:', error);
                // Force hide loading screen on error
                const loadingScreen = document.getElementById('loading-screen');
                if (loadingScreen) {
                    loadingScreen.style.display = 'none';
                }
            }
        }, 500); // Give scripts time to load
        
        // Failsafe to hide loading screen after 5 seconds maximum
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen && !loadingScreen.classList.contains('hidden')) {
                console.log('⏰ Failsafe: Force hiding loading screen after 5 seconds');
                loadingScreen.classList.add('hidden');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }
        }, 5000);
    });

})();