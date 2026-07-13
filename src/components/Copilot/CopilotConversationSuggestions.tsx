import React from "react";
import CopilotConversationSuggestionStyled from "./CopilotConversationSuggestion.style";
import { useTranslations } from "next-intl";

const CopilotConversationSuggestions = ({ handleClick }) => {
    const tCopilotChatBot = useTranslations("copilotChatBot");
    const suggestions = [{ content: tCopilotChatBot("suggestion1") }];

    return (
        <CopilotConversationSuggestionStyled>
            <p className="suggestions-header">
                {tCopilotChatBot("suggestionHeader")}
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
