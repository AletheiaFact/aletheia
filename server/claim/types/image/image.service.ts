import { BadRequestException, Inject, Injectable, NotFoundException, Scope } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { HistoryService } from "../../../history/history.service";
import { Model } from "mongoose";
import { Image, ImageDocument } from "./schemas/image.schema";
import {
    TargetModel,
    HistoryType,
} from "../../../history/schema/history.schema";
import { REQUEST } from "@nestjs/core";
import { ReportService } from "../../../report/report.service";
import type { BaseRequest } from "../../../types";

@Injectable({ scope: Scope.REQUEST })
export class ImageService {
    constructor(
        @Inject(REQUEST) private req: BaseRequest,
        @InjectModel(Image.name)
        private ImageModel: Model<ImageDocument>,
        private historyService: HistoryService,
        private reportService: ReportService
    ) {}

    async create(image, claimRevisionId = null) {
        const imageSchema = {
            data_hash: image.DataHash,
            props: {
                key: image.Key,
                extension: image.Extension,
            },
            content: image.FileURL,
            claimRevisionId: claimRevisionId,
        };

        const newImage = await new this.ImageModel(imageSchema).save();

        const history = this.historyService.getHistoryParams(
            newImage._id,
            TargetModel.Image,
            this.req.user,
            HistoryType.Create,
            newImage
        );
        this.historyService.createHistory(history);
        return newImage;
    }

    async getByDataHash(data_hash: string) {
        if (!data_hash) {
              throw new BadRequestException("Invalid data hash format.");
            }
        const report = await this.reportService.findByDataHash(data_hash);
        const image = await this.ImageModel.findOne({ data_hash });
        if (image) {
            image.props = {
                classification: report?.classification,
                ...image.props,
            };
            return image;
        } else {
            throw new NotFoundException();
        }
    }

    async updateImageWithTopics(topics, data_hash) {
        const image = await this.getByDataHash(data_hash);

        const newImage = {
            ...image.toObject,
            topics,
        };

        return this.ImageModel.updateOne({ _id: image._id }, newImage);
    }
}
