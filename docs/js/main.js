$(document).ready(function() {
    // Loading Screen
    setTimeout(function() {
        $('#loading-screen').fadeOut(500);
    }, 2000);

    // Variables
    let currentSlide = 0;
    const heroSlides = $('.hero-slide');
    const totalSlides = heroSlides.length;
    let isMenuOpen = false;
    let mouseX = 0;
    let mouseY = 0;
    
    // Custom Cursor
    $(document).mousemove(function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        $('#cursor').css({
            left: mouseX - 8,
            top: mouseY - 8
        });
        
        // Update CSS variables for magnetic effects
        document.documentElement.style.setProperty('--mouse-x', (mouseX / window.innerWidth - 0.5) * 20 + 'px');
        document.documentElement.style.setProperty('--mouse-y', (mouseY / window.innerHeight - 0.5) * 20 + 'px');
    });

    // Enhanced cursor effects for interactive elements
    $('a, button, .portfolio-item, .service-card, .testimonial-card, .contact-item').hover(
        function() {
            $('#cursor').css({
                width: '32px',
                height: '32px',
                marginLeft: '-16px',
                marginTop: '-16px',
                background: 'rgba(236, 72, 153, 0.8)',
                transform: 'scale(1.5)'
            });
        },
        function() {
            $('#cursor').css({
                width: '16px',
                height: '16px',
                marginLeft: '-8px',
                marginTop: '-8px',
                background: '#ec4899',
                transform: 'scale(1)'
            });
        }
    );

    // Mobile Navigation
    $('.nav-toggle').click(function() {
        isMenuOpen = !isMenuOpen;
        $('#mobile-menu').toggleClass('active');
        
        if (isMenuOpen) {
            $(this).html('<i class="fas fa-times"></i>');
        } else {
            $(this).html('<i class="fas fa-bars"></i>');
        }
    });

    // Close mobile menu when clicking links
    $('.mobile-nav-link, .nav-link').click(function() {
        isMenuOpen = false;
        $('#mobile-menu').removeClass('active');
        $('.nav-toggle').html('<i class="fas fa-bars"></i>');
    });

    // Hero Slider
    function nextSlide() {
        heroSlides.eq(currentSlide).removeClass('active');
        currentSlide = (currentSlide + 1) % totalSlides;
        heroSlides.eq(currentSlide).addClass('active');
    }

    // Auto-advance slides
    setInterval(nextSlide, 5000);

    // Smooth Scrolling
    function scrollToSection(sectionId) {
        const target = $('#' + sectionId);
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 70
            }, 800, 'easeInOutCubic');
        }
    }

    // Navigation link clicks
    $('.nav-link, .mobile-nav-link').click(function(e) {
        e.preventDefault();
        const href = $(this).attr('href');
        const sectionId = href.replace('#', '');
        scrollToSection(sectionId);
    });

    // Global scroll to section function
    window.scrollToSection = scrollToSection;

    // Parallax Effect
    $(window).scroll(function() {
        const scrolled = $(this).scrollTop();
        const rate = scrolled * -0.5;
        
        $('.hero-slider').css('transform', 'translateY(' + rate + 'px)');
        
        // Update CSS variable for parallax
        document.documentElement.style.setProperty('--scroll-y', scrolled * 0.5 + 'px');
    });

    // Navbar Hide/Show on Scroll
    let lastScrollTop = 0;
    $(window).scroll(function() {
        const scrollTop = $(this).scrollTop();
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            $('#navbar').css('transform', 'translateY(-100%)');
        } else {
            // Scrolling up
            $('#navbar').css('transform', 'translateY(0)');
        }
        
        lastScrollTop = scrollTop;
    });

    // Intersection Observer for Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const element = $(entry.target);
                
                // Add animation classes based on element type
                if (element.hasClass('service-card')) {
                    element.addClass('animate-scale');
                    setTimeout(function() {
                        element.addClass('animate');
                    }, element.index() * 200);
                } else if (element.hasClass('portfolio-item')) {
                    element.addClass('animate-zoom-rotate');
                    setTimeout(function() {
                        element.addClass('animate');
                    }, element.index() * 100);
                } else if (element.hasClass('testimonial-card')) {
                    element.addClass('animate-flip-x');
                    setTimeout(function() {
                        element.addClass('animate');
                    }, element.index() * 200);
                } else if (element.hasClass('about-text')) {
                    element.addClass('animate-slide-left');
                    setTimeout(function() {
                        element.addClass('animate');
                    }, 100);
                } else if (element.hasClass('about-image')) {
                    element.addClass('animate-slide-right');
                    setTimeout(function() {
                        element.addClass('animate');
                    }, 300);
                } else if (element.hasClass('contact-form-container')) {
                    element.addClass('animate-slide-left');
                    setTimeout(function() {
                        element.addClass('animate');
                    }, 100);
                } else if (element.hasClass('contact-info')) {
                    element.addClass('animate-slide-right');
                    setTimeout(function() {
                        element.addClass('animate');
                    }, 300);
                } else {
                    element.addClass('animate-on-scroll');
                    setTimeout(function() {
                        element.addClass('animate');
                    }, 100);
                }
                
                // Animate stars for testimonials
                if (element.hasClass('testimonial-card')) {
                    element.find('.star-animate').each(function(index) {
                        const star = $(this);
                        setTimeout(function() {
                            star.css('animation-play-state', 'running');
                        }, index * 100);
                    });
                }
                
                // Animate counters
                if (element.hasClass('stat-number')) {
                    animateCounter(element);
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    $('.service-card, .portfolio-item, .testimonial-card, .about-text, .about-image, .contact-form-container, .contact-info, .section-header, .stat-number').each(function() {
        observer.observe(this);
    });

    // Counter Animation
    function animateCounter(element) {
        const target = parseInt(element.data('target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(function() {
            current += increment;
            if (current >= target) {
                element.text(target + '+');
                clearInterval(timer);
            } else {
                element.text(Math.floor(current) + '+');
            }
        }, 16);
    }

    // Portfolio Lightbox
    $('.portfolio-item').click(function() {
        const imageSrc = $(this).data('image');
        $('#lightbox-image').attr('src', imageSrc);
        $('#lightbox').fadeIn(300);
        $('body').css('overflow', 'hidden');
    });

    $('#lightbox, .lightbox-close').click(function() {
        $('#lightbox').fadeOut(300);
        $('body').css('overflow', 'auto');
    });

    // Prevent lightbox close when clicking on image
    $('.lightbox-content img').click(function(e) {
        e.stopPropagation();
    });

    // Magnetic Button Effects
    $('.magnetic-btn, .magnetic-hover').each(function() {
        const button = $(this);
        
        button.mousemove(function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            $(this).css('transform', `translate(${x * 0.2}px, ${y * 0.2}px) scale(1.05)`);
        });
        
        button.mouseleave(function() {
            $(this).css('transform', 'translate(0px, 0px) scale(1)');
        });
    });

    // Enhanced Form Interactions
    $('.magnetic-input').focus(function() {
        $(this).parent().addClass('focused');
    }).blur(function() {
        $(this).parent().removeClass('focused');
    });

    // Contact Form Submission
    $('#contact-form').submit(function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            firstName: $('#firstName').val(),
            lastName: $('#lastName').val(),
            email: $('#email').val(),
            eventType: $('#eventType').val(),
            message: $('#message').val()
        };
        
        // Simple validation
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Simulate form submission
        const submitBtn = $('.submit-btn');
        const originalText = submitBtn.find('.btn-text').text();
        
        submitBtn.find('.btn-text').text('Sending...');
        submitBtn.prop('disabled', true);
        
        setTimeout(function() {
            submitBtn.find('.btn-text').text('Message Sent!');
            setTimeout(function() {
                submitBtn.find('.btn-text').text(originalText);
                submitBtn.prop('disabled', false);
                $('#contact-form')[0].reset();
            }, 2000);
        }, 1500);
    });

    // Create Floating Particles
    function createParticle() {
        const particle = $('<div class="particle"></div>');
        const startX = Math.random() * window.innerWidth;
        const randomX = (Math.random() - 0.5) * 100;
        
        particle.css({
            left: startX + 'px',
            bottom: '0px',
            '--random-x': randomX + 'px'
        });
        
        $('#particles-container').append(particle);
        
        // Remove particle after animation
        setTimeout(function() {
            particle.remove();
        }, 4000);
    }

    // Generate particles periodically
    setInterval(createParticle, 200);

    // Service Card Hover Effects
    $('.service-card').hover(
        function() {
            $(this).addClass('hover-lift');
            $(this).find('.rotating-hover').addClass('hover-rotate');
        },
        function() {
            $(this).removeClass('hover-lift');
            $(this).find('.rotating-hover').removeClass('hover-rotate');
        }
    );

    // Portfolio Item Hover Effects
    $('.portfolio-item').hover(
        function() {
            $(this).addClass('hover-tilt');
        },
        function() {
            $(this).removeClass('hover-tilt');
        }
    );

    // Testimonial Card Hover Effects
    $('.testimonial-card').hover(
        function() {
            $(this).addClass('hover-lift');
        },
        function() {
            $(this).removeClass('hover-lift');
        }
    );

    // Enhanced Scroll Animations
    function handleScroll() {
        const scrollTop = $(window).scrollTop();
        const windowHeight = $(window).height();
        
        // Parallax effects for different elements
        $('.floating-image').css('transform', `translateY(${scrollTop * 0.1}px)`);
        $('.gradient-title').css('background-position', `${scrollTop * 0.5}px center`);
        
        // Advanced parallax for hero content
        $('.hero-content').css('transform', `translateY(${scrollTop * 0.3}px) scale(${1 + scrollTop * 0.0001})`);
    }

    $(window).scroll(handleScroll);

    // Loading animations for images
    $('img').each(function() {
        $(this).addClass('loading');
        
        $(this).on('load', function() {
            $(this).removeClass('loading');
        });
    });

    // Keyboard Navigation
    $(document).keydown(function(e) {
        // ESC key to close lightbox
        if (e.keyCode === 27 && $('#lightbox').is(':visible')) {
            $('#lightbox').fadeOut(300);
            $('body').css('overflow', 'auto');
        }
        
        // Arrow keys for hero slider
        if (e.keyCode === 37) { // Left arrow
            // Previous slide logic could be added here
        } else if (e.keyCode === 39) { // Right arrow
            nextSlide();
        }
    });

    // Performance optimization: throttle scroll events
    let ticking = false;
    
    function updateScrollEffects() {
        handleScroll();
        ticking = false;
    }
    
    $(window).scroll(function() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    });

    // Resize handler for responsive adjustments
    $(window).resize(function() {
        // Adjust particles container
        const particles = $('.particle');
        particles.each(function() {
            if ($(this).position().left > window.innerWidth) {
                $(this).remove();
            }
        });
        
        // Recalculate any position-dependent elements
        if (window.innerWidth <= 768) {
            $('.nav-menu').hide();
        } else {
            $('.nav-menu').show();
            $('#mobile-menu').removeClass('active');
            isMenuOpen = false;
            $('.nav-toggle').html('<i class="fas fa-bars"></i>');
        }
    });

    // Initialize AOS-like functionality for scroll animations
    function initScrollAnimations() {
        $('.animate-on-scroll, .animate-slide-left, .animate-slide-right, .animate-scale, .animate-flip-x, .animate-flip-y, .animate-zoom-rotate').each(function() {
            observer.observe(this);
        });
    }

    initScrollAnimations();

    // Enhanced hover effects for navigation
    $('.nav-link').hover(
        function() {
            $(this).addClass('hover-bounce');
        },
        function() {
            $(this).removeClass('hover-bounce');
        }
    );

    // Footer link animations
    $('.footer-link').hover(
        function() {
            $(this).addClass('hover-grow');
        },
        function() {
            $(this).removeClass('hover-grow');
        }
    );

    // Add smooth easing function
    $.easing.easeInOutCubic = function(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t + 2) + b;
    };

    // Initialize enhanced cursor tracking
    function initEnhancedCursor() {
        let cursorDot = $('#cursor');
        let cursorTimeout;
        
        $(document).mousemove(function() {
            clearTimeout(cursorTimeout);
            cursorDot.addClass('active');
            
            cursorTimeout = setTimeout(function() {
                cursorDot.removeClass('active');
            }, 100);
        });
    }

    initEnhancedCursor();

    // Add scroll progress indicator
    function updateScrollProgress() {
        const scrollTop = $(window).scrollTop();
        const docHeight = $(document).height() - $(window).height();
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        // You could add a progress bar here
        document.documentElement.style.setProperty('--scroll-progress', scrollPercent + '%');
    }

    $(window).scroll(updateScrollProgress);

    console.log('LensCapture Photography Website Loaded Successfully! 📸✨');
});

// Additional utility functions
function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Export functions for global access
window.LensCapture = {
    scrollToSection: function(sectionId) {
        const target = $('#' + sectionId);
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 70
            }, 800, 'easeInOutCubic');
        }
    },
    debounce: debounce,
    throttle: throttle
};