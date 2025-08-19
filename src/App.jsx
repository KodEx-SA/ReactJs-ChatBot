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
      // console.warn("Invalid or empty user message:", userMessage);
      return; // Prevent empty or invalid messages
    }

    console.log("User message:", userMessage); // Log user message
    setChatHistory((history) => [...history, { type: "user", text: userMessage }]);

    // Format chat history for the API request
    const formattedHistory = chatHistory
      .filter((chat) => chat.text !== "Thinking...")
      .map(({ type, text }) => ({
        role: type === "user" ? "user" : "model",
        parts: [{ text }],
      }));
    // console.log("Formatted history for API:", formattedHistory); // Log formatted history

    // Add "Thinking..." message
    setChatHistory((history) => [...history, { type: "model", text: "Thinking..." }]);

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [...formattedHistory, { role: "user", parts: [{ text: userMessage }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 1000 },
      }),
    };

    // console.log("Sending API request with body:", requestOptions.body); // Log request body

    try {
      // Environment variables
      const API_KEY = import.meta.env.VITE_API_KEY;
      const API_URL = import.meta.env.VITE_API_URL;

      // Make the API call to get the bot response
      const response = await fetch(`${API_URL}?key=${API_KEY}`, requestOptions);
      const data = await response.json();
      if (!response.ok) {
        console.error("Gemini API error response:", data);
        throw new Error(data.error?.message || "Something went wrong!");
      }

      const botResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't find an answer.";
      console.log("Gemini response:", botResponse); // Log bot response

      // Update chat history with bot response
      setChatHistory((history) => {
        const updatedHistory = history.filter((chat) => chat.text !== "Thinking...");
        console.log("Updated chat history:", [...updatedHistory, { type: "model", text: botResponse }]); // Log final chat history
        return [...updatedHistory, { type: "model", text: botResponse }];
      });
    } catch (error) {
      console.error("Error fetching bot response:", error);
      const errorMessage = "Sorry, I couldn't process your request. Please try again.";
      console.log("Adding error message to chat history:", errorMessage);

      // Update chat history with error message
      setChatHistory((history) => {
        const updatedHistory = history.filter((chat) => chat.text !== "Thinking...");
        return [...updatedHistory, { type: "model", text: errorMessage }];
      });
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