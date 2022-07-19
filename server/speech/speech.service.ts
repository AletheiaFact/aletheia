import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { SpeechDocument, Speech } from "./schemas/speech.schema";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class SpeechService {
    constructor(
        @InjectModel(Speech.name)
        private SpeechModel: Model<SpeechDocument>
    ) {}

    create(speechBody) {
        return new this.SpeechModel(speechBody).save();
    }
}
