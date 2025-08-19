import ChatBotIcon from './ChatBotIcon';

const ChatMessage = ({ chat }) => {
    const messageType = chat && chat.type ? chat.type : 'model';
    const messageText = chat && typeof chat.text === 'string' ? chat.text : 'No message content';

    return (
        <div className={`message ${messageType === 'model' ? 'bot' : 'user'}-message`}>
            {messageType === 'model' && <ChatBotIcon />}
            <p className="message-text">{messageText}</p>
        </div>
    );
};

export default ChatMessage;