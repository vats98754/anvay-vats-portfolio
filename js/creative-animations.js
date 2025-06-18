// Creative Frontend Animation System
class CreativeAnimations {
    constructor() {
        // Device detection for animation optimization
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                       window.innerWidth < 768;
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        this.init();
        this.setupIntersectionObserver();
        this.setupMouseParallax();
        this.setupScrollAnimations();
        this.setupPerformanceOptimizations();
    }

    init() {
        console.log('Creative Animations initialized');
        
        // Ensure main name is visible
        this.ensureNameVisibility();
        
        // Initialize typewriter effect
        this.initTypewriter();
        
        // Initialize parallax text effects
        this.initParallaxText();
        
        // Initialize skill bar animations
        this.initSkillBars();
    }

    setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    entry.target.classList.add('in-view');
                }
            });
        }, options);

        // Observe all animated elements except the main name
        const animatedElements = document.querySelectorAll('.fade-in-up:not(.main-name), .slide-in-left, .slide-in-right, .fade-in-scale');
        animatedElements.forEach(el => {
            el.style.animationPlayState = 'paused';
            observer.observe(el);
        });

        // Handle main name separately - always visible
        const mainName = document.querySelector('.main-name');
        if (mainName) {
            mainName.style.animationPlayState = 'running';
            mainName.classList.add('in-view');
        }
    }

    setupMouseParallax() {
        let mouseX = 0, mouseY = 0;
        let currentX = 0, currentY = 0;

        // Enhanced mouse tracking with more precise coordinates
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX - window.innerWidth / 2) / window.innerWidth;
            mouseY = (e.clientY - window.innerHeight / 2) / window.innerHeight;
            
            // Update CSS custom properties for global mouse position
            document.documentElement.style.setProperty('--mouse-x', e.clientX + 'px');
            document.documentElement.style.setProperty('--mouse-y', e.clientY + 'px');
            document.documentElement.style.setProperty('--mouse-x-norm', mouseX);
            document.documentElement.style.setProperty('--mouse-y-norm', mouseY);
        });

        const animateParallax = () => {
            // Smooth interpolation for natural movement
            currentX += (mouseX - currentX) * 0.08;
            currentY += (mouseY - currentY) * 0.08;

            // Enhanced parallax for text elements with varied speeds
            const parallaxElements = document.querySelectorAll('.parallax-text');
            parallaxElements.forEach((el, index) => {
                const factor = (index + 1) * 0.7;
                const intensity = 25; // Increased intensity
                el.style.transform = `translate(${currentX * factor * intensity}px, ${currentY * factor * intensity * 0.5}px)`;
            });

            // Enhanced floating elements with 3D transforms
            const floatingElements = document.querySelectorAll('.floating, .floating-1, .floating-2, .floating-3');
            floatingElements.forEach((el, index) => {
                const factor = (index % 4 + 1) * 0.3;
                const rotationX = currentY * factor * 5;
                const rotationY = currentX * factor * 5;
                const translateX = currentX * factor * 15;
                const translateY = currentY * factor * 8;
                
                el.style.transform = `translate(${translateX}px, ${translateY}px) rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
            });

            // Interactive elements that follow cursor more closely
            const interactiveElements = document.querySelectorAll('.mouse-follow');
            interactiveElements.forEach((el, index) => {
                const intensity = 40 + (index * 10);
                el.style.transform = `translate(${currentX * intensity}px, ${currentY * intensity * 0.6}px)`;
            });

            // Section headers with subtle mouse influence
            const sectionHeaders = document.querySelectorAll('.section-header');
            sectionHeaders.forEach((header, index) => {
                const subtleFactor = 0.1 + (index * 0.05);
                const currentTransform = header.style.transform || '';
                const scrollTransform = currentTransform.match(/translate3d\([^)]*\)/)?.[0] || '';
                
                header.style.transform = `${scrollTransform} rotateY(${currentX * subtleFactor * 3}deg) rotateX(${currentY * subtleFactor * 2}deg)`;
            });

            requestAnimationFrame(animateParallax);
        };

        animateParallax();
        
        // Add magnetic effect to buttons and interactive elements
        this.addMagneticEffect();
        
        // Add cursor trail effect
        this.addCursorTrail();
    }

    setupScrollAnimations() {
        let ticking = false;

        const updateOnScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Parallax effect for section headers
            const headers = document.querySelectorAll('.section-header');
            headers.forEach((header, index) => {
                const rate = scrollTop * -0.5;
                header.style.transform = `translate3d(0, ${rate}px, 0)`;
            });

            // Progressive reveal for content cards
            const cards = document.querySelectorAll('.content-card');
            cards.forEach((card, index) => {
                const rect = card.getBoundingClientRect();
                const windowHeight = window.innerHeight;
                
                if (rect.top < windowHeight * 0.8) {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }
            });

            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateOnScroll);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick);
    }

    initTypewriter() {
        const typewriterElements = document.querySelectorAll('.typewriter');
        
        typewriterElements.forEach((element, index) => {
            const text = element.textContent;
            element.textContent = '';
            
            setTimeout(() => {
                let i = 0;
                const typeInterval = setInterval(() => {
                    if (i < text.length) {
                        element.textContent += text.charAt(i);
                        i++;
                    } else {
                        clearInterval(typeInterval);
                    }
                }, 100);
            }, index * 500);
        });
    }

    initParallaxText() {
        const parallaxElements = document.querySelectorAll('.parallax-text');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach((element, index) => {
                const rate = scrolled * -0.1 * (index + 1);
                element.style.transform = `translate3d(0, ${rate}px, 0)`;
            });
        });
    }

    initSkillBars() {
        const skillBars = document.querySelectorAll('.progress-bar');
        
        const animateSkillBar = (bar) => {
            const value = bar.getAttribute('aria-valuenow');
            bar.style.width = '0%';
            
            setTimeout(() => {
                bar.style.width = value + '%';
            }, 500);
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateSkillBar(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        skillBars.forEach(bar => observer.observe(bar));
    }

    // Add glitch effect to text on hover
    addGlitchEffect() {
        const glitchElements = document.querySelectorAll('.glitch');
        
        glitchElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.animation = 'glitch 0.3s linear infinite';
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.animation = 'none';
            });
        });
    }

    // Add matrix rain effect
    addMatrixEffect() {
        const matrixElements = document.querySelectorAll('.matrix-bg');
        
        matrixElements.forEach(element => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.style.position = 'absolute';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.zIndex = '-1';
            canvas.style.opacity = '0.1';
            
            element.style.position = 'relative';
            element.appendChild(canvas);
            
            const resizeCanvas = () => {
                canvas.width = element.offsetWidth;
                canvas.height = element.offsetHeight;
            };
            
            resizeCanvas();
            window.addEventListener('resize', resizeCanvas);
            
            // Matrix animation logic
            const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
            const matrixArray = matrix.split("");
            
            const fontSize = 10;
            const columns = canvas.width / fontSize;
            const drops = [];
            
            for (let x = 0; x < columns; x++) {
                drops[x] = 1;
            }
            
            const draw = () => {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                ctx.fillStyle = '#0f0';
                ctx.font = fontSize + 'px monospace';
                
                for (let i = 0; i < drops.length; i++) {
                    const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
                    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                    
                    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                        drops[i] = 0;
                    }
                    drops[i]++;
                }
            };
            
            setInterval(draw, 35);
        });
    }

    setupPerformanceOptimizations() {
        // Disable complex animations on mobile or when reduced motion is preferred
        if (this.isMobile || this.reducedMotion) {
            console.log('📱 Applying mobile/accessibility optimizations');
            
            // Reduce animation frequencies
            const animatedElements = document.querySelectorAll('.parallax-text, .floating-1, .floating-2, .floating-3');
            animatedElements.forEach(el => {
                if (this.reducedMotion) {
                    el.style.animation = 'none';
                    el.style.transform = 'none';
                } else if (this.isMobile) {
                    // Slower, less intensive animations for mobile
                    const currentAnimation = window.getComputedStyle(el).animation;
                    if (currentAnimation && currentAnimation !== 'none') {
                        el.style.animationDuration = '8s';
                        el.style.animationTimingFunction = 'ease-in-out';
                    }
                }
            });
            
            // Simplify typewriter effect on mobile
            if (this.isMobile) {
                const typewriterElements = document.querySelectorAll('.typewriter');
                typewriterElements.forEach(el => {
                    el.style.animationDuration = '2s';
                });
            }
        }
        
        // Throttle scroll events for better performance
        this.throttledScrollHandler = this.throttle(this.handleScroll.bind(this), 16);
        window.addEventListener('scroll', this.throttledScrollHandler);
        
        // Debounce resize events
        this.debouncedResizeHandler = this.debounce(this.handleResize.bind(this), 250);
        window.addEventListener('resize', this.debouncedResizeHandler);
    }
    
    ensureNameVisibility() {
        // Force main name to be visible as a failsafe
        const mainName = document.querySelector('.main-name');
        if (mainName) {
            console.log('🎯 Ensuring main name visibility');
            
            // Force visible styles
            mainName.style.opacity = '1';
            mainName.style.transform = 'translateY(0)';
            mainName.style.visibility = 'visible';
            mainName.style.display = 'block';
            mainName.style.animationPlayState = 'running';
            
            // Double-check after a short delay
            setTimeout(() => {
                const computedStyle = window.getComputedStyle(mainName);
                if (computedStyle.opacity === '0' || computedStyle.visibility === 'hidden') {
                    console.log('⚠️ Name still not visible, forcing backup display');
                    const backupName = document.querySelector('.backup-name-display');
                    if (backupName) {
                        backupName.style.display = 'block';
                        backupName.style.opacity = '1';
                    }
                }
            }, 2000);
        }
    }
    
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    handleScroll() {
        if (this.isMobile || this.reducedMotion) return;
        
        // Optimized scroll handling for non-mobile devices
        const scrollY = window.pageYOffset;
        
        // Update parallax text elements
        const parallaxElements = document.querySelectorAll('.parallax-text');
        parallaxElements.forEach((el, index) => {
            const speed = 0.3 + (index * 0.1);
            const yPos = -(scrollY * speed);
            el.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
    }
    
    handleResize() {
        // Update mobile detection on resize
        this.isMobile = window.innerWidth < 768;
        this.setupPerformanceOptimizations();
    }

    // Add magnetic effect to buttons and interactive elements
    addMagneticEffect() {
        // Magnetic effect for buttons and interactive elements
        const magneticElements = document.querySelectorAll('.btn, .portfolio-item, .service-item, .nav-link');
        
        magneticElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            });
            
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const intensity = 0.3;
                element.style.transform = `translate(${x * intensity}px, ${y * intensity}px) scale(1.05)`;
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translate(0, 0) scale(1)';
                element.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            });
        });
    }

    addCursorTrail() {
        if (this.isMobile) return; // Skip cursor trail on mobile
        
        const trail = [];
        const trailLength = 8;
        
        // Create trail elements
        for (let i = 0; i < trailLength; i++) {
            const dot = document.createElement('div');
            dot.className = 'cursor-trail';
            dot.style.cssText = `
                position: fixed;
                width: ${8 - i}px;
                height: ${8 - i}px;
                background: radial-gradient(circle, rgba(0,255,136,${0.8 - i * 0.1}) 0%, rgba(0,136,255,${0.6 - i * 0.08}) 100%);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                mix-blend-mode: screen;
                transition: opacity 0.3s ease;
            `;
            document.body.appendChild(dot);
            trail.push({ element: dot, x: 0, y: 0 });
        }
        
        let mouseX = 0, mouseY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        const animateTrail = () => {
            let currentX = mouseX;
            let currentY = mouseY;
            
            trail.forEach((dot, index) => {
                dot.x += (currentX - dot.x) * 0.3;
                dot.y += (currentY - dot.y) * 0.3;
                
                dot.element.style.left = dot.x + 'px';
                dot.element.style.top = dot.y + 'px';
                
                currentX = dot.x;
                currentY = dot.y;
            });
            
            requestAnimationFrame(animateTrail);
        };
        
        animateTrail();
        
        // Hide/show trail based on cursor activity
        let hideTimeout;
        document.addEventListener('mousemove', () => {
            trail.forEach(dot => {
                dot.element.style.opacity = '1';
            });
            
            clearTimeout(hideTimeout);
            hideTimeout = setTimeout(() => {
                trail.forEach(dot => {
                    dot.element.style.opacity = '0';
                });
            }, 2000);
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CreativeAnimations();
});

// Add some creative hover effects
document.addEventListener('DOMContentLoaded', () => {
    // Enhanced button hover effects with ripple animation
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            btn.style.setProperty('--mouse-x', x + 'px');
            btn.style.setProperty('--mouse-y', y + 'px');
            
            // Add ripple effect
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                top: ${y}px;
                left: ${x}px;
                width: 0;
                height: 0;
                border-radius: 50%;
                background: rgba(255,255,255,0.3);
                transform: translate(-50%, -50%);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            btn.style.position = 'relative';
            btn.style.overflow = 'hidden';
            btn.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Enhanced creative list item interactions with stagger effect
    const listItems = document.querySelectorAll('.creative-list li, .list-group-item, .nav-item');
    listItems.forEach((item, index) => {
        item.addEventListener('mouseenter', () => {
            // Self animation
            item.style.transform = `translateX(15px) scale(1.08) rotateY(5deg)`;
            item.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            item.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
            
            // Stagger effect on siblings
            const siblings = Array.from(item.parentElement.children);
            siblings.forEach((sibling, siblingIndex) => {
                if (sibling !== item) {
                    const distance = Math.abs(siblingIndex - index);
                    const delay = distance * 50;
                    const intensity = Math.max(0, 1 - distance * 0.3);
                    
                    setTimeout(() => {
                        sibling.style.transform = `translateX(${5 * intensity}px) scale(${1 + 0.02 * intensity})`;
                        sibling.style.transition = 'all 0.3s ease';
                    }, delay);
                }
            });
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateX(0) scale(1) rotateY(0)';
            item.style.boxShadow = 'none';
            
            // Reset siblings
            const siblings = Array.from(item.parentElement.children);
            siblings.forEach((sibling) => {
                if (sibling !== item) {
                    sibling.style.transform = 'translateX(0) scale(1)';
                }
            });
        });
    });

    // Enhanced content card tilt effect with glow
    const cards = document.querySelectorAll('.content-card, .card, .portfolio-item');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 8; // Reduced intensity for subtlety
            const rotateY = (centerX - x) / 8;
            
            // Enhanced transform with glow effect
            card.style.transform = `
                perspective(1000px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg) 
                translateZ(20px) 
                scale(1.02)
            `;
            card.style.boxShadow = `
                0 20px 40px rgba(0,0,0,0.2), 
                0 0 20px rgba(0,255,136,0.1)
            `;
            card.style.transition = 'box-shadow 0.3s ease';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0) scale(1)';
            card.style.boxShadow = 'none';
            card.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });
    
    // Add interactive glow effect to section headers
    const sectionHeaders = document.querySelectorAll('.section-header, h1, h2, h3');
    sectionHeaders.forEach(header => {
        header.addEventListener('mouseenter', () => {
            header.style.textShadow = '0 0 20px rgba(0,255,136,0.5), 0 0 40px rgba(0,136,255,0.3)';
            header.style.transition = 'text-shadow 0.3s ease';
        });
        
        header.addEventListener('mouseleave', () => {
            header.style.textShadow = 'none';
        });
    });
    
    // Add breathing animation to important elements
    const breathingElements = document.querySelectorAll('.hero-title, .profile-img');
    breathingElements.forEach(element => {
        element.style.animation = 'breathe 4s ease-in-out infinite';
    });
});
