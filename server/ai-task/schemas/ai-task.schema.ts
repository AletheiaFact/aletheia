import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import * as mongoose from "mongoose";
import { z } from "zod";
import {
    AiTaskStates,
    AiTaskState,
    AiTaskTypes,
    AiTaskType,
    CallbackRoutes,
    CallbackRoute,
} from "../constants/ai-task.constants";

const TextEmbeddingContentSchema = z.object({
    text: z.string().min(1).max(100000),
    model: z.string().min(1),
});

const AiTaskContentSchema = z.discriminatedUnion("type", [
    z.object({
        type: z.literal(AiTaskType.TEXT_EMBEDDING),
        data: TextEmbeddingContentSchema,
    }),
]);
export const validateTaskContent = (type: AiTaskType, content: unknown) => {
    const wrappedContent = { type, data: content };
    return AiTaskContentSchema.parse(wrappedContent);
};

export const AiTaskZodSchema = z.object({
    type: z.nativeEnum(AiTaskType),
    state: z.nativeEnum(AiTaskState),
    content: z.unknown(),
    callbackRoute: z.nativeEnum(CallbackRoute),
    callbackParams: z.object({
        targetId: z.string().min(1),
        field: z.string().min(1),
    }),
});

export type AiTask = z.infer<typeof AiTaskZodSchema>;
export type AiTaskDocument = AiTask & Document;

@Schema({ timestamps: true })
export class AiTaskClass {
    @Prop({
        type: String,
        enum: AiTaskTypes,
        required: true,
    })
    type: AiTaskType;

    @Prop({
        type: String,
        enum: AiTaskStates,
        default: AiTaskState.PENDING,
        required: true,
    })
    state: AiTaskState;

    @Prop({ type: mongoose.Schema.Types.Mixed, required: true })
    content: any;

    @Prop({
        type: String,
        enum: CallbackRoutes,
        required: true,
    })
    callbackRoute: CallbackRoute;

    @Prop({ type: mongoose.Schema.Types.Mixed, required: true })
    callbackParams: Record<string, any>;
}

export const AiTaskSchema = SchemaFactory.createForClass(AiTaskClass);
AiTaskSchema.index({ state: 1, createdAt: 1 });
export const AiTaskName = AiTaskClass.name;
