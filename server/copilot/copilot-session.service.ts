import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {
    CopilotSession,
    CopilotSessionDocument,
    CopilotSessionMessage,
} from "./schemas/copilot-session.schema";

@Injectable()
export class CopilotSessionService {
    private readonly logger = new Logger("CopilotSessionService");

    constructor(
        @InjectModel(CopilotSession.name)
        private copilotSessionModel: Model<CopilotSessionDocument>
    ) {}

    async createSession(
        userId: string,
        claimReviewDataHash: string,
        context: object
    ): Promise<CopilotSessionDocument> {
        const session = new this.copilotSessionModel({
            userId,
            claimReviewDataHash,
            context,
            messages: [],
            isActive: true,
        });
        return session.save();
    }

    async getActiveSession(
        userId: string,
        claimReviewDataHash: string
    ): Promise<CopilotSessionDocument | null> {
        return this.copilotSessionModel
            .findOne({
                userId,
                claimReviewDataHash,
                isActive: true,
            })
            .sort({ createdAt: -1 })
            .exec();
    }

    async getSessionById(
        sessionId: string
    ): Promise<CopilotSessionDocument | null> {
        return this.copilotSessionModel.findById(sessionId).exec();
    }

    async addMessage(
        sessionId: string,
        message: CopilotSessionMessage
    ): Promise<CopilotSessionDocument> {
        return this.copilotSessionModel
            .findByIdAndUpdate(
                sessionId,
                { $push: { messages: message } },
                { new: true }
            )
            .exec();
    }

    async deactivateSession(
        sessionId: string
    ): Promise<CopilotSessionDocument> {
        return this.copilotSessionModel
            .findByIdAndUpdate(
                sessionId,
                { isActive: false },
                { new: true }
            )
            .exec();
    }
}
