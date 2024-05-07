import React, { useEffect, useRef } from "react";
import CopilotConversationCard from "./CopilotConversationCard";
import CopilotConversationLoading from "./CopilotConversationLoading";
import { SenderEnum } from "../../types/enums";
import CopilotConversationSuggestions from "./CopilotConversationSuggestions";

const CopilotConversation = ({ handleSendMessage, isLoading, messages }) => {
    const CopilotConversationRef = useRef(null);
    const showSuggestions = messages.length <= 1;
    const loadingMessage = {
        sender: SenderEnum.Assistant,
        content: <CopilotConversationLoading />,
    };

    const handleClick = (e) =>
        handleSendMessage({
            content: e.currentTarget.textContent,
            sender: SenderEnum.User,
        });

    useEffect(() => {
        if (CopilotConversationRef.current) {
            CopilotConversationRef.current.scrollTo({
                top: 1e9,
                behavior: "smooth",
            });
        }
    }, [messages]);

    return (
        <div
            ref={CopilotConversationRef}
            style={{ height: "100%", overflow: "overlay" }}
        >
            {messages.map((message, i) => (
                <CopilotConversationCard message={message} key={i} />
            ))}
            {showSuggestions && (
                <CopilotConversationSuggestions handleClick={handleClick} />
            )}
            {isLoading && <CopilotConversationCard message={loadingMessage} />}
        </div>
    );
};

export default CopilotConversation;
