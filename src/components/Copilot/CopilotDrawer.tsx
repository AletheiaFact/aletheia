import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";
import { useAppSelector } from "../../store/store";
import CopilotForm from "./CopilotForm";
import CopilotConversation from "./CopilotConversation";

interface Message {
    sender: string;
    content: any;
}

const CopilotDrawer = ({ claim, sentence }) => {
    const context = {
        claimDate: claim.date,
        sentence: sentence,
        personalityName: claim.personalities[0].name,
        claimTittle: claim.title,
    };
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
                context={context}
                setIsLoading={setIsLoading}
                messages={messages}
                isLoading={isLoading}
                addMessage={addMessage}
            />
            <CopilotForm
                context={context}
                addMessage={addMessage}
                setIsLoading={setIsLoading}
                messages={messages}
            />
        </Drawer>
    );
};

export default CopilotDrawer;
