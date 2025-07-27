import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { User } from "../../../users/schemas/user.schema";

export type NameSpaceDocument = NameSpace & mongoose.Document;

export enum NameSpaceEnum {
    Main = "main",
}
@Schema({ toObject: { virtuals: true }, toJSON: { virtuals: true } })
export class NameSpace {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    slug: string;

    @Prop({
        type: [
            {
                type: mongoose.Types.ObjectId,
                required: true,
                ref: "User",
            },
        ],
    })
    users: (mongoose.Types.ObjectId | User)[];

    // TODO: Add logo and description field
}

export const NameSpaceSchema = SchemaFactory.createForClass(NameSpace);
