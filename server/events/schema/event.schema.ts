import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { Topic } from "../../topic/schemas/topic.schema";

export type EventDocument = Event & Document;

@Schema({ toObject: { virtuals: true }, toJSON: { virtuals: true }, timestamps: true })
export class Event {
    @Prop({ required: true, unique: true })
    data_hash: string;

    @Prop({ required: true, trim: true })
    badge: string;

    @Prop({ required: true, trim: true })
    name: string;

    @Prop({ required: true, trim: true })
    slug: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    location: string;

    @Prop({ required: true, default: Date.now })
    startDate: Date;

    @Prop({ required: true, default: Date.now, index: true })
    endDate: Date;

    @Prop({
        type: MongooseSchema.Types.ObjectId,
        required: true,
        ref: "Topic",
    })
    mainTopic: Topic;

    @Prop({
        type: [{ type: MongooseSchema.Types.ObjectId, ref: "Topic" }],
        required: false,
    })
    filterTopics: Topic[];
}

export const EventSchema = SchemaFactory.createForClass(Event);
