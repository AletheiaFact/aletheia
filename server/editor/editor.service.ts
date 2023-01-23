import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Editor, EditorDocument } from "./schema/editor.schema";
import { Types } from "mongoose";

@Injectable()
export class EditorService {
    constructor(
        @InjectModel(Editor.name)
        private EditorModel: Model<EditorDocument>
    ) {}

    async create(reference) {
        return this.EditorModel.create({ reference });
    }

    async getByReference(reference) {
        return this.EditorModel.findOne({ reference });
    }

    async updateByReference(reference, editorContentObject) {
        const editor = await this.EditorModel.updateOne(
            { reference: Types.ObjectId(reference) },
            { $set: { editorContentObject } }
        );
        return editor;
    }
}
