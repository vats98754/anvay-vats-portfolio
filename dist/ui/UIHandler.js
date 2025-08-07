import { Utils } from '../utils/Utils.js';
/**
 * Handles all UI interactions and animations
 */
export class UIHandler {
    constructor() {
        this.initializeJQueryComponents();
        this.setupEnhancedInteractions();
    }
    static getInstance() {
        if (!UIHandler.instance) {
            UIHandler.instance = new UIHandler();
        }
        return UIHandler.instance;
    }
    /**
     * Initialize all jQuery-based components (keeping original behavior)
     */
    initializeJQueryComponents() {
        const $ = window.$;
        if (!$) {
            console.error('jQuery not available');
            return;
        }
        // Navbar on scrolling
        $(window).scroll(() => {
            if ($(window).scrollTop() > 200) {
                $('.navbar').fadeIn('slow').css('display', 'flex');
            }
            else {
                $('.navbar').fadeOut('slow').css('display', 'none');
            }
        });
        // Smooth scrolling on the navbar links
        $(".navbar-nav a").on('click', (event) => {
            const element = event.currentTarget;
            if (element.hash !== "") {
                event.preventDefault();
                $('html, body').animate({
                    scrollTop: $(element.hash).offset().top - 45
                }, 1500, 'easeInOutExpo');
                if ($(element).parents('.navbar-nav').length) {
                    $('.navbar-nav .active').removeClass('active');
                    $(element).closest('a').addClass('active');
                }
            }
        });
        // Typed Initiate
        if ($('.typed-text-output').length == 1) {
            const typed_strings = $('.typed-text').text();
            new window.Typed('.typed-text-output', {
                strings: typed_strings.split(', '),
                typeSpeed: 100,
                backSpeed: 20,
                smartBackspace: false,
                loop: true
            });
        }
        // Modal Video
        $(document).ready(() => {
            let $videoSrc;
            $('.btn-play').click((event) => {
                $videoSrc = $(event.currentTarget).data("src");
            });
            $('#videoModal').on('shown.bs.modal', () => {
                $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
            });
            $('#videoModal').on('hide.bs.modal', () => {
                $("#video").attr('src', $videoSrc);
            });
        });
        // Scroll to Bottom
        $(window).scroll(() => {
            if ($(window).scrollTop() > 100) {
                $('.scroll-to-bottom').fadeOut('slow');
            }
            else {
                $('.scroll-to-bottom').fadeIn('slow');
            }
        });
        // Skills
        $('.skill').waypoint(function () {
            $('.progress .progress-bar').each((index, element) => {
                $(element).css("width", $(element).attr("aria-valuenow") + '%');
            });
        }, { offset: '80%' });
        // Portfolio isotope and filter
        const portfolioIsotope = $('.portfolio-container').isotope({
            itemSelector: '.portfolio-item',
            layoutMode: 'fitRows'
        });
        $('#portfolio-flters li').on('click', (event) => {
            $("#portfolio-flters li").removeClass('active');
            $(event.currentTarget).addClass('active');
            portfolioIsotope.isotope({ filter: $(event.currentTarget).data('filter') });
        });
        // Back to top button
        $(window).scroll(() => {
            if ($(window).scrollTop() > 200) {
                $('.back-to-top').fadeIn('slow');
            }
            else {
                $('.back-to-top').fadeOut('slow');
            }
        });
        $('.back-to-top').click(() => {
            $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
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
    }
    /**
     * Setup enhanced interactions
     */
    setupEnhancedInteractions() {
        this.createInteractiveCursor();
        this.createScrollIndicator();
        this.enhanceSectionCards();
        this.enhanceNameInteraction();
        this.setupSmoothScrolling();
    }
    /**
     * Create interactive cursor
     */
    createInteractiveCursor() {
        if (Utils.clamp(window.innerWidth, 0, 768) === 768)
            return; // Skip on mobile
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.style.cssText = `
      position: fixed;
      width: 20px;
      height: 20px;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      mix-blend-mode: difference;
      transition: transform 0.1s ease;
    `;
        document.body.appendChild(cursor);
        const trail = [];
        const trailLength = 10;
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX - 10 + 'px';
            cursor.style.top = e.clientY - 10 + 'px';
            // Add trail effect
            trail.push({ x: e.clientX, y: e.clientY });
            if (trail.length > trailLength) {
                trail.shift();
            }
            // Update trail particles
            this.updateCursorTrail(trail);
        });
        // Cursor hover effects
        document.addEventListener('mouseenter', (e) => {
            const target = e.target;
            if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.classList.contains('clickable')) {
                cursor.style.transform = 'scale(1.5)';
                cursor.style.background = 'rgba(0, 255, 150, 0.8)';
            }
        }, true);
        document.addEventListener('mouseleave', (e) => {
            const target = e.target;
            if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.classList.contains('clickable')) {
                cursor.style.transform = 'scale(1)';
                cursor.style.background = 'rgba(255, 255, 255, 0.8)';
            }
        }, true);
    }
    /**
     * Update cursor trail
     */
    updateCursorTrail(trail) {
        // Remove old trail particles
        document.querySelectorAll('.cursor-trail').forEach(el => el.remove());
        // Create new trail particles
        trail.forEach((point, index) => {
            const particle = document.createElement('div');
            particle.className = 'cursor-trail';
            const opacity = (index + 1) / trail.length * 0.5;
            const size = (index + 1) / trail.length * 8;
            particle.style.cssText = `
        position: fixed;
        left: ${point.x - size / 2}px;
        top: ${point.y - size / 2}px;
        width: ${size}px;
        height: ${size}px;
        background: rgba(255, 255, 255, ${opacity});
        border-radius: 50%;
        pointer-events: none;
        z-index: 9998;
      `;
            document.body.appendChild(particle);
            // Remove after animation
            setTimeout(() => particle.remove(), 100);
        });
    }
    /**
     * Create scroll indicator
     */
    createScrollIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'scroll-indicator';
        indicator.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 0%;
      height: 4px;
      background: linear-gradient(90deg, #00ff88, #00aaff, #aa00ff);
      z-index: 10000;
      transition: width 0.1s ease;
    `;
        document.body.appendChild(indicator);
        const updateIndicator = Utils.debounce(() => {
            const progress = Utils.getScrollProgress() * 100;
            indicator.style.width = progress + '%';
        }, 10);
        window.addEventListener('scroll', updateIndicator);
    }
    /**
     * Enhance section cards with hover effects
     */
    enhanceSectionCards() {
        const sections = document.querySelectorAll('.section-card, .card, .portfolio-item');
        sections.forEach(section => {
            const element = section;
            element.addEventListener('mouseenter', () => {
                element.style.transform = 'translateY(-10px) scale(1.02)';
                element.style.boxShadow = '0 20px 40px rgba(0, 255, 150, 0.3)';
                element.style.transition = 'all 0.3s ease';
                // Add particle burst effect
                this.createParticleBurst(element);
            });
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translateY(0) scale(1)';
                element.style.boxShadow = '';
            });
        });
    }
    /**
     * Create particle burst effect
     */
    createParticleBurst(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
        position: fixed;
        left: ${centerX}px;
        top: ${centerY}px;
        width: 4px;
        height: 4px;
        background: #00ff88;
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
            const animateParticle = () => {
                posX += vx * 0.02;
                posY += vy * 0.02;
                opacity -= 0.02;
                particle.style.transform = `translate(${posX}px, ${posY}px)`;
                particle.style.opacity = opacity.toString();
                if (opacity > 0) {
                    requestAnimationFrame(animateParticle);
                }
                else {
                    particle.remove();
                }
            };
            animateParticle();
        }
    }
    /**
     * Enhanced name interaction
     */
    enhanceNameInteraction() {
        const nameElement = document.querySelector('.display-3');
        if (!nameElement)
            return;
        nameElement.addEventListener('click', () => {
            // Create rainbow text effect
            const text = nameElement.textContent || '';
            const colors = ['#ff0000', '#ff8000', '#ffff00', '#80ff00', '#00ff00', '#00ff80', '#00ffff', '#0080ff', '#0000ff', '#8000ff', '#ff00ff', '#ff0080'];
            nameElement.innerHTML = text.split('').map((char, index) => `<span style="color: ${colors[index % colors.length]}; transition: color 0.5s ease; display: inline-block;">${char}</span>`).join('');
            // Reset after animation
            setTimeout(() => {
                nameElement.innerHTML = text;
            }, 2000);
        });
        // Add floating letters effect on hover
        nameElement.addEventListener('mouseenter', () => {
            const letters = nameElement.querySelectorAll('span');
            letters.forEach((letter, index) => {
                const element = letter;
                setTimeout(() => {
                    element.style.transform = `translateY(${Utils.randomFloat(-5, 5)}px) rotate(${Utils.randomFloat(-5, 5)}deg)`;
                }, index * 50);
            });
        });
        nameElement.addEventListener('mouseleave', () => {
            const letters = nameElement.querySelectorAll('span');
            letters.forEach(letter => {
                const element = letter;
                element.style.transform = 'translateY(0) rotate(0deg)';
            });
        });
    }
    /**
     * Setup smooth scrolling for anchor links
     */
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const href = anchor.getAttribute('href');
                if (!href)
                    return;
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    /**
     * Initialize all UI components
     */
    static initialize() {
        UIHandler.getInstance();
    }
}
UIHandler.instance = null;
