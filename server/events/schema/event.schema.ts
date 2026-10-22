import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import type { TopicDocument } from "../../topic/mongo/schemas/topic.schema";
import type { OrganizationDocument } from "../../organization/mongo/schemas/organization.schema";

export type EventDocument = Event & Document;

@Schema({ _id: false })
export class EventParticipant {
    @Prop({
        type: MongooseSchema.Types.ObjectId,
        required: true,
        ref: "Organization",
    })
    organization: OrganizationDocument;

    @Prop({ required: true, min: 0 })
    order: number;
}

const EventParticipantSchema = SchemaFactory.createForClass(EventParticipant);

@Schema({
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    timestamps: true,
})
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
    mainTopic: TopicDocument;

    @Prop({
        type: [{ type: MongooseSchema.Types.ObjectId, ref: "Topic" }],
        required: false,
    })
    filterTopics: TopicDocument[];

    @Prop({ type: [EventParticipantSchema], default: [] })
    participants: EventParticipant[];
}

export const EventSchema = SchemaFactory.createForClass(Event);
