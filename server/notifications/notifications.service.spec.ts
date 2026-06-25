import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { NotificationService } from "./notifications.service";
import {
    mockNovu,
    mockNotificationConfigService,
} from "../mocks/NotificationMock";
import { TriggerRecipientsTypeEnum } from "@novu/node";

describe("NotificationService (Unit)", () => {
    let service: NotificationService;
    let novu: ReturnType<typeof mockNovu>;
    let configService: ReturnType<typeof mockNotificationConfigService>;

    const NOVU_PROVIDER_TOKEN = "NOVU_PROVIDER_TOKEN";

    const setupModule = async (configured = true) => {
        novu = mockNovu();
        configService = mockNotificationConfigService(configured);

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                NotificationService,
                { provide: NOVU_PROVIDER_TOKEN, useValue: novu },
                { provide: ConfigService, useValue: configService },
            ],
        }).compile();

        service = module.get<NotificationService>(NotificationService);
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("when Novu is configured", () => {
        beforeAll(async () => {
            await setupModule(true);
        });

        describe("novuIsConfigured", () => {
            it("should return true when api key is set", () => {
                expect(service.novuIsConfigured()).toBe(true);
            });
        });

        describe("createSubscriber", () => {
            it("should identify subscriber and trigger email-sender", async () => {
                const result = await service.createSubscriber({
                    _id: "sub-123",
                    email: "test@example.com",
                    name: "Test User",
                });

                expect(novu.subscribers.identify).toHaveBeenCalledWith(
                    "sub-123",
                    {
                        email: "test@example.com",
                        firstName: "Test User",
                    }
                );
                expect(novu.trigger).toHaveBeenCalledWith("email-sender", {
                    to: {
                        subscriberId: "sub-123",
                        email: "test@example.com",
                        firstName: "Test User",
                    },
                    payload: {},
                });
                expect(result).toEqual({ subscriberId: "sub-123" });
            });
        });

        describe("sendEmail", () => {
            it("should trigger email-sender with subscriberId and email", async () => {
                await service.sendEmail("sub-123", "test@example.com");

                expect(novu.trigger).toHaveBeenCalledWith("email-sender", {
                    to: {
                        subscriberId: "sub-123",
                        email: "test@example.com",
                    },
                    payload: {},
                });
            });
        });

        describe("sendNotification", () => {
            it("should trigger email-notifications with payload", async () => {
                const payload = { title: "New Task", body: "Review assigned" };

                await service.sendNotification("sub-123", payload);

                expect(novu.trigger).toHaveBeenCalledWith(
                    "email-notifications",
                    {
                        to: { subscriberId: "sub-123" },
                        payload,
                    }
                );
            });
        });

        describe("topic management", () => {
            it("should create a topic", async () => {
                await service.createTopic("review-updates", "Review Updates");

                expect(novu.topics.create).toHaveBeenCalledWith({
                    key: "review-updates",
                    name: "Review Updates",
                });
            });

            it("should get a topic", async () => {
                const result = await service.getTopic("review-updates");

                expect(novu.topics.get).toHaveBeenCalledWith(
                    "review-updates"
                );
                expect(result).toEqual({
                    _id: "topic-id-123",
                    key: "test-topic",
                });
            });

            it("should return false when getTopic fails", async () => {
                novu.topics.get.mockRejectedValue(new Error("Not found"));

                const result = await service.getTopic("nonexistent");
                expect(result).toBe(false);
            });

            it("should add subscribers to topic", async () => {
                await service.addTopicSubscriber("review-updates", [
                    "sub-1",
                    "sub-2",
                ]);

                expect(novu.topics.addSubscribers).toHaveBeenCalledWith(
                    "review-updates",
                    { subscribers: ["sub-1", "sub-2"] }
                );
            });

            it("should remove subscribers from topic", async () => {
                await service.removeTopicSubscriber("review-updates", [
                    "sub-1",
                ]);

                expect(novu.topics.removeSubscribers).toHaveBeenCalledWith(
                    "review-updates",
                    { subscribers: ["sub-1"] }
                );
            });
        });

        describe("sendDailyReviewsEmail", () => {
            it("should trigger daily-report for topic", async () => {
                const body = "<html>Daily report</html>";

                await service.sendDailyReviewsEmail("daily-topic", body);

                expect(novu.trigger).toHaveBeenCalledWith("daily-report", {
                    to: [
                        {
                            type: TriggerRecipientsTypeEnum.TOPIC,
                            topicKey: "daily-topic",
                        },
                    ],
                    payload: { body },
                });
            });
        });

        describe("verifyUserOnTopic", () => {
            it("should check subscriber on topic", async () => {
                await service.verifyUserOnTopic("review-updates", "sub-123");

                expect(novu.topics.getSubscriber).toHaveBeenCalledWith(
                    "review-updates",
                    "sub-123"
                );
            });
        });

        describe("generateHmacHash", () => {
            it("should generate HMAC hash from subscriber id", () => {
                const hash = service.generateHmacHash("sub-123");

                expect(typeof hash).toBe("string");
                expect(hash.length).toBe(64); // SHA-256 hex output
            });
        });
    });

    describe("when Novu is NOT configured", () => {
        beforeAll(async () => {
            await setupModule(false);
        });

        it("novuIsConfigured should return false", () => {
            expect(service.novuIsConfigured()).toBe(false);
        });

        it("createSubscriber should return undefined without calling Novu", async () => {
            const result = await service.createSubscriber({
                _id: "sub-123",
                email: "test@example.com",
                name: "Test",
            });

            expect(result).toBeUndefined();
            expect(novu.subscribers.identify).not.toHaveBeenCalled();
        });

        it("sendEmail should return undefined", async () => {
            const result = await service.sendEmail("sub-123", "test@example.com");
            expect(result).toBeUndefined();
        });

        it("sendNotification should return undefined", async () => {
            const result = await service.sendNotification("sub-123", {});
            expect(result).toBeUndefined();
        });

        it("createTopic should return undefined", async () => {
            const result = await service.createTopic("key", "name");
            expect(result).toBeUndefined();
        });

        it("generateHmacHash should return undefined", () => {
            const result = service.generateHmacHash("sub-123");
            expect(result).toBeUndefined();
        });
    });
});
