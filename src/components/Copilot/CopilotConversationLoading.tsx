import React from "react";
import { CircularProgress } from "@mui/material";
import CopilotConversationLoadingStyle from "./CopilotConversationLoading.style";
import { useTranslations } from "next-intl";

const CopilotConversationLoading = () => {
    const tCopilotChatBot = useTranslations("copilotChatBot");
    return (
        <CopilotConversationLoadingStyle>
            <CircularProgress size={22} />
            <span className="loading-text">
                {tCopilotChatBot("agentLoadingThoughts")}
            </span>
        </CopilotConversationLoadingStyle>
    );
};

export default CopilotConversationLoading;
