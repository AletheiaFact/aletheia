import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Personality } from "../../personality/schemas/personality.schema"
import { ClaimRevision } from "../../claim-revision/schema/claim-revision.schema"

export type ClaimDocument = Claim & mongoose.Document;

@Schema({ toObject: {virtuals: true}, toJSON: {virtuals: true} })
export class Claim {
    @Prop({ required: true })
    title: string;

    @Prop({
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Personality",
    })
    personality: Personality;

    // TODO: add a deleted field of type boolean
    @Prop({ required: true })
    deleted: boolean
}
const ClaimSchemaRaw = SchemaFactory.createForClass(Claim);

ClaimSchemaRaw.virtual('revisions', {
    ref: 'ClaimRevision',
    localField: '_id',
    foreignField: 'claimId'
})
export const ClaimSchema = ClaimSchemaRaw;
