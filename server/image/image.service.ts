import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { HistoryService } from "../history/history.service";
import { Model } from "mongoose";
import { Image, ImageDocument } from "./schemas/image.schema";
import { TargetModel, HistoryType } from "../history/schema/history.schema";

@Injectable()
export class ImageService {
    constructor(
        @InjectModel(Image.name)
        private ImageModel: Model<ImageDocument>,
        private historyService: HistoryService
    ) {}

    async create(image, user = null) {
        const imageSchema = {
            data_hash: image.DataHash,
            props: {
                key: image.Key,
                extension: image.Extension,
            },
            content: image.FileURL,
        };

        const newImage = await new this.ImageModel(imageSchema).save();

        const history = this.historyService.getHistoryParams(
            newImage._id,
            TargetModel.Image,
            user,
            HistoryType.Create,
            newImage
        );
        this.historyService.createHistory(history);
        return newImage;
    }
}
