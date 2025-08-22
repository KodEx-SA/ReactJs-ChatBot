import ChatBotIcon from './ChatBotIcon';

const ChatMessage = ({ chat }) => {
  const messageType = chat?.type || 'model';
  const messageText = typeof chat?.text === 'string' ? chat.text : 'No message content available';

  return (
    <div className={`message ${messageType === 'model' ? 'bot' : 'user'}-message`}>
      {messageType === 'model' && <ChatBotIcon />}
      <p className="message-text">{messageText}</p>
    </div>
  );
};

export default ChatMessage;