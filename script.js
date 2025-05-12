// script.js - Complete DeepSeek-Powered Study Chatbot
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const chatForm = document.getElementById('chatbox-form');
    const chatInput = document.getElementById('chatbox-input');
    const chatMessages = document.getElementById('chatbox-messages');
    const sendBtn = document.getElementById('chatbox-send');

    // API Configuration (⚠️ Replace with your backend URL in production)
    const API_URL = "https://api.deepseek.com/v1/chat/completions";
    const API_KEY = "sk-04262690aafb4aa29baa789dce6d7813"; 


    const studyResponses = {
        math: {
            algebra: "Algebra helps solve for unknowns (like x in equations). Try isolating variables step by step. Example: 2x + 3 = 7 → x = 2",
            calculus: "Calculus has two main branches: derivatives (rates of change) and integrals (accumulation). The derivative of x² is 2x.",
            geometry: "Key geometry formulas:\n- Circle area: πr²\n- Triangle area: (base × height)/2\n- Pythagorean theorem: a² + b² = c²"
        },
        science: {
            biology: "Photosynthesis formula: 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂\nMitochondria produce cellular energy (ATP).",
            chemistry: "The periodic table organizes elements by atomic number. Water is H₂O, and salt is NaCl.",
            physics: "Newton's Laws:\n1. Objects in motion stay in motion\n2. F=ma\n3. Every action has an equal reaction"
        },
        techniques: {
            pomodoro: "Pomodoro technique: Study 25 min, break 5 min. After 4 cycles, take a 30-min break.",
            flashcards: "Flashcards work best with active recall. Use apps like Anki for spaced repetition.",
            mindmap: "Create mind maps by placing a central idea in the middle and branching out related concepts."
        }
    };

    // Add message to chat UI
    function addMessage(sender, content, isHTML = false) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `${sender}-message`;
        
        if (isHTML) {
            msgDiv.innerHTML = `<strong>${sender === 'user' ? 'You' : 'AI'}:</strong> ${content}`;
        } else {
            msgDiv.textContent = `${sender === 'user' ? 'You: ' : 'AI: '}${content}`;
        }
        
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Show/hide typing indicator
    function showTyping() {
        const typing = document.createElement('div');
        typing.id = 'typing-indicator';
        typing.textContent = "AI is thinking...";
        chatMessages.appendChild(typing);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function hideTyping() {
        const typing = document.getElementById('typing-indicator');
        if (typing) typing.remove();
    }

    // Get AI response from DeepSeek
    async function getAIResponse(userMessage) {
        try {
            // For production: Replace with call to your backend proxy
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${API_KEY}` // Remove this line if using backend
                },
                body: JSON.stringify({
                    model: "deepseek-chat",
                    messages: [{ role: "user", content: userMessage }],
                    temperature: 0.7
                })
            });

            if (!response.ok) throw new Error("API request failed");
            
            const data = await response.json();
            return data.choices[0].message.content;
            
        } catch (error) {
            console.error("API Error:", error);
            return getFallbackResponse(userMessage); // Use local knowledge base if API fails
        }
    }

    // Local fallback response generator
    function getFallbackResponse(input) {
        const lowerInput = input.toLowerCase();
        
        // Check subjects
        for (const subject in studyResponses) {
            for (const topic in studyResponses[subject]) {
                if (lowerInput.includes(topic)) {
                    return studyResponses[subject][topic];
                }
            }
        }

        // Default responses
        if (/hello|hi|hey/.test(lowerInput)) {
            return "Hello! I'm your study assistant. Ask me about math, science, or study techniques!";
        }

        if (/thank|thanks/.test(lowerInput)) {
            return "You're welcome! What else can I help with?";
        }

        return "I'm not sure how to help with that. Try asking about:\n- Math concepts\n- Science topics\n- Study techniques";
    }

    // Handle form submission
    async function handleSubmit(e) {
        e.preventDefault();
        const message = chatInput.value.trim();
        
        if (message) {
            addMessage('user', message);
            chatInput.value = '';
            
            showTyping();
            const response = await getAIResponse(message);
            hideTyping();
            
            addMessage('assistant', response);
        }
    }

    // Event listeners
    chatForm.addEventListener('submit', handleSubmit);
    sendBtn.addEventListener('click', handleSubmit);

    // Initial greeting
    setTimeout(() => {
        addMessage('assistant', "Hi! I'm your LazyGenius study assistant. Ask me about any academic topic or study technique!");
    }, 800);
});