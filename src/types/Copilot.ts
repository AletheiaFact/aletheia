import { SenderEnum } from "./enums";

interface ChatResponse {
    sender: SenderEnum;
    content: string;
    editorReport?: any;
}

interface ChatMessage {
    sender: string;
    content: any;
}

type MessageContext = {
    claimDate: string | Date;
    sentence: string;
    personalityName: string;
    claimTitle: string;
};

export type { ChatResponse, ChatMessage, MessageContext };
