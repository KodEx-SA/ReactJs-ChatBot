import { useState, useRef, useEffect } from 'react';
import Groq from 'groq-sdk';
import ChatBotIcon from './components/ChatBotIcon';
import ChatForm from './components/ChatForm';
import ChatMessage from './components/ChatMessage';


const App = () => {
  const [chatHistory, setChatHistory] = useState([ // Initial chat message
    { type: 'model', text: 'Hey there 👋! How can I help you today?' },
  ]);
  const chatBodyRef = useRef(null); // Reference for chat body div

  // Auto-scroll to the latest message
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight; // Scroll to bottom
    }
  }, [chatHistory]); // Re-run when chatHistory changes

  // Generate bot response
  const generateBotResponse = async (userMessage) => { // Accept userMessage as a parameter

    if (!userMessage || typeof userMessage !== 'string' || userMessage.trim() === '') {
      console.warn('Invalid or empty user message:', userMessage);
      return;
    }

    // Add user message to history
    setChatHistory((prev) => [...prev, { type: 'user', text: userMessage }]);

    // Add "Thinking..." placeholder
    setChatHistory((prev) => [...prev, { type: 'model', text: 'Thinking...' }]);

    try {
      const API_KEY = import.meta.env.VITE_GROQ_API_KEY; // Use Groq API key from environment variables

      if (!API_KEY) {
        throw new Error('Groq API key is missing. Check your .env file.');
      }

      const groq = new Groq({ apiKey: API_KEY, dangerouslyAllowBrowser: true }); // Initialize Groq client

      // Format chat history for Groq API
      const messages = [
          ...chatHistory // Use existing chat history
          .filter((chat) => chat.text !== 'Thinking...') // Exclude "Thinking..." from history
          .map(({ type, text }) => ({ // Map to Groq message format
            role: type === 'user' ? 'user' : 'assistant',
            content: text,
          })),
        { role: 'user', content: userMessage }, // Add current user message
      ];

      console.log('Sending Groq API request with messages:', messages);

      // Call Groq chat completion API
      const chatCompletion = await groq.chat.completions.create({
        messages,
        model: 'llama-3.3-70b-versatile', // Specify the model
        temperature: 0.7, // Set temperature for response variability
        max_tokens: 1000, // Limit response length
      });

      const botResponse = chatCompletion.choices[0]?.message?.content || "I couldn't find an answer."; // Safely access response content
      console.log('Received Groq response:', botResponse);

      // Update history with bot response, removing "Thinking..."
      setChatHistory((prev) => [
        ...prev.filter((chat) => chat.text !== 'Thinking...'), // Remove placeholder
        { type: 'model', text: botResponse }, // Add actual bot response
      ]);
    } catch (error) {
      console.error('Error fetching Groq response:', error);
      const errorMessage = "Sorry, I couldn't process your request. Please try again.";

      // Update history with error message, removing "Thinking..."
      setChatHistory((prev) => [
        ...prev.filter((chat) => chat.text !== 'Thinking...'),
        { type: 'model', text: errorMessage },
      ]);
    }
  };

  return (
    <div className="container">
      <div className="chatbot-popup">
        <div className="chat-header">
          <div className="header-info">
            <ChatBotIcon />
            <h2 className="logo-text">AI Assistant</h2>
          </div>
          <button className="material-symbols-rounded">Keyboard_arrow_down</button>
        </div>

        <div className="chat-body" ref={chatBodyRef}>
          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>

        <div className="chat-footer">
          <ChatForm generateBotResponse={generateBotResponse} />
        </div>
      </div>
    </div>
  );
};

export default App;