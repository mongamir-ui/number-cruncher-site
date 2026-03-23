/**
 * NUMBER CRUNCHER TAX SPECIALIST
 * Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-out',
        once: true,
        offset: 100,
        disable: false,
        startEvent: 'DOMContentLoaded'
    });

    // ==========================================
    // NAVIGATION
    // ==========================================
    const navbar = document.querySelector('.navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');

    function setActiveNavLink() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', setActiveNavLink);

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const targetPosition = target.offsetTop - 80;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================
    // ANIMATED COUNTERS
    // ==========================================
    const counters = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;

        const statsSection = document.querySelector('.stats-grid');
        if (!statsSection) return;

        const rect = statsSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isVisible) {
            countersAnimated = true;

            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-count'));
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;

                const updateCounter = () => {
                    current += step;
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };

                updateCounter();
            });
        }
    }

    window.addEventListener('scroll', animateCounters);
    window.addEventListener('load', animateCounters);

    // ==========================================
    // CONTACT FORM - REPLACED SIMULATION WITH ACTUAL FETCH
    // ==========================================
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    if (contactForm) { // Only attach listener if the form exists
        contactForm.addEventListener('submit', async function(e) { // Make event listener async
            e.preventDefault(); // Prevent default form submission

            // Get form data using FormData API
            const formData = new FormData(this);
            // Convert FormData to a plain object for JSON.stringify
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'), // Optional based on validation
                subject: formData.get('subject'), // Optional based on validation
                message: formData.get('message'),
                // Add any other fields your specific API expects
            };

            // Basic validation (customize as needed)
            // Example: Name, Email, Message are required
            if (!data.name || !data.email || !data.message) {
                showNotification('Please fill in all required fields (Name, Email, Message).', 'error');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn ? submitBtn.innerHTML : 'Submit'; // Store original text
            const originalDisabledState = submitBtn ? submitBtn.disabled : false; // Store original disabled state

            if (submitBtn) { // Update button state while submitting
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> SENDING...';
                submitBtn.disabled = true;
            }

            try {
                // Perform the actual API call
                const response = await fetch("https://api.kentroi.com/form/cmn2wonvh00000418noup12nj", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json" // Good practice to include
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) { // Check if response status is 200-299 (success)
                    contactForm.style.display = 'none'; // Hide the form
                    if (formSuccess) { // Show success message if element exists
                        formSuccess.style.display = 'block'; // Ensure it's visible
                        formSuccess.classList.add('show'); // Apply any specific success styling/animation
                    }
                    contactForm.reset(); // Clear form fields
                    showNotification('Your message has been sent successfully!', 'success');
                } else {
                    // Handle API-specific errors (e.g., validation errors, server-side issues)
                    let errorMsg = `Failed to send message. Server responded with ${response.status}. Please try again.`;
                    try {
                        const errorResponseData = await response.json();
                        if (errorResponseData && errorResponseData.message) {
                            errorMsg = errorResponseData.message;
                        } else if (errorResponseData && errorResponseData.errors) { // Common for validation errors from backend
                            // Concatenate all validation error messages
                            errorMsg = Object.values(errorResponseData.errors).flat().join(' ');
                            if (errorMsg === '') { // Fallback if no specific messages
                                errorMsg = `Validation failed: ${response.statusText}`;
                            }
                        } else if (response.statusText) {
                            errorMsg = `Error: ${response.status} ${response.statusText}`;
                        }
                    } catch (jsonError) {
                        console.warn('API error response was not JSON or failed to parse:', jsonError);
                        // Fallback to a generic message if JSON parsing fails
                    }
                    showNotification(errorMsg, 'error');
                }
            } catch (networkError) {
                // Handle network-related errors (e.g., no internet, CORS issues)
                console.error('Network error during form submission:', networkError);
                showNotification('Could not connect to the server. Please check your internet connection and try again.', 'error');
            } finally {
                // Always reset the button state
                if (submitBtn) {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = originalDisabledState; // Restore original state, or always false if desired
                }
            }
        });
    }

    // ==========================================
    // BACK TO TOP BUTTON
    // ==========================================
    const backToTop = document.getElementById('backToTop');

    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 500) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        });

        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ==========================================
    // PARALLAX EFFECT ON HERO
    // ==========================================
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;
            hero.style.backgroundPositionY = rate + 'px';
        });
    }

    // ==========================================
    // SERVICE CARDS HOVER EFFECT
    // ==========================================
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // ==========================================
    // COMPLIANCE CARDS ANIMATION
    // ==========================================
    const complianceCards = document.querySelectorAll('.compliance-card');
    complianceCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    // ==========================================
    // QUALIFICATION LIST ANIMATION
    // ==========================================
    const qualItems = document.querySelectorAll('.qual-list li');
    qualItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.1}s`;
    });

    // ==========================================
    // CONTACT ITEM ANIMATION
    // ==========================================
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.1}s`;
    });

    // ==========================================
    // FORM INPUT ANIMATIONS
    // ==========================================
    const formInputs = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });

    // ==========================================
    // STAT ITEMS ANIMATION
    // ==========================================
    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.2}s`;
    });

    // ==========================================
    // SOCIAL LINKS ANIMATION
    // ==========================================
    const socialLinks = document.querySelectorAll('.social-links a');
    socialLinks.forEach((link, index) => {
        link.style.transitionDelay = `${index * 0.1}s`;
    });

    // ==========================================
    // FOOTER LINKS ANIMATION
    // ==========================================
    const footerLinks = document.querySelectorAll('.footer-links a');
    footerLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.paddingLeft = '10px';
        });
        link.addEventListener('mouseleave', function() {
            this.style.paddingLeft = '0';
        });
    });

    // ==========================================
    // SCROLL REVEAL ANIMATION
    // ==========================================
    function revealOnScroll() {
        const reveals = document.querySelectorAll('.reveal');

        reveals.forEach(element => {
            const windowHeight = window.innerHeight;
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', revealOnScroll);

    // ==========================================
    // HERO TEXT ANIMATION ON LOAD
    // ==========================================
    const heroTexts = document.querySelectorAll('.hero-title span');
    heroTexts.forEach((text, index) => {
        text.style.opacity = '0';
        text.style.transform = 'translateY(30px)';

        setTimeout(() => {
            text.style.transition = 'all 0.8s ease';
            text.style.opacity = '1';
            text.style.transform = 'translateY(0)';
        }, 500 + (index * 200));
    });

    // ==========================================
    // INITIAL LOAD ANIMATIONS
    // ==========================================
    window.addEventListener('load', function() {
        // Trigger AOS refresh after all images load
        setTimeout(() => {
            AOS.refresh();
        }, 100);

        // Animate hero elements
        const heroSubtitle = document.querySelector('.hero-subtitle');
        const heroButtons = document.querySelector('.hero-buttons');

        if (heroSubtitle) {
            heroSubtitle.style.opacity = '0';
            heroSubtitle.style.transform = 'translateY(20px)';
            setTimeout(() => {
                heroSubtitle.style.transition = 'all 0.8s ease';
                heroSubtitle.style.opacity = '1';
                heroSubtitle.style.transform = 'translateY(0)';
            }, 1000);
        }

        if (heroButtons) {
            heroButtons.style.opacity = '0';
            heroButtons.style.transform = 'translateY(20px)';
            setTimeout(() => {
                heroButtons.style.transition = 'all 0.8s ease';
                heroButtons.style.opacity = '1';
                heroButtons.style.transform = 'translateY(0)';
            }, 1200);
        }
    });

    // ==========================================
    // IMAGE LAZY LOADING
    // ==========================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ==========================================
    // PRELOADER (Optional)
    // ==========================================
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });

    // ==========================================
    // KEYBOARD NAVIGATION
    // ==========================================
    document.addEventListener('keydown', function(e) {
        // Escape key closes mobile menu
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // ==========================================
    // PERFORMANCE: Throttle scroll events
    // ==========================================
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                setActiveNavLink();
                animateCounters();
                revealOnScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    console.log('Number Cruncher Tax Specialist - Website Initialized');
});
