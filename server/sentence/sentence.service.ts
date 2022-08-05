import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { SentenceDocument, Sentence } from "./schemas/sentence.schema";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class SentenceService {
    constructor(
        @InjectModel(Sentence.name)
        private SentenceModel: Model<SentenceDocument>
    ) {}

    async create(sentenceBody) {
        const newSentence = await new this.SentenceModel(sentenceBody).save();
        return newSentence._id;
    }

    getByDataHash(data_hash) {
        return this.SentenceModel.findOne({ data_hash });
    }
}
