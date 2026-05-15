import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Editor, EditorDocument } from "./schema/editor.schema";
import { Model, Types } from "mongoose";

@Injectable()
export class EditorService {
    constructor(
        @InjectModel(Editor.name)
        private EditorModel: Model<EditorDocument>
    ) {}

    async create(reference: string) {
        return this.EditorModel.create({ reference });
    }

    async getByReference(reference: string) {
        return this.EditorModel.findOne({ reference });
    }

    async updateByReference(reference: string, editorContentObject: any) {
        const editor = await this.EditorModel.findByIdAndUpdate(
            { reference: new Types.ObjectId(reference) },
            { $set: { editorContentObject } }
        );
        return editor;
    }
}
