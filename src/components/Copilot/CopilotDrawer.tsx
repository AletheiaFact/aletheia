import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useAppSelector } from "../../store/store";
import CopilotForm from "./CopilotForm";
import { useTranslation } from "next-i18next";
import CopilotDrawerStyled from "./CopilotDrawer.style";
import copilotApi from "../../api/copilotApi";
import { SenderEnum } from "../../types/enums";
import { Claim } from "../../types/Claim";
import { Report } from "../../types/Report";
import {
    ChatMessage,
    ChatMessageType,
    ChatResponse,
    MessageContext,
} from "../../types/Copilot";
import { calculatePosition } from "./utils/calculatePositions";
import Loading from "../Loading";
import { AnyExtension, RemirrorManager } from "remirror";
import { ReactExtensions } from "@remirror/react";
import CopilotToolbar from "./CopilotToolbar";
const CopilotConversation = React.lazy(() => import("./CopilotConversation"));

interface Size {
    width: string;
    height: string;
}

interface CopilotDrawerProps {
    claim: Claim;
    sentence: string;
    manager: RemirrorManager<ReactExtensions<AnyExtension>>;
}

const CopilotDrawer = ({ manager, claim, sentence }: CopilotDrawerProps) => {
    const { t } = useTranslation();
    const { vw, copilotDrawerCollapsed } = useAppSelector((state) => ({
        vw: state?.vw,
        copilotDrawerCollapsed:
            state?.copilotDrawerCollapsed !== undefined
                ? state?.copilotDrawerCollapsed
                : true,
    }));

    const CHAT_DEFAULT_CONVERSATION = [
        {
            type: ChatMessageType.info,
            content: t("copilotChatBot:chatBotGreetings"),
            sender: SenderEnum.Assistant,
        },
    ];

    const [open, setOpen] = useState<boolean>(!copilotDrawerCollapsed);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [editorReport, setEditorReport] = useState<Report | null>(null);
    const [size, setSize] = useState<Size>({ width: "350px", height: "100%" });
    const [messages, setMessages] = useState<ChatMessage[]>(
        CHAT_DEFAULT_CONVERSATION
    );
    const { topPosition, rightPosition, rotate } = useMemo(
        () => calculatePosition(open, vw),
        [open, vw.sm, vw.md]
    );

    const handleClearConversation = () => {
        setMessages(CHAT_DEFAULT_CONVERSATION);
    };

    const context: MessageContext = useMemo(
        () => ({
            claimDate: claim?.date,
            sentence: sentence,
            personalityName: claim?.personalities[0]?.name || null,
            claimTitle: claim?.title,
        }),
        [claim, sentence]
    );

    const handleSendMessage = async (
        newChatMessage: ChatMessage
    ): Promise<void> => {
        try {
            setIsLoading(true);
            addNewMessage(newChatMessage);
            const {
                data: { sender, content, editorReport },
            } = (await copilotApi.agentChat({
                messages: [...messages, newChatMessage],
                context: context,
            })) as { data: ChatResponse };
            setEditorReport(editorReport);
            addNewMessage({ type: ChatMessageType.info, sender, content });
        } catch (error) {
            addNewMessage({
                type: ChatMessageType.error,
                sender: SenderEnum.Assistant,
                content: t("copilotChatBot:copilotChatBotErrorMessage"),
            });
            console.error({ Error: error });
        } finally {
            setIsLoading(false);
        }
    };

    const addNewMessage = (newMessage) =>
        setMessages((prevMessages) => [...prevMessages, newMessage]);

    useEffect(() => {
        if (open && vw?.sm) {
            setSize({ width: "100%", height: "50%" });
        } else if (open) {
            setSize({ width: "350px", height: "100%" });
        }
    }, [open, vw?.sm]);

    useEffect(() => {
        setOpen(!copilotDrawerCollapsed);
    }, [copilotDrawerCollapsed]);

    return (
        <CopilotDrawerStyled
            variant="persistent"
            anchor={vw?.sm ? "bottom" : "right"}
            open={open}
            width={size.width}
            height={size.height}
            aria-hidden={!open}
        >
            <CopilotToolbar handleClearConversation={handleClearConversation} />
            <Suspense fallback={<Loading />}>
                <CopilotConversation
                    manager={manager}
                    handleSendMessage={handleSendMessage}
                    messages={messages}
                    isLoading={isLoading}
                    editorReport={editorReport}
                />
            </Suspense>
            <CopilotForm handleSendMessage={handleSendMessage} />
            <span className="footer">{t("copilotChatBot:footer")}</span>
        </CopilotDrawerStyled>
    );
};

export default CopilotDrawer;
