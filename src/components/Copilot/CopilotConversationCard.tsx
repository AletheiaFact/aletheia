import React from "react";
import { Avatar } from "antd";
import colors from "../../styles/colors";
import CopilotConversationCardStyle from "./CopilotConversationCard.style";
import { SenderEnum } from "../../types/enums";
import { useTranslation } from "next-i18next";

const CopilotConversationCard = ({ message }) => {
    const { t } = useTranslation();
    const { type, sender, content } = message;
    return (
        <CopilotConversationCardStyle>
            <div className="conversation-card-header">
                {sender === SenderEnum.Assistant ? (
                    <img
                        height={32}
                        width={32}
                        alt="Aletheia assistant bot avatar"
                        src="/favicon-32x32.png"
                        style={{ borderRadius: 16 }}
                    />
                ) : (
                    <Avatar style={{ background: colors.quartiary }}>
                        {SenderEnum.User.slice(0, 1).toUpperCase()}
                    </Avatar>
                )}
                <span>{t(`copilotChatBot:${sender}`)}</span>
            </div>
            <p className={`conversation-card-content ${type}`}>{content}</p>
        </CopilotConversationCardStyle>
    );
};

export default CopilotConversationCard;
