import ChatBotIcon from './ChatBotIcon';

const ChatMessage = ({ chat }) => { // Destructure chat prop
  const messageType = chat?.type || 'model'; // Default to 'model' if type is undefined
  const messageText = typeof chat?.text === 'string' ? chat.text : 'No message content available'; // Safely access text

  return (
    <div className={`message ${messageType === 'model' ? 'bot' : 'user'}-message`}>
      {messageType === 'model' && <ChatBotIcon />}
      <p className="message-text">{messageText}</p>
    </div>
  );
};

export default ChatMessage;