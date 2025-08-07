import { Config } from '../config/Config.js';
import { Utils } from '../utils/Utils.js';
import { Mouse, InteractiveStar, ModelUserData, TrailData } from '../types.js';

/**
 * Manages the Three.js scene and all 3D components
 */
export class SceneManager {
  public scene!: any; // THREE.Scene
  public camera!: any; // THREE.PerspectiveCamera
  public renderer!: any; // THREE.WebGLRenderer
  public particles!: any; // THREE.Points
  
  private geometries: any[] = [];
  private gltfModels: any[] = [];
  private mouse: Mouse = { x: 0, y: 0 };
  private targetMouse: Mouse = { x: 0, y: 0 };
  private backgroundMaterial!: any; // THREE.ShaderMaterial
  private starMaterial!: any; // THREE.ShaderMaterial
  private northernLightsMaterial!: any; // THREE.ShaderMaterial
  private scrollY: number = 0;
  private interactiveStars: InteractiveStar[] = [];
  private raycaster = new (window.THREE || window.THREE).Raycaster();
  private objectTrails: TrailData[] = [];
  private thinkerModel?: any; // THREE.Object3D
  private brainModel?: any; // THREE.Object3D

  constructor() {
    this.init();
    this.createNorthernLightsBackground();
    this.createBlinkingStarField();
    this.loadGLTFModels();
    this.createRevolvingObjectTrails();
    this.setupEventListeners();
    this.animate();
  }

  /**
   * Initialize the Three.js scene
   */
  private init(): void {
    console.log('🚀 Initializing Three.js with Northern Lights background...');
    
    const THREE = window.THREE || (window as any).THREE;
    
    // Scene setup
    this.scene = new THREE.Scene();
    
    // Camera setup
    this.camera = new THREE.PerspectiveCamera(
      Config.CAMERA_CONFIG.fov,
      window.innerWidth / window.innerHeight,
      Config.CAMERA_CONFIG.near,
      Config.CAMERA_CONFIG.far
    );
    this.camera.position.z = Config.CAMERA_CONFIG.initialZ;
    
    // Renderer setup
    const canvas = document.getElementById('threejs-canvas') as HTMLCanvasElement;
    if (!canvas) {
      console.error('❌ Canvas element not found!');
      return;
    }
    
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: !Config.isMobile(),
      powerPreference: Config.getPowerPreference()
    });
    
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Config.getPixelRatio());
    
    // Lighting setup
    const ambientLight = new THREE.AmbientLight(
      Config.LIGHTING_CONFIG.ambientColor,
      Config.LIGHTING_CONFIG.ambientIntensity
    );
    this.scene.add(ambientLight);
    
    // Add additional bright light for brain visibility
    const brainSpotlight = new THREE.SpotLight(0x00ffff, 2, 100, Math.PI / 4, 0.5);
    brainSpotlight.position.set(20, 30, 10);
    brainSpotlight.target.position.set(0, 0, -20);
    this.scene.add(brainSpotlight);
    this.scene.add(brainSpotlight.target);
    
    // Add point light that will follow the brain
    const brainPointLight = new THREE.PointLight(0x44aaff, 1.5, 50);
    brainPointLight.position.set(0, 10, -20);
    this.scene.add(brainPointLight);
    
    // Store reference for brain lighting updates
    (this as any).brainPointLight = brainPointLight;
    
    console.log('✅ Scene initialized, ready for northern lights...');
    
    // Force an immediate render
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Create the northern lights background
   */
  private createNorthernLightsBackground(): void {
    console.log('🌌 Creating spectacular northern lights background...');
    
    const THREE = window.THREE || (window as any).THREE;
    const sphereGeometry = new THREE.SphereGeometry(800, 64, 64);
    
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
    
    const fragmentShader = this.getNorthernLightsFragmentShader();
    
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
    
    const backgroundSphere = new THREE.Mesh(sphereGeometry, this.northernLightsMaterial);
    this.scene.add(backgroundSphere);
    
    console.log('✅ Northern lights background created and added to scene');
    
    Utils.createStatusIndicator('🌌 Northern Lights Active!', '#00ff64', 5000);
  }

  /**
   * Get the northern lights fragment shader
   */
  private getNorthernLightsFragmentShader(): string {
    return `
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
        vec3 deepSpace = vec3(0.005, 0.01, 0.05);
        vec3 nightSky = vec3(0.02, 0.05, 0.15);
        vec3 horizon = vec3(0.05, 0.1, 0.25);
        
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
        
        // Final color blending
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
  }

  /**
   * Create the blinking star field
   */
  private createBlinkingStarField(): void {
    console.log('⭐ Creating beautiful blinking star field...');
    
    const THREE = window.THREE || (window as any).THREE;
    const starCount = Config.STAR_CONFIG.count;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);
    const phases = new Float32Array(starCount);
    const sparklePhases = new Float32Array(starCount);
    
    this.interactiveStars = [];
    
    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      
      const x = (Math.random() - 0.5) * Config.STAR_CONFIG.positionRange.x;
      const y = (Math.random() - 0.5) * Config.STAR_CONFIG.positionRange.y;
      const z = (Math.random() - 0.5) * Config.STAR_CONFIG.positionRange.z;
      
      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;
      
      this.interactiveStars.push({
        id: i,
        position: new THREE.Vector3(x, y, z),
        isShootingStar: false,
        shootingDirection: new THREE.Vector3(),
        shootingSpeed: 0,
        originalPosition: new THREE.Vector3(x, y, z)
      });
      
      // Apply star colors based on configuration
      this.applyStarColor(colors, i3);
      
      sizes[i] = Utils.randomFloat(Config.STAR_CONFIG.sizeRange.min, Config.STAR_CONFIG.sizeRange.max);
      phases[i] = Math.random() * Math.PI * 2;
      sparklePhases[i] = Math.random() * Math.PI * 2;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1));
    geometry.setAttribute('sparklePhase', new THREE.BufferAttribute(sparklePhases, 1));
    
    this.starMaterial = this.createStarMaterial();
    this.particles = new THREE.Points(geometry, this.starMaterial);
    this.scene.add(this.particles);
    
    console.log('✅ Blinking star field created with', starCount, 'stars');
    
    Utils.createStatusIndicator('⭐ Blinking Stars Active!', '#ffc800', 4000, { top: '70px', right: '20px' });
  }

  /**
   * Apply star color based on type
   */
  private applyStarColor(colors: Float32Array, index: number): void {
    const starType = Math.random();
    const colorConfig = Config.STAR_CONFIG.colors;
    
    if (starType < colorConfig.white.weight) {
      colors[index] = colorConfig.white.color.r;
      colors[index + 1] = colorConfig.white.color.g;
      colors[index + 2] = colorConfig.white.color.b;
    } else if (starType < colorConfig.white.weight + colorConfig.blueWhite.weight) {
      colors[index] = colorConfig.blueWhite.color.r + Math.random() * 0.2;
      colors[index + 1] = colorConfig.blueWhite.color.g + Math.random() * 0.1;
      colors[index + 2] = colorConfig.blueWhite.color.b;
    } else if (starType < colorConfig.white.weight + colorConfig.blueWhite.weight + colorConfig.yellow.weight) {
      colors[index] = colorConfig.yellow.color.r;
      colors[index + 1] = colorConfig.yellow.color.g + Math.random() * 0.2;
      colors[index + 2] = colorConfig.yellow.color.b + Math.random() * 0.3;
    } else {
      colors[index] = colorConfig.aurora.color.r + Math.random() * 0.4;
      colors[index + 1] = colorConfig.aurora.color.g + Math.random() * 0.2;
      colors[index + 2] = colorConfig.aurora.color.b + Math.random() * 0.3;
    }
  }

  /**
   * Create star material with shaders
   */
  private createStarMaterial(): any {
    const THREE = window.THREE || (window as any).THREE;
    
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0.0 },
        mousePos: { value: new THREE.Vector2(0, 0) },
        pointTexture: { value: this.createBlinkingStarTexture() }
      },
      vertexShader: this.getStarVertexShader(),
      fragmentShader: this.getStarFragmentShader(),
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
  }

  /**
   * Get star vertex shader
   */
  private getStarVertexShader(): string {
    return `
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
        
        // Mouse interaction - brighten nearby stars
        vec2 screenPos = (mvPosition.xy / mvPosition.w) * 0.5 + 0.5;
        float mouseDist = distance(screenPos, mousePos);
        float mouseEffect = 1.0 + (1.0 - smoothstep(0.0, 0.3, mouseDist)) * 2.0;
        
        gl_PointSize = size * finalEffect * mouseEffect * (400.0 / -mvPosition.z);
        
        vAlpha = finalEffect * (0.5 + 0.5 * sin(time * 4.0 + phase));
        vSparkle = sparkleIntensity;
        
        gl_Position = projectionMatrix * mvPosition;
      }
    `;
  }

  /**
   * Get star fragment shader
   */
  private getStarFragmentShader(): string {
    return `
      uniform sampler2D pointTexture;
      varying vec3 vColor;
      varying float vAlpha;
      varying float vSparkle;
      
      void main() {
        vec4 textureColor = texture2D(pointTexture, gl_PointCoord);
        
        float distFromCenter = distance(gl_PointCoord, vec2(0.5));
        float glow = 1.0 - smoothstep(0.0, 0.6, distFromCenter);
        
        vec3 sparkleColor = vColor + vec3(0.3, 0.3, 0.3) * vSparkle;
        
        float mouseDistance = distance(gl_PointCoord, vec2(0.5));
        float constellationGlow = 1.0 - smoothstep(0.1, 0.8, mouseDistance);
        sparkleColor += vec3(0.2, 0.4, 0.8) * constellationGlow * 0.5;
        
        vec4 finalColor = vec4(sparkleColor * glow, vAlpha) * textureColor;
        
        gl_FragColor = finalColor;
      }
    `;
  }

  /**
   * Create blinking star texture
   */
  private createBlinkingStarTexture(): any {
    const THREE = window.THREE || (window as any).THREE;
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext('2d')!;
    
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

  /**
   * Load GLTF models
   */
  private loadGLTFModels(): void {
    const THREE = window.THREE || (window as any).THREE;
    
    if (typeof (THREE as any).GLTFLoader === 'undefined') {
      console.error('❌ GLTFLoader not available');
      this.createFallbackModels();
      return;
    }
    
    console.log('🎮 Loading GLTF models...');
    
    const loader = new (THREE as any).GLTFLoader();
    let modelsLoaded = 0;
    const modelsToLoad = Config.getGLTFModels(); // Use the new method with absolute URLs
    const totalModels = modelsToLoad.length;
    
    const modelLoaded = () => {
      modelsLoaded++;
      if (modelsLoaded === totalModels) {
        Utils.createStatusIndicator(`✅ All ${totalModels} models loaded!`, '#00ff00', 3000, { top: '120px', right: '20px' });
      }
    };

    console.log('🌐 Asset base URL:', Config.getAssetBaseUrl());
    console.log('📦 Models to load:', modelsToLoad.map(m => ({ name: m.name, path: m.path })));

    modelsToLoad.forEach(modelConfig => {
      console.log(`🚀 Loading ${modelConfig.name} from: ${modelConfig.path}`);
      
      loader.load(
        modelConfig.path,
        (gltf: any) => {
          console.log(`✅ ${modelConfig.name} model loaded:`, gltf);
          
          const model = gltf.scene;
          model.scale.set(modelConfig.scale, modelConfig.scale, modelConfig.scale);
          model.position.set(modelConfig.position.x, modelConfig.position.y, modelConfig.position.z);
          
          if (modelConfig.rotation) {
            model.rotation.set(modelConfig.rotation.x, modelConfig.rotation.y, modelConfig.rotation.z);
          }
          
          // Configure model based on type
          if (modelConfig.isProfile) {
            this.setupProfileModel(model, modelConfig.name);
          } else if (modelConfig.isRevolving) {
            this.setupRevolvingModel(model, modelConfig);
          }
          
          // Handle animations
          if (modelConfig.hasAnimation && gltf.animations && gltf.animations.length > 0) {
            const mixer = new THREE.AnimationMixer(model);
            const action = mixer.clipAction(gltf.animations[0]);
            action.play();
            
            (model.userData as ModelUserData).mixer = mixer;
          }
          
          this.gltfModels.push(model);
          this.scene.add(model);
          modelLoaded();
          
          console.log(`🎯 ${modelConfig.name} model added to scene`);
        },
        (progress: any) => {
          const percentage = Math.round((progress.loaded / progress.total) * 100);
          console.log(`${modelConfig.name} loading progress: ${percentage}% (${progress.loaded}/${progress.total} bytes)`);
        },
        (error: any) => {
          console.error(`❌ Error loading ${modelConfig.name} model from ${modelConfig.path}:`, error);
          console.error('Error details:', {
            message: error.message,
            type: error.type,
            target: error.target,
            status: error.status || 'unknown',
          });
          
          // Try to provide helpful error information
          if (error.status === 404) {
            console.error(`📁 File not found. Check if the asset exists at: ${modelConfig.path}`);
          } else if (error.status === 0 || error.type === 'error') {
            console.error('🔒 This might be a CORS or network connectivity issue.');
            console.error('🌐 Current URL:', window.location.href);
            console.error('📦 Asset URL:', modelConfig.path);
          }
          
          modelLoaded();
        }
      );
    });
  }

  /**
   * Setup profile model
   */
  private setupProfileModel(model: any, name: string): void {
    const userData: ModelUserData = {
      isInteractive: true,
      rotationSpeed: 0.005,
      baseRotationY: Math.PI / 4,
      hoverRotationY: 0,
      targetRotationY: Math.PI / 4,
      isHovered: false
    };
    
    model.userData = userData;
    
    if (name === 'thinker') {
      console.log('🗿 Thinker model detected, setting up...');
      this.thinkerModel = model;
      this.setupThinkerProfilePicture();
    }
    // Brain is now handled in setupRevolvingModel
  }

  /**
   * Setup revolving model
   */
  private setupRevolvingModel(model: any, config: any): void {
    const userData: ModelUserData = {
      rotationSpeed: 0.01,
      floatSpeed: 0.005,
      originalY: model.position.y,
      revolutionRadius: config.revolutionRadius || 60,
      revolutionSpeed: 0.006,
      revolutionAngle: 0,
      targetRevolutionAngle: 0,
      isRevolvingObject: true,
      scrollTriggerStart: config.scrollTrigger?.start || 0.2,
      scrollTriggerEnd: config.scrollTrigger?.end || 0.8,
      baseScale: config.scale
    };
    
    model.userData = userData;
    
    // Special setup for brain model
    if (config.name === 'brain') {
      console.log('🧠 Setting up brain with special creative effects...');
      this.brainModel = model;
      userData.isCreativeBrain = true;
      userData.brainPhase = 0;
      userData.particleSystem = null;
      
      // Make brain always visible and prominent
      model.visible = true;
      
      // Add emissive glow to brain materials
      model.traverse((child: any) => {
        if (child.isMesh && child.material) {
          child.material.emissive = new (window.THREE || (window as any).THREE).Color(0x001133);
          child.material.emissiveIntensity = 0.4;
        }
      });
    }
  }

  /**
   * Setup Thinker profile picture
   */
  private setupThinkerProfilePicture(): void {
    console.log('🗿 Setting up Thinker profile picture...');
    
    if (!this.thinkerModel) {
      console.error('Thinker model not available');
      return;
    }

    const profileImg = document.querySelector('#thinker-profile-1') as HTMLElement;
    if (!profileImg) {
      console.log('No thinker profile element found to replace');
      return;
    }

    try {
      // Create canvas for 3D profile
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 300;
      canvas.style.cssText = profileImg.style.cssText;
      canvas.className = profileImg.className;
      canvas.style.cursor = 'pointer';
      canvas.style.borderRadius = '50%';

      // Create Three.js scene for the canvas
      const profileScene = new (window.THREE).Scene();
      const profileCamera = new (window.THREE).PerspectiveCamera(50, 1, 0.1, 100);
      profileCamera.position.set(0, 0, 12); // Moved farther from camera

      const profileRenderer = new (window.THREE).WebGLRenderer({ 
        canvas, 
        alpha: true, 
        antialias: true 
      });
      profileRenderer.setSize(300, 300);
      profileRenderer.setClearColor(0x000000, 0);

      // Clone and setup thinker for profile
      const profileThinker = this.thinkerModel.clone();
      profileThinker.scale.set(2.5, 2.5, 2.5);
      profileThinker.position.set(0, -1, 0);

      // Add lighting for profile scene
      const ambientLight = new (window.THREE).AmbientLight(0x404040, 0.6);
      const directionalLight = new (window.THREE).DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(5, 5, 5);
      profileScene.add(ambientLight);
      profileScene.add(directionalLight);
      profileScene.add(profileThinker);

      // Replace image with 3D canvas
      profileImg.parentNode?.replaceChild(canvas, profileImg);
      console.log('✅ Profile image replaced with 3D Thinker');

      // Animation loop for profile
      const animateProfile = () => {
        profileThinker.rotation.y += 0.01;
        profileThinker.position.y = -1 + Math.sin(Date.now() * 0.001) * 0.1;
        profileRenderer.render(profileScene, profileCamera);
        requestAnimationFrame(animateProfile);
      };
      animateProfile();

    } catch (error) {
      console.error('❌ Error setting up Thinker profile:', error);
    }
  }

  /**
   * Setup creative brain scroll effects with enhanced positioning
   */
  private setupCreativeBrainScrollEffects(): void {
    if (!this.brainModel) return;
    
    console.log('🧠 Setting up ENHANCED creative brain scroll animations...');
    
    // Enhanced brain properties for dramatic scroll effects
    const userData = this.brainModel.userData as ModelUserData;
    userData.isCreativeBrain = true;
    userData.originalScale = this.brainModel.scale.x;
    userData.scrollProgress = 0;
    userData.brainPhase = 0;
    userData.particleSystem = null;
    
    // Make brain MUCH larger and position it for dramatic entrance
    this.brainModel.scale.set(15, 15, 15); // Much bigger for visibility
    this.brainModel.position.set(50, 20, -30); // Further off-screen for dramatic entrance
    
    // Add some initial rotation for dynamic feel
    this.brainModel.rotation.x = Math.PI * 0.2;
    this.brainModel.rotation.y = Math.PI * 0.3;
    
    // Make sure brain is visible by default
    this.brainModel.visible = true;
    
    // Add debugging material to make brain more visible
    this.brainModel.traverse((child: any) => {
      if (child.isMesh) {
        // Make brain materials more visible
        if (child.material) {
          child.material.emissive = new (window.THREE || (window as any).THREE).Color(0x001122);
          child.material.emissiveIntensity = 0.3;
        }
      }
    });
    
    console.log('✅ Enhanced creative brain scroll effects ready for DRAMATIC entrance!');
    console.log('🧠 Brain position:', this.brainModel.position);
    console.log('🧠 Brain scale:', this.brainModel.scale);
    console.log('🧠 Brain visible:', this.brainModel.visible);
  }

  /**
   * Create fallback models when GLTF loader is not available
   */
  private createFallbackModels(): void {
    console.log('🔄 Creating fallback models...');
    // Create simple geometric shapes as fallbacks
  }

  /**
   * Create revolving object trails
   */
  private createRevolvingObjectTrails(): void {
    console.log('✨ Creating revolving object trails...');
    // Implementation for particle trails
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    // Mouse movement
    document.addEventListener('mousemove', (event) => {
      this.handleStarInteraction(event);
      this.handleBackgroundAssetInteraction(event);
    });

    // Mouse click
    document.addEventListener('click', (event) => {
      this.createClickShootingStars(event);
    });

    // Touch support
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

    // Window resize
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Scroll events
    window.addEventListener('scroll', () => {
      this.scrollY = window.scrollY;
    });
  }

  /**
   * Handle star interaction
   */
  private handleStarInteraction(event: { clientX: number; clientY: number }): void {
    this.mouse.x = (event.clientX / window.innerWidth - 0.5) * 2;
    this.mouse.y = -(event.clientY / window.innerHeight - 0.5) * 2;
    
    // Update star material mouse position
    if (this.starMaterial) {
      this.starMaterial.uniforms.mousePos.value.set(
        event.clientX / window.innerWidth,
        1 - event.clientY / window.innerHeight
      );
    }
  }

  /**
   * Handle background asset interaction
   */
  private handleBackgroundAssetInteraction(event: { clientX: number; clientY: number }): void {
    const mouseInfluence = {
      x: (event.clientX / window.innerWidth - 0.5) * 2,
      y: -(event.clientY / window.innerHeight - 0.5) * 2
    };
    
    this.gltfModels.forEach(model => {
      const userData = model.userData as ModelUserData;
      if (userData) {
        const targetX = userData.originalX || model.position.x;
        const targetZ = userData.originalZ || model.position.z;
        
        if (!userData.originalX) {
          userData.originalX = model.position.x;
          userData.originalZ = model.position.z;
        }
        
        model.position.x += (targetX + mouseInfluence.x * 5 - model.position.x) * 0.02;
        model.position.z += (targetZ + mouseInfluence.y * 3 - model.position.z) * 0.02;
        
        model.rotation.y += mouseInfluence.x * 0.001;
        model.rotation.x += mouseInfluence.y * 0.0005;
      }
    });
  }

  /**
   * Create shooting stars on click
   */
  private createClickShootingStars(event: MouseEvent): void {
    Utils.createRippleEffect(event.clientX, event.clientY);
    
    const mouse = new window.THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        this.createRandomShootingStar(mouse);
      }, i * 200);
    }
  }

  /**
   * Create random shooting star
   */
  private createRandomShootingStar(mousePos: any): void {
    if (!this.interactiveStars || this.interactiveStars.length === 0) return;
    
    const availableStars = this.interactiveStars.filter(star => !star.isShootingStar);
    if (availableStars.length === 0) return;
    
    const randomStar = availableStars[Math.floor(Math.random() * availableStars.length)];
    // Implementation for shooting star animation
  }

  /**
   * Main animation loop
   */
  private animate(): void {
    requestAnimationFrame(() => this.animate());
    
    const time = Date.now() * 0.001;
    const deltaTime = 0.016;
    
    // Update northern lights
    if (this.northernLightsMaterial) {
      this.northernLightsMaterial.uniforms.time.value = time;
    }
    
    // Update star animation
    if (this.starMaterial) {
      this.starMaterial.uniforms.time.value = time;
    }
    
    // Animate star field
    if (this.particles) {
      this.particles.rotation.x = time * Config.ANIMATION_CONFIG.starRotationSpeed.x;
      this.particles.rotation.y = time * Config.ANIMATION_CONFIG.starRotationSpeed.y;
      
      const breathingScale = 1 + Math.sin(time * Config.ANIMATION_CONFIG.breathingSpeed) * Config.ANIMATION_CONFIG.breathingIntensity;
      this.particles.scale.setScalar(breathingScale);
    }
    
    // Animate GLTF models
    const scrollProgress = Utils.getScrollProgress();
    this.scrollY = window.scrollY;
    
    this.gltfModels.forEach((model) => {
      const userData = model.userData as ModelUserData;
      
      if (userData?.isRevolvingObject) {
        this.animateRevolvingModel(model, userData, scrollProgress, time);
      } else {
        this.animateFloatingModel(model, userData, time, deltaTime);
      }
    });
    
    // Update camera
    this.updateCamera(time, scrollProgress);
    
    // Render
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Animate revolving model
   */
  private animateRevolvingModel(model: any, userData: ModelUserData, scrollProgress: number, time: number): void {
    const scrollRange = userData.scrollTriggerEnd! - userData.scrollTriggerStart!;
    const scrollInRange = Math.max(0, Math.min(1, (scrollProgress - userData.scrollTriggerStart!) / scrollRange));
    
    userData.targetRevolutionAngle = userData.revolutionAngle! + (scrollInRange * Math.PI * 2);
    
    const revolutionX = Math.cos(userData.targetRevolutionAngle!) * userData.revolutionRadius!;
    const revolutionZ = Math.sin(userData.targetRevolutionAngle!) * userData.revolutionRadius!;
    
    model.position.x = revolutionX;
    model.position.z = revolutionZ - 30;
    model.position.y = userData.originalY! + Math.sin(time * userData.floatSpeed!) * 3;
    
    model.lookAt(this.camera.position);
    
    const distanceToCamera = model.position.distanceTo(this.camera.position);
    const scaleMultiplier = Math.max(0.5, Math.min(2.0, 50 / distanceToCamera));
    const baseScale = userData.baseScale || 1;
    model.scale.setScalar(baseScale * scaleMultiplier);
  }

  /**
   * Animate floating model
   */
  private animateFloatingModel(model: any, userData: ModelUserData, time: number, deltaTime: number): void {
    if (userData?.mixer) {
      userData.mixer.update(deltaTime);
    }
    
    // Creative brain scroll effects
    if (userData?.isCreativeBrain) {
      this.animateCreativeBrain(model, userData, time);
      return;
    }
    
    if (userData?.originalY !== undefined) {
      model.position.y = userData.originalY + Math.sin(time * (userData.floatSpeed || 0.005)) * 2;
    }
    
    if (userData?.rotationSpeed) {
      model.rotation.y += userData.rotationSpeed;
    }
    
    if (userData?.bubble) {
      userData.bubble.position.copy(model.position);
      userData.bubble.rotation.y += (userData.rotationSpeed || 0) * 0.5;
      userData.bubble.material.opacity = 0.15 + Math.sin(time * 2) * 0.05;
    }
  }

  /**
   * Animate creative brain with enhanced scroll effects
   */
  private animateCreativeBrain(model: any, userData: ModelUserData, time: number): void {
    const scrollProgress = Utils.getScrollProgress();
    userData.scrollProgress = scrollProgress;
    userData.brainPhase! += 0.03;
    
    // Brain is always visible and animated
    model.visible = true;
    
    // CREATIVE EFFECT 1: Enhanced orbital motion with brain consciousness
    const revolutionSpeed = 0.008 + scrollProgress * 0.004; // Speed up with scroll
    userData.revolutionAngle! += revolutionSpeed;
    
    const revolutionRadius = userData.revolutionRadius! * (0.8 + scrollProgress * 0.4);
    const heightVariation = Math.sin(time * 0.6 + userData.brainPhase!) * 8;
    
    model.position.x = Math.cos(userData.revolutionAngle!) * revolutionRadius;
    model.position.z = Math.sin(userData.revolutionAngle!) * revolutionRadius - 25;
    model.position.y = userData.originalY! + heightVariation + scrollProgress * 10;
    
    // CREATIVE EFFECT 2: Multi-layered pulsing and breathing
    const heartbeatPulse = 1 + Math.sin(time * 4) * 0.3;
    const breathingPulse = 1 + Math.sin(time * 0.8) * 0.4;
    const neuralPulse = 1 + Math.sin(time * 6 + userData.brainPhase!) * 0.2;
    const scrollScale = userData.baseScale! * (1 + scrollProgress * 0.8);
    
    const finalScale = scrollScale * heartbeatPulse * breathingPulse * neuralPulse;
    model.scale.setScalar(finalScale);
    
    // CREATIVE EFFECT 3: Complex brain-like rotation
    model.rotation.x = time * 0.3 + Math.sin(userData.brainPhase!) * 0.5;
    model.rotation.y = time * 0.5 + userData.brainPhase! * 2;
    model.rotation.z = Math.sin(time * 0.4) * 0.6 + scrollProgress * Math.PI;
    
    // CREATIVE EFFECT 4: Neural lighting
    const lightIntensity = 1 + scrollProgress * 2;
    const colorPhase = time * 2 + userData.brainPhase!;
    
    // Update brain point light if it exists
    if ((this as any).brainPointLight) {
      (this as any).brainPointLight.position.copy(model.position);
      (this as any).brainPointLight.intensity = lightIntensity + Math.sin(time * 4) * 0.5;
      
      // Color cycle
      const r = 0.2 + Math.sin(colorPhase) * 0.4;
      const g = 0.6 + Math.sin(colorPhase + Math.PI * 0.5) * 0.4;
      const b = 0.9 + Math.sin(colorPhase + Math.PI) * 0.1;
      (this as any).brainPointLight.color.setRGB(r, g, b);
    }
    
    // CREATIVE EFFECT 5: Particle system
    if (scrollProgress > 0.2 && !userData.particleSystem) {
      this.createEnhancedBrainParticleSystem(model, userData);
    }
    
    if (userData.particleSystem) {
      this.animateBrainParticles(userData.particleSystem, model, time, scrollProgress, 1 - scrollProgress);
    }
  }

  /**
   * Create enhanced particle system around brain with neural firing effect
   */
  private createEnhancedBrainParticleSystem(brainModel: any, userData: ModelUserData): void {
    console.log('✨ Creating enhanced brain particle system...');
    
    const THREE = window.THREE || (window as any).THREE;
    const particleCount = 80; // More particles for enhanced effect
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Create multiple layers of particles
      const layer = Math.floor(i / 20); // 4 layers of 20 particles each
      const baseRadius = 12 + layer * 8;
      const radius = baseRadius + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
      
      // Velocities for orbital motion
      velocities[i3] = (Math.random() - 0.5) * 0.1;
      velocities[i3 + 1] = (Math.random() - 0.5) * 0.1;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.1;
      
      // Enhanced brain-themed colors with different layers
      switch (layer) {
        case 0: // Inner core - bright cyan
          colors[i3] = 0.0;
          colors[i3 + 1] = 0.9 + Math.random() * 0.1;
          colors[i3 + 2] = 1.0;
          break;
        case 1: // Middle layer - electric blue
          colors[i3] = 0.2 + Math.random() * 0.3;
          colors[i3 + 1] = 0.5 + Math.random() * 0.3;
          colors[i3 + 2] = 1.0;
          break;
        case 2: // Outer layer - purple
          colors[i3] = 0.6 + Math.random() * 0.4;
          colors[i3 + 1] = 0.2 + Math.random() * 0.3;
          colors[i3 + 2] = 0.9 + Math.random() * 0.1;
          break;
        default: // Outermost - white neural sparks
          colors[i3] = 0.8 + Math.random() * 0.2;
          colors[i3 + 1] = 0.8 + Math.random() * 0.2;
          colors[i3 + 2] = 0.9 + Math.random() * 0.1;
      }
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.userData = { velocities }; // Store velocities for animation
    
    const material = new THREE.PointsMaterial({
      size: 1.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });
    
    userData.particleSystem = new THREE.Points(geometry, material);
    userData.particleSystem.position.copy(brainModel.position);
    this.scene.add(userData.particleSystem);
    
    console.log('✅ Enhanced brain particles created!');
  }

  /**
   * Animate brain particles with neural firing patterns
   */
  private animateBrainParticles(particleSystem: any, brainModel: any, time: number, peakProgress: number, fadeProgress: number): void {
    if (!particleSystem || !particleSystem.geometry) return;
    
    const positions = particleSystem.geometry.attributes.position.array;
    const colors = particleSystem.geometry.attributes.color.array;
    const velocities = particleSystem.geometry.userData.velocities;
    const particleCount = positions.length / 3;
    
    // Update particle system position to follow brain
    particleSystem.position.copy(brainModel.position);
    
    // Update individual particles
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Neural firing effect - particles pulse and move
      const neuralPulse = Math.sin(time * 5 + i * 0.1) * peakProgress;
      const orbitSpeed = 0.02 * (1 + peakProgress);
      
      // Orbital motion around brain center
      const currentRadius = Math.sqrt(
        positions[i3] * positions[i3] + 
        positions[i3 + 1] * positions[i3 + 1] + 
        positions[i3 + 2] * positions[i3 + 2]
      );
      
      // Add orbital rotation
      const angle = Math.atan2(positions[i3 + 1], positions[i3]);
      const newAngle = angle + orbitSpeed;
      
      positions[i3] = currentRadius * Math.cos(newAngle) + velocities[i3] * neuralPulse;
      positions[i3 + 1] = currentRadius * Math.sin(newAngle) + velocities[i3 + 1] * neuralPulse;
      positions[i3 + 2] += velocities[i3 + 2] * neuralPulse;
      
      // Neural firing color pulses
      const firingIntensity = Math.abs(Math.sin(time * 8 + i * 0.3)) * peakProgress;
      const layer = Math.floor(i / 20);
      
      // Enhance colors during neural firing
      switch (layer) {
        case 0: // Inner core flashes
          colors[i3 + 1] = 0.9 + firingIntensity * 0.1;
          colors[i3 + 2] = 1.0;
          break;
        case 1: // Middle layer electricity
          colors[i3] = 0.2 + firingIntensity * 0.5;
          colors[i3 + 1] = 0.5 + firingIntensity * 0.4;
          break;
        case 2: // Outer layer neural networks
          colors[i3] = 0.6 + firingIntensity * 0.3;
          colors[i3 + 1] = 0.2 + firingIntensity * 0.6;
          break;
        default: // Sparks
          const sparkIntensity = 0.8 + firingIntensity * 0.2;
          colors[i3] = sparkIntensity;
          colors[i3 + 1] = sparkIntensity;
          colors[i3 + 2] = sparkIntensity;
      }
    }
    
    // Fade out particles when brain fades
    if (fadeProgress > 0) {
      particleSystem.material.opacity = Math.max(0, 0.9 - fadeProgress * 1.2);
    }
    
    // Mark attributes as needing update
    particleSystem.geometry.attributes.position.needsUpdate = true;
    particleSystem.geometry.attributes.color.needsUpdate = true;
  }

  /**
   * Update camera position and rotation
   */
  private updateCamera(time: number, scrollProgress: number): void {
    // Enhanced camera movement with mouse following
    this.camera.position.x += (this.mouse.x * 3 - this.camera.position.x) * Config.ANIMATION_CONFIG.cameraFollowSpeed;
    this.camera.position.y += (-this.mouse.y * 3 - this.camera.position.y) * Config.ANIMATION_CONFIG.cameraFollowSpeed;
    
    // Add subtle camera sway
    this.camera.position.x += Math.sin(time * Config.ANIMATION_CONFIG.cameraSwaySpeed.x) * Config.ANIMATION_CONFIG.cameraSwayIntensity.x;
    this.camera.position.y += Math.cos(time * Config.ANIMATION_CONFIG.cameraSwaySpeed.y) * Config.ANIMATION_CONFIG.cameraSwayIntensity.y;
    
    // Scroll-based camera distance
    const targetZ = Config.CAMERA_CONFIG.initialZ + (scrollProgress * Config.ANIMATION_CONFIG.scrollCameraDistance);
    this.camera.position.z += (targetZ - this.camera.position.z) * Config.ANIMATION_CONFIG.scrollCameraSpeed;
    
    this.camera.lookAt(this.scene.position);
  }
}
