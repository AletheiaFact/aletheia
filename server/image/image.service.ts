import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { HistoryService } from "../history/history.service";
import { Model } from "mongoose";
import { Image, ImageDocument } from "./schemas/image.schema";
import { TargetModel, HistoryType } from "../history/schema/history.schema";
import { FileManagementService } from "../file-management/file-management.service";
const md5 = require("md5");

@Injectable()
export class ImageService {
    constructor(
        @InjectModel(Image.name)
        private ImageModel: Model<ImageDocument>,
        private historyService: HistoryService,
        private fileManagementService: FileManagementService
    ) {}

    async create(image, user) {
        return this.fileManagementService
            .upload(image)
            .then(async (imageUploaded) => {
                const imageDataHash = md5(
                    `${imageUploaded.FileURL}${imageUploaded.Key}${imageUploaded.Extension}`
                );

                const imageSchema = {
                    data_hash: imageDataHash,
                    props: {
                        key: imageUploaded.Key,
                        extension: imageUploaded.Extension,
                    },
                    content: imageUploaded.FileURL,
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
            });
    }
}
