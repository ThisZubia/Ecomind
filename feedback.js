// Feedback Form JavaScript for EcoMind Website

// DOM elements
let feedbackForm, messagesContainer, submittedDataContainer, submittedData;
let loadPreviousFeedbackBtn, clearAllFeedbackBtn, previousFeedbackContainer;

// Initialize feedback functionality
document.addEventListener('DOMContentLoaded', function() {
    feedbackForm = document.getElementById('wellnessFeedbackForm');
    messagesContainer = document.getElementById('messagesContainer');
    submittedDataContainer = document.getElementById('submittedDataContainer');
    submittedData = document.getElementById('submittedData');
    loadPreviousFeedbackBtn = document.getElementById('loadPreviousFeedback');
    clearAllFeedbackBtn = document.getElementById('clearAllFeedback');
    previousFeedbackContainer = document.getElementById('previousFeedbackContainer');
    
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', handleFeedbackSubmit);
    }
    
    if (loadPreviousFeedbackBtn) {
        loadPreviousFeedbackBtn.addEventListener('click', loadPreviousFeedback);
    }
    
    if (clearAllFeedbackBtn) {
        clearAllFeedbackBtn.addEventListener('click', clearAllFeedback);
    }
    
    // Check if there's existing feedback to show load button state
    updateLoadButtonState();
});

// Handle feedback form submission
function handleFeedbackSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const formData = getFormData();
    
    // Validate form data
    if (!validateFormData(formData)) {
        return;
    }
    
    // Convert to JSON and save to localStorage
    const feedbackJSON = JSON.stringify(formData);
    saveFeedbackToLocalStorage(feedbackJSON, formData);
    
    // Show confirmation message
    showSuccessMessage('Thank you for your feedback! Your wellness data has been saved locally.', 'messagesContainer');
    
    // Display submitted data
    displaySubmittedData(formData);
    
    // Reset form
    feedbackForm.reset();
    
    // Update load button state
    updateLoadButtonState();
}

// Get form data
function getFormData() {
    return {
        name: document.getElementById('userName').value.trim(),
        email: document.getElementById('userEmail').value.trim(),
        mood: document.getElementById('userMood').value,
        comments: document.getElementById('userComments').value.trim(),
        timestamp: new Date().toISOString(),
        submittedAt: formatDate(new Date())
    };
}

// Validate form data
function validateFormData(data) {
    // Check required fields
    if (!data.name) {
        showValidationError('Please enter your name.');
        return false;
    }
    
    if (!data.email) {
        showValidationError('Please enter your email.');
        return false;
    }
    
    if (!isValidEmail(data.email)) {
        showValidationError('Please enter a valid email address.');
        return false;
    }
    
    if (!data.mood) {
        showValidationError('Please select your current mood.');
        return false;
    }
    
    return true;
}

// Show validation error
function showValidationError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger alert-dismissible fade show';
    errorDiv.innerHTML = `
        <i class="bi bi-exclamation-triangle me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    messagesContainer.appendChild(errorDiv);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

// Save feedback to localStorage
function saveFeedbackToLocalStorage(feedbackJSON, formData) {
    try {
        // Get existing feedback array or create new one
        const existingFeedback = JSON.parse(localStorage.getItem('ecomindFeedback') || '[]');
        
        // Add new feedback
        existingFeedback.push(formData);
        
        // Save back to localStorage
        localStorage.setItem('ecomindFeedback', JSON.stringify(existingFeedback));
        
        console.log('Feedback saved to localStorage:', feedbackJSON);
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        showValidationError('Error saving feedback. Please try again.');
    }
}

// Display submitted data
function displaySubmittedData(data) {
    const dataHTML = `
        <div class="row">
            <div class="col-md-6">
                <strong>Name:</strong> ${data.name}
            </div>
            <div class="col-md-6">
                <strong>Email:</strong> ${data.email}
            </div>
        </div>
        <div class="row mt-2">
            <div class="col-md-6">
                <strong>Mood:</strong> <span class="badge bg-success">${data.mood}</span>
            </div>
            <div class="col-md-6">
                <strong>Submitted:</strong> ${data.submittedAt}
            </div>
        </div>
        ${data.comments ? `
        <div class="row mt-2">
            <div class="col-12">
                <strong>Comments:</strong><br>
                <em>"${data.comments}"</em>
            </div>
        </div>
        ` : ''}
        <div class="mt-3">
            <small class="text-muted">
                <i class="bi bi-info-circle me-1"></i>
                This data is stored locally in your browser and is not sent to any server.
            </small>
        </div>
    `;
    
    submittedData.innerHTML = dataHTML;
    submittedDataContainer.style.display = 'block';
    
    // Scroll to submitted data
    submittedDataContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Load previous feedback from localStorage
function loadPreviousFeedback() {
    try {
        const existingFeedback = JSON.parse(localStorage.getItem('ecomindFeedback') || '[]');
        
        if (existingFeedback.length === 0) {
            previousFeedbackContainer.innerHTML = `
                <div class="alert alert-info">
                    <i class="bi bi-info-circle me-2"></i>
                    No previous feedback found. Submit your first feedback above!
                </div>
            `;
            return;
        }
        
        // Sort by timestamp (newest first)
        existingFeedback.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        // Display feedback
        let feedbackHTML = `
            <div class="row g-3">
                <div class="col-12">
                    <h5 class="text-success mb-3">
                        <i class="bi bi-clock-history me-2"></i>
                        Previous Feedback (${existingFeedback.length} entries)
                    </h5>
                </div>
        `;
        
        existingFeedback.forEach((feedback, index) => {
            feedbackHTML += `
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <h6 class="card-title mb-0">${feedback.name}</h6>
                                <span class="badge bg-success">${feedback.mood}</span>
                            </div>
                            <p class="card-text">
                                <small class="text-muted">
                                    <i class="bi bi-envelope me-1"></i>${feedback.email}<br>
                                    <i class="bi bi-calendar me-1"></i>${feedback.submittedAt}
                                </small>
                            </p>
                            ${feedback.comments ? `
                                <p class="card-text">
                                    <em>"${feedback.comments.length > 100 ? 
                                        feedback.comments.substring(0, 100) + '...' : 
                                        feedback.comments}"</em>
                                </p>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
        });
        
        feedbackHTML += '</div>';
        
        previousFeedbackContainer.innerHTML = feedbackHTML;
        
        // Scroll to feedback section
        previousFeedbackContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
    } catch (error) {
        console.error('Error loading previous feedback:', error);
        previousFeedbackContainer.innerHTML = `
            <div class="alert alert-danger">
                <i class="bi bi-exclamation-triangle me-2"></i>
                Error loading previous feedback. Please try again.
            </div>
        `;
    }
}

// Clear all feedback from localStorage
function clearAllFeedback() {
    if (confirm('Are you sure you want to delete all saved feedback? This action cannot be undone.')) {
        try {
            localStorage.removeItem('ecomindFeedback');
            previousFeedbackContainer.innerHTML = `
                <div class="alert alert-success">
                    <i class="bi bi-check-circle me-2"></i>
                    All feedback data has been cleared successfully.
                </div>
            `;
            
            // Hide submitted data container
            submittedDataContainer.style.display = 'none';
            
            // Update load button state
            updateLoadButtonState();
            
            showSuccessMessage('All feedback data has been cleared from local storage.', 'messagesContainer');
            
        } catch (error) {
            console.error('Error clearing feedback:', error);
            showValidationError('Error clearing feedback data. Please try again.');
        }
    }
}

// Update load button state based on existing data
function updateLoadButtonState() {
    try {
        const existingFeedback = JSON.parse(localStorage.getItem('ecomindFeedback') || '[]');
        const hasData = existingFeedback.length > 0;
        
        if (loadPreviousFeedbackBtn) {
            loadPreviousFeedbackBtn.innerHTML = hasData ? 
                `<i class="bi bi-archive me-2"></i>Load Previous Feedback (${existingFeedback.length})` :
                `<i class="bi bi-archive me-2"></i>Load Previous Feedback`;
        }
        
        if (clearAllFeedbackBtn) {
            clearAllFeedbackBtn.style.display = hasData ? 'inline-block' : 'none';
        }
    } catch (error) {
        console.error('Error checking localStorage:', error);
    }
}

// Export feedback data as JSON file
function exportFeedbackData() {
    try {
        const existingFeedback = JSON.parse(localStorage.getItem('ecomindFeedback') || '[]');
        
        if (existingFeedback.length === 0) {
            showValidationError('No feedback data to export.');
            return;
        }
        
        const dataStr = JSON.stringify(existingFeedback, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `ecomind-feedback-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        showSuccessMessage('Feedback data exported successfully!', 'messagesContainer');
        
    } catch (error) {
        console.error('Error exporting feedback:', error);
        showValidationError('Error exporting feedback data. Please try again.');
    }
}

// Add export button functionality (if needed)
document.addEventListener('DOMContentLoaded', function() {
    const exportBtn = document.getElementById('exportFeedback');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportFeedbackData);
    }
});

// Enhanced form validation with real-time feedback
document.addEventListener('DOMContentLoaded', function() {
    const emailInput = document.getElementById('userEmail');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            const email = this.value.trim();
            if (email && !isValidEmail(email)) {
                this.classList.add('is-invalid');
            } else {
                this.classList.remove('is-invalid');
            }
        });
    }
});

// Mood-based encouragement messages
const moodEncouragement = {
    'Happy': 'Wonderful! Your positive energy is like sunshine for your wellbeing. 🌞',
    'Sad': 'Thank you for sharing. Remember, like seasons, emotions change. You\'re not alone. 🌱',
    'Calm': 'Beautiful! Your inner peace is a gift to yourself and others. 🍃',
    'Stressed': 'We hear you. Take a deep breath - you\'re taking a positive step by sharing. 🌊',
    'Energetic': 'Amazing! Your vitality is inspiring. Channel that energy into something you love! ⚡'
};

// Show mood-specific encouragement
function showMoodEncouragement(mood) {
    if (moodEncouragement[mood]) {
        const encouragementDiv = document.createElement('div');
        encouragementDiv.className = 'alert alert-info alert-dismissible fade show mt-2';
        encouragementDiv.innerHTML = `
            <i class="bi bi-heart me-2"></i>
            ${moodEncouragement[mood]}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        messagesContainer.appendChild(encouragementDiv);
        
        setTimeout(() => {
            if (encouragementDiv.parentNode) {
                encouragementDiv.remove();
            }
        }, 8000);
    }
}

// Enhanced form submission with mood encouragement
const originalHandleFeedbackSubmit = handleFeedbackSubmit;
handleFeedbackSubmit = function(e) {
    e.preventDefault();
    
    const formData = getFormData();
    
    if (!validateFormData(formData)) {
        return;
    }
    
    // Show mood-specific encouragement
    showMoodEncouragement(formData.mood);
    
    // Continue with original submission
    originalHandleFeedbackSubmit.call(this, e);
};

