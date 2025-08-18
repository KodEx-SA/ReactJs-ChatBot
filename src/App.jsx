import ChatBotIcon from "./components/ChatBotIcon"
import ChatForm from "./components/ChatForm"
import ChatMessage from "./components/ChatMessage"
import { useState } from "react";

const App = () => {
  const [chatHistory, setChatHistory] = useState([]);

  // generate bot response
  const generateBotResponse = async (history) => {

    // Format chat history for the API request
    history = history.map((type, text) => ({ type, parts: [{ text }] }));

    const requestOptions = {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: history })
    }

    try {
      // Make the API call to get the bot response
      const response = await fetch(import.meta.env.VITE_API_URL, requestOptions);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error.message || "Something went wrong");
      console.log(data);
    } catch (error) {
      console.error("Error fetching bot response:", error);
    }
  };

  return (
    <div className="container">
      <div className="chatbot-popup">
        <div className="chat-header">
          {/* ChatBot header */}
          <div className="header-info">
            <ChatBotIcon />
            <h2 className="logo-text">Smith-Bot</h2>
          </div>
          <button className="material-symbols-rounded">Keyboard_arrow_down</button>
        </div>

        {/* ChatBot body */}
        <div className="chat-body">
          <div className="message bot-message">
            <ChatBotIcon />
            <p className="message-text">
              Hey there 👋!. <br /> How can I help you today?
            </p>
          </div>

          {/* Display/render chat history dynamically */}
          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>

        {/* ChatBot footer */}
        <div className="chat-footer">
          <ChatForm chatHistory={chatHistory} setChatHistory={setChatHistory} generateBotResponse={generateBotResponse} />
        </div>
      </div>
    </div>
  )
}

export default App