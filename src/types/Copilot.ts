import { SenderEnum } from "./enums";

interface ChatResponse {
    sender: SenderEnum;
    content: string;
    editorReport?: any;
}

export enum ChatMessageType {
    info = "info",
    error = "error",
}

interface ChatMessage {
    type: ChatMessageType;
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
