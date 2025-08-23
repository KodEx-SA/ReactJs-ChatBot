import ChatBotIcon from "./components/ChatBotIcon";
import ChatForm from "./components/ChatForm";
import ChatMessage from "./components/ChatMessage";
import { useState, useRef, useEffect } from "react";
import Groq from "groq-sdk";

const App = () => {
  const [chatHistory, setChatHistory] = useState([
    { type: "model", text: "Hey there 👋! How can I help you today?" },
  ]);
  const chatBodyRef = useRef(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Generate bot response
  const generateBotResponse = async (userMessage) => {
    if (!userMessage || typeof userMessage !== "string" || userMessage.trim() === "") {
      console.warn("Invalid or empty user message:", userMessage);
      return;
    }

    // Add user message to history
    setChatHistory((prev) => [...prev, { type: "user", text: userMessage }]);

    // Add "Thinking..." placeholder
    setChatHistory((prev) => [...prev, { type: "model", text: "Thinking..." }]);

    try {
      const API_KEY = import.meta.env.VITE_GROQ_API_KEY;
      if (!API_KEY) {
        throw new Error("Groq API key is missing. Check your .env file.");
      }

      const groq = new Groq({ apiKey: API_KEY, dangerouslyAllowBrowser: true });

      // Format chat history for Groq API, including the new user message
      const messages = [
        ...chatHistory
          .filter((chat) => chat.text !== "Thinking...")
          .map(({ type, text }) => ({
            role: type === "user" ? "user" : "assistant",
            content: text,
          })),
        { role: "user", content: userMessage },
      ];

      console.log("Sending Groq API request with messages:", messages);

      const chatCompletion = await groq.chat.completions.create({
        messages,
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_tokens: 1000,
      });

      const botResponse = chatCompletion.choices[0]?.message?.content || "I couldn't find an answer.";

      // Update history with bot response, removing "Thinking..."
      setChatHistory((prev) => [
        ...prev.filter((chat) => chat.text !== "Thinking..."),
        { type: "model", text: botResponse },
      ]);
    } catch (error) {
      console.error("Error fetching Groq response:", error);
      const errorMessage = "Sorry, I couldn't process your request. Please try again.";
      setChatHistory((prev) => [
        ...prev.filter((chat) => chat.text !== "Thinking..."),
        { type: "model", text: errorMessage },
      ]);
    }
  };

  return (
    <div className="container">
      <div className="chatbot-popup">
        <div className="chat-header">
          <div className="header-info">
            <ChatBotIcon />
            <h2 className="logo-text">Smith-Bot</h2>
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