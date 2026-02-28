import { useState } from 'react';
import ChatBotIcon from './ChatBotIcon';
import MarkdownRenderer from './MarkdownRenderer';

const CopyIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ThinkingDots = () => (
  <div className="thinking-dots">
    <span />
    <span />
    <span />
  </div>
);

const ChatMessage = ({ chat }) => {
  const [copied, setCopied] = useState(false);

  const isUser = chat?.type === 'user';
  const isThinking = chat?.isThinking;
  const isError = chat?.isError;

  const timestamp = chat?.timestamp
    ? new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  const handleCopy = () => {
    if (!chat?.text) return;
    navigator.clipboard.writeText(chat.text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className={`message ${isUser ? 'user-message' : 'bot-message'} ${isError ? 'error-message' : ''}`}>
      {!isUser && (
        <div className="bot-avatar">
          <ChatBotIcon />
        </div>
      )}

      <div className="message-inner">
        <div className="message-bubble">
          {isThinking ? (
            <ThinkingDots />
          ) : isUser ? (
            <p className="user-text">{chat.text}</p>
          ) : (
            <MarkdownRenderer text={chat.text} />
          )}
        </div>

        {!isThinking && (
          <div className={`message-meta ${isUser ? 'meta-user' : 'meta-bot'}`}>
            {timestamp && <span className="message-time">{timestamp}</span>}
            {!isUser && chat?.text && (
              <button className="copy-btn" onClick={handleCopy} title="Copy message">
                {copied ? <CheckIcon /> : <CopyIcon />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            )}
          </div>
        )}
      </div>

      {isUser && <div className="user-avatar">You</div>}
    </div>
  );
};

export default ChatMessage;
