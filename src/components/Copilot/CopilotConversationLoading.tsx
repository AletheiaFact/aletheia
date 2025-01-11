import React from "react";
import { CircularProgress } from "@mui/material";
import CopilotConversationLoadingStyle from "./CopilotConversationLoading.style";
import { useTranslation } from "next-i18next";

const CopilotConversationLoading = () => {
    const { t } = useTranslation();
    return (
        <CopilotConversationLoadingStyle>
            <CircularProgress className="loading" />
            <span className="loading-text">
                {t("copilotChatBot:agentLoadingThoughts")}
            </span>
        </CopilotConversationLoadingStyle>
    );
};

export default CopilotConversationLoading;
