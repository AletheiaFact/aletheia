import {
    BadRequestException,
    ConflictException,
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, isValidObjectId, Model } from "mongoose";
import { EventDocument, Event } from "./schema/event.schema";
import { VerificationRequestService } from "../verification-request/verification-request.service";
import { SentenceService } from "../claim/types/sentence/sentence.service";
import { CreateEventDTO, UpdateEventDTO } from "./dto/event.dto";
import { FilterEventsDTO } from "./dto/filter.dto";
import { TopicService } from "../topic/topic.service";
import { FindAllResponse } from "./types/event.interfaces";
import * as crypto from "crypto";
import slugify from "slugify";
import { EventsStatus } from "../types/enums";

@Injectable()
export class EventsService {
    private readonly logger = new Logger(EventsService.name);

    constructor(
        @InjectModel(Event.name) private eventModel: Model<EventDocument>,
        private readonly verificationRequestService: VerificationRequestService,
        private readonly sentenceService: SentenceService,
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

            const updateData: Partial<Event> = { ...otherFields };

            if (mainTopic) {
                updateData.mainTopic = await this.topicService.findOrCreateTopic(mainTopic);
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
     * @returns A list of event documents.
     */
    async findAll(queryDto: FilterEventsDTO): Promise<FindAllResponse> {
        const { page, pageSize, order, status } = queryDto;
        try {
            const query = this.buildStatusQuery(status);

            this.logger.debug(`Fetching events list. Page: ${page}, PageSize: ${pageSize}, Status: ${status}`);
            this.logger.verbose(`Built MongoDB Query: ${JSON.stringify(query)}`);

            const [events, total] = await Promise.all([
                this.eventModel.find(query)
                    .skip(page * parseInt(`${pageSize}`, 10))
                    .limit(parseInt(`${pageSize}`, 10))
                    .sort({ endDate: order })
                    .lean<Event[]>()
                    .exec(),

                this.eventModel.countDocuments(query).exec()
            ]);

            return { events, total };
        } catch (error) {
            this.logger.error(`Failed to fetch events list: ${error.message}`, error.stack);
            throw new InternalServerErrorException("An error occurred while fetching the events list.");
        }
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
        now.setHours(0, 0, 0, 0);

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
