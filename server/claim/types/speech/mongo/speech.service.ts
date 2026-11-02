import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { SpeechDocument, Speech } from "./schemas/speech.schema";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class MongoSpeechService {
    constructor(
        @InjectModel(Speech.name)
        private SpeechModel: Model<SpeechDocument>
    ) {}

    create(speechBody: Record<string, any>) {
        return new this.SpeechModel(speechBody).save();
    }

    async getSpeech(id: string) {
        // Draft debate transcript speeches are not public until approved.
        return await this.SpeechModel.findOne({
            _id: id,
            isDraft: { $ne: true },
        });
    }
}
