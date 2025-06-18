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

// Simple Three.js Background - Minimal Implementation
class Portfolio3D {
    constructor() {
        console.log('🎨 Portfolio3D constructor called');
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.testCube = null;
        
        this.init();
        this.animate();
    }

    init() {
        console.log('🎨 Initializing Three.js...');
        
        // Update debug info
        const updateDebugInfo = (type, message) => {
            const element = document.getElementById(`${type}-status`);
            if (element) element.textContent = `${type}: ${message}`;
        };
        
        updateDebugInfo('threejs', 'Initializing...');
        
        try {
            // Scene setup
            this.scene = new THREE.Scene();
            console.log('✅ Scene created');
            updateDebugInfo('threejs', 'Scene created');
            
            // Camera setup
            this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            this.camera.position.z = 8;
            console.log('✅ Camera created');
            
            // Get canvas
            const canvas = document.getElementById('threejs-canvas');
            if (!canvas) {
                throw new Error('Canvas not found!');
            }
            
            updateDebugInfo('canvas', 'Found and using');
            
            // Renderer setup
            this.renderer = new THREE.WebGLRenderer({ 
                canvas: canvas,
                alpha: true,
                antialias: true
            });
            
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.setClearColor(0x000011, 0.2); // Dark blue with transparency
            
            console.log('✅ Renderer created');
            updateDebugInfo('renderer', 'WebGL initialized');
            
            // Create a big, obvious test cube
            const geometry = new THREE.BoxGeometry(4, 4, 4);
            const material = new THREE.MeshBasicMaterial({ 
                color: 0xff0000,
                wireframe: true
            });
            this.testCube = new THREE.Mesh(geometry, material);
            this.testCube.position.set(0, 0, 0);
            this.scene.add(this.testCube);
            
            console.log('✅ Red test cube added');
            updateDebugInfo('threejs', 'Test cube added');
            
            // Force immediate render
            this.renderer.render(this.scene, this.camera);
            console.log('✅ Initial render completed');
            updateDebugInfo('threejs', 'Rendering active');
            
        } catch (error) {
            console.error('❌ Portfolio3D init error:', error);
            updateDebugInfo('threejs', 'ERROR: ' + error.message);
        }
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (this.testCube) {
            this.testCube.rotation.x += 0.02;
            this.testCube.rotation.y += 0.02;
        }
        
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }
}

// Initialize Three.js when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM loaded, checking Three.js...');
    
    // Update debug info
    const updateDebugInfo = (type, message) => {
        const element = document.getElementById(`${type}-status`);
        if (element) element.textContent = `${type}: ${message}`;
    };
    
    updateDebugInfo('canvas', document.getElementById('threejs-canvas') ? 'Found' : 'NOT FOUND');
    updateDebugInfo('threejs', typeof THREE !== 'undefined' ? 'Loaded' : 'Not loaded');
    
    if (typeof THREE !== 'undefined') {
        console.log('✅ THREE.js available, version:', THREE.REVISION);
        
        try {
            new Portfolio3D();
            console.log('✅ Portfolio3D initialized successfully');
        } catch (error) {
            console.error('❌ Failed to create Portfolio3D:', error);
            updateDebugInfo('threejs', 'Failed: ' + error.message);
        }
    } else {
        console.error('❌ THREE.js not loaded');
        updateDebugInfo('threejs', 'Not loaded!');
    }
});
