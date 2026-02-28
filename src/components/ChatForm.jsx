import { useRef, useCallback } from 'react';

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const ChatForm = ({ generateBotResponse, isLoading }) => {
  const textareaRef = useRef(null);

  const handleSubmit = useCallback(() => {
    const value = textareaRef.current?.value.trim();
    if (!value || isLoading) return;
    textareaRef.current.value = '';
    textareaRef.current.style.height = 'auto';
    generateBotResponse(value);
  }, [generateBotResponse, isLoading]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e) => {
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 160) + 'px';
  };

  return (
    <div className="chat-form">
      <textarea
        ref={textareaRef}
        className="message-input"
        placeholder="Message AI Assistant... (Shift+Enter for new line)"
        rows={1}
        disabled={isLoading}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        aria-label="Message input"
      />
      <button
        className="send-btn"
        onClick={handleSubmit}
        disabled={isLoading}
        aria-label="Send message"
        title="Send (Enter)"
      >
        {isLoading ? (
          <span className="send-spinner" />
        ) : (
          <SendIcon />
        )}
      </button>
    </div>
  );
};

export default ChatForm;
