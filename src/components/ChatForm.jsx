import { useRef } from 'react';

// ChatForm component for user input
const ChatForm = ({ generateBotResponse, isLoading }) => {
  const inputRef = useRef(null);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const userMessage = inputRef.current?.value.trim();
    if (!userMessage) {
      console.warn('Empty input submitted');
      return;
    }

    console.log('Form submitted with user message:', userMessage);
    inputRef.current.value = '';
    generateBotResponse(userMessage);
  };

  return (
    <form className="chat-form" onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        type="text"
        className="message-input"
        placeholder="Message..."
        required
        disabled={isLoading}
      />
      <button type="submit" className="material-symbols-rounded" disabled={isLoading}>
        arrow_upward
      </button>
    </form>
  );
};

export default ChatForm;