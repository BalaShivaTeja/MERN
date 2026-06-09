/**
 * ============================================
 * BALA SHIVA TEJA KANDIMALLA - PORTFOLIO JS
 * Modern Interactions & Animations | 2026
 * ============================================
 */

(function() {
    'use strict';

    // ===== CONFIGURATION =====
    const CONFIG = {
        particleCount: 30,
        particleMinSize: 2,
        particleMaxSize: 6,
        scrollOffset: 80,
        revealThreshold: 0.1,
        typingSpeed: 100,
        typingDelay: 500,
    };

    // ===== DOM CACHE =====
    const DOM = {
        navbar: document.getElementById('navbar'),
        particles: document.getElementById('particles'),
        mobileMenuBtn: document.querySelector('.mobile-menu-btn'),
        mobileNavMenu: document.querySelector('.mobile-nav-menu'),
        mobileNavOverlay: document.querySelector('.mobile-nav-overlay'),
        mobileNavClose: document.querySelector('.mobile-nav-close'),
        navLinks: document.querySelectorAll('.nav-links a'),
        revealElements: document.querySelectorAll('.reveal'),
        heroBadge: document.querySelector('.hero-badge'),
        heroTitle: document.querySelector('.hero h1'),
        statNumbers: document.querySelectorAll('.stat-number'),
        timelineCards: document.querySelectorAll('.timeline-card'),
        skillItems: document.querySelectorAll('.skill-item'),
    };

    // ===== UTILITIES =====
    const utils = {
        /**
         * Debounce function execution
         */
        debounce: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        /**
         * Throttle function execution
         */
        throttle: function(func, limit) {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },

        /**
         * Check if element is in viewport
         */
        isInViewport: function(element, threshold = 0) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top <= (window.innerHeight || document.documentElement.clientHeight) * (1 - threshold) &&
                rect.bottom >= 0
            );
        },

        /**
         * Animate number counting
         */
        animateNumber: function(element, target, duration = 2000) {
            const start = 0;
            const startTime = performance.now();
            const isFloat = target % 1 !== 0;

            const update = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Easing function: easeOutExpo
                const easeOut = 1 - Math.pow(2, -10 * progress);
                const current = start + (target - start) * easeOut;

                if (isFloat) {
                    element.textContent = current.toFixed(1);
                } else {
                    element.textContent = Math.floor(current);
                }

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    element.textContent = target;
                }
            };

            requestAnimationFrame(update);
        },

        /**
         * Generate random number in range
         */
        random: function(min, max) {
            return Math.random() * (max - min) + min;
        },

        /**
         * Create element with attributes
         */
        createElement: function(tag, attrs = {}, text = '') {
            const el = document.createElement(tag);
            Object.entries(attrs).forEach(([key, val]) => el.setAttribute(key, val));
            if (text) el.textContent = text;
            return el;
        }
    };

    // ===== PARTICLE SYSTEM =====
    const ParticleSystem = {
        particles: [],

        init: function() {
            if (!DOM.particles) return;
            this.generate();
        },

        generate: function() {
            for (let i = 0; i < CONFIG.particleCount; i++) {
                const size = utils.random(CONFIG.particleMinSize, CONFIG.particleMaxSize);
                const particle = utils.createElement('div', {
                    class: 'particle',
                    style: `
                        left: ${Math.random() * 100}%;
                        top: ${Math.random() * 100}%;
                        width: ${size}px;
                        height: ${size}px;
                        animation-delay: ${Math.random() * 15}s;
                        animation-duration: ${10 + Math.random() * 10}s;
                        opacity: ${0.2 + Math.random() * 0.4};
                    `
                });
                DOM.particles.appendChild(particle);
                this.particles.push(particle);
            }
        },

        destroy: function() {
            this.particles.forEach(p => p.remove());
            this.particles = [];
        }
    };

    // ===== NAVIGATION =====
    const Navigation = {
        init: function() {
            this.handleScroll();
            this.bindEvents();
            this.updateActiveLink();
        },

        handleScroll: function() {
            const scrollY = window.scrollY;

            // Navbar background
            if (scrollY > 50) {
                DOM.navbar.classList.add('scrolled');
            } else {
                DOM.navbar.classList.remove('scrolled');
            }

            // Update active nav link
            this.updateActiveLink();
        },

        updateActiveLink: function() {
            const sections = document.querySelectorAll('section[id]');
            let current = '';

            sections.forEach(section => {
                const sectionTop = section.offsetTop - CONFIG.scrollOffset;
                if (window.scrollY >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });

            DOM.navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        },

        bindEvents: function() {
            window.addEventListener('scroll', utils.throttle(() => {
                this.handleScroll();
            }, 100));

            // Smooth scroll for anchor links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    e.preventDefault();
                    const target = document.querySelector(anchor.getAttribute('href'));
                    if (target) {
                        const offset = target.offsetTop - CONFIG.scrollOffset;
                        window.scrollTo({
                            top: offset,
                            behavior: 'smooth'
                        });
                        // Close mobile menu if open
                        this.closeMobileMenu();
                    }
                });
            });
        },

        openMobileMenu: function() {
            if (DOM.mobileNavMenu) {
                DOM.mobileNavMenu.classList.add('active');
            }
            if (DOM.mobileNavOverlay) {
                DOM.mobileNavOverlay.classList.add('active');
            }
            document.body.style.overflow = 'hidden';
        },

        closeMobileMenu: function() {
            if (DOM.mobileNavMenu) {
                DOM.mobileNavMenu.classList.remove('active');
            }
            if (DOM.mobileNavOverlay) {
                DOM.mobileNavOverlay.classList.remove('active');
            }
            document.body.style.overflow = '';
        }
    };

    // ===== MOBILE MENU =====
    const MobileMenu = {
        init: function() {
            if (!DOM.mobileMenuBtn) return;

            DOM.mobileMenuBtn.addEventListener('click', () => {
                Navigation.openMobileMenu();
            });

            if (DOM.mobileNavClose) {
                DOM.mobileNavClose.addEventListener('click', () => {
                    Navigation.closeMobileMenu();
                });
            }

            if (DOM.mobileNavOverlay) {
                DOM.mobileNavOverlay.addEventListener('click', () => {
                    Navigation.closeMobileMenu();
                });
            }

            // Close on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    Navigation.closeMobileMenu();
                }
            });
        }
    };

    // ===== SCROLL REVEAL =====
    const ScrollReveal = {
        observer: null,

        init: function() {
            if ('IntersectionObserver' in window) {
                this.observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('active');
                            // Animate stat numbers when they come into view
                            const statNumbers = entry.target.querySelectorAll('.stat-number');
                            statNumbers.forEach(stat => {
                                if (!stat.dataset.animated) {
                                    const text = stat.textContent;
                                    const num = parseFloat(text.replace(/[^0-9.]/g, ''));
                                    if (!isNaN(num)) {
                                        stat.dataset.animated = 'true';
                                        utils.animateNumber(stat, num, 2000);
                                    }
                                }
                            });
                        }
                    });
                }, { 
                    threshold: CONFIG.revealThreshold,
                    rootMargin: '0px 0px -50px 0px'
                });

                DOM.revealElements.forEach(el => this.observer.observe(el));
            } else {
                // Fallback for browsers without IntersectionObserver
                DOM.revealElements.forEach(el => el.classList.add('active'));
            }
        }
    };

    // ===== TYPING EFFECT =====
    const TypingEffect = {
        init: function() {
            const subtitle = document.querySelector('.hero-subtitle');
            if (!subtitle) return;

            const text = subtitle.textContent;
            subtitle.textContent = '';
            subtitle.classList.add('typing-cursor');

            let i = 0;
            const type = () => {
                if (i < text.length) {
                    subtitle.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, CONFIG.typingSpeed);
                } else {
                    subtitle.classList.remove('typing-cursor');
                }
            };

            setTimeout(type, CONFIG.typingDelay);
        }
    };

    // ===== COUNTER ANIMATION =====
    const CounterAnimation = {
        init: function() {
            // Pre-set stat numbers for animation
            const statMap = {
                '12+': 12,
                '5': 5,
                '50+': 50
            };

            DOM.statNumbers.forEach(stat => {
                const text = stat.textContent.trim();
                const num = statMap[text] || parseFloat(text);
                if (!isNaN(num)) {
                    stat.dataset.target = num;
                    stat.textContent = '0';
                }
            });
        }
    };

    // ===== TIMELINE INTERACTIONS =====
    const Timeline = {
        init: function() {
            DOM.timelineCards.forEach(card => {
                card.addEventListener('click', () => {
                    this.toggleCard(card);
                });

                // Add hover sound effect (optional - visual feedback)
                card.addEventListener('mouseenter', () => {
                    card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                });
            });
        },

        toggleCard: function(card) {
            // Toggle expanded state
            const details = card.querySelector('.timeline-details');
            const tags = card.querySelector('.timeline-tags');

            if (card.classList.contains('expanded')) {
                card.classList.remove('expanded');
                details.style.maxHeight = '';
                tags.style.opacity = '';
            } else {
                // Collapse other cards
                DOM.timelineCards.forEach(c => {
                    if (c !== card) c.classList.remove('expanded');
                });
                card.classList.add('expanded');
            }
        }
    };

    // ===== SKILL ITEMS INTERACTION =====
    const Skills = {
        init: function() {
            DOM.skillItems.forEach(item => {
                item.addEventListener('mouseenter', () => {
                    this.showTooltip(item);
                });

                item.addEventListener('mouseleave', () => {
                    this.hideTooltip(item);
                });

                // Click to copy skill name
                item.addEventListener('click', () => {
                    this.copyToClipboard(item.textContent.trim(), item);
                });
            });
        },

        showTooltip: function(item) {
            // Visual feedback on hover is handled by CSS
        },

        hideTooltip: function(item) {
            // Cleanup if needed
        },

        copyToClipboard: function(text, element) {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(() => {
                    const original = element.textContent;
                    element.textContent = 'Copied!';
                    element.style.background = 'var(--success)';
                    element.style.color = 'white';
                    element.style.borderColor = 'var(--success)';

                    setTimeout(() => {
                        element.textContent = original;
                        element.style.background = '';
                        element.style.color = '';
                        element.style.borderColor = '';
                    }, 1500);
                });
            }
        }
    };

    // ===== PARALLAX EFFECT =====
    const Parallax = {
        init: function() {
            const heroVisual = document.querySelector('.hero-visual');
            if (!heroVisual) return;

            window.addEventListener('scroll', utils.throttle(() => {
                const scrolled = window.scrollY;
                const rate = scrolled * 0.3;
                if (scrolled < window.innerHeight) {
                    heroVisual.style.transform = `translateY(${rate}px)`;
                }
            }, 16));
        }
    };

    // ===== THEME TOGGLE (Dark/Light) =====
    const ThemeToggle = {
        init: function() {
            // Check for saved preference
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'light') {
                this.setLightTheme();
            }

            // Create toggle button if needed
            // This is a placeholder for future light theme implementation
        },

        setLightTheme: function() {
            document.body.classList.add('light-theme');
        },

        setDarkTheme: function() {
            document.body.classList.remove('light-theme');
        }
    };

    // ===== LOADING SCREEN =====
    const LoadingScreen = {
        init: function() {
            // Create loading overlay
            const loader = utils.createElement('div', {
                id: 'page-loader',
                style: `
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: var(--bg-primary);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                    gap: 1rem;
                    transition: opacity 0.5s ease, visibility 0.5s ease;
                `
            });

            const spinner = utils.createElement('div', {
                style: `
                    width: 50px;
                    height: 50px;
                    border: 3px solid var(--border);
                    border-top-color: var(--accent);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                `
            });

            const text = utils.createElement('p', {
                style: `
                    color: var(--text-secondary);
                    font-size: 0.9rem;
                    font-family: var(--font-display);
                `
            }, 'Loading Portfolio...');

            loader.appendChild(spinner);
            loader.appendChild(text);
            document.body.appendChild(loader);

            // Add spin animation
            const style = utils.createElement('style', {}, `
                @keyframes spin { to { transform: rotate(360deg); } }
            `);
            document.head.appendChild(style);

            // Hide loader when page loads
            window.addEventListener('load', () => {
                setTimeout(() => {
                    loader.style.opacity = '0';
                    loader.style.visibility = 'hidden';
                    setTimeout(() => loader.remove(), 500);
                }, 500);
            });
        }
    };

    // ===== BACK TO TOP BUTTON =====
    const BackToTop = {
        init: function() {
            const btn = utils.createElement('button', {
                id: 'back-to-top',
                style: `
                    position: fixed;
                    bottom: 2rem;
                    right: 2rem;
                    width: 50px;
                    height: 50px;
                    background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
                    border: none;
                    border-radius: 50%;
                    color: white;
                    font-size: 1.2rem;
                    cursor: pointer;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                    z-index: 999;
                    box-shadow: 0 4px 15px var(--accent-glow);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                `
            });
            btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
            document.body.appendChild(btn);

            window.addEventListener('scroll', utils.throttle(() => {
                if (window.scrollY > 500) {
                    btn.style.opacity = '1';
                    btn.style.visibility = 'visible';
                } else {
                    btn.style.opacity = '0';
                    btn.style.visibility = 'hidden';
                }
            }, 100));

            btn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });

            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'translateY(-3px)';
                btn.style.boxShadow = 'var(--shadow-glow)';
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
                btn.style.boxShadow = '0 4px 15px var(--accent-glow)';
            });
        }
    };

    // ===== MAGNETIC BUTTON EFFECT =====
    const MagneticButtons = {
        init: function() {
            const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .nav-cta');

            buttons.forEach(btn => {
                btn.addEventListener('mousemove', (e) => {
                    const rect = btn.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;

                    btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
                });

                btn.addEventListener('mouseleave', () => {
                    btn.style.transform = '';
                });
            });
        }
    };

    // ===== CURSOR GLOW EFFECT =====
    const CursorGlow = {
        init: function() {
            // Only on desktop
            if (window.matchMedia('(pointer: coarse)').matches) return;

            const glow = utils.createElement('div', {
                id: 'cursor-glow',
                style: `
                    position: fixed;
                    width: 300px;
                    height: 300px;
                    background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%);
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 0;
                    transform: translate(-50%, -50%);
                    transition: opacity 0.3s ease;
                    opacity: 0;
                `
            });
            document.body.appendChild(glow);

            let mouseX = 0, mouseY = 0;
            let glowX = 0, glowY = 0;

            document.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
                glow.style.opacity = '1';
            });

            document.addEventListener('mouseleave', () => {
                glow.style.opacity = '0';
            });

            const animate = () => {
                glowX += (mouseX - glowX) * 0.1;
                glowY += (mouseY - glowY) * 0.1;
                glow.style.left = glowX + 'px';
                glow.style.top = glowY + 'px';
                requestAnimationFrame(animate);
            };
            animate();
        }
    };

    // ===== KEYBOARD NAVIGATION =====
    const KeyboardNav = {
        init: function() {
            document.addEventListener('keydown', (e) => {
                // Press 'H' to go home
                if (e.key === 'h' || e.key === 'H') {
                    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                }

                // Press 'R' to download resume
                if (e.key === 'r' || e.key === 'R') {
                    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                        const resumeLink = document.querySelector('a[download]');
                        if (resumeLink) resumeLink.click();
                    }
                }
            });
        }
    };

    // ===== PERFORMANCE MONITORING =====
    const Performance = {
        init: function() {
            // Log performance metrics
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = window.performance.timing;
                    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                    console.log(`%c Portfolio loaded in ${pageLoadTime}ms`, 'color: var(--accent); font-weight: bold;');
                }, 0);
            });
        }
    };

    // ===== INITIALIZATION =====
    const App = {
        init: function() {
            // Core functionality
            ParticleSystem.init();
            Navigation.init();
            MobileMenu.init();
            ScrollReveal.init();
            CounterAnimation.init();
            Timeline.init();
            Skills.init();
            Parallax.init();
            ThemeToggle.init();

            // Enhanced interactions
            // LoadingScreen.init(); // Uncomment to enable loading screen
            BackToTop.init();
            MagneticButtons.init();
            CursorGlow.init();
            KeyboardNav.init();
            Performance.init();

            // Typing effect (optional - can be distracting)
            // TypingEffect.init();

            console.log('%c Bala Shiva Teja Portfolio ', 'background: linear-gradient(135deg, #6366f1, #06b6d4); color: white; padding: 8px 16px; border-radius: 8px; font-weight: bold; font-size: 14px;');
            console.log('%c Welcome to my portfolio! ', 'color: #818cf8; font-size: 12px;');
        }
    };

    // Start the app when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => App.init());
    } else {
        App.init();
    }

})()
