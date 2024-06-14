import React, { useEffect, useRef, useState } from "react";
import CopilotConversationCard from "./CopilotConversationCard";
import CopilotConversationLoading from "./CopilotConversationLoading";
import { SenderEnum } from "../../types/enums";
import CopilotConversationSuggestions from "./CopilotConversationSuggestions";
import AletheiaButton from "../Button";
import { useTranslation } from "next-i18next";
import CopilotFeedback from "./CopilotFeedback";

const CopilotConversation = ({
    manager,
    handleSendMessage,
    isLoading,
    messages,
    editorReport,
}) => {
    const { t } = useTranslation();
    const CopilotConversationRef = useRef(null);
    const [showButtons, setShowButtons] = useState({
        ADD_REPORT: true,
        ADD_RATE: false,
    });
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
    }, [messages, showButtons]);

    const handleAddReportClick = () => {
        manager.view.updateState(manager.createState(editorReport));
        setShowButtons({
            ADD_REPORT: false,
            ADD_RATE: true,
        });
    };

    return (
        <div
            ref={CopilotConversationRef}
            style={{ height: "100%", overflow: "overlay" }}
        >
            {messages.map((message) => (
                <CopilotConversationCard
                    message={message}
                    key={message.content}
                />
            ))}
            {showSuggestions && (
                <CopilotConversationSuggestions handleClick={handleClick} />
            )}
            {showButtons.ADD_REPORT && editorReport && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        margin: 16,
                    }}
                >
                    <AletheiaButton onClick={handleAddReportClick}>
                        {t("copilotChatBot:addFactCheckingReportButton")}
                    </AletheiaButton>
                </div>
            )}
            {showButtons.ADD_RATE && (
                <CopilotFeedback setShowButtons={setShowButtons} />
            )}
            {isLoading && <CopilotConversationCard message={loadingMessage} />}
        </div>
    );
};

export default CopilotConversation;
