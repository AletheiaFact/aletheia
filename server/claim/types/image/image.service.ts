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
import { mapAggregateToRecord } from "../../../util/mongo-utils";

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

   /**
     * Counts the number of unique claims associated with multiple topics concurrently.
     * Uses aggregation to extract distinct claimRevisionIds per topic from Image records in a single query.
     * @param topicIds - Array of unique topic IDs.
     * @returns A dictionary mapping each topic ID to its total count of unique image claims.
     */
    async getBatchCountsByTopics(topicIds: string[]): Promise<Record<string, number>> {
        if (!topicIds || topicIds.length === 0) return {};

        try {
            const objectIds = topicIds.map(id => new Types.ObjectId(id));

            const aggregations = await this.ImageModel.aggregate([
                { $match: { "topics.id": { $in: objectIds } } },
                { $unwind: "$topics" },
                { $match: { "topics.id": { $in: objectIds } } },
                {
                    $group: {
                        _id: "$topics.id",
                        uniqueClaims: { $addToSet: "$claimRevisionId" }
                    }
                },
                {
                    $project: {
                        count: { $size: "$uniqueClaims" }
                    }
                }
            ]);

            return mapAggregateToRecord<number>(aggregations, "count");
        } catch (error) {
            const stackTrace = error instanceof Error ? error.stack : String(error);
            this.logger.error(`Failed to count batch unique image claims`, stackTrace);
            throw new InternalServerErrorException(`An error occurred while counting batch image claims.`);
        }
    }

    /**
     * Retrieves image data hashes for multiple topics concurrently.
     * Uses aggregation to group hashes by topic ID in a single database roundtrip.
     * @param topicIds - Array of unique topic IDs.
     * @returns A dictionary mapping each topic ID to an array of its associated image data hashes.
     */
    async getBatchHashesByTopics(topicIds: string[]): Promise<Record<string, string[]>> {
        if (!topicIds || topicIds.length === 0) return {};

        try {
            const objectIds = topicIds.map(id => new Types.ObjectId(id));

            const aggregations = await this.ImageModel.aggregate([
                { $match: { "topics.id": { $in: objectIds } } },
                { $unwind: "$topics" },
                { $match: { "topics.id": { $in: objectIds } } },
                {
                    $group: {
                        _id: "$topics.id",
                        hashes: { $addToSet: "$data_hash" }
                    }
                }
            ]);

            return mapAggregateToRecord<string[]>(aggregations, "hashes");
        } catch (error) {
            const stackTrace = error instanceof Error ? error.stack : String(error);
            this.logger.error(`Failed to fetch batch image hashes`, stackTrace);
            throw new InternalServerErrorException(`An error occurred while retrieving batch images.`);
        }
    }
}
