import ChatBotIcon from './ChatBotIcon'; // Import the ChatBot icon component

const ChatMessage = ({chat}) => {
    return (
        <div className={`message ${chat.type === "model" ? "bot" : "user"}-message`}>
            {chat.type === "model" && <ChatBotIcon /> /* Display ChatBot icon for bot messages */}
            <p className="message-text">
                {chat.text}
            </p>
        </div>
    )
}

export default ChatMessage