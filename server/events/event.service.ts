import {
    BadRequestException,
    ConflictException,
    Inject,
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, isValidObjectId, Model, Types } from "mongoose";
import { EventDocument, Event } from "./schema/event.schema";
import { VerificationRequestService } from "../verification-request/verification-request.service";
import { CreateEventDTO, UpdateEventDTO } from "./dto/event.dto";
import { FilterEventsDTO } from "./dto/filter.dto";
import { TopicService } from "../topic/topic.service";
import { EventMetricsData, EventMetricsResponse, FindAllResponse } from "./types/event.interfaces";
import * as crypto from "crypto";
import slugify from "slugify";
import { EventsStatus } from "../types/enums";
import { ClaimReviewService } from "../claim-review/claim-review.service";
import { NameSpaceEnum } from "../auth/name-space/schemas/name-space.schema";
import type { BaseRequest } from "../types";
import { REQUEST } from "@nestjs/core";
import { SentenceService } from "../claim/types/sentence/sentence.service";
import { ImageService } from "../claim/types/image/image.service";

@Injectable()
export class EventsService {
    private readonly logger = new Logger(EventsService.name);

    constructor(
        @Inject(REQUEST) private req: BaseRequest,
        @InjectModel(Event.name) private eventModel: Model<EventDocument>,
        private readonly sentenceService: SentenceService,
        private readonly imageService: ImageService,
        private readonly claimReviewService: ClaimReviewService,
        private readonly verificationRequestService: VerificationRequestService,
        private readonly topicService: TopicService,
    ) { }

    /**
     * Creates a new event, processes associated topics, and generates a data hash.
     * * @param createEventDto - Data transfer object containing event details.
     * @returns A promise that resolves to the created event document.
     */
    async create(createEventDto: CreateEventDTO): Promise<EventDocument> {
        try {
            this.logger.debug("Creating event", { createEventDto });

            const createdTopic = await this.topicService.findOrCreateTopic({
                ...createEventDto.mainTopic,
                name: createEventDto.mainTopic.label
            })

            const slug = slugify(createEventDto.name, {
                lower: true,
                strict: true,
                trim: true
            });

            const data_hash = crypto
                .createHash("md5")
                .update(`${createEventDto.name}-${createEventDto.startDate}`)
                .digest("hex");

            const newEvent = await this.eventModel.create({
                ...createEventDto,
                data_hash,
                slug: slug,
                mainTopic: createdTopic._id
            })

            this.logger.log(`Event created successfully: ${newEvent._id}`);
            return newEvent;
        } catch (error) {
            this.logger.error(`Failed to create event: "${error.name}"`, error.stack);

            if (error.name === "ValidationError") {
                const fields = Object.keys(error.errors).join(", ");
                throw new BadRequestException(`Schema validation failed: missing or invalid fields [${fields}]`);
            }

            if (error.code === 11000) {
                const duplicateField = Object.keys(error.keyPattern)[0];
                throw new ConflictException(`Duplicate entry: an event with this ${duplicateField} already exists`);
            }

            throw new InternalServerErrorException("Unexpected error during event creation");
        }
    }

    /**
     * Partially updates an existing event and synchronizes related topics if provided.
     * @param id - The unique identifier of the event.
     * @param updateEventDto - Data transfer object with partial event updates.
     * @returns The updated event document.
     */
    async update(id: string, updateEventDto: UpdateEventDTO): Promise<EventDocument> {
        try {
            this.logger.debug(`Updating event ${id}`, { updateEventDto });

            if (!isValidObjectId(id)) {
                throw new BadRequestException(`Invalid event ID format: ${id}`);
            }

            const { mainTopic, filterTopics, ...otherFields } = updateEventDto;

            const slug = slugify(updateEventDto.name, {
                lower: true,
                strict: true,
                trim: true
            });

            const updateData: Partial<Event> = { ...otherFields, slug: slug };

            if (mainTopic) {
                updateData.mainTopic = await this.topicService.findOrCreateTopic({ ...mainTopic, name: mainTopic.label });
            }

            if (filterTopics !== undefined) {
                const uniqueTopics = Array.from(
                    new Map(filterTopics.map(topic => [topic.name, topic])).values()
                );

                updateData.filterTopics = await Promise.all(
                    uniqueTopics.map(topic => this.topicService.findOrCreateTopic(topic))
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
            this.logger.error(`Failed to update event [${id}]`, error.stack);

            if (error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }

            if (error.name === "CastError") {
                throw new BadRequestException(`Invalid format for field: ${error.path}`);
            }

            throw new InternalServerErrorException("Unexpected error during event update");
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
            const skip = page * limit;

            this.logger.debug(`Fetching events list. Page: ${page}, PageSize: ${pageSize}, Status: ${status}`);
            this.logger.verbose(`Built MongoDB Query: ${JSON.stringify(query)}`);

            const [events, total] = await Promise.all([
                this.eventModel.find(query)
                    .skip(skip)
                    .limit(limit)
                    .sort({ endDate: order === "asc" ? 1 : -1 })
                    .lean<EventDocument[]>()
                    .populate("mainTopic")
                    .exec(),

                this.eventModel.countDocuments(query).exec()
            ]);

            const eventMetrics = await this.getBatchEventMetrics(events);

            return { events, eventMetrics, total };
        } catch (error) {
            const stackTrace = error instanceof Error ? error.stack : String(error);
            this.logger.error(`Failed to fetch events list: ${error instanceof Error ? error.message : 'Unknown error'}`, stackTrace);
            throw new InternalServerErrorException("An error occurred while fetching the events list.");
        }
    }

    /**
     * Fetches and aggregates metrics for an array of events concurrently using batching.
     * Orchestrates the extraction, data fetching, and mapping processes.
     * @param events - Array of event documents.
     * @returns A dictionary of metrics keyed by the event's data hash.
     */
    private async getBatchEventMetrics(events: EventDocument[]): Promise<Record<string, EventMetricsResponse>> {
        if (!events || events.length === 0) {
            this.logger.debug("No events provided for batch metrics processing.");
            return {};
        }

        const topicIds = [...new Set(events.map((event) => event.mainTopic?._id).filter(Boolean) as string[])];

        this.logger.debug(`Starting batch metrics processing for ${events.length} events (${topicIds.length} unique topics).`);

        try {
            const metricsData = await this.fetchBatchMetricsData(topicIds);
            this.logger.debug(
                `Batch data fetched successfully. ` +
                `Stats found: Verification(${Object.keys(metricsData.verificationStats).length}), ` +
                `Reviews(${Object.keys(metricsData.claimReviewsStats).length}), ` +
                `Sentences(${Object.keys(metricsData.sentencesStats).length}), ` +
                `Images(${Object.keys(metricsData.imagesStats).length})`
            );

            const mappedResults = this.mapMetricsToEvents(events, metricsData);
            this.logger.debug(`Successfully mapped metrics to ${events.length} event hashes.`);

            return mappedResults;
        } catch (error) {
            const stackTrace = error instanceof Error ? error.stack : String(error);
            this.logger.error(`Failed to process batch event metrics. Returning zeroed fallback metrics.`, stackTrace);

            return events.reduce((accumulator, event) => {
                accumulator[event.data_hash.toString()] = {
                    verificationRequests: 0,
                    claims: 0,
                    reviews: 0,
                };
                return accumulator;
            }, {} as Record<string, EventMetricsResponse>);
        }
    }

    /**
     * Executes concurrent batched database queries to fetch metrics for the given topics.
     * @param topicIds - Array of unique main topic IDs.
     * @returns A promise that resolves to an object containing the batched metrics maps.
     */
    private async fetchBatchMetricsData(topicIds: string[]) {
        const namespace = this.req.params.namespace || NameSpaceEnum.Main;

        const [verificationStats, claimReviewsStats, sentencesStats, imagesStats] =
            await Promise.all([
                this.verificationRequestService.getBatchCountsByTopics(topicIds),
                this.claimReviewService.getBatchCountsByTopics(topicIds, {
                    isHidden: false,
                    isDeleted: false,
                    nameSpace: namespace
                }),
                this.sentenceService.getBatchCountsByTopics(topicIds),
                this.imageService.getBatchCountsByTopics(topicIds),
            ]);

        const metricsData = {
            verificationStats,
            claimReviewsStats,
            sentencesStats,
            imagesStats,
        };

        return metricsData;
    }

    /**
     * Maps the fetched batched metrics data back to their respective events.
     * @param events - Array of event documents.
     * @param metricsData - The resolved batched metrics data containing counts per topic.
     * @returns A dictionary of metrics keyed by the event's data hash.
     */
    private mapMetricsToEvents(
        events: EventDocument[],
        metricsData: EventMetricsData
    ): Record<string, EventMetricsResponse> {
        return events.reduce((accumulator, event) => {
            const eventHash = event.data_hash.toString();
            const topicId = event.mainTopic?._id || "";

            const countSentences = metricsData.sentencesStats[topicId] || 0;
            const countImages = metricsData.imagesStats[topicId] || 0;

            accumulator[eventHash] = {
                verificationRequests: metricsData.verificationStats[topicId] || 0,
                reviews: metricsData.claimReviewsStats[topicId] || 0,
                claims: countSentences + countImages,
            };

            return accumulator;
        }, {} as Record<string, EventMetricsResponse>);
    }

    /**
     * Searches for an event by its hash.
     * * @param data_hash - URL identifier hash.
     * @returns Event document.
     */
    async findByHash(data_hash: string): Promise<EventDocument> {
        this.logger.debug(`Fetching public event with hash: ${data_hash}`);

        const event = (await this.eventModel.findOne({ data_hash }).populate("mainTopic").populate("filterTopics").exec());

        if (!event) {
            this.logger.warn(`Public access attempt failed - Hash not found: ${data_hash}`);
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
}
