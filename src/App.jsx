import { useState, useEffect, useRef } from 'react';
import Groq from 'groq-sdk';
import ChatBotIcon from './components/ChatBotIcon';
import ChatForm from './components/ChatForm';
import ChatMessage from './components/ChatMessage';

// Constants for configuration
const MODEL_NAME = 'llama-3.3-70b-versatile';
const TEMPERATURE = 0.7;
const MAX_TOKENS = 3000;
const INITIAL_MESSAGE = {
  type: 'model',
  text: 'Hey there 👋! How can I help you today?',
};
const ERROR_MESSAGE = "Sorry, I couldn't process your request. Please try again.";
const THINKING_MESSAGE = 'Thinking...';

// Main App component for the chatbot
const App = () => {
  const [chatHistory, setChatHistory] = useState([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const chatBodyRef = useRef(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Handle sending user message and fetching bot response
  const handleGenerateBotResponse = async (userMessage) => {
    if (!userMessage || typeof userMessage !== 'string' || userMessage.trim() === '') {
      console.warn('Invalid or empty user message:', userMessage);
      return;
    }

    // Add user message and thinking placeholder
    setChatHistory((prev) => [
      ...prev,
      { type: 'user', text: userMessage },
      { type: 'model', text: THINKING_MESSAGE },
    ]);
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      if (!apiKey) {
        throw new Error('Groq API key is missing. Check your .env file.');
      }

      const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });

      // Prepare messages for API call
      const messages = [
        ...chatHistory
          .filter((chat) => chat.text !== THINKING_MESSAGE)
          .map(({ type, text }) => ({
            role: type === 'user' ? 'user' : 'assistant',
            content: text,
          })),
        { role: 'user', content: userMessage },
      ];

      console.log('Sending Groq API request with messages:', messages);

      // Fetch bot response
      const chatCompletion = await groq.chat.completions.create({
        messages,
        model: MODEL_NAME,
        temperature: TEMPERATURE,
        max_tokens: MAX_TOKENS,
      });

      const botResponse = chatCompletion.choices[0]?.message?.content || ERROR_MESSAGE;
      console.log('Received Groq response:', botResponse);

      // Update history with bot response
      setChatHistory((prev) => [
        ...prev.filter((chat) => chat.text !== THINKING_MESSAGE),
        { type: 'model', text: botResponse },
      ]);
    } catch (error) {
      console.error('Error fetching Groq response:', error);
      setChatHistory((prev) => [
        ...prev.filter((chat) => chat.text !== THINKING_MESSAGE),
        { type: 'model', text: ERROR_MESSAGE },
      ]);
    } finally {
      setIsLoading(false);
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
          <button className="material-symbols-rounded">keyboard_arrow_down</button>
        </div>
        <div className="chat-body" ref={chatBodyRef}>
          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>
        <div className="chat-footer">
          <ChatForm generateBotResponse={handleGenerateBotResponse} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default App;