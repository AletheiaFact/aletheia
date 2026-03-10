import * as request from "supertest";
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

jest.setTimeout(10000);

describe("EventController (e2e)", () => {
    let app: any;
    let createdEventId: string;

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
                expect(body).toHaveProperty("total");
                expect(Array.isArray(body.events)).toBe(true);
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
                expect(body).toHaveProperty("total");
                expect(Array.isArray(body.events)).toBe(true);
                expect(body.events.length).toBeGreaterThanOrEqual(2);
                expect(body.total).toBeGreaterThanOrEqual(2);

                const created = body.events.find((event) => event._id === createdEventId);
                expect(created).toBeDefined();
                expect(created.name).toEqual("Future Event Alpha");
            });
    });

    it("/api/event/:id (PATCH) - should update event name", () => {
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
                status: "upcoming",
            })
            .expect(200)
            .expect(({ body }) => {
                expect(body).toHaveProperty("events");
                expect(body).toHaveProperty("total");
                expect(Array.isArray(body.events)).toBe(true);
                expect(body.events.length).toBeGreaterThanOrEqual(1);
                expect(body.total).toBeGreaterThanOrEqual(1);

                for (const event of body.events) {
                    expect(new Date(event.startDate).getTime()).toBeGreaterThan(Date.now() - 24 * 60 * 60 * 1000);
                }
            });
    });

    it("/api/event (GET) - should accept unknown status and still return list", () => {
        return request(app.getHttpServer())
            .get("/api/event")
            .query({
                page: 0,
                pageSize: 20,
                order: "asc",
                status: "unknown-status",
            })
            .expect(200)
            .expect(({ body }) => {
                expect(body).toHaveProperty("events");
                expect(body).toHaveProperty("total");
                expect(Array.isArray(body.events)).toBe(true);
                expect(body.events.length).toBeGreaterThanOrEqual(1);
                expect(body.total).toBeGreaterThanOrEqual(1);
            });
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
        jest.restoreAllMocks();
        await app.close();
        await CleanupDatabase(process.env.MONGO_URI!);
    });
});
