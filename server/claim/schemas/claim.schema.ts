import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Personality } from "../../personality/mongo/schemas/personality.schema";
import { ClaimRevision } from "../claim-revision/schema/claim-revision.schema";
import { softDeletePlugin } from "mongoose-softdelete-typescript";
import { NameSpaceEnum } from "../../auth/name-space/schemas/name-space.schema";

export type ClaimDocument = Claim & mongoose.Document & { revisions: any };

@Schema({ toObject: { virtuals: true }, toJSON: { virtuals: true } })
export class Claim {
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
    slug: string;

    @Prop({
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "ClaimRevision",
    })
    latestRevision: ClaimRevision;

    @Prop({ type: Boolean, default: false, required: true })
    isHidden: boolean;

    @Prop({ default: NameSpaceEnum.Main, required: true })
    nameSpace: string;
}
const ClaimSchemaRaw = SchemaFactory.createForClass(Claim);

ClaimSchemaRaw.virtual("revisions", {
    ref: "ClaimRevision",
    localField: "_id",
    foreignField: "claimId",
});

ClaimSchemaRaw.virtual("sources", {
    ref: "Source",
    localField: "_id",
    foreignField: "targetId",
});

ClaimSchemaRaw.plugin(softDeletePlugin);

export const ClaimSchema = ClaimSchemaRaw;
