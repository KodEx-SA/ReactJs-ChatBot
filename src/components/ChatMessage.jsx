import ChatBotIcon from './ChatBotIcon';

const ChatMessage = ({ chat }) => {
  const messageType = chat?.type || 'model';
  const messageText = typeof chat?.text === 'string' ? chat.text : 'No message content available';
  const isThinking = chat?.className === 'thinking-message';
  const timestamp = chat?.timestamp ? new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <div className={`message ${messageType === 'model' ? 'bot-message' : 'user-message'} ${chat.className || ''}`} aria-live="polite">
      {messageType === 'model' && <ChatBotIcon />}
      <div className="message-content">
        <p className="message-text">
          {isThinking ? (
            <span className="thinking-dots">
              <span></span><span></span><span></span>
            </span>
          ) : (
            messageText
          )}
        </p>
        {timestamp && <span className="message-timestamp">{timestamp}</span>}
      </div>
    </div>
  );
};

export default ChatMessage;