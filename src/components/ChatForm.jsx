import React, { useRef } from "react";

const ChatForm = ({chatHistory, setChatHistory, generateBotResponse}) => {
    const inputRef = useRef();
    
    const handleFormSubmit = (e) => {
        e.preventDefault();

        const userMessage = inputRef.current.value.trim();
        if (!userMessage) return;
        inputRef.current.value = "";
        
        // update chat history with user message
        setChatHistory(history => [...history, { type: 'user', text: userMessage }]);

        // "Thinking..." message
        setTimeout(() => setChatHistory((history) => [...history, { type: 'model', text: "Thinking..." }]), 600);

        generateBotResponse([...chatHistory, { type: 'user', text: userMessage }]);
    };

    return (
        <form action="" className="chat-form" onSubmit={handleFormSubmit}>
            <input ref={inputRef} type="text" className="message-input" placeholder="Message...." required />
            <button className="material-symbols-rounded">arrow_upward</button>
        </form>
    )
}

export default ChatForm