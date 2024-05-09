import React, { useState } from "react";
import { useAppSelector } from "../../store/store";
import CopilotForm from "./CopilotForm";
import CopilotConversation from "./CopilotConversation";
import { Message } from "../../types/Message";
import { useTranslation } from "next-i18next";
import CopilotDrawerStyled from "./CopilotDrawer.style";
import copilotApi from "../../api/copilotApi";
import { SenderEnum } from "../../types/enums";

const CopilotDrawer = () => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [editorReport, setEditorReport] = useState(null);
    const [messages, setMessages] = useState<Message[]>([
        {
            content: t("copilotChatBot:chatBotGreetings"),
            sender: SenderEnum.Assistant,
        },
    ]);

    const { copilotDrawerCollapsed } = useAppSelector((state) => ({
        copilotDrawerCollapsed:
            state?.copilotDrawerCollapsed !== undefined
                ? state?.copilotDrawerCollapsed
                : true,
    }));

    const handleSendMessage = async (newChatMessage) => {
        try {
            setIsLoading(true);
            addNewMessage(newChatMessage);
            const {
                data: { sender, content, editorReport },
            } = await copilotApi.agentChat({
                messages: [...messages, newChatMessage],
                context: context,
            });
            setEditorReport(editorReport);
            addNewMessage({ sender, content });
        } catch (e) {
            console.error({ Error: e });
        } finally {
            setIsLoading(false);
        }
    };

    const addNewMessage = (newMessage) =>
        setMessages((messages) => [...messages, newMessage]);

    return (
        <CopilotDrawerStyled
            variant="persistent"
            anchor="right"
            open={!copilotDrawerCollapsed}
        >
            <CopilotConversation
                handleSendMessage={handleSendMessage}
                messages={messages}
                isLoading={isLoading}
                editorReport={editorReport}
            />
            <CopilotForm handleSendMessage={handleSendMessage} />
            <span className="footer">{t("copilotChatBot:footer")}</span>
        </CopilotDrawerStyled>
    );
};

export default CopilotDrawer;
