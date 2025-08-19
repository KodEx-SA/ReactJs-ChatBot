import React, { useRef } from "react";

const ChatForm = ({ generateBotResponse }) => {
    const inputRef = useRef();

    const handleFormSubmit = (e) => {
        e.preventDefault();

        const userMessage = inputRef.current.value.trim();
        if (!userMessage) {
            console.warn("Empty input submitted");
            return;
        }
        inputRef.current.value = ""; // Clear input

        console.log("Submitting user message:", userMessage); // Log user message
        generateBotResponse(userMessage); // Pass only the user message
    };

    return (
        <form action="" className="chat-form" onSubmit={handleFormSubmit}>
            <input
                ref={inputRef}
                type="text"
                className="message-input"
                placeholder="Message..."
                required
            />
            <button className="material-symbols-rounded">arrow_upward</button>
        </form>
    );
};

export default ChatForm;