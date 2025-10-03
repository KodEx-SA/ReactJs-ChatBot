import { useRef } from 'react';

const ChatForm = ({ generateBotResponse, isLoading, disabled }) => {
  const inputRef = useRef(null);

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
    <form className="chat-form" onSubmit={handleSubmit} role="form" aria-label="Chat input form">
      <input
        ref={inputRef}
        type="text"
        className="message-input"
        placeholder="Type a message..."
        autoFocus
        disabled={disabled || isLoading}
        role="textbox"
        aria-label="Message input"
      />
      <button
        type="submit"
        className="material-symbols-rounded"
        disabled={disabled || isLoading}
        aria-label="Send message"
      >
        send
      </button>
    </form>
  );
};

export default ChatForm;