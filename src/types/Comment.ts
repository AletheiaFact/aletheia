import { CommentEnum } from "./enums";

export interface CommentUser {
    _id: string;
    name: string;
}

export interface Comment {
    _id: string;
    id?: string;
    user: CommentUser;
    comment: string;
    text: string;
    type: CommentEnum;
    from?: number;
    to?: number;
    replies: Comment[];
    isReply: boolean;
    resolved: boolean;
    targetId: string;
    createdAt: string | number | Date;
}

export interface NewCommentPayload {
    from?: number;
    to?: number;
    text: string;
    comment: string;
    user: string;
}