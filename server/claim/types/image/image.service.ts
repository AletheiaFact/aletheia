import {
    BadRequestException,
    Inject,
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
    Scope,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { HistoryService } from "../../../history/history.service";
import { Model, Types } from "mongoose";
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
    private readonly logger = new Logger(ImageService.name);

    constructor(
        @Inject(REQUEST) private req: BaseRequest,
        @InjectModel(Image.name)
        private ImageModel: Model<ImageDocument>,
        private historyService: HistoryService,
        private reportService: ReportService
    ) { }

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
        await this.historyService.createHistory(history);
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

    async updateImageWithTopics(topics, data_hash): Promise<ImageDocument> {
        if (!Array.isArray(topics)) {
            throw new BadRequestException("Invalid topics array.");
        }

        const image = await this.getByDataHash(data_hash);

        const newImage = {
            ...image.toObject,
            topics,
        };

        return this.ImageModel.findByIdAndUpdate({ _id: image._id }, newImage);
    }

    /**
     * Searches for image data hashes associated with a specific topic.
     * @param topicId - The topic identifier.
     * @returns Array of image data hashes.
     */
    async getHashesByTopic(topicId: string): Promise<string[]> {
        this.logger.debug(`Fetching image hashes for topic: ${topicId}`);
        try {
            const images = await this.ImageModel.find(
                { "topics.id": { $eq: new Types.ObjectId(topicId) } },
                { data_hash: 1 }
            ).lean();

            this.logger.debug(
                `Successfully retrieved ${images.length} image hashes for topic: ${topicId}`
            );

            return images.map(image => image.data_hash);
        } catch (error) {
            this.logger.error(
                `Failed to fetch image hashes for topic: ${topicId}`,
                error.stack
            );
            throw new InternalServerErrorException(`An error occurred while retrieving images for the requested topic.`);
        }
    }
}
