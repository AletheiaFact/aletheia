import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import * as mongoose from "mongoose";
import { z } from "zod";

export const AiTaskZodSchema = z.object({
    type: z.string(),
    state: z.enum(["pending", "in_progress", "succeeded", "failed"]),
    content: z.any(),
    callbackRoute: z.string(),
    callbackParams: z.object({
        targetId: z.string(),
        field: z.string(),
    }),
});

export type AiTask = z.infer<typeof AiTaskZodSchema>;
export type AiTaskDocument = AiTask & Document;

@Schema({ timestamps: true })
export class AiTaskClass {
    @Prop({ required: true })
    type: string;

    @Prop({
        type: String,
        enum: ["pending", "in_progress", "succeeded", "failed"],
        default: "pending",
        required: true,
    })
    state: "pending" | "in_progress" | "succeeded" | "failed";

    @Prop({ type: mongoose.Schema.Types.Mixed, required: true })
    content: any;

    @Prop({ required: true })
    callbackRoute: string;

    @Prop({
        type: mongoose.Schema.Types.Mixed,
        required: true,
    })
    callbackParams: Record<string, any>;
}

export const AiTaskSchema = SchemaFactory.createForClass(AiTaskClass);
AiTaskSchema.index({ state: 1, createdAt: 1 });
export const AiTaskName = AiTaskClass.name;
