// Main JavaScript for EcoMind Website

// Nature therapy quotes and themes
const natureQuotes = [
    {
        text: "In every walk with nature, one receives far more than they seek.",
        author: "John Muir",
        theme: "Forest Therapy"
    },
    {
        text: "The earth has music for those who listen.",
        author: "George Santayana",
        theme: "Sound Healing"
    },
    {
        text: "Nature is not a place to visit. It is home.",
        author: "Terry Tempest Williams",
        theme: "Connection"
    },
    {
        text: "Look deep into nature, and then you will understand everything better.",
        author: "Albert Einstein",
        theme: "Mindfulness"
    },
    {
        text: "The clearest way into the Universe is through a forest wilderness.",
        author: "John Muir",
        theme: "Forest Bathing"
    },
    {
        text: "Nature holds the key to our aesthetic, intellectual, cognitive and even spiritual satisfaction.",
        author: "E.O. Wilson",
        theme: "Holistic Wellness"
    },
    {
        text: "In nature, nothing is perfect and everything is perfect.",
        author: "Alice Walker",
        theme: "Acceptance"
    },
    {
        text: "The mountains are calling and I must go.",
        author: "John Muir",
        theme: "Adventure Therapy"
    },
    {
        text: "Nature does not hurry, yet everything is accomplished.",
        author: "Lao Tzu",
        theme: "Patience & Peace"
    }
];

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Load quotes on home page
    if (document.getElementById('quotes-grid')) {
        loadQuoteCards();
    }
    
    // Initialize smooth scrolling for anchor links
    initSmoothScrolling();
    
    // Initialize navbar scroll effect
    initNavbarScrollEffect();
});

// Load quote cards dynamically
function loadQuoteCards() {
    const quotesGrid = document.getElementById('quotes-grid');
    if (!quotesGrid) return;
    
    // Shuffle quotes and take first 6
    const shuffledQuotes = shuffleArray([...natureQuotes]).slice(0, 6);
    
    shuffledQuotes.forEach((quote, index) => {
        const quoteCard = createQuoteCard(quote, index);
        quotesGrid.appendChild(quoteCard);
    });
    
    // Add animation delay to cards
    setTimeout(() => {
        const cards = quotesGrid.querySelectorAll('.quote-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 150);
        });
    }, 100);
}

// Create quote card element
function createQuoteCard(quote, index) {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4';
    
    col.innerHTML = `
        <div class="quote-card" style="opacity: 0; transform: translateY(30px); transition: all 0.6s ease;">
            <div class="quote-text">"${quote.text}"</div>
            <div class="quote-author">— ${quote.author}</div>
            <div class="mt-2">
                <span class="badge bg-success">${quote.theme}</span>
            </div>
        </div>
    `;
    
    return col;
}

// Utility function to shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Initialize smooth scrolling
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
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
}

// Initialize navbar scroll effect
function initNavbarScrollEffect() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
        }
    });
}

// Show loading spinner
function showLoading(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="loading-spinner show text-center">
                <div class="spinner-border text-success" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-3 text-muted">Getting your personalized nature wisdom...</p>
            </div>
        `;
    }
}

// Show error message
function showError(containerId, message) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="alert alert-warning" role="alert">
                <i class="bi bi-exclamation-triangle me-2"></i>
                ${message}
            </div>
        `;
    }
}

// Format date for display
function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show success message with animation
function showSuccessMessage(message, containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        const successDiv = document.createElement('div');
        successDiv.className = 'alert alert-success alert-dismissible fade show';
        successDiv.innerHTML = `
            <i class="bi bi-check-circle me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        container.appendChild(successDiv);
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.remove();
            }
        }, 5000);
    }
}

// Add ripple effect to buttons
function addRippleEffect() {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Initialize ripple effect when DOM is loaded
document.addEventListener('DOMContentLoaded', addRippleEffect);

// Add CSS for ripple effect
const rippleCSS = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;

// Inject ripple CSS
const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);

