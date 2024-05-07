import React, { useEffect, useRef } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import colors from "../../styles/colors";
import CopilotConversationCard from "./CopilotConversationCard";
import copilotApi from "../../api/copilotApi";

const CopilotConversation = ({
    sentence,
    setIsLoading,
    isLoading,
    messages,
    addMessage,
}) => {
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

    const handleClick = async (e) => {
        setIsLoading(true);
        const newChatMessage = {
            sender: "You",
            content: e.currentTarget.textContent,
        };
        addMessage({ content: e.currentTarget.textContent, sender: "You" });
        const { data: aiMessage } = await copilotApi.agentChat({
            messages: [...messages, newChatMessage],
        });
        addMessage(aiMessage);
        setIsLoading(false);
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
            {messages.length <= 1 && (
                <div
                    style={{
                        marginLeft: "40px",
                        display: "flex",
                        flexDirection: "column",
                        border: "1px solid #ccc",
                        borderRadius: 4,
                    }}
                >
                    <p
                        style={{
                            padding: "8px 0",
                            textAlign: "center",
                            margin: 0,
                        }}
                    >
                        Como posso te ajudar ?
                    </p>
                    <div
                        onClick={handleClick}
                        style={{
                            padding: "8px 0",
                            cursor: "pointer",
                            borderTop: "1px solid #ccc",
                            textAlign: "center",
                        }}
                    >
                        Preciso de ajuda com minha checagem
                    </div>
                    <div
                        onClick={handleClick}
                        style={{
                            padding: "8px 0",
                            cursor: "pointer",
                            borderTop: "1px solid #ccc",
                            textAlign: "center",
                        }}
                    >
                        Me ajude a listar perguntas a serem respondidas
                    </div>
                </div>
            )}
            {isLoading && <CopilotConversationCard message={loadingMessage} />}
        </div>
    );
};

export default CopilotConversation;
