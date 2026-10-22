import request from "supertest";
import { Test, TestingModule } from "@nestjs/testing";
import { ValidationPipe } from "@nestjs/common";
import { getModelToken } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ISoftDeletedModel } from "mongoose-softdelete-typescript";
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
import { FeatureFlagService } from "../feature-flag/feature-flag.service";
import { EventsService } from "../events/event.service";
import { OrganizationDocument } from "../organization/mongo/schemas/organization.schema";

describe("OrganizationController (e2e)", () => {
    let app: any;
    let moduleFixture: TestingModule;
    let organizationModel: ISoftDeletedModel<OrganizationDocument>;
    let organizationId: string;
    let secondOrganizationId: string;

    const mockFeatureFlagService = {
        isEnableEventsFeature: vi.fn(),
    };

    const uploadedLogo = (seed: string) => ({
        FileURL: `https://bucket.s3.amazonaws.com/${seed}.png`,
        Key: `${seed}.png`,
        Extension: "png",
        DataHash: seed.padEnd(32, "0"),
    });

    const eventPayload = (name: string, participants: unknown[]) => ({
        badge: "ELEIÇÕES 2026",
        name,
        description: `${name} description`,
        location: "Rio de Janeiro",
        startDate: new Date("2026-10-23T00:00:00.000Z").toISOString(),
        endDate: new Date("2026-10-24T00:00:00.000Z").toISOString(),
        mainTopic: { label: "Elections", wikidataId: "Q40231" },
        participants,
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

        moduleFixture = await Test.createTestingModule({
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

        organizationModel = moduleFixture.get(getModelToken("Organization"));
        await organizationModel.ensureIndexes();
        const eventModel = moduleFixture.get<Model<any>>(
            getModelToken("Event")
        );
        await eventModel.ensureIndexes();
    });

    beforeEach(() => {
        mockFeatureFlagService.isEnableEventsFeature.mockReturnValue(true);
    });

    it("returns 404 when the events flag is disabled", () => {
        mockFeatureFlagService.isEnableEventsFeature.mockReturnValue(false);
        return request(app.getHttpServer())
            .get("/api/organization")
            .query({ name: "any" })
            .expect(404);
    });

    it("creates an organization from a fresh logo upload", () => {
        return request(app.getHttpServer())
            .post("/api/organization")
            .send({
                name: "Agência Exemplo",
                website: "https://example.org",
                logo: uploadedLogo("a1"),
            })
            .expect(201)
            .expect(({ body }) => {
                organizationId = body._id;
                expect(body.slug).toBe("agencia-exemplo");
                expect(body.logo.content).toBe(uploadedLogo("a1").FileURL);
            });
    });

    it("rejects a duplicate name with 409", () => {
        return request(app.getHttpServer())
            .post("/api/organization")
            .send({ name: "agência exemplo", logo: uploadedLogo("a2") })
            .expect(409);
    });

    it("rejects an invalid payload with 400", () => {
        return request(app.getHttpServer())
            .post("/api/organization")
            .send({
                name: "Bad Site",
                website: "javascript:alert(1)",
                logo: uploadedLogo("a3"),
            })
            .expect(400);
    });

    it("searches by name, case-insensitive, treating input literally", async () => {
        await request(app.getHttpServer())
            .get("/api/organization")
            .query({ name: "EXEMP" })
            .expect(200)
            .expect(({ body }) => {
                expect(body.map((org) => org._id)).toEqual([organizationId]);
                expect(body[0].logo).toHaveProperty("content");
            });

        return request(app.getHttpServer())
            .get("/api/organization")
            .query({ name: ".*" })
            .expect(200)
            .expect(({ body }) => expect(body).toEqual([]));
    });

    it("updates an organization and re-derives its slug", () => {
        return request(app.getHttpServer())
            .patch(`/api/organization/${organizationId}`)
            .send({ name: "Agência Exemplo Checagem" })
            .expect(200)
            .expect(({ body }) => {
                expect(body.slug).toBe("agencia-exemplo-checagem");
                expect(body.website).toBe("https://example.org");
            });
    });

    it("returns 400 for a malformed id and 404 for a missing one", async () => {
        await request(app.getHttpServer())
            .patch("/api/organization/not-an-id")
            .send({ name: "x1" })
            .expect(400);

        return request(app.getHttpServer())
            .patch("/api/organization/507f1f77bcf86cd799439011")
            .send({ name: "x2" })
            .expect(404);
    });

    it("creates an event with participants and rejects unknown ones", async () => {
        const second = await request(app.getHttpServer())
            .post("/api/organization")
            .send({ name: "Segunda Org", logo: uploadedLogo("b1") })
            .expect(201);
        secondOrganizationId = second.body._id;

        await request(app.getHttpServer())
            .post("/api/event")
            .send(
                eventPayload("Debate com participantes", [
                    { organization: "507f1f77bcf86cd799439099", order: 0 },
                ])
            )
            .expect(400);

        await request(app.getHttpServer())
            .post("/api/event")
            .send(
                eventPayload("Debate com participantes", [
                    { organization: secondOrganizationId, order: 1 },
                    { organization: organizationId, order: 0 },
                ])
            )
            .expect(201)
            .expect(({ body }) => {
                expect(
                    body.participants.map(({ organization }) => organization)
                ).toEqual([organizationId, secondOrganizationId]);
            });
    });

    it("exposes populated participants on the event page and hides deleted ones", async () => {
        const eventsService = await moduleFixture.resolve(EventsService);
        const { body: list } = await request(app.getHttpServer())
            .get("/api/event")
            .expect(200);
        const created = list.events.find(
            (event) => event.name === "Debate com participantes"
        );

        const event = await eventsService.findByHash(created.data_hash);
        expect(
            event.participants.map(({ organization }) => organization.name)
        ).toEqual(["Agência Exemplo Checagem", "Segunda Org"]);
        expect(event.participants[0].organization.logo).toHaveProperty(
            "content"
        );

        await organizationModel.softDelete({ _id: secondOrganizationId });

        const afterDelete = await eventsService.findByHash(created.data_hash);
        expect(
            afterDelete.participants.map(
                ({ organization }) => organization.name
            )
        ).toEqual(["Agência Exemplo Checagem"]);
    });

    afterAll(async () => {
        vi.restoreAllMocks();
        await app.close();
        await CleanupDatabase(process.env.MONGO_URI!);
    });
});
