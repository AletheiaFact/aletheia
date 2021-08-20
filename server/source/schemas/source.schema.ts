import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { User } from "../../users/schemas/user.schema";

export type SourceDocument = Source & mongoose.Document;

@Schema()
export class Source {
    @Prop({ required: true })
    link: string;

    @Prop({
        validate: {
            validator: (v) => {
                return (
                    ["unclassified", "reliable", "unreliable", "fake"].indexOf(
                        v
                    ) !== -1
                );
            },
        },
        message: (tag) => `${tag} is not a valid classification.`,
    })
    classification: string;

    @Prop()
    description: string;

    /**
     * Use Dynamic ref https://mongoosejs.com/docs/populate.html#dynamic-ref
     */
    @Prop({
        type: mongoose.Types.ObjectId,
        required: true,
        refPath: "onModel",
    })
    targetId: mongoose.Types.ObjectId;

    @Prop({
        required: true,
        enum: ["Claim", "ClaimReview"],
    })
    targetModel: string;

    @Prop({
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User",
    })
    user: User;
}

export const SourceSchema = SchemaFactory.createForClass(Source);
