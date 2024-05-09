import React, { useContext, useEffect, useRef } from "react";
import CopilotConversationCard from "./CopilotConversationCard";
import CopilotConversationLoading from "./CopilotConversationLoading";
import { SenderEnum } from "../../types/enums";
import CopilotConversationSuggestions from "./CopilotConversationSuggestions";
import AletheiaButton from "../Button";
import { CollaborativeEditorContext } from "../Collaborative/CollaborativeEditorProvider";
import { RemirrorContentType } from "remirror";
import { useTranslation } from "next-i18next";

const CopilotConversation = ({
    handleSendMessage,
    isLoading,
    messages,
    editorReport,
}) => {
    const { t } = useTranslation();
    const { setEditorContentObject, setShouldInsertAIReport } = useContext(
        CollaborativeEditorContext
    );
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

    const handleAddReportClick = () => {
        setShouldInsertAIReport(true);
        setEditorContentObject(editorReport as RemirrorContentType);
    };

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
            {editorReport && (
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
            {isLoading && <CopilotConversationCard message={loadingMessage} />}
        </div>
    );
};

export default CopilotConversation;
