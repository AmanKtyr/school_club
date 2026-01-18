/**
 * SCHOOL CLUB ERP SOFTWARE
 * Main JavaScript File
 * Version: 1.0.0
 */

// DOM Ready Function
document.addEventListener('DOMContentLoaded', function() {
    initApplication();
});

/**
 * Initialize Application
 */
function initApplication() {
    // Initialize AOS
    initAOS();
    
    // Initialize Scroll Progress
    initScrollProgress();
    
    // Initialize Navigation
    initNavigation();
    
    // Initialize Forms
    initForms();
    
    // Initialize Animations
    initAnimations();
    
    // Initialize Chat Widget
    initChatWidget();
    
    // Add performance monitoring
    monitorPerformance();
}

/**
 * Initialize AOS (Animate On Scroll)
 */
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100,
            delay: 100,
            easing: 'ease-in-out',
            disable: function() {
                return window.innerWidth < 768;
            }
        });
    } else {
        console.warn('AOS library not loaded');
    }
}

/**
 * Initialize Scroll Progress Bar
 */
function initScrollProgress() {
    const scrollProgress = document.getElementById('scrollProgress');
    
    if (!scrollProgress) return;
    
    window.addEventListener('scroll', function() {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        
        scrollProgress.style.width = scrollPercent + '%';
    });
}

/**
 * Initialize Navigation
 */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const allNavLinks = document.querySelectorAll('a[href^="#"]');
    const mobileMenu = document.querySelector('details.dropdown');

    // Scroll effect for navbar
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-active');
        } else {
            navbar.classList.remove('navbar-active');
        }
    });

    // Smooth scroll for all anchor links
    allNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({ top: targetElement.offsetTop - 80, behavior: 'smooth' });
            }

            // If the link is inside the mobile menu, close the menu
            if (mobileMenu && mobileMenu.hasAttribute('open') && mobileMenu.contains(link)) {
                mobileMenu.removeAttribute('open');
            }
        });
    });
}

/**
 * Toggle Mobile Menu
 */
function toggleMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    
    mobileMenu.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
    
    // Toggle aria-expanded
    const isExpanded = mobileMenu.classList.contains('active');
    mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
}

/**
 * Initialize Forms
 */
function initForms() {
    const demoForm = document.getElementById('demoForm');
    
    if (demoForm) {
        demoForm.addEventListener('submit', handleFormSubmit);
        
        // Add real-time validation
        const inputs = demoForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearFieldError);
        });
    }
    
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }
}

/**
 * Handle Form Submission
 */
function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    
    // Validate form
    if (!validateForm(form)) {
        return;
    }
    
    // Disable submit button
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Processing...';
    submitBtn.disabled = true;
    
    // Prepare data for submission
    const data = {
        schoolName: formData.get('schoolName'),
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        students: formData.get('students'),
        role: formData.get('role'),
        message: formData.get('message'),
        timestamp: new Date().toISOString(),
        source: 'website_demo_form'
    };
    
    // Simulate API call (replace with actual API call)
    setTimeout(() => {
        // Show success message
        showNotification({
            type: 'success',
            title: 'Demo Request Submitted!',
            message: 'Thank you for your interest. Our team will contact you within 2 hours to schedule your personalized demo.'
        });
        
        // Reset form
        form.reset();
        
        // Re-enable submit button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Track conversion
        trackConversion('demo_request', data);
        
        // Send to analytics (example)
        console.log('Form submitted:', data);
        
    }, 1500);
}

/**
 * Validate Form
 */
function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            markFieldAsInvalid(field, 'This field is required');
            isValid = false;
        }
    });
    
    // Email validation
    const emailField = form.querySelector('input[type="email"]');
    if (emailField && emailField.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
            markFieldAsInvalid(emailField, 'Please enter a valid email address');
            isValid = false;
        }
    }
    
    // Phone validation
    const phoneField = form.querySelector('input[type="tel"]');
    if (phoneField && phoneField.value) {
        const phoneRegex = /^[6-9]\d{9}$/;
        const cleanPhone = phoneField.value.replace(/\D/g, '');
        if (!phoneRegex.test(cleanPhone)) {
            markFieldAsInvalid(phoneField, 'Please enter a valid Indian phone number');
            isValid = false;
        }
    }
    
    return isValid;
}

/**
 * Validate Field
 */
function validateField(e) {
    const field = e.target;
    
    if (field.hasAttribute('required') && !field.value.trim()) {
        markFieldAsInvalid(field, 'This field is required');
        return;
    }
    
    if (field.type === 'email' && field.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            markFieldAsInvalid(field, 'Please enter a valid email address');
            return;
        }
    }
    
    markFieldAsValid(field);
}

/**
 * Clear Field Error
 */
function clearFieldError(e) {
    const field = e.target;
    const errorElement = field.parentElement.querySelector('.field-error');
    
    if (errorElement) {
        errorElement.remove();
        field.classList.remove('border-error');
    }
}

/**
 * Mark Field as Invalid
 */
function markFieldAsInvalid(field, message) {
    // Remove existing error
    const existingError = field.parentElement.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error class
    field.classList.add('border-error');
    
    // Create error message
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error text-error text-sm mt-1 flex items-center gap-1';
    errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i><span>${message}</span>`;
    
    field.parentElement.appendChild(errorElement);
}

/**
 * Mark Field as Valid
 */
function markFieldAsValid(field) {
    field.classList.remove('border-error');
    const errorElement = field.parentElement.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

/**
 * Handle Newsletter Submission
 */
function handleNewsletterSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const email = form.querySelector('input[type="email"]').value;
    
    if (!email) {
        showNotification({
            type: 'error',
            title: 'Error',
            message: 'Please enter your email address'
        });
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification({
            type: 'error',
            title: 'Error',
            message: 'Please enter a valid email address'
        });
        return;
    }
    
    // Disable submit button
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Subscribing...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        showNotification({
            type: 'success',
            title: 'Subscribed Successfully!',
            message: 'Thank you for subscribing to our newsletter. You will receive updates shortly.'
        });
        
        form.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Track subscription
        trackConversion('newsletter_subscription', { email });
        
    }, 1000);
}

/**
 * Show Notification
 */
function showNotification({ type, title, message }) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification fixed top-4 right-4 z-50 p-4 rounded-xl shadow-2xl backdrop-blur-sm border transform transition-all duration-300 translate-x-full`;
    
    const typeConfig = {
        success: {
            bg: 'bg-green-500/20',
            border: 'border-green-500/30',
            text: 'text-green-100',
            icon: 'fa-check-circle'
        },
        error: {
            bg: 'bg-red-500/20',
            border: 'border-red-500/30',
            text: 'text-red-100',
            icon: 'fa-exclamation-circle'
        },
        info: {
            bg: 'bg-blue-500/20',
            border: 'border-blue-500/30',
            text: 'text-blue-100',
            icon: 'fa-info-circle'
        }
    };
    
    const config = typeConfig[type] || typeConfig.info;
    
    notification.innerHTML = `
        <div class="flex items-start gap-3 max-w-sm">
            <div class="w-8 h-8 ${config.bg} rounded-lg flex items-center justify-center flex-shrink-0">
                <i class="fas ${config.icon} ${config.text}"></i>
            </div>
            <div>
                <p class="font-semibold ${config.text}">${title}</p>
                <p class="text-sm ${config.text} opacity-90">${message}</p>
            </div>
            <button class="close-notification ml-2 ${config.text} hover:opacity-80">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(() => {
        notification.classList.remove('translate-x-full');
        notification.classList.add('translate-x-0');
    });
    
    // Add close button functionality
    const closeBtn = notification.querySelector('.close-notification');
    closeBtn.addEventListener('click', () => {
        closeNotification(notification);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        closeNotification(notification);
    }, 5000);
}

/**
 * Close Notification
 */
function closeNotification(notification) {
    notification.classList.remove('translate-x-0');
    notification.classList.add('translate-x-full');
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

/**
 * Initialize Animations
 */
function initAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements
    const animatedElements = document.querySelectorAll('.feature-card, .industry-card, .testimonial-card, .pricing-card');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Initialize Chat Widget
 */
function initChatWidget() {
    const chatToggle = document.getElementById('chatToggle');
    const chatWidget = document.querySelector('.chat-widget');
    
    if (!chatToggle || !chatWidget) return;
    
    let isChatOpen = false;
    
    chatToggle.addEventListener('click', function() {
        if (!isChatOpen) {
            // Open chat
            openChat();
        } else {
            // Close chat
            closeChat();
        }
        
        isChatOpen = !isChatOpen;
    });
    
    function openChat() {
        // Create chat interface
        const chatInterface = document.createElement('div');
        chatInterface.className = 'chat-interface fixed bottom-20 right-4 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-1000';
        chatInterface.innerHTML = `
            <div class="chat-header bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-xl flex justify-between items-center">
                <div class="flex items-center gap-3">
                    <i class="fas fa-headset text-xl"></i>
                    <div>
                        <h4 class="font-bold">Live Support</h4>
                        <p class="text-sm opacity-90">We're online to help!</p>
                    </div>
                </div>
                <button class="close-chat text-white hover:opacity-80">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="chat-body p-4 max-h-96 overflow-y-auto">
                <div class="chat-message bot mb-4">
                    <div class="bg-gray-100 rounded-xl p-3">
                        <p class="text-sm">Hello! 👋 How can I help you today?</p>
                    </div>
                </div>
            </div>
            <div class="chat-footer p-4 border-t border-gray-200">
                <div class="flex gap-2">
                    <input type="text" placeholder="Type your message..." class="flex-1 input input-bordered">
                    <button class="btn btn-primary">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        `;
        
        chatWidget.appendChild(chatInterface);
        
        // Add close functionality
        const closeBtn = chatInterface.querySelector('.close-chat');
        closeBtn.addEventListener('click', function() {
            closeChat();
            isChatOpen = false;
        });
    }
    
    function closeChat() {
        const chatInterface = document.querySelector('.chat-interface');
        if (chatInterface) {
            chatInterface.remove();
        }
    }
}

/**
 * Track Conversion
 */
function trackConversion(event, data) {
    // Implement your analytics tracking here
    console.log(`Tracking conversion: ${event}`, data);
    
    // Example: Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', event, data);
    }
    
    // Example: Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', event, data);
    }
}

/**
 * Monitor Performance
 */
function monitorPerformance() {
    // Log page load time
    window.addEventListener('load', function() {
        if ('performance' in window) {
            const timing = performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            
            console.log(`Page loaded in ${loadTime}ms`);
            
            // Send to analytics if load time is high
            if (loadTime > 3000) {
                console.warn('Page load time is high, consider optimization');
            }
        }
    });
    
    // Monitor CLS (Cumulative Layout Shift)
    let clsValue = 0;
    let clsEntries = [];
    
    const observer = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
            if (!entry.hadRecentInput) {
                clsEntries.push(entry);
                clsValue += entry.value;
            }
        }
    });
    
    observer.observe({ type: 'layout-shift', buffered: true });
    
    // Report CLS if high
    window.addEventListener('beforeunload', () => {
        if (clsValue > 0.1) {
            console.warn(`High CLS detected: ${clsValue}`);
        }
    });
}

/**
 * Error Handling
 */
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    
    // Send to error tracking service
    if (typeof Sentry !== 'undefined') {
        Sentry.captureException(e.error);
    }
});

/**
 * Export for module usage
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initApplication,
        validateForm,
        showNotification
    };
}