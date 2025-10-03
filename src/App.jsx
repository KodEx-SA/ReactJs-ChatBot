import { useState, useEffect, useRef } from 'react';
import Groq from 'groq-sdk';
import ChatBotIcon from './components/ChatBotIcon';
import ChatForm from './components/ChatForm';
import ChatMessage from './components/ChatMessage';

// Constants
const MODEL_NAME = 'llama-3.3-70b-versatile';
const TEMPERATURE = 0.7;
const MAX_TOKENS = 3000;
const INITIAL_MESSAGE = {
  type: 'model',
  text: 'Hey there 👋! How can I help you today? (I\'m an AI assistant powered by Groq, ask me anything!)',
  timestamp: Date.now(),
};
const ERROR_MESSAGE = {
  type: 'model',
  text: 'Sorry, I couldn\'t process your request. Please try again.',
  className: 'error-message',
  timestamp: Date.now(),
};
const THINKING_MESSAGE = {
  type: 'model',
  text: 'Thinking',
  className: 'thinking-message',
  timestamp: Date.now(),
};

const App = () => {
  const [chatHistory, setChatHistory] = useState([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const chatBodyRef = useRef(null);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleGenerateBotResponse = async (userMessage) => {
    if (!userMessage || typeof userMessage !== 'string' || userMessage.trim() === '') {
      console.warn('Invalid or empty user message:', userMessage);
      return;
    }

    setChatHistory((prev) => [
      ...prev,
      { type: 'user', text: userMessage, timestamp: Date.now() },
      { ...THINKING_MESSAGE, id: Date.now() },
    ]);
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      if (!apiKey) {
        throw new Error('Groq API key is missing. Check your .env file.');
      }

      const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });

      const messages = [
        ...chatHistory
          .filter((chat) => chat.text !== THINKING_MESSAGE.text)
          .map(({ type, text }) => ({
            role: type === 'user' ? 'user' : 'assistant',
            content: text,
          })),
        { role: 'user', content: userMessage },
      ];

      const chatCompletion = await groq.chat.completions.create({
        messages,
        model: MODEL_NAME,
        temperature: TEMPERATURE,
        max_tokens: MAX_TOKENS,
      });

      const botResponse = chatCompletion.choices[0]?.message?.content || 'Sorry, no response received.';
      setChatHistory((prev) => [
        ...prev.filter((chat) => chat.text !== THINKING_MESSAGE.text),
        { type: 'model', text: botResponse, timestamp: Date.now() },
      ]);
    } catch (error) {
      console.error('Error fetching Groq response:', error);
      setChatHistory((prev) => [
        ...prev.filter((chat) => chat.text !== THINKING_MESSAGE.text),
        { ...ERROR_MESSAGE, timestamp: Date.now() },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      {isOpen ? (
        <div className="chatbot-popup">
          <div className="chat-header">
            <div className="header-info">
              <ChatBotIcon />
              <h2 className="logo-text">AI Assistant</h2>
            </div>
            <button
              className="material-symbols-rounded"
              onClick={toggleChat}
              aria-label="Close chat window"
            >
              close
            </button>
          </div>
          <div className="chat-body" ref={chatBodyRef}>
            {chatHistory.map((chat, index) => (
              <ChatMessage key={index} chat={chat} />
            ))}
          </div>
          <div className="chat-footer">
            <ChatForm
              generateBotResponse={handleGenerateBotResponse}
              isLoading={isLoading}
              disabled={isLoading}
            />
          </div>
        </div>
      ) : (
        <ChatBotIcon className="floating-chat-icon" onClick={toggleChat} />
      )}
    </div>
  );
};

export default App;