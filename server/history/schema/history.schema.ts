import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { User } from "../../users/schemas/user.schema";

export type HistoryDocument = History & mongoose.Document;

export enum TargetModel { 
  Claim = 'claim',
  Personality = 'personality',
  ClaimReview = 'claim-review'
}

export enum HistoryType { 
  Create = 'create',
  Update = 'update',
  Delete = 'delete'
}
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
    })
    targetModel: TargetModel;

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

    @Prop({
      type: Date,
      required: true,
    })
    date: mongoose.Date
}

export const HistorySchema = SchemaFactory.createForClass(History);