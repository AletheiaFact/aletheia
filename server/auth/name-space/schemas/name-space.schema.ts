import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { User } from "../../../users/schemas/user.schema";

export type NameSpaceDocument = NameSpace & mongoose.Document;

@Schema({ toObject: { virtuals: true }, toJSON: { virtuals: true } })
export class NameSpace {
    @Prop({ required: true })
    name: string;

    @Prop({
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User",
    })
    users: User[];
}

export const NameSpaceSchema = SchemaFactory.createForClass(NameSpace);
