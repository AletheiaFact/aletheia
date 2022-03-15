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
}
const ClaimSchemaRaw = SchemaFactory.createForClass(Claim);

ClaimSchemaRaw.virtual('revisions', {
    ref: 'ClaimRevision',
    localField: '_id',
    foreignField: 'claimId'
})
export const ClaimSchema = ClaimSchemaRaw;
