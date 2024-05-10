import React, { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "../../store/store";
import CopilotForm from "./CopilotForm";
import CopilotConversation from "./CopilotConversation";
import { Message } from "../../types/Message";
import { useTranslation } from "next-i18next";
import CopilotDrawerStyled from "./CopilotDrawer.style";
import copilotApi from "../../api/copilotApi";
import { SenderEnum } from "../../types/enums";
import CopilotCollapseDrawerButton from "./CopilotCollapseDrawerButton";

const getPositions = (open, vw, size) => {
    let rightPosition = "16px";
    let topPosition = "50%";
    let rotate = "rotateY(135deg)";

    if (!vw.sm) {
        rightPosition = open ? size.width : "16px";
        rotate = open ? "rotateY(45deg)" : "rotateY(135deg)";
    } else {
        rightPosition = "50%";
        rotate = open ? "rotate(90deg)" : "rotate(270deg)";
        topPosition = open ? "50%" : "calc(100% - 64px)";
    }

    return { topPosition, rightPosition, rotate };
};

const CopilotDrawer = () => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [editorReport, setEditorReport] = useState(null);
    const [size, setSize] = useState({ width: "350px", height: "100%" });
    const [messages, setMessages] = useState<Message[]>([
        {
            content: t("copilotChatBot:chatBotGreetings"),
            sender: SenderEnum.Assistant,
        },
    ]);
    const { vw } = useAppSelector((state) => ({ vw: state?.vw }));

    const context = {
        claimDate: claim.date,
        sentence: sentence,
        personalityName: claim.personalities[0].name,
        claimTittle: claim.title,
    };

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

    useEffect(() => {
        if (open && vw?.sm) {
            setSize({ width: "100%", height: "50%" });
        } else if (open) {
            setSize({ width: "350px", height: "100%" });
        }
    }, [open, vw?.sm]);

    useEffect(() => setOpen(true), [vw?.md]);

    const { topPosition, rightPosition, rotate } = useMemo(
        () => getPositions(open, vw, { width: "350px" }),
        [open, vw.sm, vw.md]
    );

    return (
        <>
            {vw?.md && (
                <CopilotCollapseDrawerButton
                    handleClick={() => setOpen(!open)}
                    rightPosition={rightPosition}
                    rotate={rotate}
                    topPosition={topPosition}
                />
            )}
            <CopilotDrawerStyled
                variant="persistent"
                anchor={vw?.sm ? "bottom" : "right"}
                open={open}
                width={size.width}
                height={size.height}
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
        </>
    );
};

export default CopilotDrawer;
