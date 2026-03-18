import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import {
    BadRequestException,
    ConflictException,
    InternalServerErrorException,
    NotFoundException,
} from "@nestjs/common";
import * as crypto from "crypto";
import { EventsService } from "./event.service";
import { Event } from "./schema/event.schema";
import { VerificationRequestService } from "../verification-request/verification-request.service";
import { TopicService } from "../topic/topic.service";
import {
    mockCreateEventDto,
    mockEventModel,
    mockClaimService,
    mockClaimReviewService,
    mockTopicService,
    mockVerificationRequestService,
    mockRequest,
} from "../mocks/EventMock";
import { EventsStatus } from "../types/enums";
import { ClaimService } from "../claim/claim.service";
import { ClaimReviewService } from "../claim-review/claim-review.service";
import { REQUEST } from "@nestjs/core";

describe("EventsService (Unit)", () => {
    let service: EventsService;

    beforeAll(async () => {
        const testingModule: TestingModule = await Test.createTestingModule({
            providers: [
                EventsService,
                {
                    provide: REQUEST,
                    useValue: mockRequest,
                },
                {
                    provide: getModelToken(Event.name),
                    useValue: mockEventModel,
                },
                {
                    provide: VerificationRequestService,
                    useValue: mockVerificationRequestService,
                },
                {
                    provide: ClaimService,
                    useValue: mockClaimService,
                },
                {
                    provide: ClaimReviewService,
                    useValue: mockClaimReviewService,
                },
                {
                    provide: TopicService,
                    useValue: mockTopicService,
                },
            ],
        }).compile();

        service = await testingModule.resolve<EventsService>(EventsService);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("create", () => {
        it("should create an event with generated hash and resolved topics", async () => {
            const mainTopic = { _id: "t1", name: "Climate", wikidataId: "Q1" };
            const expectedHash = crypto
                .createHash("md5")
                .update(`${mockCreateEventDto.name}-${mockCreateEventDto.startDate}`)
                .digest("hex");
            const createdEvent = { _id: "e1", data_hash: expectedHash };

            mockTopicService.findOrCreateTopic.mockResolvedValueOnce(mainTopic);
            mockEventModel.create.mockResolvedValue(createdEvent);

            const result = await service.create(mockCreateEventDto as any);

            expect(mockTopicService.findOrCreateTopic).toHaveBeenCalledTimes(1);
            expect(mockTopicService.findOrCreateTopic).toHaveBeenCalledWith({
                ...mockCreateEventDto.mainTopic,
                name: mockCreateEventDto.mainTopic.label,
            });
            expect(mockEventModel.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    ...mockCreateEventDto,
                    data_hash: expectedHash,
                    mainTopic: mainTopic._id,
                })
            );
            expect(result).toEqual(createdEvent);
        });

        it("should throw BadRequestException for schema validation errors", async () => {
            const validationError = {
                name: "ValidationError",
                errors: { name: {}, location: {} },
            };

            mockTopicService.findOrCreateTopic.mockResolvedValue({ _id: "topic-id" });
            mockEventModel.create.mockRejectedValue(validationError);

            await expect(service.create(mockCreateEventDto as any)).rejects.toThrow(
                BadRequestException
            );
        });

        it("should throw ConflictException for duplicate key errors", async () => {
            const duplicateKeyError = {
                code: 11000,
                keyPattern: { name: 1 },
            };

            mockTopicService.findOrCreateTopic.mockResolvedValue({ _id: "topic-id" });
            mockEventModel.create.mockRejectedValue(duplicateKeyError);

            await expect(service.create(mockCreateEventDto as any)).rejects.toThrow(
                ConflictException
            );
        });

        it("should throw InternalServerErrorException for unknown errors", async () => {
            mockTopicService.findOrCreateTopic.mockResolvedValue({ _id: "topic-id" });
            mockEventModel.create.mockRejectedValue(new Error("unexpected"));

            await expect(service.create(mockCreateEventDto as any)).rejects.toThrow(
                InternalServerErrorException
            );
        });
    });

    describe("update", () => {
        it("should throw BadRequestException when id is invalid", async () => {
            await expect(service.update("invalid-id", { name: "Updated" } as any)).rejects.toThrow(
                BadRequestException
            );

            expect(mockEventModel.findByIdAndUpdate).not.toHaveBeenCalled();
        });

        it("should update event and deduplicate filter topics by name", async () => {
            const id = "507f1f77bcf86cd799439011";
            const updateDto = {
                name: "Updated Event",
                mainTopic: { name: "Main", wikidataId: "Q10" },
                filterTopics: [
                    { name: "A", wikidataId: "Q11" },
                    { name: "A", wikidataId: "Q11" },
                    { name: "B", wikidataId: "Q12" },
                ],
            } as any;

            const resolvedMain = { _id: "tm", name: "Main" };
            const resolvedFilterA = { _id: "ta", name: "A" };
            const resolvedFilterB = { _id: "tb", name: "B" };
            const updatedEvent = { _id: id, ...updateDto };

            mockTopicService.findOrCreateTopic
                .mockResolvedValueOnce(resolvedMain)
                .mockResolvedValueOnce(resolvedFilterA)
                .mockResolvedValueOnce(resolvedFilterB);
            mockEventModel.findByIdAndUpdate.mockResolvedValue(updatedEvent);

            const result = await service.update(id, updateDto);

            expect(mockTopicService.findOrCreateTopic).toHaveBeenCalledTimes(3);
            expect(mockEventModel.findByIdAndUpdate).toHaveBeenCalledWith(
                id,
                {
                    $set: expect.objectContaining({
                        name: "Updated Event",
                        mainTopic: resolvedMain,
                        filterTopics: [resolvedFilterA, resolvedFilterB],
                    }),
                },
                { new: true, runValidators: true }
            );
            expect(result).toEqual(updatedEvent);
        });

        it("should throw NotFoundException if event is not found", async () => {
            const id = "507f1f77bcf86cd799439011";
            mockEventModel.findByIdAndUpdate.mockResolvedValue(null);

            await expect(service.update(id, { name: "Updated" } as any)).rejects.toThrow(
                NotFoundException
            );
        });

        it("should throw BadRequestException on cast errors", async () => {
            const id = "507f1f77bcf86cd799439011";
            mockEventModel.findByIdAndUpdate.mockRejectedValue({
                name: "CastError",
                path: "startDate",
            });

            await expect(service.update(id, { name: "Updated" } as any)).rejects.toThrow(
                BadRequestException
            );
        });

        it("should throw InternalServerErrorException on unknown failures", async () => {
            const id = "507f1f77bcf86cd799439011";
            mockEventModel.findByIdAndUpdate.mockRejectedValue(new Error("unexpected"));

            await expect(service.update(id, { name: "Updated" } as any)).rejects.toThrow(
                InternalServerErrorException
            );
        });
    });

    describe("findAll", () => {
        it("should return events list with pagination and order", async () => {
            const eventsResult = [
                {
                    data_hash: "mock-hash-1",
                    endDate: "2025-11-20T23:00:00.000+00:00",
                    mainTopic: { wikidataId: "Q123", name: "Topic A" }
                },
                {
                    data_hash: "mock-hash-2",
                    endDate: "2025-12-15T18:30:00.000+00:00",
                    mainTopic: { wikidataId: "Q456", name: "Topic B" }
                }
            ];

            const exec = jest.fn().mockResolvedValue(eventsResult);
            const populate = jest.fn().mockReturnValue({ exec });
            const lean = jest.fn().mockReturnValue({ populate });
            const sort = jest.fn().mockReturnValue({ lean });
            const limit = jest.fn().mockReturnValue({ sort });
            const skip = jest.fn().mockReturnValue({ limit });

            mockEventModel.find.mockReturnValue({ skip });

            const countExec = jest.fn().mockResolvedValue(eventsResult.length);
            mockEventModel.countDocuments = jest.fn().mockReturnValue({ exec: countExec });

            const mockMetrics = { verificationRequests: 5, claims: 10, reviews: 15 };
            jest.spyOn(service, 'getEventMetrics').mockResolvedValue(mockMetrics);

            const result = await service.findAll({
                page: 1,
                pageSize: 5,
                order: "desc",
                status: EventsStatus.HAPPENING,
            });

            expect(mockEventModel.find).toHaveBeenCalledWith(
                expect.objectContaining({
                    startDate: expect.any(Object),
                    endDate: expect.any(Object),
                })
            );
            expect(skip).toHaveBeenCalledWith(5);
            expect(limit).toHaveBeenCalledWith(5);
            expect(sort).toHaveBeenCalledWith({ endDate: -1 });
            expect(populate).toHaveBeenCalledWith("mainTopic");

            expect(service.getEventMetrics).toHaveBeenCalledTimes(2);
            expect(service.getEventMetrics).toHaveBeenCalledWith("Q123", "Topic A");

            expect(result).toEqual({
                events: eventsResult,
                total: eventsResult.length,
                eventMetrics: {
                    "mock-hash-1": mockMetrics,
                    "mock-hash-2": mockMetrics,
                }
            });
        });

        it("should throw InternalServerErrorException when querying fails", async () => {
            const exec = jest.fn().mockRejectedValue(new Error("db fail"));
            const populate = jest.fn().mockReturnValue({ exec });
            const lean = jest.fn().mockReturnValue({ populate });
            const sort = jest.fn().mockReturnValue({ lean });
            const limit = jest.fn().mockReturnValue({ sort });
            const skip = jest.fn().mockReturnValue({ limit });

            mockEventModel.find.mockReturnValue({ skip });

            const countExec = jest.fn().mockResolvedValue(0);
            mockEventModel.countDocuments = jest.fn().mockReturnValue({ exec: countExec });

            jest.restoreAllMocks();

            await expect(
                service.findAll({ page: 0, pageSize: 10, order: "asc", status: EventsStatus.UPCOMING })
            ).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe("findByHash", () => {
        it("should return event when hash exists", async () => {
            const event = { _id: "e1", data_hash: "hash123" };
            const exec = jest.fn().mockResolvedValue(event);
            const populateFilterTopics = jest.fn().mockReturnValue({ exec });
            const populateMainTopic = jest
                .fn()
                .mockReturnValue({ populate: populateFilterTopics });

            mockEventModel.findOne.mockReturnValue({ populate: populateMainTopic });

            const result = await service.findByHash("hash123");

            expect(mockEventModel.findOne).toHaveBeenCalledWith({ data_hash: "hash123" });
            expect(result).toEqual(event);
        });

        it("should throw NotFoundException when hash does not exist", async () => {
            const exec = jest.fn().mockResolvedValue(null);
            const populateFilterTopics = jest.fn().mockReturnValue({ exec });
            const populateMainTopic = jest
                .fn()
                .mockReturnValue({ populate: populateFilterTopics });

            mockEventModel.findOne.mockReturnValue({ populate: populateMainTopic });

            await expect(service.findByHash("missing-hash")).rejects.toThrow(
                NotFoundException
            );
        });
    });
});
