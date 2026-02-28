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

interface CopilotSessionMessage {
    sender: string;
    content: string;
    type: string;
    editorReport?: any;
}

interface CopilotSession {
    _id: string;
    userId: string;
    claimReviewDataHash: string;
    messages: CopilotSessionMessage[];
    context: MessageContext;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export type {
    ChatResponse,
    ChatMessage,
    MessageContext,
    CopilotSession,
    CopilotSessionMessage,
};
