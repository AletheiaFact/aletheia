import React from "react";
import CopilotConversationSuggestionStyled from "./CopilotConversationSuggestion.style";
import { useTranslation } from "next-i18next";

const CopilotConversationSuggestions = ({ handleClick }) => {
    const { t } = useTranslation();
    const suggestions = [
        { content: t("copilotChatBot:suggestion1") },
        { content: t("copilotChatBot:suggestion2") },
    ];

    return (
        <CopilotConversationSuggestionStyled>
            <p className="suggestions-header">
                {t("copilotChatBot:suggestionHeader")}
            </p>
            {suggestions &&
                suggestions.map(({ content }) => (
                    <div
                        key={content}
                        className="suggestion-card"
                        onClick={handleClick}
                    >
                        {content}
                    </div>
                ))}
        </CopilotConversationSuggestionStyled>
    );
};

export default CopilotConversationSuggestions;
