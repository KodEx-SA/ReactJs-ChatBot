import ChatBotIcon from "./ChatBotIcon";

const ChatMessage = ({ chat }) => {
  // Debug log to check props
  console.log("ChatMessage props:", chat);

  const messageType = chat?.type || "model";
  const messageText =
    typeof chat?.text === "string"
      ? messageType === "user"
        ? chat.text.replace(/\n/g, " ")
        : chat.text
      : "No message content available";
  const isThinking = chat?.className === "thinking-message";
  const isError = chat?.className === "error-message";
  const timestamp = chat?.timestamp
    ? new Date(chat.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
    : "";

  return (
    <div
      className={`message ${messageType === "model" ? "bot-message" : "user-message"} ${isError ? "error-message" : ""} ${isThinking ? "thinking-message" : ""}`}
      aria-live="polite"
    >
      {messageType === "model" && <ChatBotIcon />}
      <div className="message-content">
        <p
          className={`message-text ${messageType === "model" ? "bot-message-text" : "user-message-text"}`}
        >
          {isThinking ? (
            <span className="thinking-dots">
              <span></span>
              <span></span>
              <span></span>
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
