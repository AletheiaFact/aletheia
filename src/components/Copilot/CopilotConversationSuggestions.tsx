import React from "react";
import CopilotConversationSuggestionStyled from "./CopilotConversationSuggestion.style";
import { useTranslation } from "next-i18next";

const CopilotConversationSuggestions = ({ handleClick }) => {
    const { t } = useTranslation();
    const suggestions = [{ content: t("copilotChatBot:suggestion1") }];

    return (
        <CopilotConversationSuggestionStyled>
            <p className="suggestions-header">
                {t("copilotChatBot:suggestionHeader")}
            </p>
            {suggestions
                ? suggestions.map(({ content }) => (
                      <button
                          key={content}
                          className="suggestion-card"
                          onClick={handleClick}
                      >
                          {content}
                      </button>
                  ))
                : {}}
        </CopilotConversationSuggestionStyled>
    );
};

export default CopilotConversationSuggestions;
