import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";

export type ImageDocument = Image & mongoose.Document;

@Schema({ toObject: { virtuals: true }, toJSON: { virtuals: true } })
export class Image {
    @Prop({
        default: "Image",
        required: true,
    })
    type: string;

    @Prop({ required: true })
    data_hash: string;

    @Prop({ type: Object, required: true })
    props: object;

    @Prop({ required: true })
    content: string;
}

const ImageSchemaRaw = SchemaFactory.createForClass(Image);

export const ImageSchema = ImageSchemaRaw;
