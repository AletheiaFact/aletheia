import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export interface UserDocument extends User, Document {
    authenticate(): any;
}

@Schema()
export class User {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true, unique: true })
    oryId: string;

    @Prop({ required: true })
    role: string;

    @Prop({ required: true, default: false })
    firstPasswordChanged: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
