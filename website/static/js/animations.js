// Global GSAP Animations - Used across all marketing pages

(function() {
    'use strict';

    // Wait for GSAP to load
    function initGlobalAnimations() {
        // Register ScrollTrigger plugin
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            console.warn('GSAP or ScrollTrigger not loaded');
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        // ============================================
        // HERO SECTIONS
        // ============================================
        
        // Animate any hero section (welcome-hero, story-hero, pricing-hero, features-hero)
        const heroSelectors = ['.welcome-hero', '.story-hero', '.pricing-hero', '.features-hero'];
        heroSelectors.forEach(selector => {
            const hero = document.querySelector(selector);
            if (hero) {
                const heading = hero.querySelector('h1');
                const subtitle = hero.querySelector('.subtitle, p');
                const button = hero.querySelector('a, .button-style, .main-btn, .secondary-btn, .third-btn');

                if (heading) {
                    gsap.from(heading, {
                        opacity: 0,
                        y: 50,
                        duration: 1,
                        ease: 'power3.out'
                    });
                }

                if (subtitle) {
                    gsap.from(subtitle, {
                        opacity: 0,
                        y: 30,
                        duration: 1,
                        delay: 0.2,
                        ease: 'power3.out'
                    });
                }

                if (button) {
                    gsap.from(button, {
                        opacity: 0,
                        scale: 0.9,
                        duration: 0.6,
                        delay: 0.4,
                        ease: 'back.out(1.5)'
                    });
                }
            }
        });

        // ============================================
        // CONTENT BLOCKS (Our Story, Features)
        // ============================================
        
        gsap.utils.toArray('[data-animate]').forEach((block) => {
            gsap.from(block, {
                scrollTrigger: {
                    trigger: block,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                y: 60,
                duration: 0.8,
                ease: 'power3.out'
            });
        });

        // ============================================
        // FEATURE BLOCKS
        // ============================================
        
        gsap.utils.toArray('.feature-block').forEach((block) => {
            const content = block.querySelector('.feature-content');
            const icon = block.querySelector('.feature-icon');
            const heading = block.querySelector('h3');
            const text = block.querySelector('p');
            const badges = block.querySelectorAll('.spec-badge');

            if (content) {
                gsap.from(content, {
                    scrollTrigger: {
                        trigger: block,
                        start: 'top 80%',
                        toggleActions: 'play none none none'
                    },
                    opacity: 0,
                    y: 60,
                    duration: 0.8,
                    ease: 'power3.out'
                });
            }

            if (icon) {
                gsap.from(icon, {
                    scrollTrigger: {
                        trigger: block,
                        start: 'top 75%',
                        toggleActions: 'play none none none'
                    },
                    scale: 0,
                    rotation: -180,
                    duration: 0.6,
                    delay: 0.2,
                    ease: 'back.out(1.5)'
                });
            }

            if (heading) {
                gsap.from(heading, {
                    scrollTrigger: {
                        trigger: block,
                        start: 'top 75%',
                        toggleActions: 'play none none none'
                    },
                    opacity: 0,
                    x: -30,
                    duration: 0.6,
                    delay: 0.4,
                    ease: 'power2.out'
                });
            }

            if (text) {
                gsap.from(text, {
                    scrollTrigger: {
                        trigger: block,
                        start: 'top 75%',
                        toggleActions: 'play none none none'
                    },
                    opacity: 0,
                    x: -30,
                    duration: 0.6,
                    delay: 0.5,
                    ease: 'power2.out'
                });
            }

            if (badges.length > 0) {
                gsap.from(badges, {
                    scrollTrigger: {
                        trigger: block,
                        start: 'top 70%',
                        toggleActions: 'play none none none'
                    },
                    opacity: 0,
                    scale: 0.8,
                    y: 20,
                    duration: 0.4,
                    stagger: 0.1,
                    delay: 0.6,
                    ease: 'back.out(1.5)'
                });
            }
        });

        // ============================================
        // PRICING CARDS
        // ============================================
        
        const pricingCards = document.querySelectorAll('.pricing-card');
        if (pricingCards.length > 0) {
            gsap.from(pricingCards, {
                scrollTrigger: {
                    trigger: '.pricing-cards',
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                y: 60,
                scale: 0.95,
                duration: 0.8,
                stagger: 0.2,
                ease: 'back.out(1.2)'
            });

            // Popular badge animation
            const popularBadge = document.querySelector('.popular-badge');
            if (popularBadge) {
                gsap.from(popularBadge, {
                    scrollTrigger: {
                        trigger: '.pricing-cards',
                        start: 'top 75%',
                        toggleActions: 'play none none none'
                    },
                    opacity: 0,
                    scale: 0,
                    duration: 0.6,
                    delay: 0.5,
                    ease: 'elastic.out(1, 0.5)'
                });
            }

            // Feature items in pricing cards
            pricingCards.forEach((card) => {
                const features = card.querySelectorAll('.feature-item');
                if (features.length > 0) {
                    gsap.from(features, {
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 70%',
                            toggleActions: 'play none none none'
                        },
                        opacity: 0,
                        x: -20,
                        duration: 0.5,
                        stagger: 0.1,
                        delay: 0.3,
                        ease: 'power2.out'
                    });
                }
            });
        }

        // ============================================
        // VISUAL CARDS
        // ============================================
        
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

        // ============================================
        // PRINCIPLE ITEMS
        // ============================================
        
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

        // ============================================
        // FLOATING ICONS
        // ============================================
        
        gsap.utils.toArray('.floating-icon, .feature-icon').forEach((icon) => {
            gsap.to(icon, {
                y: -15,
                duration: 3,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true,
                delay: Math.random() * 0.5
            });
        });

        // ============================================
        // CTA SECTIONS
        // ============================================
        
        const ctaSections = ['.cta-section', '.features-cta', '.pricing-footer'];
        ctaSections.forEach(selector => {
            const cta = document.querySelector(selector);
            if (cta) {
                gsap.from(cta, {
                    scrollTrigger: {
                        trigger: cta,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    },
                    opacity: 0,
                    y: 50,
                    scale: 0.95,
                    duration: 1,
                    ease: 'power3.out'
                });

                const heading = cta.querySelector('h2');
                if (heading) {
                    gsap.from(heading, {
                        scrollTrigger: {
                            trigger: cta,
                            start: 'top 80%',
                            toggleActions: 'play none none none'
                        },
                        opacity: 0,
                        y: 30,
                        duration: 0.8,
                        delay: 0.2,
                        ease: 'power2.out'
                    });
                }

                const button = cta.querySelector('a, .button-style, .main-btn');
                if (button) {
                    gsap.from(button, {
                        scrollTrigger: {
                            trigger: cta,
                            start: 'top 80%',
                            toggleActions: 'play none none none'
                        },
                        opacity: 0,
                        scale: 0.9,
                        duration: 0.6,
                        delay: 0.4,
                        ease: 'back.out(1.5)'
                    });
                }
            }
        });

        // ============================================
        // WELCOME PAGE SPECIFIC
        // ============================================
        
        const welcomeImg = document.querySelector('.welcome-hero-img');
        if (welcomeImg) {
            gsap.from(welcomeImg, {
                opacity: 0,
                x: 100,
                scale: 0.9,
                duration: 1,
                delay: 0.5,
                ease: 'power3.out'
            });

            // Floating animation
            gsap.to(welcomeImg, {
                y: -15,
                duration: 3,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true,
                delay: 1
            });
        }

        const welcomeContent = document.querySelector('.welcome-content');
        if (welcomeContent) {
            // Parallax effect
            gsap.to(welcomeContent, {
                scrollTrigger: {
                    trigger: '.welcome-section',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1
                },
                y: 50,
                ease: 'none'
            });

            if (welcomeImg) {
                gsap.to(welcomeImg, {
                    scrollTrigger: {
                        trigger: '.welcome-section',
                        start: 'top top',
                        end: 'bottom top',
                        scrub: 1
                    },
                    y: -50,
                    ease: 'none'
                });
            }
        }

        // ============================================
        // BUTTON HOVER ENHANCEMENTS
        // ============================================
        
        const buttons = document.querySelectorAll('.main-btn, .secondary-btn, .third-btn, .plan-button');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                gsap.to(button, {
                    scale: 1.05,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            button.addEventListener('mouseleave', () => {
                gsap.to(button, {
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });
        });

        // ============================================
        // CARD HOVER EFFECTS (3D Tilt)
        // ============================================
        
        gsap.utils.toArray('.pricing-card, .feature-content').forEach((card) => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    rotationY: 2,
                    duration: 0.4,
                    ease: 'power2.out'
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    rotationY: 0,
                    duration: 0.4,
                    ease: 'power2.out'
                });
            });
        });

        // ============================================
        // PARALLAX EFFECTS
        // ============================================
        
        gsap.utils.toArray('.feature-content, .visual-card').forEach((card) => {
            gsap.to(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                },
                y: -30,
                ease: 'none'
            });
        });
    }

    // Initialize when DOM and GSAP are ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(initGlobalAnimations, 100);
        });
    } else {
        setTimeout(initGlobalAnimations, 100);
    }

})();