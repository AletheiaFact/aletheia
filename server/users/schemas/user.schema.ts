import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Roles, Status } from "../../auth/ability/ability.factory";
import { Document, Types } from "mongoose";
import { Badge } from "../../badge/schemas/badge.schema";

export interface UserDocument extends User, Document {
    authenticate(): any;
}

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true, unique: true })
    oryId: string;

    @Prop({ required: true, default: false })
    firstPasswordChanged: boolean;

    @Prop({ type: Object, required: true, default: { main: Roles.Regular } })
    role: object;

    @Prop({ required: true, default: false })
    totp: boolean;

    @Prop({
        type: [
            {
                type: Types.ObjectId,
                ref: "Badge",
                required: false,
            },
        ],
    })
    badges: Badge[];

    @Prop({ required: true, default: Status.Active })
    state: Status;
}

const UserSchemaRaw = SchemaFactory.createForClass(User);
UserSchemaRaw.pre("find", function () {
    this.populate("badges");
});

export const UserSchema = UserSchemaRaw;
