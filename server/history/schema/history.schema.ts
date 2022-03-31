import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { User } from "../../users/schemas/user.schema";
import { HistoryType } from "../../claim/claim.service";

export type HistoryDocument = History & mongoose.Document;

@Schema({ toObject: {virtuals: true}, toJSON: {virtuals: true} })
export class History {
    @Prop({
        type: mongoose.Types.ObjectId,
        required: true,
        refPath: "onModel",
    })
    targetId: mongoose.Types.ObjectId;

    @Prop({
        required: true,
        enum: ["Claim", "Personality"],
    })
    targetModel: string;

    @Prop({
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    })
    user: User;
        
    @Prop({
      required: true,
    })
    type: HistoryType //TODO: Validate if details field(after, before) it's optional or required based on type

    @Prop({
      type: Object,
      required: true,
    })
    details: object
}

export const HistorySchema = SchemaFactory.createForClass(History);