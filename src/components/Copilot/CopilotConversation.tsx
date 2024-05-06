import React, { useEffect, useRef } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import colors from "../../styles/colors";
import CopilotConversationCard from "./CopilotConversationCard";

const CopilotConversation = ({ isLoading, messages }) => {
    const ref = useRef(null);
    const loadingMessage = {
        sender: "Assistant",
        content: (
            <LoadingOutlined
                spin
                style={{ fontSize: 16, color: colors.bluePrimary }}
            />
        ),
    };

    useEffect(() => {
        if (ref.current) {
            ref.current.scrollTo({
                top: 1e9,
                behavior: "smooth",
            });
        }
    }, [messages]);

    return (
        <div ref={ref} style={{ height: "100%", overflow: "overlay" }}>
            {messages.map((message, i) => (
                <CopilotConversationCard message={message} key={i} />
            ))}
            {isLoading && <CopilotConversationCard message={loadingMessage} />}
        </div>
    );
};

export default CopilotConversation;
