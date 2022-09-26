import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Roles } from "../../ability/ability.factory";
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

    @Prop({ required: true, default: false })
    firstPasswordChanged: boolean;

    @Prop({ required: true, default: Roles.Regular })
    role: Roles;
}

export const UserSchema = SchemaFactory.createForClass(User);
