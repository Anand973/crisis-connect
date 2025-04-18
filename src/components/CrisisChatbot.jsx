import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, Loader2 } from 'lucide-react';

const crisisGuidelines = {
  earthquake: [
    "Drop, Cover, and Hold On!",
    "Stay away from windows and heavy furniture",
    "If indoors, stay there; if outdoors, move to an open area",
    "Be prepared for aftershocks",
    "Check for gas leaks and turn off if necessary"
  ],
  flood: [
    "Move to higher ground immediately",
    "Avoid walking or driving through flood waters",
    "Stay tuned to local news for updates",
    "Keep emergency supplies ready",
    "Turn off electricity if water is entering your home"
  ],
  fire: [
    "Call emergency services immediately",
    "Get out of the building as quickly as possible",
    "Stay low to avoid smoke inhalation",
    "Don't use elevators",
    "Meet at a designated safe location"
  ],
  hurricane: [
    "Stay indoors and away from windows",
    "Keep emergency supplies ready",
    "Listen to local authorities",
    "Secure outdoor objects",
    "Have an evacuation plan ready"
  ],
  default: [
    "Stay calm and assess the situation",
    "Call emergency services if needed",
    "Follow local authorities' instructions",
    "Keep emergency supplies ready",
    "Stay informed through reliable sources"
  ]
};

// AI-powered response generation
const generateAIResponse = (userInput, context) => {
  const input = userInput.toLowerCase();
  let response = '';
  let guidelines = crisisGuidelines.default;
  let severity = 'moderate';
  
  // Analyze severity based on keywords
  if (input.includes('severe') || input.includes('serious') || input.includes('critical')) {
    severity = 'high';
  } else if (input.includes('mild') || input.includes('minor')) {
    severity = 'low';
  }

  // Determine crisis type and context
  if (input.includes('earthquake')) {
    guidelines = crisisGuidelines.earthquake;
    if (severity === 'high') {
      response = "⚠️ HIGH SEVERITY EARTHQUAKE ALERT:\n";
      response += "1. " + guidelines[0] + "\n";
      response += "2. " + guidelines[1] + "\n";
      response += "3. " + guidelines[2] + "\n";
      response += "4. " + guidelines[3] + "\n";
      response += "5. " + guidelines[4] + "\n";
      response += "\n🚨 IMMEDIATE ACTION REQUIRED: Call emergency services if trapped or injured.";
    } else {
      response = "Earthquake Safety Guidelines:\n" + guidelines.join("\n");
    }
  } else if (input.includes('flood')) {
    guidelines = crisisGuidelines.flood;
    if (severity === 'high') {
      response = "🌊 FLOOD EMERGENCY ALERT:\n";
      response += "1. " + guidelines[0] + "\n";
      response += "2. " + guidelines[1] + "\n";
      response += "3. " + guidelines[2] + "\n";
      response += "4. " + guidelines[3] + "\n";
      response += "5. " + guidelines[4] + "\n";
      response += "\n⚠️ URGENT: Move to higher ground immediately if water levels are rising.";
    } else {
      response = "Flood Safety Guidelines:\n" + guidelines.join("\n");
    }
  } else if (input.includes('fire')) {
    guidelines = crisisGuidelines.fire;
    if (severity === 'high') {
      response = "🔥 FIRE EMERGENCY ALERT:\n";
      response += "1. " + guidelines[0] + "\n";
      response += "2. " + guidelines[1] + "\n";
      response += "3. " + guidelines[2] + "\n";
      response += "4. " + guidelines[3] + "\n";
      response += "5. " + guidelines[4] + "\n";
      response += "\n🚨 CRITICAL: Evacuate immediately and call 911.";
    } else {
      response = "Fire Safety Guidelines:\n" + guidelines.join("\n");
    }
  } else if (input.includes('hurricane')) {
    guidelines = crisisGuidelines.hurricane;
    if (severity === 'high') {
      response = "🌀 HURRICANE EMERGENCY ALERT:\n";
      response += "1. " + guidelines[0] + "\n";
      response += "2. " + guidelines[1] + "\n";
      response += "3. " + guidelines[2] + "\n";
      response += "4. " + guidelines[3] + "\n";
      response += "5. " + guidelines[4] + "\n";
      response += "\n⚠️ URGENT: Follow evacuation orders if issued.";
    } else {
      response = "Hurricane Safety Guidelines:\n" + guidelines.join("\n");
    }
  } else {
    // Handle general queries with context awareness
    if (context.lastCrisisType) {
      response = `Based on your previous ${context.lastCrisisType} situation:\n`;
      response += guidelines.join("\n");
    } else {
      response = "I can help you with specific crisis situations. Please tell me what type of emergency you're facing (earthquake/flood/fire/hurricane).";
    }
  }

  return response;
};

const CrisisChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: 'Hello! I can help guide you through various crisis situations. What type of emergency are you facing? (earthquake/flood/fire/hurricane)'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [context, setContext] = useState({});
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      type: 'user',
      content: input
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Update context based on user input
    const newContext = { ...context };
    if (input.toLowerCase().includes('earthquake')) newContext.lastCrisisType = 'earthquake';
    else if (input.toLowerCase().includes('flood')) newContext.lastCrisisType = 'flood';
    else if (input.toLowerCase().includes('fire')) newContext.lastCrisisType = 'fire';
    else if (input.toLowerCase().includes('hurricane')) newContext.lastCrisisType = 'hurricane';
    setContext(newContext);

    // Generate AI response
    const response = generateAIResponse(input, newContext);
    
    setMessages(prev => [...prev, { type: 'bot', content: response }]);
    setIsTyping(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary/90 transition-colors"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-xl w-80 h-96 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold">AI Crisis Assistant</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg whitespace-pre-line ${
                    message.type === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleSend}
                disabled={isTyping}
                className="bg-primary text-white p-2 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrisisChatbot; 