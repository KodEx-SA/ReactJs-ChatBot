import ChatBotIcon from "./components/ChatBotIcon";
import ChatForm from "./components/ChatForm";
import ChatMessage from "./components/ChatMessage";
import { useState, useRef, useEffect } from "react";

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
      const API_KEY = import.meta.env.VITE_API_KEY;
      const API_URL = import.meta.env.VITE_API_URL;

      if (!API_KEY || !API_URL) {
        throw new Error("API key or URL is missing. Check your .env file.");
      }

      // Format chat history for API, including the new user message
      const formattedHistory = [
        ...chatHistory
          .filter((chat) => chat.text !== "Thinking...")
          .map(({ type, text }) => ({
            role: type === "user" ? "user" : "model",
            parts: [{ text }],
          })),
        { role: "user", parts: [{ text: userMessage }] },
      ];

      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: formattedHistory,
          generationConfig: { temperature: 0.7, maxOutputTokens: 1000 },
        }),
      };

      console.log("Sending API request with body:", requestOptions.body);

      const response = await fetch(`${API_URL}?key=${API_KEY}`, requestOptions);
      const data = await response.json();
      console.log("Raw API response:", data);

      if (!response.ok) {
        console.error("Gemini API error response:", data);
        throw new Error(data.error?.message || "API request failed");
      }

      const botResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't find an answer.";

      // Update history with bot response, removing "Thinking..."
      setChatHistory((prev) => [
        ...prev.filter((chat) => chat.text !== "Thinking..."),
        { type: "model", text: botResponse },
      ]);
    } catch (error) {
      console.error("Error fetching bot response:", error);
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