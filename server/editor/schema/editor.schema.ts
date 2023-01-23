import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";

export type EditorDocument = Editor & mongoose.Document;

@Schema({ toObject: { virtuals: true }, toJSON: { virtuals: true } })
export class Editor {
    @Prop({
        required: true,
        type: Object,
        default: {},
    })
    editorContentObject: any; // TODO: define a type for the editor content object

    @Prop({
        type: mongoose.Types.ObjectId,
        required: true,
        refPath: "onModel",
    })
    reference: mongoose.Types.ObjectId;
}

const EditorSchemaRaw = SchemaFactory.createForClass(Editor);

EditorSchemaRaw.pre("find", function () {
    this.populate("reference");
});

export const EditorSchema = EditorSchemaRaw;
