import { Injectable, NotFoundException } from "@nestjs/common";
import { Model } from "mongoose";
import { SentenceDocument, Sentence } from "./schemas/sentence.schema";
import { InjectModel } from "@nestjs/mongoose";
import { ReportService } from "../report/report.service";

@Injectable()
export class SentenceService {
    constructor(
        @InjectModel(Sentence.name)
        private SentenceModel: Model<SentenceDocument>,
        private reportService: ReportService
    ) {}

    async create(sentenceBody) {
        const newSentence = await new this.SentenceModel(sentenceBody).save();
        return newSentence._id;
    }

    async getByDataHash(data_hash) {
        //Fix me
        const report = await this.reportService.findBySentenceHash(data_hash);
        const sentence = await this.SentenceModel.findOne({ data_hash });
        if (sentence) {
            sentence.props = {
                classification: report?.classification,
                ...sentence.props,
            };
            return sentence;
        } else {
            throw new NotFoundException();
        }
    }
}
