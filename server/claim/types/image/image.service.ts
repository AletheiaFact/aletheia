import {
    BadRequestException,
    Inject,
    Injectable,
    NotFoundException,
    Scope,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { HistoryService } from "../../../history/history.service";
import { Model, UpdateWriteOpResult } from "mongoose";
import { Image, ImageDocument } from "./schemas/image.schema";
import {
    TargetModel,
    HistoryType,
} from "../../../history/schema/history.schema";
import { REQUEST } from "@nestjs/core";
import { ReportService } from "../../../report/report.service";
import type { BaseRequest } from "../../../types";
import { GetByDataHashDto } from "../../dto/get-by-datahash.dto";

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
            this.req.user?._id,
            HistoryType.Create,
            newImage
        );
        this.historyService.createHistory(history);
        return newImage;
    }

    async getByDataHash(data_hash: string) {
        const validatedParams = GetByDataHashDto.safeParse({ data_hash });

        if (!validatedParams.success) {
            throw new BadRequestException("Invalid data_hash format");
        }

        const { data_hash: validatedHash } = validatedParams.data;

        const report = await this.reportService.findByDataHash(validatedHash);
        const image = await this.ImageModel.findOne({
            data_hash: validatedHash,
        });
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

    async updateImageWithTopics(
        topics,
        data_hash
    ): Promise<UpdateWriteOpResult> {
        const image = await this.getByDataHash(data_hash);

        const newImage = {
            ...image.toObject,
            topics,
        };

        return this.ImageModel.updateOne({ _id: image._id }, newImage);
    }
}
