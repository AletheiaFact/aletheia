import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Paragraph } from "../../paragraph/schemas/paragraph.schema";

export type GenerativeInformationDocument = GenerativeInformation &
    mongoose.Document;
@Schema({ toObject: { virtuals: true }, toJSON: { virtuals: true } })
export class GenerativeInformation {
    @Prop({
        default: "generative-information",
        required: true,
    })
    type: string;

    @Prop({
        type: [
            {
                type: mongoose.Types.ObjectId,
                required: true,
                ref: "Paragraph",
            },
        ],
    })
    content: Paragraph[];
}

const GenerativeInformationSchemaRaw = SchemaFactory.createForClass(
    GenerativeInformation
);

GenerativeInformationSchemaRaw.pre("find", function () {
    this.populate("content");
});
GenerativeInformationSchemaRaw.pre("findOne", function () {
    this.populate("content");
});

export const GenerativeInformationSchema = GenerativeInformationSchemaRaw;
