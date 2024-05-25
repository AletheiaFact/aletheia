import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import {
    GenerativeInformationDocument,
    GenerativeInformation,
} from "./schemas/generative-information.schema";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class GenerativeInformationService {
    constructor(
        @InjectModel(GenerativeInformation.name)
        private GenerativeInformationModel: Model<GenerativeInformationDocument>
    ) {}

    create(generativeInformationBody) {
        return new this.GenerativeInformationModel(
            generativeInformationBody
        ).save();
    }
}
