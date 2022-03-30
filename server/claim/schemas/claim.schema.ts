import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Personality } from "../../personality/schemas/personality.schema"
import { ClaimRevision } from "../../claim-revision/schema/claim-revision.schema"

export type ClaimDocument = Claim & mongoose.Document & { revisions: any };

@Schema({ toObject: {virtuals: true}, toJSON: {virtuals: true} })
export class Claim {
    @Prop({
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Personality",
    })
    personality: Personality;

    @Prop({ default: false })
    deleted: boolean

    @Prop({ required: true })
    slug: string;

    @Prop({
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "ClaimRevision",
    })
    latestRevision: ClaimRevision
}
const ClaimSchemaRaw = SchemaFactory.createForClass(Claim);

ClaimSchemaRaw.virtual('revisions', {
    ref: 'ClaimRevision',
    localField: '_id',
    foreignField: 'claimId'
})

ClaimSchemaRaw.virtual('sources', {
    ref: 'Source',
    localField: '_id',
    foreignField: 'targetId'
})
export const ClaimSchema = ClaimSchemaRaw;
