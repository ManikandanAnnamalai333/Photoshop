// Advanced Animation Utilities for LensCapture Photography Website

// Animation Controller Class
class AnimationController {
    constructor() {
        this.animations = new Map();
        this.observers = new Map();
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.init();
    }

    init() {
        this.setupReducedMotionListener();
        this.setupPerformanceOptimizations();
        this.createCustomAnimations();
    }

    setupReducedMotionListener() {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        mediaQuery.addListener((e) => {
            this.isReducedMotion = e.matches;
            this.toggleAnimations(!e.matches);
        });
    }

    setupPerformanceOptimizations() {
        // Add will-change property to animated elements
        $('.portfolio-item, .service-card, .testimonial-card, .hero-slide').addClass('gpu-accelerated');
        
        // Optimize scroll-based animations
        this.setupScrollOptimization();
    }

    setupScrollOptimization() {
        let ticking = false;
        const updateAnimations = () => {
            this.handleScrollAnimations();
            ticking = false;
        };

        $(window).on('scroll', () => {
            if (!ticking && !this.isReducedMotion) {
                requestAnimationFrame(updateAnimations);
                ticking = true;
            }
        });
    }

    handleScrollAnimations() {
        const scrollTop = $(window).scrollTop();
        const windowHeight = $(window).height();

        // Parallax effects
        this.updateParallaxElements(scrollTop);
        
        // Progress-based animations
        this.updateProgressAnimations(scrollTop);
    }

    updateParallaxElements(scrollTop) {
        // Hero parallax
        $('.hero-slider').css('transform', `translateY(${scrollTop * 0.5}px) scale(${1 + scrollTop * 0.0001})`);
        
        // Floating elements
        $('.floating-image').css('transform', `translateY(${scrollTop * 0.1}px) rotate(${scrollTop * 0.01}deg)`);
        
        // Background elements
        $('.particles-container').css('transform', `translateY(${scrollTop * 0.2}px)`);
    }

    updateProgressAnimations(scrollTop) {
        const docHeight = $(document).height() - $(window).height();
        const progress = Math.min(scrollTop / docHeight, 1);
        
        // Update gradient positions
        $('.gradient-bg').css('background-position', `${progress * 100}% 50%`);
        
        // Update transform-based animations
        document.documentElement.style.setProperty('--scroll-progress', progress);
    }

    createCustomAnimations() {
        this.createTextRevealAnimation();
        this.createMagneticEffects();
        this.createHoverEffects();
        this.createLoadingAnimations();
    }

    createTextRevealAnimation() {
        const textElements = $('.hero-title span');
        textElements.each((index, element) => {
            const $element = $(element);
            const delay = index * 300 + 1500;
            
            setTimeout(() => {
                if (!this.isReducedMotion) {
                    $element.css({
                        'animation': 'wordReveal 0.8s cubic-bezier(0.215, 0.610, 0.355, 1.000) forwards',
                        'animation-delay': '0ms'
                    });
                } else {
                    $element.css('opacity', '1');
                }
            }, delay);
        });
    }

    createMagneticEffects() {
        $('.magnetic-btn, .magnetic-hover').each((index, element) => {
            const $element = $(element);
            let bounds;

            $element.on('mouseenter', function() {
                bounds = this.getBoundingClientRect();
            });

            $element.on('mousemove', (e) => {
                if (!bounds || this.isReducedMotion) return;

                const x = e.clientX - bounds.left - bounds.width / 2;
                const y = e.clientY - bounds.top - bounds.height / 2;
                
                const strength = 0.3;
                const translateX = x * strength;
                const translateY = y * strength;

                $element.css('transform', `translate3d(${translateX}px, ${translateY}px, 0) scale(1.05)`);
            });

            $element.on('mouseleave', () => {
                $element.css('transform', 'translate3d(0, 0, 0) scale(1)');
            });
        });
    }

    createHoverEffects() {
        // Service cards advanced hover
        $('.service-card').each((index, element) => {
            const $element = $(element);
            
            $element.on('mouseenter', () => {
                if (this.isReducedMotion) return;
                
                $element.css({
                    'transform': 'translateY(-10px) rotateY(5deg)',
                    'box-shadow': '0 20px 60px rgba(0, 0, 0, 0.2)'
                });

                // Rotate icon
                $element.find('.rotating-hover').css('transform', 'rotate(360deg) scale(1.2)');
            });

            $element.on('mouseleave', () => {
                $element.css({
                    'transform': 'translateY(0) rotateY(0deg)',
                    'box-shadow': '0 10px 30px rgba(0, 0, 0, 0.1)'
                });

                $element.find('.rotating-hover').css('transform', 'rotate(0deg) scale(1)');
            });
        });

        // Portfolio items advanced hover
        $('.portfolio-item').each((index, element) => {
            const $element = $(element);
            const isEven = index % 2 === 0;
            
            $element.on('mouseenter', () => {
                if (this.isReducedMotion) return;
                
                const rotation = isEven ? '2deg' : '-2deg';
                $element.css('transform', `scale(1.05) rotate(${rotation})`);
                
                // Icon animation
                $element.find('.portfolio-icon').css({
                    'transform': 'scale(1) rotate(0deg)',
                    'opacity': '1'
                });
            });

            $element.on('mouseleave', () => {
                $element.css('transform', 'scale(1) rotate(0deg)');
                
                $element.find('.portfolio-icon').css({
                    'transform': 'scale(0) rotate(-180deg)',
                    'opacity': '0'
                });
            });
        });
    }

    createLoadingAnimations() {
        // Loading screen enhancements
        const $loadingScreen = $('#loading-screen');
        const $spinner = $('.loading-spinner');
        
        if (!this.isReducedMotion) {
            // Enhanced spinner
            $spinner.css('animation', 'spin 1s linear infinite, pulse 2s ease-in-out infinite alternate');
            
            // Stagger text animations
            $('.loading-title').css('animation', 'fadeInUp 0.8s ease 0.3s both');
            $('.loading-subtitle').css('animation', 'fadeInUp 0.8s ease 0.6s both');
        }
    }

    // Counter animation with easing
    animateCounter($element, target, duration = 2000, easing = 'easeOutExpo') {
        if (this.isReducedMotion) {
            $element.text(target + '+');
            return;
        }

        $({ counter: 0 }).animate({ counter: target }, {
            duration: duration,
            easing: easing,
            step: function() {
                $element.text(Math.floor(this.counter) + '+');
            },
            complete: function() {
                $element.text(target + '+');
            }
        });
    }

    // Advanced intersection observer
    createAdvancedObserver(elements, options = {}) {
        const defaultOptions = {
            threshold: [0, 0.25, 0.5, 0.75, 1],
            rootMargin: '0px 0px -50px 0px'
        };

        const observerOptions = { ...defaultOptions, ...options };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const $element = $(entry.target);
                const ratio = entry.intersectionRatio;

                if (entry.isIntersecting) {
                    this.triggerElementAnimation($element, ratio);
                }
            });
        }, observerOptions);

        elements.each((index, element) => {
            observer.observe(element);
        });

        return observer;
    }

    triggerElementAnimation($element, ratio) {
        if (this.isReducedMotion) {
            $element.css('opacity', '1');
            return;
        }

        const animationType = $element.data('animation') || 'fadeInUp';
        const delay = $element.data('delay') || 0;
        const duration = $element.data('duration') || 800;

        setTimeout(() => {
            $element.addClass('animate-' + animationType).addClass('animate');
        }, delay);
    }

    // Particle system
    createParticleSystem(container, options = {}) {
        const defaults = {
            particleCount: 50,
            particleSize: 4,
            colors: ['#ec4899', '#8b5cf6', '#3b82f6'],
            speed: 2,
            direction: 'up'
        };

        const config = { ...defaults, ...options };
        
        if (this.isReducedMotion) return;

        const createParticle = () => {
            const $particle = $('<div class="particle"></div>');
            const color = config.colors[Math.floor(Math.random() * config.colors.length)];
            const size = config.particleSize + Math.random() * 2;
            const startX = Math.random() * $(container).width();
            const duration = 3000 + Math.random() * 2000;

            $particle.css({
                position: 'absolute',
                width: size + 'px',
                height: size + 'px',
                backgroundColor: color,
                borderRadius: '50%',
                left: startX + 'px',
                bottom: '0px',
                opacity: 0.6,
                pointerEvents: 'none'
            });

            $(container).append($particle);

            // Animate particle
            $particle.animate({
                bottom: $(container).height() + 'px',
                left: startX + (Math.random() - 0.5) * 100 + 'px',
                opacity: 0
            }, duration, 'linear', () => {
                $particle.remove();
            });
        };

        // Create particles periodically
        const interval = setInterval(() => {
            if (document.hidden || this.isReducedMotion) return;
            createParticle();
        }, 200);

        return interval;
    }

    // Smooth reveal for images
    createImageReveal($images) {
        $images.each((index, image) => {
            const $image = $(image);
            const $wrapper = $('<div class="image-reveal-wrapper"></div>');
            
            $image.wrap($wrapper);
            $wrapper.css({
                overflow: 'hidden',
                position: 'relative'
            });

            const $overlay = $('<div class="reveal-overlay"></div>');
            $overlay.css({
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, #ec4899, transparent)',
                transform: 'translateX(-100%)',
                zIndex: 1
            });

            $wrapper.append($overlay);

            // Trigger reveal on intersection
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !this.isReducedMotion) {
                        $overlay.css({
                            animation: 'slideReveal 1.5s ease-out forwards'
                        });
                    }
                });
            }, { threshold: 0.1 });

            observer.observe($wrapper[0]);
        });
    }

    // Toggle all animations
    toggleAnimations(enable) {
        if (enable) {
            $('*').css('animation-play-state', 'running');
            $('.gpu-accelerated').addClass('smooth-transform');
        } else {
            $('*').css('animation-play-state', 'paused');
            $('.gpu-accelerated').removeClass('smooth-transform');
        }
    }

    // Clean up
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.animations.forEach(animation => {
            if (animation.pause) animation.pause();
        });
        
        $(window).off('scroll.animations');
        $('.magnetic-btn, .magnetic-hover').off('mousemove mouseleave');
    }
}

// Custom easing functions
$.extend($.easing, {
    easeInOutExpo: function(x, t, b, c, d) {
        if (t == 0) return b;
        if (t == d) return b + c;
        if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
    },
    easeOutExpo: function(x, t, b, c, d) {
        return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
    },
    easeInOutBack: function(x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
        return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
    }
});

// Additional CSS animations via JavaScript
const additionalCSS = `
    @keyframes slideReveal {
        0% { transform: translateX(-100%); }
        50% { transform: translateX(0%); }
        100% { transform: translateX(100%); }
    }
    
    @keyframes elasticIn {
        0% { transform: scale(0.3) rotate(-30deg); opacity: 0; }
        50% { transform: scale(1.05) rotate(-15deg); }
        70% { transform: scale(0.9) rotate(5deg); }
        100% { transform: scale(1) rotate(0deg); opacity: 1; }
    }
    
    @keyframes magneticPull {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1.05); }
    }
    
    .elastic-in { animation: elasticIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
    .magnetic-pull { animation: magneticPull 0.3s ease; }
`;

// Inject additional CSS
$('<style>').text(additionalCSS).appendTo('head');

// Initialize animation controller when DOM is ready
$(document).ready(function() {
    window.animationController = new AnimationController();
    
    // Setup advanced observers for different element types
    const $serviceCards = $('.service-card');
    const $portfolioItems = $('.portfolio-item');
    const $testimonialCards = $('.testimonial-card');
    const $statNumbers = $('.stat-number');
    const $images = $('img');
    
    // Create observers
    if ($serviceCards.length) {
        window.animationController.createAdvancedObserver($serviceCards, {
            threshold: 0.3
        });
    }
    
    if ($portfolioItems.length) {
        window.animationController.createAdvancedObserver($portfolioItems, {
            threshold: 0.2
        });
    }
    
    if ($testimonialCards.length) {
        window.animationController.createAdvancedObserver($testimonialCards, {
            threshold: 0.4
        });
    }
    
    // Setup counter animations
    $statNumbers.each(function() {
        const $this = $(this);
        const target = parseInt($this.data('target'));
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    window.animationController.animateCounter($this, target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(this);
    });
    
    // Setup image reveals
    window.animationController.createImageReveal($images);
    
    // Setup particle system
    const particleInterval = window.animationController.createParticleSystem('#particles-container', {
        particleCount: 30,
        colors: ['#ec4899', '#8b5cf6', '#3b82f6', '#10b981'],
        speed: 1.5
    });
    
    console.log('Advanced Animation Controller Initialized! 🎨✨');
});

// Clean up on page unload
$(window).on('beforeunload', function() {
    if (window.animationController) {
        window.animationController.destroy();
    }
});

// Export for global access
window.LensCaptureAnimations = {
    controller: () => window.animationController,
    createCustomAnimation: (element, keyframes, options) => {
        if (window.animationController && !window.animationController.isReducedMotion) {
            return element.animate(keyframes, options);
        }
        return null;
    }
};