import React from "react";
import { Avatar } from "@mui/material";
import colors from "../../styles/colors";
import CopilotConversationCardStyle from "./CopilotConversationCard.style";
import { SenderEnum } from "../../types/enums";

const CopilotConversationCard = ({ message }) => {
    const { type, sender, content } = message;
    const isAssistant = sender === SenderEnum.Assistant;

    return (
        <CopilotConversationCardStyle item $isAssistant={isAssistant}>
            <div className="conversation-card-header">
                {isAssistant && (
                    <img
                        height={32}
                        width={32}
                        alt="Aletheia assistant bot avatar"
                        src="/favicon-32x32.png"
                        style={{ borderRadius: 16 }}
                    />
                )}
            </div>
            <p className={`conversation-card-content ${type}`}>{content}</p>
            <div className="conversation-card-header">
                {!isAssistant && (
                    <Avatar style={{ background: colors.quartiary, width: 30, height: 30 }}>
                        {SenderEnum.User.slice(0, 1).toUpperCase()}
                    </Avatar>
                )}
            </div>
        </CopilotConversationCardStyle>
    );
};

export default CopilotConversationCard;
