import React, { useRef } from 'react';

const ChatForm = ({ generateBotResponse }) => { // Receive generateBotResponse as a prop
  const inputRef = useRef(); // Reference for the input field

  const handleFormSubmit = (e) => { // Handle form submission
    e.preventDefault();

    const userMessage = inputRef.current.value.trim();
    if (!userMessage) {
      console.warn('Empty input submitted');
      return;
    }

    console.log('Form submitted with user message:', userMessage);
    inputRef.current.value = '';
    generateBotResponse(userMessage); // Call the function passed via props
  };

  return (
    <form className="chat-form" onSubmit={handleFormSubmit}>
      <input
        ref={inputRef}
        type="text"
        className="message-input"
        placeholder="Message..."
        required
      />
      <button type="submit" className="material-symbols-rounded">
        arrow_upward
      </button>
    </form>
  );
};

export default ChatForm;