import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Image } from "../../claim/types/image/schemas/image.schema";
import * as mongoose from "mongoose";

export type BadgeDocument = Badge & mongoose.Document;

@Schema()
export class Badge {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    description: string;

    @Prop({ type: mongoose.Types.ObjectId, ref: "Image", required: true })
    image: Image;

    @Prop({ required: true })
    created_at: string;
}

const BadgeSchemaRaw = SchemaFactory.createForClass(Badge);

BadgeSchemaRaw.pre("find", function () {
    this.populate("image");
});

export const BadgeSchema = BadgeSchemaRaw;
