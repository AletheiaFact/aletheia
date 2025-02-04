import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";

export type TopicDocument = Topic & mongoose.Document;

@Schema({ toObject: { virtuals: true }, toJSON: { virtuals: true } })
export class Topic {
    // TODO: Implement topic taxonomy
    // TODO: Better I18N
    @Prop({
        required: true,
        unique: true,
    })
    slug: string;

    @Prop({
        required: true,
    })
    name: string;

    @Prop({ required: false })
    wikidataId?: string;

    @Prop({
        required: true,
    })
    language: string;
}

export const TopicSchema = SchemaFactory.createForClass(Topic);
