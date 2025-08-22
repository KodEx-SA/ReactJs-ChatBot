import React, { useRef } from "react";

const ChatForm = ({ generateBotResponse }) => {
  const inputRef = useRef();

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const userMessage = inputRef.current.value.trim();
    if (!userMessage) {
      console.warn("Empty input submitted");
      return;
    }

    console.log("Form submitted with user message:", userMessage); // Added for debugging
    inputRef.current.value = ""; // Clear input after validation
    generateBotResponse(userMessage);
  };

  return (
    <form action="" className="chat-form" onSubmit={handleFormSubmit}>
      <input
        ref={inputRef}
        type="text"
        className="message-input"
        placeholder="Message..."
        required
      />
      <button type="submit" className="material-symbols-rounded">arrow_upward</button>
    </form>
  );
};

export default ChatForm;