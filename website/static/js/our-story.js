// Our Story Page - GSAP Animations

(function() {
    'use strict';

    // Wait for GSAP and ScrollTrigger to load
    function initAnimations() {
        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);

        // Hero Animation
        gsap.from('.story-hero', {
            opacity: 0,
            y: 40,
            duration: 1,
            ease: 'power3.out'
        });

        // Content Blocks Animation
        gsap.utils.toArray('.content-block').forEach((block, index) => {
            gsap.from(block, {
                scrollTrigger: {
                    trigger: block,
                    start: 'top 80%',
                    end: 'top 20%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                y: 60,
                duration: 0.8,
                ease: 'power3.out'
            });
        });

        // Principle Items Stagger Animation
        gsap.utils.toArray('.content-block').forEach((block) => {
            const principles = block.querySelectorAll('.principle-item');
            
            if (principles.length > 0) {
                gsap.from(principles, {
                    scrollTrigger: {
                        trigger: block,
                        start: 'top 70%',
                        toggleActions: 'play none none none'
                    },
                    opacity: 0,
                    x: -30,
                    duration: 0.6,
                    stagger: 0.2,
                    ease: 'power2.out'
                });
            }
        });

        // Visual Cards Hover Effect Enhancement
        gsap.utils.toArray('.visual-card').forEach((card) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 75%',
                    toggleActions: 'play none none none'
                },
                scale: 0.9,
                opacity: 0,
                duration: 0.6,
                ease: 'back.out(1.2)'
            });
        });

        // Floating Icons Animation
        gsap.utils.toArray('.floating-icon').forEach((icon) => {
            gsap.to(icon, {
                y: -20,
                duration: 3,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true
            });
        });

        // CTA Section Animation
        gsap.from('.cta-section', {
            scrollTrigger: {
                trigger: '.cta-section',
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 50,
            scale: 0.95,
            duration: 1,
            ease: 'power3.out'
        });

        // Button Pulse Effect on CTA
        const ctaButton = document.querySelector('.cta-section .button-style');
        if (ctaButton) {
            gsap.to(ctaButton, {
                scrollTrigger: {
                    trigger: '.cta-section',
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                scale: 1.05,
                duration: 0.4,
                ease: 'power2.out',
                yoyo: true,
                repeat: 1
            });
        }
    }

    // Initialize when DOM and GSAP are ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            // Small delay to ensure GSAP is loaded
            setTimeout(initAnimations, 100);
        });
    } else {
        setTimeout(initAnimations, 100);
    }

})();