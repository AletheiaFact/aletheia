import React from "react";
import { Avatar } from "antd";

const CopilotConversationCard = ({ message }) => {
    const { sender, content } = message;
    return (
        <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Avatar style={{ margin: 0 }}>
                    {sender.slice(0, 1).toUpperCase()}
                </Avatar>
                <span>{sender}</span>
            </div>
            <p style={{ paddingLeft: "40px", wordBreak: "break-word" }}>
                {content}
            </p>
        </div>
    );
};

export default CopilotConversationCard;
