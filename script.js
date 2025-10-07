// ===== EXACT REPLICA JAVASCRIPT =====

// DOM Elements
const header = document.getElementById('header');
const progressBar = document.getElementById('progress-bar');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const contactForm = document.getElementById('contact-form');

// State variables
let mobileMenuOpen = false;
let isScrolled = false;
let activeFilter = 'All';

// ===== UTILITY FUNCTIONS =====

// Smooth scroll to section (exact replica of React smoothScrollTo)
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const headerHeight = header.offsetHeight;
        const elementPosition = element.offsetTop - headerHeight;
        
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
        
        // Close mobile menu if open
        closeMobileMenu();
    }
}

// Mobile menu functions
function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
    updateMobileMenuState();
}

function closeMobileMenu() {
    mobileMenuOpen = false;
    updateMobileMenuState();
}

function updateMobileMenuState() {
    const menuIcon = mobileMenuBtn.querySelector('.menu-icon');
    const closeIcon = mobileMenuBtn.querySelector('.close-icon');
    
    if (mobileMenuOpen) {
        mobileMenu.classList.add('active');
        menuIcon.classList.add('hidden');
        closeIcon.classList.remove('hidden');
    } else {
        mobileMenu.classList.remove('active');
        menuIcon.classList.remove('hidden');
        closeIcon.classList.add('hidden');
    }
}

// ===== EVENT LISTENERS =====

// Mobile menu toggle
mobileMenuBtn.addEventListener('click', toggleMobileMenu);

// Close mobile menu when clicking on navigation links
document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

// Header scroll effect and progress bar (exact replica of React scroll handler)
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // Header background change (exact replica of React isScrolled state)
    const newIsScrolled = scrolled > 50;
    if (newIsScrolled !== isScrolled) {
        isScrolled = newIsScrolled;
        if (isScrolled) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    // Progress bar (exact replica of React scrollYProgress)
    const progress = (scrolled / (documentHeight - windowHeight)) * 100;
    progressBar.style.width = Math.min(progress, 100) + '%';
    
    // Parallax effect for floating shapes (exact replica of React parallax)
    const shapes = document.querySelectorAll('.floating-shape');
    shapes.forEach((shape, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed);
        shape.style.transform = `translateY(${yPos}px)`;
    });
});

// ===== PORTFOLIO FILTER FUNCTIONALITY =====
// Exact replica of React PortfolioSection filter logic

const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filterValue = button.getAttribute('data-filter');
        
        // Update active filter state (exact replica of React setActiveFilter)
        if (filterValue !== activeFilter) {
            activeFilter = filterValue;
            
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            // Filter portfolio items (exact replica of React filteredProjects logic)
            portfolioItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                const shouldShow = activeFilter === 'All' || itemCategory === activeFilter;
                
                if (shouldShow) {
                    item.style.display = 'block';
                    // Add fade-in animation
                    setTimeout(() => {
                        item.classList.add('animate');
                    }, 100);
                } else {
                    item.style.display = 'none';
                    item.classList.remove('animate');
                }
            });
        }
    });
});

// ===== SERVICE POPUP FORM HANDLING =====
const servicePopup = document.getElementById('servicePopup');
const serviceRequestForm = document.getElementById('serviceRequestForm');
const popupServiceSelect = document.getElementById('popupService');

// Service name mapping
const serviceNames = {
    'static-website': 'Static Website - ₹1,499+',
    'dynamic-website': 'Dynamic Website - ₹3,499+',
    'premium-website': 'Premium Website - ₹5,999+',
    'domain-registration': 'Domain Registration - ₹899/year',
    'hosting-setup': 'Hosting with Setup - ₹459/year',
    'logo-design': 'Logo Design - ₹299',
    'content-writing': 'Content Writing - ₹299/page',
    'custom-project': 'Custom Project',
    'consultation': 'Consultation'
};

// Open service form popup
function openServiceForm(serviceType) {
    servicePopup.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Pre-select the service
    if (serviceType && popupServiceSelect) {
        popupServiceSelect.value = serviceType;
    }
    
    // Add entrance animation
    setTimeout(() => {
        const container = servicePopup.querySelector('.popup-container');
        if (container) {
            container.style.animation = 'scaleIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        }
    }, 10);
}

// Close service form popup
function closeServiceForm() {
    const container = servicePopup.querySelector('.popup-container');
    if (container) {
        container.style.animation = 'scaleOut 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    }
    
    setTimeout(() => {
        servicePopup.classList.remove('active');
        document.body.style.overflow = '';
        serviceRequestForm.reset();
    }, 300);
}

// Close popup on overlay click
servicePopup.addEventListener('click', (e) => {
    if (e.target === servicePopup) {
        closeServiceForm();
    }
});

// Prevent duplicate escape listener
let escapeListenerAdded = false;

if (!escapeListenerAdded) {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && servicePopup.classList.contains('active')) {
            closeServiceForm();
        }
    });
    escapeListenerAdded = true;
}

// Handle service request form submission
serviceRequestForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(serviceRequestForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const service = formData.get('service');
    const message = formData.get('message');
    const timeline = formData.get('timeline');
    
    // Get service name
    const serviceName = serviceNames[service] || service;
    
    // Create email content
    const subject = `Service Request: ${serviceName}`;
    const body = `New Service Request

Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}

Service Requested: ${serviceName}
Timeline: ${timeline || 'Not specified'}

Project Details:
${message}

---
This request was submitted via the portfolio website.`;
    
    // Open default email client
    window.location.href = `mailto:anidev2025@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Close popup and show success
    closeServiceForm();
    
    setTimeout(() => {
        showNotification('Request sent! We\'ll get back to you soon.');
    }, 400);
});

// ===== CONTACT FORM HANDLING =====
// Exact replica of React ContactSection form submission

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const service = formData.get('service');
    const message = formData.get('message');
    
    // Get service name
    const serviceName = serviceNames[service] || service;
    
    // Create email content (exact replica of React form handler)
    const subject = `New Contact Form Submission: ${serviceName}`;
    const body = `Name: ${name}
Email: ${email}
Service: ${serviceName}

Message:
${message}`;
    
    // Open default email client (exact replica of React mailto functionality)
    window.location.href = `mailto:anidev2025@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Reset form (exact replica of React form reset)
    contactForm.reset();
    
    // Show success notification
    showNotification('Thank you! Your message has been sent.');
});

// ===== NOTIFICATION SYSTEM =====
// Enhanced notification system

function showNotification(message) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22,4 12,14.01 9,11.01"></polyline>
            </svg>
            <span>${message}</span>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
// Exact replica of React useInView hook functionality

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            
            // Special handling for staggered animations
            if (entry.target.classList.contains('portfolio-item')) {
                const items = document.querySelectorAll('.portfolio-item');
                const index = Array.from(items).indexOf(entry.target);
                entry.target.style.animationDelay = `${index * 0.1}s`;
            }
            
            if (entry.target.classList.contains('service-card')) {
                const cards = document.querySelectorAll('.service-card');
                const index = Array.from(cards).indexOf(entry.target);
                entry.target.style.animationDelay = `${index * 0.1}s`;
            }
            
            if (entry.target.classList.contains('process-step')) {
                const steps = document.querySelectorAll('.process-step');
                const index = Array.from(steps).indexOf(entry.target);
                entry.target.style.animationDelay = `${index * 0.2}s`;
            }
            
            if (entry.target.classList.contains('addon-card')) {
                const cards = document.querySelectorAll('.addon-card');
                const index = Array.from(cards).indexOf(entry.target);
                entry.target.style.transitionDelay = `${index * 0.1}s`;
            }
        }
    });
}, observerOptions);

// ===== ACTIVE NAVIGATION LINK HIGHLIGHTING =====
// Exact replica of React active section detection

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('onclick');
        if (href && href.includes(`'${current}'`)) {
            link.classList.add('active');
        }
    });
}

// Add scroll listener for active nav link
window.addEventListener('scroll', updateActiveNavLink);

// ===== TYPING EFFECT FOR HERO SUBTITLE =====
// Enhanced typing effect similar to React animations

function typeWriter(element, text, speed = 80) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// ===== INITIALIZATION =====
// Exact replica of React component mounting and useEffect hooks

document.addEventListener('DOMContentLoaded', () => {
    // Initialize intersection observer for all animated elements
    const animatedElements = document.querySelectorAll(`
        .section-header,
        .portfolio-filters,
        .portfolio-item,
        .service-card,
        .process-step,
        .about-image,
        .about-text,
        .contact-info,
        .contact-form,
        .addons-header,
        .addon-card,
        .addons-note
    `);
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
    
    // Initialize typing effect for hero subtitle
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        const originalText = heroSubtitle.textContent;
        // Delay typing effect to match React animation delays
        setTimeout(() => {
            typeWriter(heroSubtitle, originalText, 80);
        }, 1200);
    }
    
    // Initialize portfolio filter (show all items initially)
    portfolioItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('animate');
        }, index * 100);
    });
    
    // Set initial active nav link
    updateActiveNavLink();
});

// ===== WINDOW LOAD EVENT =====
// Final initialization after all resources are loaded

window.addEventListener('load', () => {
    // Trigger initial animations
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.classList.add('animate');
    }
    
    console.log('🚀 Portfolio Loaded Successfully!');
    console.log('✅ SEO Optimized');
    console.log('✅ Performance Enhanced');
    console.log('✅ Animations Improved');
    console.log('✅ Add-ons Section Added');
    console.log('✅ Service Popup Form Ready');
    console.log('✅ All Services Integrated');
});

// ===== PERFORMANCE OPTIMIZATION =====
// Throttle scroll events for better performance

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
    }
}

// Apply throttling to scroll-heavy functions
const throttledScroll = throttle(() => {
    updateActiveNavLink();
}, 16); // ~60fps

window.addEventListener('scroll', throttledScroll);

// ===== LAZY LOADING ENHANCEMENT =====
// Add intersection observer for lazy loading images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });

    // Observe all images with data-src attribute
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== KEYBOARD NAVIGATION SUPPORT =====
// Enhanced accessibility support

document.addEventListener('keydown', (e) => {
    // Close mobile menu on Escape key
    if (e.key === 'Escape' && mobileMenuOpen) {
        closeMobileMenu();
    }
    
    // Navigate sections with arrow keys (when focused on nav)
    if (e.target.classList.contains('nav-link')) {
        const navLinks = Array.from(document.querySelectorAll('.nav-link'));
        const currentIndex = navLinks.indexOf(e.target);
        
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            const nextIndex = (currentIndex + 1) % navLinks.length;
            navLinks[nextIndex].focus();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            const prevIndex = (currentIndex - 1 + navLinks.length) % navLinks.length;
            navLinks[prevIndex].focus();
        }
    }
});

// ===== SMOOTH SCROLL ENHANCEMENT =====
// Add smooth scroll with easing for better UX
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== RESIZE HANDLER =====
// Handle window resize events

window.addEventListener('resize', () => {
    // Close mobile menu on resize to desktop
    if (window.innerWidth >= 768 && mobileMenuOpen) {
        closeMobileMenu();
    }
});

// ===== ADDITIONAL ANIMATIONS =====
// Add notification animations to CSS dynamically

const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .nav-link.active {
        color: var(--primary-600) !important;
    }
    
    .nav-link.active .nav-underline {
        width: 100% !important;
    }
`;
document.head.appendChild(notificationStyles);
