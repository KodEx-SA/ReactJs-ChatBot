import ChatBotIcon from "./components/ChatBotIcon"
import ChatForm from "./components/ChatForm"
import ChatMessage from "./components/ChatMessage"
import { useState } from "react";

const App = () => {
  const [chatHistory, setChatHistory] = useState([]);

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

          {/* Display chat history */}
          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>

        {/* ChatBot footer */}
        <div className="chat-footer">
          <ChatForm setChatHistory={setChatHistory} />
        </div>
      </div>
    </div>
  )
}

export default App