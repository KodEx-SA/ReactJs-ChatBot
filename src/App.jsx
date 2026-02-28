import { useState, useEffect, useRef, useCallback } from 'react';
import Groq from 'groq-sdk';
import ChatBotIcon from './components/ChatBotIcon';
import ChatForm from './components/ChatForm';
import ChatMessage from './components/ChatMessage';

const MODEL_NAME = 'llama-3.3-70b-versatile';
const TEMPERATURE = 0.7;
const MAX_TOKENS = 3000;

const createInitialMessage = () => ({
  id: 'initial',
  type: 'model',
  text: "Hey there 👋 I'm your AI Assistant — ask me anything, and I'll do my best to help.",
  timestamp: Date.now(),
});

const App = () => {
  const [chatHistory, setChatHistory] = useState([createInitialMessage()]);
  const [isLoading, setIsLoading] = useState(false);
  const chatBodyRef = useRef(null);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const clearChat = useCallback(() => {
    setChatHistory([createInitialMessage()]);
  }, []);

  const handleGenerateBotResponse = async (userMessage) => {
    if (!userMessage?.trim()) return;

    const botMsgId = `bot-${Date.now()}`;

    setChatHistory((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, type: 'user', text: userMessage, timestamp: Date.now() },
      { id: botMsgId, type: 'model', text: '', isThinking: true, timestamp: Date.now() },
    ]);
    setIsLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      if (!apiKey) throw new Error('Groq API key is missing. Check your .env file.');

      const groq = new Groq({ apiKey, dangerouslyAllowBrowser: true });

      const messages = [
        ...chatHistory
          .filter((c) => !c.isThinking && c.text)
          .map(({ type, text }) => ({
            role: type === 'user' ? 'user' : 'assistant',
            content: text,
          })),
        { role: 'user', content: userMessage },
      ];

      const stream = await groq.chat.completions.create({
        messages,
        model: MODEL_NAME,
        temperature: TEMPERATURE,
        max_tokens: MAX_TOKENS,
        stream: true,
      });

      let fullText = '';
      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content || '';
        fullText += delta;
        setChatHistory((prev) =>
          prev.map((c) =>
            c.id === botMsgId ? { ...c, text: fullText, isThinking: false } : c
          )
        );
      }
    } catch (error) {
      setChatHistory((prev) =>
        prev.map((c) =>
          c.id === botMsgId
            ? {
                ...c,
                text: 'Sorry, I couldn\'t process your request. Please try again.',
                isThinking: false,
                isError: true,
              }
            : c
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const messageCount = chatHistory.filter((c) => c.type === 'user').length;

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-brand">
          <ChatBotIcon />
          <div className="brand-text">
            <span className="brand-name">AI Assistant</span>
            <span className="brand-model">llama-3.3-70b</span>
          </div>
        </div>
        <div className="header-actions">
          {messageCount > 0 && (
            <span className="message-count">{messageCount} message{messageCount !== 1 ? 's' : ''}</span>
          )}
          <button className="clear-btn" onClick={clearChat} title="Clear conversation">
            <span className="material-symbols-rounded">delete_sweep</span>
            <span>Clear</span>
          </button>
        </div>
      </header>

      <main className="chat-main">
        <div className="chat-body" ref={chatBodyRef}>
          <div className="messages-container">
            {chatHistory.map((chat) => (
              <ChatMessage key={chat.id} chat={chat} />
            ))}
          </div>
        </div>
      </main>

      <footer className="chat-footer">
        <div className="footer-inner">
          <ChatForm generateBotResponse={handleGenerateBotResponse} isLoading={isLoading} />
          <p className="footer-note">
            AI can make mistakes. Verify important information.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
