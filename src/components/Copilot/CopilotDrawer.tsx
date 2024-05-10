import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useAppSelector } from "../../store/store";
import CopilotForm from "./CopilotForm";
import { useTranslation } from "next-i18next";
import CopilotDrawerStyled from "./CopilotDrawer.style";
import copilotApi from "../../api/copilotApi";
import { SenderEnum } from "../../types/enums";
import CopilotCollapseDrawerButton from "./CopilotCollapseDrawerButton";
import { Claim } from "../../types/Claim";
import { Report } from "../../types/Report";
import { ChatMessage, ChatResponse, MessageContext } from "../../types/Copilot";
import { calculatePosition } from "./utils/calculatePositions";
import Loading from "../Loading";
const CopilotConversation = React.lazy(() => import("./CopilotConversation"));

interface Size {
    width: string;
    height: string;
}

interface CopilotDrawerProps {
    claim: Claim;
    sentence: string;
}

const CopilotDrawer = ({ claim, sentence }: CopilotDrawerProps) => {
    const { t } = useTranslation();
    const { vw, copilotDrawerCollapsed } = useAppSelector((state) => ({
        vw: state?.vw,
        copilotDrawerCollapsed:
            state?.copilotDrawerCollapsed !== undefined
                ? state?.copilotDrawerCollapsed
                : true,
    }));

    const [open, setOpen] = useState<boolean>(!copilotDrawerCollapsed);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [editorReport, setEditorReport] = useState<Report | null>(null);
    const [size, setSize] = useState<Size>({ width: "350px", height: "100%" });
    const { topPosition, rightPosition, rotate } = useMemo(
        () => calculatePosition(open, vw),
        [open, vw.sm, vw.md]
    );
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            content: t("copilotChatBot:chatBotGreetings"),
            sender: SenderEnum.Assistant,
        },
    ]);

    const context: MessageContext = useMemo(
        () => ({
            claimDate: claim.date,
            sentence: sentence,
            personalityName: claim.personalities[0].name,
            claimTitle: claim.title,
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
            addNewMessage({ sender, content });
        } catch (e) {
            console.error({ Error: e });
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
        if (!copilotDrawerCollapsed) {
            setOpen(true);
        }
    }, [vw?.md, copilotDrawerCollapsed]);

    return (
        <>
            {vw?.md && (
                <CopilotCollapseDrawerButton
                    handleClick={() => setOpen(!open)}
                    rightPosition={rightPosition}
                    rotate={rotate}
                    topPosition={topPosition}
                    aria-expanded={open}
                />
            )}
            <CopilotDrawerStyled
                variant="persistent"
                anchor={vw?.sm ? "bottom" : "right"}
                open={open}
                width={size.width}
                height={size.height}
                aria-hidden={!open}
                role="button"
            >
                <Suspense fallback={<Loading />}>
                    <CopilotConversation
                        handleSendMessage={handleSendMessage}
                        messages={messages}
                        isLoading={isLoading}
                        editorReport={editorReport}
                    />
                </Suspense>
                <CopilotForm handleSendMessage={handleSendMessage} />
                <span className="footer">{t("copilotChatBot:footer")}</span>
            </CopilotDrawerStyled>
        </>
    );
};

export default CopilotDrawer;
