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
        // Ensure claimReviewDataHash is treated as a literal value and not a query object
        if (typeof claimReviewDataHash !== "string") {
            this.logger.warn(
                `Invalid claimReviewDataHash type in getActiveSession: ${typeof claimReviewDataHash}`
            );
            return null;
        }

        return this.copilotSessionModel
            .findOne({
                userId,
                claimReviewDataHash: { $eq: claimReviewDataHash },
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

    async listSessionsByUser(
        userId: string,
        page: number = 1,
        pageSize: number = 20,
        claimReviewDataHash?: string
    ): Promise<{
        sessions: CopilotSessionDocument[];
        total: number;
        page: number;
        pageSize: number;
    }> {
        const skip = (page - 1) * pageSize;
        const filter: Record<string, any> = { userId };
        if (claimReviewDataHash) {
            filter.claimReviewDataHash = { $eq: claimReviewDataHash };
        }
        const [sessions, total] = await Promise.all([
            this.copilotSessionModel
                .find(filter)
                .sort({ updatedAt: -1 })
                .skip(skip)
                .limit(pageSize)
                .exec(),
            this.copilotSessionModel.countDocuments(filter).exec(),
        ]);
        return { sessions, total, page, pageSize };
    }

    async updateSession(
        sessionId: string,
        updateData: { title?: string; status?: string }
    ): Promise<CopilotSessionDocument> {
        return this.copilotSessionModel
            .findByIdAndUpdate(sessionId, { $set: updateData }, { new: true })
            .exec();
    }
}
