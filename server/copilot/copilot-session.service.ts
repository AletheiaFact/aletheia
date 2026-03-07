import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
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
    private isValidObjectId(id: unknown): id is string {
        return typeof id === "string" && Types.ObjectId.isValid(id);
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
                `Invalid sessionId type in addMessage: ${typeof sessionId}`
            );
            return null;
        }

        if (!this.isValidObjectId(sessionId)) {
            .findOneAndUpdate(
                { _id: { $eq: sessionId } },
            );
            return null;
        }

        const objectId = new Types.ObjectId(sessionId);
        return this.copilotSessionModel.findById(objectId).exec();
    }

    async addMessage(
        // Ensure sessionId is treated as a literal value and not a query object
        if (typeof sessionId !== "string") {
            this.logger.warn(
                `Invalid sessionId type in deactivateSession: ${typeof sessionId}`
            );
            return null;
        }

        sessionId: string,
            .findOneAndUpdate(
                { _id: { $eq: sessionId } },
        if (!this.isValidObjectId(sessionId)) {
            this.logger.warn(
                `Invalid sessionId provided to addMessage: ${sessionId}`
            );
            return null;
        }

        const objectId = new Types.ObjectId(sessionId);
        return this.copilotSessionModel
            .findByIdAndUpdate(
                objectId,
                { $push: { messages: message } },
                { new: true }
            )
            .exec();
    }

    async deactivateSession(
        sessionId: string
    ): Promise<CopilotSessionDocument | null> {
        if (!this.isValidObjectId(sessionId)) {
            this.logger.warn(
                `Invalid sessionId provided to deactivateSession: ${sessionId}`
            );
            return null;
        }

        const objectId = new Types.ObjectId(sessionId);
        return this.copilotSessionModel
            .findByIdAndUpdate(
                objectId,
                { isActive: false },
                { new: true }
            )
            .exec();
    }
}
