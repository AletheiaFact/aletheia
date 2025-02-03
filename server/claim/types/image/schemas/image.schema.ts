import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ContentModelEnum } from "../../../../types/enums";
import mongoose from "mongoose";
import { Topic } from "../../../../topic/schemas/topic.schema";
import { ClaimRevision } from "../../../../claim/claim-revision/schema/claim-revision.schema";

export type ImageDocument = Image & mongoose.Document;

@Schema({ toObject: { virtuals: true }, toJSON: { virtuals: true } })
export class Image {
    @Prop({
        default: ContentModelEnum.Image,
        required: true,
    })
    type: string;

    @Prop({ required: true })
    data_hash: string;

    @Prop({ type: Object, required: true })
    props: object;

    @Prop({ required: true })
    content: string;

    @Prop({ required: false })
    topics: Topic[];

    @Prop({
        type: mongoose.Types.ObjectId,
        required: false,
        ref: "ClaimRevision",
    })
    claimRevisionId: ClaimRevision;
}

const ImageSchemaRaw = SchemaFactory.createForClass(Image);

export const ImageSchema = ImageSchemaRaw;
