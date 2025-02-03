import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

export type EditorDocument = Editor & mongoose.Document;

export type EditorContentObjectType = {
    type: string;
    content: {
        type: string;
        attrs?: {
            personalityId: string;
            speechId: string;
            cardId: string;
        };
        content?: {
            type: string;
            content: { type: string; text: string }[];
        }[];
    }[];
};
@Schema({ toObject: { virtuals: true }, toJSON: { virtuals: true } })
export class Editor {
    @Prop({
        required: true,
        type: Object,
        default: {},
    })
    editorContentObject: EditorContentObjectType;

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
