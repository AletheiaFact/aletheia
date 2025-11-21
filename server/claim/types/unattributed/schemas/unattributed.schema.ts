import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Paragraph } from "../../paragraph/schemas/paragraph.schema";

export type UnattributedDocument = Unattributed & mongoose.Document;
@Schema({ toObject: { virtuals: true }, toJSON: { virtuals: true } })
export class Unattributed {
    @Prop({
        default: "unattributed",
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

const UnattributedSchemaRaw = SchemaFactory.createForClass(Unattributed);

UnattributedSchemaRaw.pre("find", function () {
    this.populate("content");
});
UnattributedSchemaRaw.pre("findOne", function () {
    this.populate("content");
});

export const UnattributedSchema = UnattributedSchemaRaw;
