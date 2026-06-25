import {
    BadRequestException,
    ConflictException,
    Inject,
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, isValidObjectId, Model, Types } from "mongoose";
import { EventDocument, Event } from "./schema/event.schema";
import { CreateEventDTO, UpdateEventDTO } from "./dto/event.dto";
import { FilterEventsDTO } from "./dto/filter.dto";
import { TopicService } from "../topic/topic.service";
import {
    BuildMetricsParams,
    EventMetricsData,
    EventMetricsResponse,
    FindAllResponse,
    TopicDataAggregation,
} from "./types/event.interfaces";
import * as crypto from "crypto";
import slugify from "slugify";
import { EventsStatus } from "../types/enums";
import { ClaimReviewService } from "../claim-review/claim-review.service";
import { NameSpaceEnum } from "../auth/name-space/schemas/name-space.schema";
import type { BaseRequest } from "../types";
import { REQUEST } from "@nestjs/core";
import { Topic, TopicDocument } from "../topic/schemas/topic.schema";
import { toError } from "../util/error-handling";
import { mapAggregateToRecord } from "../util/mongo-utils";

@Injectable()
export class EventsService {
    private readonly logger = new Logger(EventsService.name);

    constructor(
        @Inject(REQUEST) private req: BaseRequest,
        @InjectModel(Event.name) private eventModel: Model<EventDocument>,
        @InjectModel(Topic.name) private TopicModel: Model<TopicDocument>,
        private readonly claimReviewService: ClaimReviewService,
        private readonly topicService: TopicService
    ) {}

    /**
     * Creates a new event, processes associated topics, and generates a data hash.
     * * @param createEventDto - Data transfer object containing event details.
     * @returns A promise that resolves to the created event document.
     */
    async create(createEventDto: CreateEventDTO): Promise<EventDocument> {
        try {
            this.logger.debug("Creating event", { createEventDto });

            const topicName = createEventDto.mainTopic.label ?? createEventDto.mainTopic.name;

            const createdTopic = await this.topicService.findOrCreateTopic({
                ...createEventDto.mainTopic,
                name: topicName,
            });

            const slug = slugify(createEventDto.name, {
                lower: true,
                strict: true,
                trim: true,
            });

            const data_hash = crypto
                .createHash("md5")
                .update(`${createEventDto.name}-${createEventDto.startDate}`)
                .digest("hex");

            const newEvent = await this.eventModel.create({
                ...createEventDto,
                data_hash,
                slug: slug,
                mainTopic: createdTopic._id,
            });

            this.logger.log(`Event created successfully: ${newEvent._id}`);
            return newEvent;
        } catch (error) {
            const err = toError(error);
            this.logger.error(`Failed to create event: "${err.name}"`, err.stack);

            if (err.name === "ValidationError" && err.errors) {
                const fields = Object.keys(err.errors).join(", ");
                throw new BadRequestException(`Schema validation failed: missing or invalid fields [${fields}]`);
            }

            if (err.code === 11000 && err.keyPattern) {
                const duplicateField = Object.keys(err.keyPattern)[0];
                throw new ConflictException(`Duplicate entry: an event with this ${duplicateField} already exists`);
            }

            throw new InternalServerErrorException(
                "Unexpected error during event creation"
            );
        }
    }

    /**
     * Partially updates an existing event and synchronizes related topics if provided.
     * @param id - The unique identifier of the event.
     * @param updateEventDto - Data transfer object with partial event updates.
     * @returns The updated event document.
     */
    async update(
        id: string,
        updateEventDto: UpdateEventDTO
    ): Promise<EventDocument> {
        try {
            this.logger.debug(`Updating event ${id}`, { updateEventDto });

            if (!isValidObjectId(id)) {
                throw new BadRequestException(`Invalid event ID format: ${id}`);
            }

            const { mainTopic, filterTopics, ...otherFields } = updateEventDto;

            const updateData: Partial<Event> = { ...otherFields };

            if (updateEventDto.name) {
                updateData.slug = slugify(updateEventDto.name, {
                    lower: true,
                    strict: true,
                    trim: true
                });
            }

            if (mainTopic) {
                const topicName = mainTopic.label ?? mainTopic.name;
                updateData.mainTopic = await this.topicService.findOrCreateTopic({ ...mainTopic, name: topicName });
            }

            if (filterTopics !== undefined) {
                const uniqueTopics = Array.from(
                    new Map(
                        filterTopics.map((topic) => [topic.name, topic])
                    ).values()
                );

                updateData.filterTopics = await Promise.all(
                    uniqueTopics.map((topic) =>
                        this.topicService.findOrCreateTopic(topic)
                    )
                );
            }

            const updatedEvent = await this.eventModel.findByIdAndUpdate(
                id,
                { $set: updateData },
                { new: true, runValidators: true }
            );

            if (!updatedEvent) {
                throw new NotFoundException(`Event not found with ID: ${id}`);
            }

            return updatedEvent;
        } catch (error) {
            const err = toError(error);
            this.logger.error(`Failed to update event [${id}]`, err.stack);

            if (
                error instanceof NotFoundException ||
                error instanceof BadRequestException
            ) {
                throw error;
            }

            if (err.name === "CastError") {
                throw new BadRequestException(`Invalid format for field: ${err.path}`);
            }

            throw new InternalServerErrorException(
                "Unexpected error during event update"
            );
        }
    }

    /**
     * Lists events with pagination and dynamic filters for status.
     * Useful for public listings and SSR components.
     * @param queryDto - DTO containing pagination and filter parameters.
     * @returns A list of event documents, a dictionary of event metrics, and the total count.
     */
    async findAll(queryDto: FilterEventsDTO): Promise<FindAllResponse> {
        const { page, pageSize, order, status } = queryDto;
        try {
            const query = this.buildStatusQuery(status);
            const limit = parseInt(`${pageSize}`, 10);
            const skip = (page ?? 0) * limit;

            this.logger.debug(
                `Fetching events list. Page: ${page}, PageSize: ${pageSize}, Status: ${status}`
            );
            this.logger.verbose(
                `Built MongoDB Query: ${JSON.stringify(query)}`
            );

            const [events, total] = await Promise.all([
                this.eventModel
                    .find(query)
                    .skip(skip)
                    .limit(limit)
                    .sort({ endDate: order === "asc" ? 1 : -1 })
                    .lean<EventDocument[]>()
                    .populate("mainTopic")
                    .exec(),

                this.eventModel.countDocuments(query).exec(),
            ]);

            const eventMetrics = await this.fetchBatchMetricsData(events);

            this.logger.log({
                message: "FindAll events and metrics completed successfully",
                eventCount: events.length,
                metricsCount: Object.keys(eventMetrics).length,
                query: JSON.stringify(query),
            });

            return { events, eventMetrics, total };
        } catch (error) {
            const stackTrace =
                error instanceof Error ? error.stack : String(error);
            this.logger.error(
                `Failed to fetch events list: ${error instanceof Error ? error.message : "Unknown error"
                }`,
                stackTrace
            );
            throw new InternalServerErrorException(
                "An error occurred while fetching the events list."
            );
        }
    }

    /**
     * Searches for an event by its hash.
     * * @param data_hash - URL identifier hash.
     * @returns Event document.
     */
    async findByHash(data_hash: string): Promise<EventDocument> {
        this.logger.debug(`Fetching public event with hash: ${data_hash}`);

        const event = await this.eventModel
            .findOne({ data_hash })
            .populate("mainTopic")
            .populate("filterTopics")
            .exec();

        if (!event) {
            this.logger.warn(
                `Public access attempt failed - Hash not found: ${data_hash}`
            );
            throw new NotFoundException(`The requested event was not found.`);
        }

        return event;
    }

    /**
     * Internal helper to build MongoDB date queries based on event status.
     * @param status - The status string (finalized, upcoming, happening).
     * @returns A MongoDB query object.
     */
    private buildStatusQuery(status?: EventsStatus): FilterQuery<Event> {
        const query: FilterQuery<Event> = {};
        const now = new Date();
        now.setUTCHours(0, 0, 0, 0);

        if (!status || status === "all") return query;

        switch (status) {
            case EventsStatus.FINALIZED:
                query.endDate = { $lt: now };
                break;
            case EventsStatus.UPCOMING:
                query.startDate = { $gt: now };
                break;
            case EventsStatus.HAPPENING:
                query.startDate = { $lte: now };
                query.endDate = { $gte: now };
                break;
            default:
                this.logger.warn(`Unknown status provided: ${status}`);
        }

        return query;
    }

    /**
     * Executes batched database queries to fetch metrics for the given topics.
     * Uses a 2-step approach to resolve data dependencies (hashes) before querying ClaimReviews.
     * @param topicIds - Array of unique main topic IDs.
     * @returns A promise that resolves to an object containing the batched metrics maps.
     */
    private async fetchBatchMetricsData(
        events: EventDocument[]
    ): Promise<EventMetricsData> {
        const namespace = this.req.params.namespace || NameSpaceEnum.Main;
        const topicIds = [
            ...new Set(
                events
                    .map((event) => event.mainTopic?._id)
                    .filter(Boolean) as string[]
            ),
        ];

        const objectIds = topicIds.map((id) => new Types.ObjectId(id));

        try {
            const [metricsResult] = await this.TopicModel.aggregate([
                { $match: { _id: { $in: objectIds } } },
                {
                    $facet: {
                        verificationStats: [
                            {
                                $lookup: {
                                    from: "verificationrequests",
                                    localField: "_id",
                                    foreignField: "topics",
                                    as: "verifications",
                                },
                            },
                            {
                                $project: {
                                    count: { $size: "$verifications" },
                                },
                            },
                        ],
                        sentencesData: [
                            {
                                $lookup: {
                                    from: "sentences",
                                    localField: "_id",
                                    foreignField: "topics.id",
                                    as: "sentences",
                                },
                            },
                            {
                                $project: {
                                    hashes: {
                                        $setUnion: ["$sentences.data_hash", []],
                                    },
                                    claimRevisionIds: {
                                        $setUnion: [
                                            "$sentences.claimRevisionId",
                                            [],
                                        ],
                                    },
                                },
                            },
                        ],
                        imagesData: [
                            {
                                $lookup: {
                                    from: "images",
                                    localField: "_id",
                                    foreignField: "topics.id",
                                    as: "images",
                                },
                            },
                            {
                                $project: {
                                    hashes: {
                                        $setUnion: ["$images.data_hash", []],
                                    },
                                    claimRevisionIds: {
                                        $setUnion: [
                                            "$images.claimRevisionId",
                                            [],
                                        ],
                                    },
                                },
                            },
                        ],
                    },
                },
            ]);

            const { verificationStats, sentencesData, imagesData } =
                metricsResult;

            const topicToHashesMap: Record<string, string[]> = {};

            for (const topicId of topicIds) {
                const sentenceHashes =
                    sentencesData.find(
                        (sentence: any) =>
                            String(sentence._id) === String(topicId)
                    )?.hashes || [];
                const imageHashes =
                    imagesData.find(
                        (image: any) => String(image._id) === String(topicId)
                    )?.hashes || [];

                topicToHashesMap[topicId] = [...sentenceHashes, ...imageHashes];
            }

            const claimReviewsStats =
                await this.claimReviewService.getBatchCountsByTopics(
                    topicIds,
                    {
                        isHidden: false,
                        isDeleted: false,
                        nameSpace: namespace,
                    },
                    topicToHashesMap
                );

            return this.buildFinalMetricsDictionary({
                events,
                verificationStats,
                claimReviewsStats,
                sentencesData,
                imagesData,
            });
        } catch (error) {
            const err = toError(error);
            this.logger.error(`Metrics fetch failed, using fallback: ${err.message}`);

            return events.reduce((acc, event) => {
                acc[String(event.data_hash)] = {
                    verificationRequests: 0,
                    claims: 0,
                    reviews: 0,
                };
                return acc;
            }, {} as EventMetricsData);
        }
    }

    /**
     * Builds the final metrics dictionary mapped by the event's data_hash,
     * formatting and summing the raw data from the database.
     */
    private buildFinalMetricsDictionary({
        events,
        verificationStats,
        claimReviewsStats,
        sentencesData,
        imagesData,
    }: BuildMetricsParams): Record<string, EventMetricsResponse> {
        const verificationMap = mapAggregateToRecord<number>(
            verificationStats,
            "count"
        );
        const claimsMap = this.calculateUniqueClaims(sentencesData, imagesData);

        const finalMetrics: Record<string, EventMetricsResponse> = {};

        for (const event of events) {
            const eventHash = String(event.data_hash);
            const topicId = String(event.mainTopic?._id);

            finalMetrics[eventHash] = {
                verificationRequests: verificationMap[topicId] || 0,
                claims: claimsMap[topicId] || 0,
                reviews: claimReviewsStats[topicId] || 0,
            };
        }

        return finalMetrics;
    }

    /**
     * Calculates the total number of unique claims per topic based on claimRevisionId.
     * Aggregates IDs from sentences and images and returns the count of distinct IDs.
     */
    private calculateUniqueClaims(
        sentencesData: TopicDataAggregation[],
        imagesData: TopicDataAggregation[]
    ): Record<string, number> {
        const topicClaimsSet: Record<string, Set<string>> = {};

        const processItem = (item: TopicDataAggregation) => {
            if (!item) return;
            const topicId = String(item._id);

            const revisionIds = item.claimRevisionIds || [];

            if (!topicClaimsSet[topicId]) {
                topicClaimsSet[topicId] = new Set<string>();
            }

            revisionIds.forEach((revisionId: Types.ObjectId) => {
                if (revisionId) {
                    topicClaimsSet[topicId].add(String(revisionId));
                }
            });
        };

        sentencesData?.forEach(processItem);
        imagesData?.forEach(processItem);

        const claimsCountMap: Record<string, number> = {};
        for (const [topicId, claimSet] of Object.entries(topicClaimsSet)) {
            claimsCountMap[topicId] = claimSet.size;
        }

        return claimsCountMap;
    }
}
