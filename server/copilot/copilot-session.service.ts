import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, isValidObjectId } from "mongoose";
import {
    CopilotSession,
    CopilotSessionDocument,
    CopilotSessionMessage,
} from "./schemas/copilot-session.schema";

@Injectable()
export class CopilotSessionService {
    private readonly logger = new Logger("CopilotSessionService");

    /**
     * Ensures the provided id is a valid MongoDB ObjectId string.
     */
    private isValidObjectIdString(id: unknown): id is string {
        return typeof id === "string" && isValidObjectId(id);
    }

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
        // Ensure sessionId is treated as a literal value and not a query object
        if (typeof sessionId !== "string") {
            this.logger.warn(
                `Invalid sessionId type in getSessionById: ${typeof sessionId}`
            );
            return null;
        }

        if (!this.isValidObjectIdString(sessionId)) {
            this.logger.warn(
                `Invalid sessionId provided to getSessionById: ${sessionId}`
            );
            return null;
        }

        return this.copilotSessionModel.findById(sessionId).exec();
    }

    async addMessage(
        sessionId: string,
        message: CopilotSessionMessage
    ): Promise<CopilotSessionDocument | null> {
        // Ensure sessionId is treated as a literal value and not a query object
        if (typeof sessionId !== "string") {
            this.logger.warn(
                `Invalid sessionId type in addMessage: ${typeof sessionId}`
            );
            return null;
        }

        if (!this.isValidObjectIdString(sessionId)) {
            this.logger.warn(
                `Invalid sessionId provided to addMessage: ${sessionId}`
            );
            return null;
        }

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
    ): Promise<CopilotSessionDocument | null> {
        if (!this.isValidObjectIdString(sessionId)) {
            this.logger.warn(
                `Invalid sessionId provided to deactivateSession: ${sessionId}`
            );
            return null;
        }

        return this.copilotSessionModel
            .findByIdAndUpdate(
                sessionId,
                { isActive: false },
                { new: true }
            )
            .exec();
    }
}
