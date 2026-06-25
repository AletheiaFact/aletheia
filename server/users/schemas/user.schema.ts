import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Roles, Status } from "../../auth/ability/ability.factory";
import { Document, Types } from "mongoose";
import { BadgeDocument } from "../../badge/schemas/badge.schema";

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
    badges: BadgeDocument[];

    // NOTE(vitest-migration): The explicit `type: String` is required because
    // SWC's `decoratorMetadata` emits the enum object (not `String`) as the
    // design:type for enum-typed properties. Without it, Mongoose's
    // SchemaFactory.createForClass() interprets the enum keys as schema types
    // and throws. The same fix was applied to ~14 @Prop decorators across 9
    // schema files in this PR. This pattern is also a Mongoose best practice
    // (explicit > implicit) so the change is preserved post-Phase 2.
    @Prop({ type: String, required: true, default: Status.Active })
    state: Status;
}

const UserSchemaRaw = SchemaFactory.createForClass(User);
UserSchemaRaw.pre("find", function () {
    this.populate("badges");
});

export const UserSchema = UserSchemaRaw;
