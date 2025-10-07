// ===== AI CHATBOT WITH DEEPSEEK API =====

// Configuration
const CHATBOT_CONFIG = {
    apiEndpoint: 'https://api.deepseek.com/v1/chat/completions',
    apiKey: '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', // Add your DeepSeek API key here
    model: 'deepseek-chat',
    maxTokens: 2000,
    temperature: 0.7,
};

// Portfolio knowledge base for AI training
const KNOWLEDGE_BASE = {
    owner: {
        name: 'Anunay Anand',
        role: 'Web Developer & Designer',
        company: 'AniDev UniStudio',
        location: 'Bihar, India',
        email: 'anidev2025@gmail.com',
        expertise: ['Web Development', 'UI/UX Design', 'React', 'JavaScript', 'Responsive Design', 'SEO Optimization', 'AI Integration']
    },
    services: {
        static: {
            name: 'Static Website',
            price: '₹1,499+',
            delivery: '2 to 6 days',
            features: ['1-3 Static Pages', 'Responsive Design', 'Basic Contact Form', 'Animations', 'Free 1 Month Support']
        },
        dynamic: {
            name: 'Dynamic Website',
            price: '₹3,499+',
            delivery: '6 to 10 days',
            features: ['4-7 Pages', 'SEO Friendly', 'Contact Forms', 'Image Gallery', 'Better Animations', '3 Redesigns', 'Free 3 Month Support'],
            popular: true
        },
        premium: {
            name: 'Premium Website',
            price: '₹5,999+',
            delivery: '9 to 20 days',
            features: ['8-15 Pages', 'Advanced Design', 'SEO + Speed Optimization', 'Google Maps', '3 Full Remakes', 'AI Integration', 'Free 6 Month Support']
        }
    },
    addons: {
        domain: { name: 'Domain Registration', price: '₹899/year' },
        hosting: { name: 'Hosting with Setup', price: '₹459/year' },
        logo: { name: 'Logo Design', price: '₹299' },
        content: { name: 'Content Writing', price: '₹299/page' }
    },
    contact: {
        email: 'anidev2025@gmail.com',
        location: 'India',
        availability: 'Available for freelance projects'
    }
};

// System prompt for AI training
const SYSTEM_PROMPT = `You are Aurax, a friendly and intelligent AI assistant for AniDev UniStudio, a web development company owned by Anunay Anand. Your name is Aurax and you are a versatile AI assistant who can help with both professional and casual conversations.

IMPORTANT: When asked who you are, always say "I am Aurax, an AI assistant" - NOT Anunay Anand. Anunay Anand is the owner of the company, you are his AI assistant.

ABOUT THE COMPANY OWNER:
- Name: Anunay Anand (the human owner, NOT you)
- Role: Web Developer & Designer, Founder of AniDev UniStudio
- Location: Bihar, India
- Email: anidev2025@gmail.com
- Expertise: Web Development, UI/UX Design, React, JavaScript, Responsive Design, SEO, AI Integration

YOUR ROLE AS AURAX:
- You are a friendly, conversational AI assistant
- You can answer ANY question - technical, casual, fun, or general
- You tell jokes, share facts, have casual conversations
- You help with web development questions and recommendations
- You provide technology advice and explain services
- You are knowledgeable about many topics, not just web development
- You have a personality - be friendly, helpful, and sometimes funny

SERVICES OFFERED:

1. STATIC WEBSITE (₹1,499+)
   - Delivery: 2-6 days
   - Features: 1-3 pages, responsive design, basic contact form, animations, 1 month support

2. DYNAMIC WEBSITE (₹3,499+) [MOST POPULAR]
   - Delivery: 6-10 days
   - Features: 4-7 pages, SEO friendly, contact forms, image gallery, better animations, 3 redesigns, 3 months support

3. PREMIUM WEBSITE (₹5,999+)
   - Delivery: 9-20 days
   - Features: 8-15 pages, advanced design, SEO + speed optimization, Google Maps, 3 full remakes, AI integration, 6 months support

ADD-ON SERVICES:
- Domain Registration: ₹899/year
- Hosting with Setup: ₹459/year
- Logo Design: ₹299
- Content Writing: ₹299/page

GUIDELINES:
- Always identify yourself as "Aurax, an AI assistant" when asked who you are
- Never say you are Anunay Anand - he is the owner, you are his AI assistant
- Answer ALL types of questions - jokes, facts, casual chat, technical questions, etc.
- Be friendly, conversational, and helpful with a touch of personality
- Tell jokes when asked, share interesting facts, have fun conversations
- For web development questions: provide accurate pricing, timelines, and tech recommendations
- Suggest modern frameworks: React, Next.js, Tailwind CSS, Node.js, etc.
- For business inquiries: encourage using the contact form or popup
- If asked about custom projects, mention that prices may vary
- Highlight the most popular package (Dynamic Website) when relevant
- Be honest if you don't know something specific
- Use emojis to be friendly and engaging
- Keep responses concise but informative
- Show personality - be warm, helpful, and sometimes humorous

Remember: You're not just a business bot - you're a friendly AI who can chat about anything!`;

// Chat state
let chatHistory = [];
let currentFile = null;
let isTyping = false;

// Initialize chatbot
function initChatbot() {
    const toggle = document.getElementById('chatbot-toggle');
    const window = document.getElementById('chatbot-window');
    
    if (toggle && window) {
        // Add click event listener to toggle button
        toggle.addEventListener('click', toggleChatbot);
        
        // Load chat history from localStorage
        loadChatHistory();
        
        console.log('✅ AI Chatbot Initialized');
        console.log('✅ DeepSeek API Key Configured');
    }
}

// Toggle chatbot window
function toggleChatbot() {
    const toggle = document.getElementById('chatbot-toggle');
    const window = document.getElementById('chatbot-window');
    const icon = toggle.querySelector('.chatbot-icon');
    const closeIcon = toggle.querySelector('.chatbot-close-icon');
    
    window.classList.toggle('hidden');
    icon.classList.toggle('hidden');
    closeIcon.classList.toggle('hidden');
    
    if (!window.classList.contains('hidden')) {
        // Focus input when opening
        setTimeout(() => {
            document.getElementById('chatbot-input').focus();
        }, 300);
        
        // Hide suggestions after first interaction
        if (chatHistory.length > 1) {
            document.getElementById('chatbot-suggestions').style.display = 'none';
        }
    }
}

// Send message
async function sendMessage() {
    const input = document.getElementById('chatbot-input');
    const message = input.value.trim();
    
    if (!message && !currentFile) return;
    
    // Add user message to chat
    addMessage(message, 'user', currentFile);
    input.value = '';
    
    // Hide suggestions
    document.getElementById('chatbot-suggestions').style.display = 'none';
    
    // Clear file
    if (currentFile) {
        document.getElementById('file-preview').innerHTML = '';
        currentFile = null;
    }
    
    // Show typing indicator
    showTypingIndicator();
    
    // Get AI response
    try {
        const response = await getAIResponse(message);
        hideTypingIndicator();
        addMessage(response, 'bot');
    } catch (error) {
        hideTypingIndicator();
        addMessage('Sorry, I encountered an error. Please try again or contact us directly at anidev2025@gmail.com', 'bot');
        console.error('Chatbot error:', error);
    }
    
    // Save chat history
    saveChatHistory();
}

// Send suggestion
function sendSuggestion(text) {
    document.getElementById('chatbot-input').value = text;
    sendMessage();
}

// Handle key press
function handleChatKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

// Add message to chat
function addMessage(text, sender, file = null) {
    const messagesContainer = document.getElementById('chatbot-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    let content = '';
    
    if (sender === 'bot') {
        content = `
            <div class="message-avatar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
            </div>
        `;
    }
    
    content += `<div class="message-content">`;
    
    if (file) {
        content += `
            <div class="message-file">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                    <polyline points="13,2 13,9 20,9"></polyline>
                </svg>
                <span>${file.name}</span>
            </div>
        `;
    }
    
    if (text) {
        content += `<p>${formatMessage(text)}</p>`;
    }
    
    content += `</div>`;
    messageDiv.innerHTML = content;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Add to history
    chatHistory.push({ text, sender, file: file ? file.name : null, timestamp: Date.now() });
}

// Format message with markdown-like syntax
function formatMessage(text) {
    // Convert URLs to links
    text = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
    
    // Convert line breaks
    text = text.replace(/\n/g, '<br>');
    
    // Convert **bold**
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convert *italic*
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    return text;
}

// Show typing indicator
function showTypingIndicator() {
    const messagesContainer = document.getElementById('chatbot-messages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing-indicator';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `
        <div class="message-avatar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
            </svg>
        </div>
        <div class="message-content">
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    isTyping = true;
}

// Hide typing indicator
function hideTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.remove();
    }
    isTyping = false;
}

// Get AI response from DeepSeek
async function getAIResponse(userMessage) {
    // Check if API key is configured
    if (!CHATBOT_CONFIG.apiKey) {
        return getFallbackResponse(userMessage);
    }
    
    try {
        // Build conversation history
        const messages = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...chatHistory.slice(-10).map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.text
            })),
            { role: 'user', content: userMessage }
        ];
        
        const response = await fetch(CHATBOT_CONFIG.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${CHATBOT_CONFIG.apiKey}`
            },
            body: JSON.stringify({
                model: CHATBOT_CONFIG.model,
                messages: messages,
                max_tokens: CHATBOT_CONFIG.maxTokens,
                temperature: CHATBOT_CONFIG.temperature,
                stream: false
            })
        });
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        return data.choices[0].message.content;
        
    } catch (error) {
        console.error('DeepSeek API error:', error);
        return getFallbackResponse(userMessage);
    }
}

// Fallback response when API is not available
function getFallbackResponse(userMessage) {
    const msg = userMessage.toLowerCase();
    
    // Jokes
    if (msg.includes('joke') || msg.includes('funny') || msg.includes('laugh')) {
        const jokes = [
            "Why do programmers prefer dark mode? Because light attracts bugs! 🐛😄",
            "Why did the developer go broke? Because he used up all his cache! 💰😂",
            "How many programmers does it take to change a light bulb? None, that's a hardware problem! 💡😄",
            "Why do Java developers wear glasses? Because they don't C#! 👓😂",
            "What's a programmer's favorite hangout place? Foo Bar! 🍺😄",
            "Why did the web developer walk out of the restaurant in disgust? The seating was laid out in tables! 🍽️😂"
        ];
        return jokes[Math.floor(Math.random() * jokes.length)];
    }
    
    // Greetings
    if (msg.includes('hello') || msg.includes('hi ') || msg.includes('hey') || msg === 'hi' || msg === 'hey') {
        return `Hey there! 👋 I'm Aurax, your friendly AI assistant. I can help you with web development questions, tell jokes, chat about tech, or just have a casual conversation. What's on your mind?`;
    }
    
    // How are you
    if (msg.includes('how are you') || msg.includes('how r u') || msg.includes('whats up')) {
        return `I'm doing great, thanks for asking! 😊 I'm here and ready to help. Whether you need web development advice, want to hear a joke, or just want to chat - I'm all ears! What can I do for you?`;
    }
    
    // Fun facts
    if (msg.includes('fact') || msg.includes('interesting') || msg.includes('tell me something')) {
        const facts = [
            "Did you know? The first website ever created is still online! It was made by Tim Berners-Lee in 1991. 🌐",
            "Fun fact: The average person spends about 6 hours and 42 minutes online each day! ⏰",
            "Did you know? JavaScript was created in just 10 days by Brendan Eich in 1995! 🚀",
            "Interesting: The first computer bug was an actual bug - a moth found in a computer in 1947! 🦋",
            "Did you know? Google processes over 8.5 billion searches per day! 🔍"
        ];
        return facts[Math.floor(Math.random() * facts.length)];
    }
    
    // Service inquiries
    if (msg.includes('service') || msg.includes('offer') || msg.includes('package')) {
        return `I offer three main website packages:\n\n**Static Website** - ₹1,499+ (2-6 days)\nPerfect for simple sites with 1-3 pages.\n\n**Dynamic Website** - ₹3,499+ (6-10 days) 🌟 Most Popular\nGreat for businesses with 4-7 pages and better features.\n\n**Premium Website** - ₹5,999+ (9-20 days)\nComplete solution with 8-15 pages and advanced features.\n\nI also offer add-ons like domain registration, hosting, logo design, and content writing. Would you like to know more about any specific package?`;
    }
    
    // Pricing inquiries
    if (msg.includes('price') || msg.includes('cost') || msg.includes('how much')) {
        return `Here are my pricing packages:\n\n💼 **Static Website**: ₹1,499+\n💼 **Dynamic Website**: ₹3,499+ (Most Popular)\n💼 **Premium Website**: ₹5,999+\n\n**Add-ons:**\n🌐 Domain Registration: ₹899/year\n🖥️ Hosting: ₹459/year\n🎨 Logo Design: ₹299\n✍️ Content Writing: ₹299/page\n\nPrices may vary based on custom requirements. Would you like to request a quote?`;
    }
    
    // Timeline inquiries
    if (msg.includes('time') || msg.includes('long') || msg.includes('delivery') || msg.includes('when')) {
        return `Project timelines:\n\n⏱️ **Static Website**: 2-6 days\n⏱️ **Dynamic Website**: 6-10 days\n⏱️ **Premium Website**: 9-20 days\n\nTimelines may vary based on project complexity and your specific requirements. Quality work delivered on time! 💪`;
    }
    
    // Contact inquiries
    if (msg.includes('contact') || msg.includes('email') || msg.includes('reach')) {
        return `You can reach us at:\n\n📧 **Email**: anidev2025@gmail.com\n📍 **Location**: India\n\nYou can also use the contact form on this website or click the "Get Started" button on any service package. We typically respond within 24 hours! ⚡`;
    }
    
    // About inquiries
    if (msg.includes('who') || msg.includes('about') || msg.includes('you') || msg.includes('aurax')) {
        return `I'm **Aurax**, a friendly AI assistant for AniDev UniStudio! 🤖\n\nI can help you with:\n💬 Any questions (tech or casual)\n🎭 Jokes and fun facts\n💡 Technology recommendations\n💼 Service information\n💰 Pricing details\n\nThe company is owned by **Anunay Anand**, a skilled web developer based in Bihar, India.\n\nFeel free to ask me anything - I'm here to chat! 😊`;
    }
    
    // Thank you
    if (msg.includes('thank') || msg.includes('thanks')) {
        return `You're welcome! 😊 Happy to help! If you need anything else - whether it's web development advice, a joke, or just a chat - I'm here for you! 💙`;
    }
    
    // Goodbye
    if (msg.includes('bye') || msg.includes('goodbye') || msg.includes('see you')) {
        return `Goodbye! 👋 It was great chatting with you. Feel free to come back anytime - I'm always here to help! Have an awesome day! ✨`;
    }
    
    // Default response
    return `I'm here to help! 😊 You can ask me about:\n\n💼 Web development services\n💰 Pricing and packages\n🎭 Jokes or fun facts\n💡 Tech recommendations\n💬 Or just chat about anything!\n\nWhat would you like to know?`;
}

// Handle file selection
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
    }
    
    currentFile = file;
    
    // Show file preview
    const preview = document.getElementById('file-preview');
    preview.innerHTML = `
        <div class="file-preview-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                <polyline points="13,2 13,9 20,9"></polyline>
            </svg>
            <span>${file.name}</span>
            <button onclick="clearFile()" class="file-remove">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
    `;
}

// Clear file
function clearFile() {
    currentFile = null;
    document.getElementById('file-preview').innerHTML = '';
    document.getElementById('chatbot-file-input').value = '';
}

// Clear chat
function clearChat() {
    if (confirm('Are you sure you want to clear the chat history?')) {
        chatHistory = [];
        const messagesContainer = document.getElementById('chatbot-messages');
        messagesContainer.innerHTML = `
            <div class="message bot-message">
                <div class="message-avatar">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                    </svg>
                </div>
                <div class="message-content">
                    <p>Chat cleared! How can I help you?</p>
                </div>
            </div>
        `;
        document.getElementById('chatbot-suggestions').style.display = 'flex';
        localStorage.removeItem('chatbot_history');
    }
}

// Save chat history to localStorage
function saveChatHistory() {
    try {
        localStorage.setItem('chatbot_history', JSON.stringify(chatHistory.slice(-50))); // Keep last 50 messages
    } catch (e) {
        console.error('Failed to save chat history:', e);
    }
}

// Load chat history from localStorage
function loadChatHistory() {
    try {
        const saved = localStorage.getItem('chatbot_history');
        if (saved) {
            chatHistory = JSON.parse(saved);
            
            // Restore messages
            const messagesContainer = document.getElementById('chatbot-messages');
            messagesContainer.innerHTML = '';
            
            chatHistory.forEach(msg => {
                addMessage(msg.text, msg.sender, msg.file ? { name: msg.file } : null);
            });
            
            if (chatHistory.length > 1) {
                document.getElementById('chatbot-suggestions').style.display = 'none';
            }
        }
    } catch (e) {
        console.error('Failed to load chat history:', e);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initChatbot);
