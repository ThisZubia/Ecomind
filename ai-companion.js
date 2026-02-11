// AI Companion JavaScript for EcoMind Website

// Nature-themed responses for different moods
const moodResponses = {
    stressed: [
        "Like a tree that bends in the wind but doesn't break, you too can weather this storm. Take a deep breath and imagine yourself in a peaceful forest.",
        "The ocean waves wash away all worries. Let the rhythm of nature calm your mind and restore your inner peace.",
        "Mountains stand tall through countless storms. Your strength is deeper than you know. Find a quiet moment to connect with nature today."
    ],
    anxious: [
        "In nature, everything has its perfect timing. Trust that you are exactly where you need to be, like a flower blooming in its season.",
        "The gentle rustling of leaves reminds us that even in movement, there can be peace. Let nature's wisdom guide your anxious heart.",
        "Like morning dew that gently settles, let calmness wash over you. Nature teaches us that after every storm comes stillness."
    ],
    sad: [
        "Even the mightiest oak was once an acorn. Your current sadness is not your final destination - growth and renewal await.",
        "The earth embraces both sunshine and rain, knowing both are necessary for life. Your feelings are valid and part of your natural cycle.",
        "Like a river that carves beautiful canyons through persistence, your journey through sadness will create something beautiful in time."
    ],
    happy: [
        "Your joy radiates like sunlight through forest leaves, bringing warmth to all around you. Share this beautiful energy with the world.",
        "Like a bird singing at dawn, your happiness is a gift to the universe. Let it soar and inspire others to find their own song.",
        "Your positive energy flows like a clear mountain stream, refreshing and pure. Keep spreading this natural joy wherever you go."
    ],
    calm: [
        "You embody the serenity of a still lake at sunrise. This inner peace is your natural state - treasure and nurture it.",
        "Like a gentle breeze through meadow grass, your calmness brings harmony to your surroundings. You are nature's peace in human form.",
        "In your stillness, you reflect the wisdom of ancient trees. This tranquility is a gift - both to yourself and to others."
    ],
    energetic: [
        "Your vitality flows like a rushing waterfall, powerful and inspiring. Channel this energy into something that nurtures your soul.",
        "Like the first rays of dawn breaking over mountains, your energy illuminates new possibilities. Use this gift to create positive change.",
        "Your spirit dances like wildflowers in a summer breeze. Let this natural enthusiasm guide you toward your dreams."
    ],
    default: [
        "Nature whispers ancient wisdom to those who listen. Take a moment today to step outside and hear what the earth has to tell you.",
        "You are as unique and beautiful as a snowflake, as strong as a mountain, and as flowing as a river. Trust in your natural magnificence.",
        "Like the changing seasons, life brings constant transformation. Embrace each moment as part of your beautiful, natural journey."
    ]
};

// Personalized greetings based on names
const nameGreetings = [
    "Hello {name}! Like a seed planted in fertile soil, your potential is limitless. Here's some nature wisdom just for you:",
    "Greetings {name}! The forest welcomes you with open arms. Let this message from nature guide your day:",
    "Welcome {name}! As unique as every leaf on a tree, you bring something special to this world. Here's your personal nature insight:",
    "Hi {name}! The mountains echo with ancient wisdom, and today they have a special message for you:",
    "Dear {name}, like morning dew that nourishes the earth, may this nature wisdom nourish your soul:"
];

// DOM elements
let userInput, aiResponse, regenerateBtn, aiForm;

// Initialize AI Companion functionality
document.addEventListener('DOMContentLoaded', function() {
    userInput = document.getElementById('userInput');
    aiResponse = document.getElementById('aiResponse');
    regenerateBtn = document.getElementById('regenerateBtn');
    aiForm = document.getElementById('aiCompanionForm');
    
    if (aiForm) {
        aiForm.addEventListener('submit', handleFormSubmit);
    }
    
    if (regenerateBtn) {
        regenerateBtn.addEventListener('click', regenerateQuote);
    }
});

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    const input = userInput.value.trim();
    
    if (!input) {
        showError('aiResponse', 'Please enter your mood or name to get personalized wisdom.');
        return;
    }
    
    generateAIResponse(input);
}

// Generate AI response based on user input
async function generateAIResponse(input) {
    showLoading('aiResponse');
    
    try {
        // First try to get a quote from ZenQuotes API
        const zenQuote = await fetchZenQuote();
        
        // Analyze input for mood or name
        const analysis = analyzeInput(input);
        
        // Generate personalized response
        const personalizedResponse = generatePersonalizedResponse(analysis, zenQuote);
        
        displayResponse(personalizedResponse);
        regenerateBtn.style.display = 'inline-block';
        
    } catch (error) {
        console.error('Error generating AI response:', error);
        // Fallback to local responses if API fails
        const analysis = analyzeInput(input);
        const fallbackResponse = generateFallbackResponse(analysis);
        displayResponse(fallbackResponse);
        regenerateBtn.style.display = 'inline-block';
    }
}

// Fetch quote from ZenQuotes API
async function fetchZenQuote() {
    try {
        const response = await fetch('https://zenquotes.io/api/random');
        if (!response.ok) {
            throw new Error('API request failed');
        }
        const data = await response.json();
        return data[0]; // ZenQuotes returns an array
    } catch (error) {
        console.error('ZenQuotes API error:', error);
        throw error;
    }
}

// Analyze user input to determine mood or extract name
function analyzeInput(input) {
    const lowerInput = input.toLowerCase();
    
    // Check for mood keywords
    const moodKeywords = {
        stressed: ['stress', 'stressed', 'overwhelm', 'pressure', 'anxious', 'worry'],
        anxious: ['anxious', 'nervous', 'worry', 'fear', 'panic', 'uneasy'],
        sad: ['sad', 'down', 'depressed', 'blue', 'unhappy', 'melancholy'],
        happy: ['happy', 'joy', 'excited', 'cheerful', 'glad', 'elated'],
        calm: ['calm', 'peaceful', 'serene', 'tranquil', 'relaxed', 'zen'],
        energetic: ['energetic', 'pumped', 'motivated', 'active', 'vibrant', 'dynamic']
    };
    
    // Find matching mood
    for (const [mood, keywords] of Object.entries(moodKeywords)) {
        if (keywords.some(keyword => lowerInput.includes(keyword))) {
            return { type: 'mood', value: mood, originalInput: input };
        }
    }
    
    // If no mood detected, treat as name
    const name = extractName(input);
    return { type: 'name', value: name, originalInput: input };
}

// Extract name from input
function extractName(input) {
    // Simple name extraction - take first word if it looks like a name
    const words = input.trim().split(' ');
    const firstWord = words[0];
    
    // Capitalize first letter
    return firstWord.charAt(0).toUpperCase() + firstWord.slice(1).toLowerCase();
}

// Generate personalized response
function generatePersonalizedResponse(analysis, zenQuote) {
    let response = '';
    
    if (analysis.type === 'name') {
        // Personalized greeting with name
        const greeting = getRandomItem(nameGreetings).replace('{name}', analysis.value);
        response = `<div class="mb-3"><p class="lead text-success">${greeting}</p></div>`;
    } else {
        // Mood-based response
        response = `<div class="mb-3"><p class="lead text-success">I sense you're feeling ${analysis.value}. Here's some nature wisdom to help:</p></div>`;
    }
    
    // Add ZenQuotes quote if available
    if (zenQuote) {
        response += `
            <div class="quote-card mb-3">
                <div class="quote-text">"${zenQuote.q}"</div>
                <div class="quote-author">— ${zenQuote.a}</div>
            </div>
        `;
    }
    
    // Add mood-specific nature advice
    const moodAdvice = getMoodAdvice(analysis);
    response += `
        <div class="alert alert-success">
            <i class="bi bi-leaf me-2"></i>
            ${moodAdvice}
        </div>
    `;
    
    // Add attribution for ZenQuotes
    if (zenQuote) {
        response += `
            <div class="text-center mt-3">
                <small class="text-muted">
                    Inspirational quotes provided by <a href="https://zenquotes.io/" target="_blank">ZenQuotes API</a>
                </small>
            </div>
        `;
    }
    
    return response;
}

// Get mood-specific advice
function getMoodAdvice(analysis) {
    if (analysis.type === 'mood' && moodResponses[analysis.value]) {
        return getRandomItem(moodResponses[analysis.value]);
    }
    return getRandomItem(moodResponses.default);
}

// Generate fallback response when API fails
function generateFallbackResponse(analysis) {
    let response = '';
    
    if (analysis.type === 'name') {
        const greeting = getRandomItem(nameGreetings).replace('{name}', analysis.value);
        response = `<div class="mb-3"><p class="lead text-success">${greeting}</p></div>`;
    } else {
        response = `<div class="mb-3"><p class="lead text-success">I sense you're feeling ${analysis.value}. Here's some nature wisdom to help:</p></div>`;
    }
    
    const advice = getMoodAdvice(analysis);
    response += `
        <div class="alert alert-success">
            <i class="bi bi-leaf me-2"></i>
            ${advice}
        </div>
    `;
    
    return response;
}

// Display response in the AI response container
function displayResponse(responseHTML) {
    if (aiResponse) {
        aiResponse.innerHTML = responseHTML;
        
        // Add fade-in animation
        aiResponse.style.opacity = '0';
        setTimeout(() => {
            aiResponse.style.transition = 'opacity 0.5s ease';
            aiResponse.style.opacity = '1';
        }, 100);
    }
}

// Regenerate quote with same input
function regenerateQuote() {
    const input = userInput.value.trim();
    if (input) {
        generateAIResponse(input);
    }
}

// Utility function to get random item from array
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Store last response for regeneration
let lastInput = '';

// Update form submit to store input
const originalHandleFormSubmit = handleFormSubmit;
handleFormSubmit = function(e) {
    e.preventDefault();
    const input = userInput.value.trim();
    lastInput = input;
    originalHandleFormSubmit.call(this, e);
};

// Enhanced error handling
function showAIError(message) {
    if (aiResponse) {
        aiResponse.innerHTML = `
            <div class="alert alert-warning" role="alert">
                <i class="bi bi-exclamation-triangle me-2"></i>
                <strong>Oops!</strong> ${message}
                <br><small class="text-muted mt-2">Don't worry - nature's wisdom is always available. Try again in a moment.</small>
            </div>
        `;
    }
}

