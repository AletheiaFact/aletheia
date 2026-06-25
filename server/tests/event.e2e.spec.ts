import request from "supertest";
import { Test, TestingModule } from "@nestjs/testing";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "../app.module";
import { SessionGuard } from "../auth/session.guard";
import { SessionGuardMock } from "./mocks/SessionGuardMock";
import { SessionOrM2MGuard } from "../auth/m2m-or-session.guard";
import { SessionOrM2MGuardMock } from "./mocks/SessionOrM2MGuardMock";
import { M2MGuard } from "../auth/m2m.guard";
import { M2MGuardMock } from "./mocks/M2MGuardMock";
import { AbilitiesGuard } from "../auth/ability/abilities.guard";
import { AbilitiesGuardMock } from "./mocks/AbilitiesGuardMock";
import { TestConfigOptions } from "./utils/TestConfigOptions";
import { SeedTestUser } from "./utils/SeedTestUser";
import { CleanupDatabase } from "./utils/CleanupDatabase";
import { EventsStatus } from "../types/enums";
import { Model } from "mongoose";
import { getModelToken } from "@nestjs/mongoose";
import { FeatureFlagService } from "../feature-flag/feature-flag.service";


describe("EventController (e2e)", () => {
    let app: any;
    let createdEventId: string;

    const mockFeatureFlagService = {
        isEnableEventsFeature: vi.fn(),
    };

    const createEventPayload = (
        name: string,
        startDate: Date,
        endDate: Date,
        mainTopicName = "Climate"
    ) => ({
        badge: "event-badge",
        name,
        description: `${name} description`,
        location: "New York",
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        mainTopic: {
            label: mainTopicName,
            name: mainTopicName,
            wikidataId: "Q125928",
        },
    });

    beforeAll(async () => {
        const mongoUri = process.env.MONGO_URI!;

        await SeedTestUser(mongoUri);

        const testConfig = {
            ...TestConfigOptions.config,
            db: {
                ...TestConfigOptions.config.db,
                connection_uri: mongoUri,
            },
        };

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule.register(testConfig)],
        })
            .overrideGuard(SessionGuard)
            .useValue(SessionGuardMock)
            .overrideGuard(SessionOrM2MGuard)
            .useValue(SessionOrM2MGuardMock)
            .overrideGuard(M2MGuard)
            .useValue(M2MGuardMock)
            .overrideGuard(AbilitiesGuard)
            .useValue(AbilitiesGuardMock)
            .overrideProvider(FeatureFlagService)
            .useValue(mockFeatureFlagService)
            .compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({
                transform: true,
                transformOptions: { enableImplicitConversion: true },
                whitelist: true,
                forbidNonWhitelisted: true,
            })
        );

        await app.init();

        const eventModel = moduleFixture.get<Model<any>>(getModelToken("Event"));
        await eventModel.ensureIndexes();
    });

    beforeEach(() => {
        mockFeatureFlagService.isEnableEventsFeature.mockReturnValue(true);
    });

    describe("Feature Flag Security", () => {
        it("should return 404 for API when feature flag is DISABLED", async () => {
            mockFeatureFlagService.isEnableEventsFeature.mockReturnValue(false);
            return request(app.getHttpServer())
                .get("/api/event")
                .expect(404);
        });

        it("should redirect to '/' for Public Pages when feature flag is DISABLED", async () => {
            mockFeatureFlagService.isEnableEventsFeature.mockReturnValue(false);
            return request(app.getHttpServer())
                .get("/event")
                .expect(302)
                .expect("Location", "/");
        });
    });

    it("/api/event (GET) - should return empty list initially", () => {
        return request(app.getHttpServer())
            .get("/api/event")
            .query({
                page: 0,
                pageSize: 10,
                order: "asc",
            })
            .expect(200)
            .expect(({ body }) => {
                expect(body).toHaveProperty("events");
                expect(body).toHaveProperty("eventMetrics");
                expect(body).toHaveProperty("total");
                expect(Array.isArray(body.events)).toBe(true);
                expect(body.eventMetrics).toEqual({});
                expect(body.events).toHaveLength(0);
                expect(body.total).toBe(0);
            });
    });

    it("/api/event (POST) - should create a new event", () => {
        const now = new Date();
        const start = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
        const end = new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000);

        return request(app.getHttpServer())
            .post("/api/event")
            .send(createEventPayload("Future Event Alpha", start, end))
            .expect(201)
            .expect(({ body }) => {
                createdEventId = body._id;

                expect(body).toHaveProperty("_id");
                expect(body).toHaveProperty("data_hash");
                expect(body.name).toEqual("Future Event Alpha");
                expect(body).toHaveProperty("mainTopic");
            });
    });

    it("/api/event (POST) - should reject duplicate event by unique data_hash", async () => {
        const now = new Date();
        const start = new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000);
        const end = new Date(now.getTime() + 9 * 24 * 60 * 60 * 1000);
        const payload = createEventPayload("Duplicate Event", start, end);

        await request(app.getHttpServer())
            .post("/api/event")
            .send(payload)
            .expect(201);

        return request(app.getHttpServer())
            .post("/api/event")
            .send(payload)
            .expect(409);
    });

    it("/api/event (GET) - should list created events", () => {
        return request(app.getHttpServer())
            .get("/api/event")
            .query({
                page: 0,
                pageSize: 20,
                order: "asc",
            })
            .expect(200)
            .expect(({ body }) => {
                expect(body).toHaveProperty("events");
                expect(body).toHaveProperty("eventMetrics");
                expect(body).toHaveProperty("total");
                expect(Array.isArray(body.events)).toBe(true);
                expect(typeof body.eventMetrics).toBe("object");
                expect(body.events.length).toBeGreaterThanOrEqual(2);
                expect(body.total).toBeGreaterThanOrEqual(2);

                const created = body.events.find((event) => event._id === createdEventId);
                expect(created).toBeDefined();
                expect(created.name).toEqual("Future Event Alpha");

                expect(body.eventMetrics[created.data_hash]).toMatchObject({
                    verificationRequests: expect.any(Number),
                    claims: expect.any(Number),
                    reviews: expect.any(Number)
                });
            });
    });

    it("/api/event/:id (PATCH) - should update event name", () => {
        expect(createdEventId).toBeDefined();

        return request(app.getHttpServer())
            .patch(`/api/event/${createdEventId}`)
            .send({
                name: "Future Event Alpha Updated",
            })
            .expect(200)
            .expect(({ body }) => {
                expect(body._id).toEqual(createdEventId);
                expect(body.name).toEqual("Future Event Alpha Updated");
            });
    });

    it("/api/event/:id (PATCH) - should return 400 for invalid ObjectId", () => {
        return request(app.getHttpServer())
            .patch("/api/event/invalid-id")
            .send({ name: "No Update" })
            .expect(400);
    });

    it("/api/event (GET) - should filter by status=upcoming", async () => {
        const now = new Date();
        const start = new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000);
        const end = new Date(now.getTime() + 13 * 24 * 60 * 60 * 1000);

        await request(app.getHttpServer())
            .post("/api/event")
            .send(createEventPayload("Future Event Beta", start, end, "Politics"))
            .expect(201);

        return request(app.getHttpServer())
            .get("/api/event")
            .query({
                page: 0,
                pageSize: 20,
                order: "asc",
                status: EventsStatus.UPCOMING,
            })
            .expect(200)
            .expect(({ body }) => {
                expect(body).toHaveProperty("events");
                expect(body).toHaveProperty("eventMetrics");
                expect(body).toHaveProperty("total");
                expect(Array.isArray(body.events)).toBe(true);
                expect(typeof body.eventMetrics).toBe("object");
                expect(body.events.length).toBeGreaterThanOrEqual(1);
                expect(body.total).toBeGreaterThanOrEqual(1);

                for (const event of body.events) {
                    expect(new Date(event.startDate).getTime()).toBeGreaterThan(Date.now() - 24 * 60 * 60 * 1000);
                    expect(body.eventMetrics[event.data_hash]).toBeDefined();
                }
            });
    });

    it("/api/event (GET) - should REJECT unknown status", () => {
        return request(app.getHttpServer())
            .get("/api/event")
            .query({
                status: "unknown-status",
            })
            .expect(400);
    });

    it("/api/event (POST) - should validate required fields", () => {
        return request(app.getHttpServer())
            .post("/api/event")
            .send({
                name: "Invalid Event Payload",
            })
            .expect(400);
    });

    it("/api/event/:id (PATCH) - should return 404 for non-existent event id", () => {
        return request(app.getHttpServer())
            .patch("/api/event/507f1f77bcf86cd799439011")
            .send({ name: "Not found update" })
            .expect(404);
    });

    afterAll(async () => {
        vi.restoreAllMocks();
        await app.close();
        await CleanupDatabase(process.env.MONGO_URI!);
    });
});
