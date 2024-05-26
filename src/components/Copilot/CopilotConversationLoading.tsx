import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import CopilotConversationLoadingStyle from "./CopilotConversationLoading.style";
import { useTranslation } from "next-i18next";

const CopilotConversationLoading = () => {
    const { t } = useTranslation();
    return (
        <CopilotConversationLoadingStyle>
            <LoadingOutlined className="loading" spin />
            <span className="loading-text">
                {t("copilotChatBot:agentLoadingThoughts")}
            </span>
        </CopilotConversationLoadingStyle>
    );
};

export default CopilotConversationLoading;
