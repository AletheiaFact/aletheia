import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { softDeletePlugin } from "mongoose-softdelete-typescript";

import { Personality } from "../../personality/schemas/personality.schema";

export type ClaimCollectionDocument = ClaimCollection & mongoose.Document;

@Schema({ toObject: { virtuals: true }, toJSON: { virtuals: true } })
export class ClaimCollection {
    @Prop({ required: true })
    slug: string;

    @Prop({ required: true })
    title: string;

    @Prop({
        type: Object,
        required: true,
    })
    editorContentObject: any; // TODO: define a type for the editor content object

    @Prop({
        type: [
            {
                type: mongoose.Types.ObjectId,
                required: true,
                ref: "Personality",
            },
        ],
    })
    personalities: Personality[];

    @Prop({ required: true })
    date: Date;

    @Prop({ type: Boolean, default: false, required: true })
    isHidden: boolean;
}

const ClaimCollectionSchemaRaw = SchemaFactory.createForClass(ClaimCollection);

ClaimCollectionSchemaRaw.virtual("sources", {
    ref: "Source",
    localField: "_id",
    foreignField: "targetId",
});

ClaimCollectionSchemaRaw.plugin(softDeletePlugin);

export const ClaimCollectionSchema = ClaimCollectionSchemaRaw;
