import ChatBotIcon from "./components/ChatBotIcon"
import ChatForm from "./components/ChatForm"

const App = () => {
  return (
    <div className="container">
      <div className="chatbot-popup">
        <div className="chat-header">
          {/* ChatBot header */}
          <div className="header-info">
            <ChatBotIcon />
            <h2 className="logo-text">Smith-Bot</h2>
          </div>
          <button className="material-symbols-rounded">Keyboard_arrow_down</button>
        </div>

        {/* ChatBot body */}
        <div className="chat-body">
          <div className="message bot-message">
            <ChatBotIcon />
            <p className="message-text">
              Hey there 👋!. <br /> How can I help you today?
            </p>
          </div>

          <div className="message user-message">
            <p className="message-text">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sit, 
              error corrupti laboriosam officiis aperiam asperiores temporibus aspernatur veniam odit mollitia, 
              recusandae labore molestias minus inventore optio neque consequatur, ad quibusdam?
            </p>
          </div>
        </div>

        {/* ChatBot footer */}
        <div className="chat-footer">
          <ChatForm />
        </div>
      </div>
    </div>
  )
}

export default App