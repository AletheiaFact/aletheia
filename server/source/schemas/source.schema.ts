import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { User } from "../../users/schemas/user.schema";
import { NameSpaceEnum } from "../../auth/name-space/schemas/name-space.schema";

export type SourceDocument = Source & mongoose.Document;

export enum SourceTargetModel {
    Claim = "Claim",
    ClaimReview = "ClaimReview",
}
@Schema()
export class Source {
    @Prop({ required: true })
    href: string;

    @Prop({ type: Object, required: false })
    props: object;

    /**
     * Use Dynamic ref https://mongoosejs.com/docs/populate.html#dynamic-ref
     */
    @Prop({
        type: [
            {
                type: mongoose.Types.ObjectId,
                required: false,
                refPath: "onModel",
            },
        ],
    })
    targetId: mongoose.Types.ObjectId[];

    @Prop({
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User",
    })
    user: User;

    @Prop({ unique: true, required: true })
    data_hash: string;

    @Prop({ default: NameSpaceEnum.Main, required: false })
    nameSpace: string;
}

export const SourceSchema = SchemaFactory.createForClass(Source);
