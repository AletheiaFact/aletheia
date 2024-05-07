import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";
import { useAppSelector } from "../../store/store";
import CopilotForm from "./CopilotForm";
import CopilotConversation from "./CopilotConversation";

interface Message {
    sender: string;
    content: any;
}

const CopilotDrawer = ({ sentence }) => {
    const initialMessage = [
        {
            content: "Ola, eu sou checador de fatos assistente da Aletheia",
            sender: "Assistant",
        },
    ];
    const [messages, setMessages] = useState<Message[]>(initialMessage);
    const [isLoading, setIsLoading] = useState(false);

    const { copilotDrawerCollapsed } = useAppSelector((state) => ({
        copilotDrawerCollapsed:
            state?.copilotDrawerCollapsed !== undefined
                ? state?.copilotDrawerCollapsed
                : true,
    }));

    const addMessage = (newMessage) => {
        setMessages((messages) => [...messages, newMessage]);
    };

    return (
        <Drawer
            sx={{
                width: 350,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: 350,
                    padding: 2,
                },
                zIndex: 999999,
                maxHeight: "100vh",
                overflow: "hidden",
                flex: "1 1 350px",
            }}
            variant="persistent"
            anchor="right"
            open={!copilotDrawerCollapsed}
        >
            <CopilotConversation
                sentence={sentence}
                setIsLoading={setIsLoading}
                messages={messages}
                isLoading={isLoading}
                addMessage={addMessage}
            />
            <CopilotForm
                addMessage={addMessage}
                setIsLoading={setIsLoading}
                messages={messages}
                sentence={sentence}
            />
        </Drawer>
    );
};

export default CopilotDrawer;
