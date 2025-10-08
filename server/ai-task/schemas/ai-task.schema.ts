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
    text: z.string().min(1).max(10000),
    model: z.string().min(1),
});

const IdentifyingDataContentSchema = z.object({
    text: z.string().min(1).max(10000),
    model: z.string().min(1),
});

const DefiningTopicsContentSchema = z.object({
    text: z.string().min(1).max(10000),
    model: z.string().min(1),
});

const DefiningImpactAreaContentSchema = z.object({
    text: z.string().min(1).max(10000),
    model: z.string().min(1),
});

const DefiningSeverityContentSchema = z.object({
    text: z.string().min(1).max(10000),
    model: z.string().min(1),
});

const AiTaskContentSchema = z.discriminatedUnion("type", [
    z.object({
        type: z.literal(AiTaskType.TEXT_EMBEDDING),
        data: TextEmbeddingContentSchema,
    }),
    z.object({
        type: z.literal(AiTaskType.IDENTIFYING_DATA),
        data: IdentifyingDataContentSchema,
    }),
    z.object({
        type: z.literal(AiTaskType.DEFINING_TOPICS),
        data: DefiningTopicsContentSchema,
    }),
    z.object({
        type: z.literal(AiTaskType.DEFINING_IMPACT_AREA),
        data: DefiningImpactAreaContentSchema,
    }),
    z.object({
        type: z.literal(AiTaskType.DEFINING_SEVERITY),
        data: DefiningSeverityContentSchema,
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

export type AiTaskZod = z.infer<typeof AiTaskZodSchema>;
export type AiTaskDocument = AiTaskZod & Document;

@Schema({ timestamps: true })
export class AiTask {
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

export const AiTaskSchema = SchemaFactory.createForClass(AiTask);
AiTaskSchema.index({ state: 1, createdAt: 1 });
export const AiTaskName = AiTask.name;
