// ============================================
// TAHWAR.PK - MAIN JAVASCRIPT
// ============================================

// Navigation Scroll Effect
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// Mobile Menu Toggle
function toggleMobileMenu() {
    const mobileNav = document.getElementById('mobile-nav');
    if (mobileNav) {
        mobileNav.classList.toggle('active');
    }
}

// Make function globally available - BOTH ways for compatibility
window.toggleMobileMenu = toggleMobileMenu;
window.TahwarApp = window.TahwarApp || {};
window.TahwarApp.toggleMobileMenu = toggleMobileMenu;

// Tab Switching
function switchTab(tabName) {
    // Remove active class from all buttons and contents
    const buttons = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');
    
    buttons.forEach(btn => btn.classList.remove('active'));
    contents.forEach(content => content.classList.remove('active'));
    
    // Add active class to clicked button
    event.target.classList.add('active');
    
    // Show corresponding content
    const tabContent = document.getElementById(tabName + '-tab');
    if (tabContent) {
        tabContent.classList.add('active');
    }
}

// FAQ Accordion
function toggleFAQ(element) {
    const faqItem = element.parentElement;
    const isActive = faqItem.classList.contains('active');
    
    // Close all FAQs
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Open clicked FAQ if it wasn't active
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// Scroll Reveal Animation
function revealOnScroll() {
    const reveals = document.querySelectorAll('.scroll-reveal');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const revealPoint = 100;
        
        if (elementTop < windowHeight - revealPoint) {
            element.classList.add('revealed');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// Smooth Scrolling for Anchor Links
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#!') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Close mobile menu if open
                    const mobileNav = document.getElementById('mobile-nav');
                    if (mobileNav) {
                        mobileNav.classList.remove('active');
                    }
                }
            }
        });
    });
    
    // Initialize scroll reveals on page load
    revealOnScroll();
});

// Form Validation
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return false;
    
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = '#dc3545';
        } else {
            input.style.borderColor = '#E8E4DC';
        }
    });
    
    // Email validation
    const emailInputs = form.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        if (input.value && !validateEmail(input.value)) {
            isValid = false;
            input.style.borderColor = '#dc3545';
        }
    });
    
    // Phone validation
    const phoneInputs = form.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        if (input.value && !validatePhone(input.value)) {
            isValid = false;
            input.style.borderColor = '#dc3545';
        }
    });
    
    return isValid;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    // Pakistan phone number validation (11 digits)
    const re = /^03\d{9}$/;
    return re.test(phone.replace(/[-\s]/g, ''));
}

// Show Alert Message
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.innerHTML = `
        <span>${message}</span>
    `;
    
    const container = document.querySelector('.container');
    if (container) {
        container.insertBefore(alertDiv, container.firstChild);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            alertDiv.style.opacity = '0';
            setTimeout(() => alertDiv.remove(), 300);
        }, 5000);
    }
}

// Filter Venues
function filterVenues() {
    const cityFilter = document.getElementById('city-filter');
    const capacityFilter = document.getElementById('capacity-filter');
    const priceFilter = document.getElementById('price-filter');
    
    if (!cityFilter || !capacityFilter || !priceFilter) return;
    
    const city = cityFilter.value;
    const capacity = capacityFilter.value;
    const price = priceFilter.value;
    
    const venues = document.querySelectorAll('.venue-card');
    
    venues.forEach(venue => {
        let show = true;
        
        if (city && venue.dataset.city !== city) {
            show = false;
        }
        
        if (capacity) {
            const venueCapacity = parseInt(venue.dataset.capacity);
            const [min, max] = capacity.split('-').map(Number);
            if (venueCapacity < min || (max && venueCapacity > max)) {
                show = false;
            }
        }
        
        if (price) {
            const venuePrice = parseInt(venue.dataset.price);
            const [min, max] = price.split('-').map(Number);
            if (venuePrice < min || (max && venuePrice > max)) {
                show = false;
            }
        }
        
        venue.style.display = show ? 'block' : 'none';
    });
}

// Search Functionality
function searchVenues() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    
    const searchTerm = searchInput.value.toLowerCase();
    const venues = document.querySelectorAll('.venue-card');
    
    venues.forEach(venue => {
        const venueName = venue.querySelector('.venue-name').textContent.toLowerCase();
        const venueLocation = venue.querySelector('.venue-location').textContent.toLowerCase();
        
        if (venueName.includes(searchTerm) || venueLocation.includes(searchTerm)) {
            venue.style.display = 'block';
        } else {
            venue.style.display = 'none';
        }
    });
}

// Handle Booking Request
function handleBookingRequest(event) {
    event.preventDefault();
    
    if (!validateForm('booking-form')) {
        showAlert('Please fill in all required fields correctly.', 'error');
        return;
    }
    
    const form = document.getElementById('booking-form');
    const formData = new FormData(form);
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate API call (replace with actual backend call)
    setTimeout(() => {
        showAlert('Your booking request has been sent successfully! The venue owner will contact you within 24 hours.', 'success');
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
}

// Handle Vendor Registration
function handleVendorRegistration(event) {
    event.preventDefault();
    
    if (!validateForm('vendor-form')) {
        showAlert('Please fill in all required fields correctly.', 'error');
        return;
    }
    
    const form = document.getElementById('vendor-form');
    const formData = new FormData(form);
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Registering...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        showAlert('Registration successful! Our team will contact you within 24 hours to verify your venue.', 'success');
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
}

// Handle Contact Form
function handleContactForm(event) {
    event.preventDefault();
    
    if (!validateForm('contact-form')) {
        showAlert('Please fill in all required fields correctly.', 'error');
        return;
    }
    
    const form = document.getElementById('contact-form');
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        showAlert('Thank you for contacting us! We will respond within 24 hours.', 'success');
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 1500);
}

// Load More Venues
function loadMoreVenues() {
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (!loadMoreBtn) return;
    
    loadMoreBtn.textContent = 'Loading...';
    loadMoreBtn.disabled = true;
    
    // Simulate loading more venues
    setTimeout(() => {
        showAlert('All venues loaded!', 'info');
        loadMoreBtn.style.display = 'none';
    }, 1000);
}

// Initialize Date Picker
function initializeDatePicker() {
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        input.setAttribute('min', today);
    });
}

// Image Preview for Upload
function previewImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const preview = document.getElementById('image-preview');
            if (preview) {
                preview.src = e.target.result;
                preview.style.display = 'block';
            }
        };
        
        reader.readAsDataURL(input.files[0]);
    }
}

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize date pickers
    initializeDatePicker();
    
    // Add form submit handlers
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingRequest);
    }
    
    const vendorForm = document.getElementById('vendor-form');
    if (vendorForm) {
        vendorForm.addEventListener('submit', handleVendorRegistration);
    }
    
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
    
    // Add search handler
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', searchVenues);
    }
    
    // Add filter handlers
    const cityFilter = document.getElementById('city-filter');
    const capacityFilter = document.getElementById('capacity-filter');
    const priceFilter = document.getElementById('price-filter');
    
    if (cityFilter) cityFilter.addEventListener('change', filterVenues);
    if (capacityFilter) capacityFilter.addEventListener('change', filterVenues);
    if (priceFilter) priceFilter.addEventListener('change', filterVenues);
    
    // Load more button
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreVenues);
    }
});

// Export functions for use in other files
window.TahwarApp = {
    toggleMobileMenu,
    switchTab,
    toggleFAQ,
    validateForm,
    showAlert,
    filterVenues,
    searchVenues,
    handleBookingRequest,
    handleVendorRegistration,
    handleContactForm,
    loadMoreVenues,
    previewImage
};
