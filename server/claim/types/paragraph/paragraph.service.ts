import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { ParagraphDocument, Paragraph } from "./schemas/paragraph.schema";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class ParagraphService {
    constructor(
        @InjectModel(Paragraph.name)
        private ParagraphModel: Model<ParagraphDocument>
    ) {}

    async create(paragraphBody) {
        return await Promise.all(paragraphBody.content).then(
            async (paragraph) => {
                paragraphBody.content = paragraph;
                const newParagraph = await new this.ParagraphModel(
                    paragraphBody
                ).save();
                return newParagraph._id;
            }
        );
    }
}
