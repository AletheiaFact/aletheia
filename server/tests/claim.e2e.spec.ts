import { MongoMemoryServer } from "mongodb-memory-server";
import * as request from "supertest";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../app.module";
import { SessionGuard } from "../auth/session.guard";
import { SessionGuardMock } from "./mocks/SessionGuardMock";
import { TestConfigOptions } from "./utils/TestConfigOptions";
import { SeedTestUser } from "./utils/SeedTestUser";
import { SeedTestPersonality } from "./utils/SeedTestPersonality";
import { ContentModelEnum } from "../types/enums";
import { NameSpaceEnum } from "../auth/name-space/schemas/name-space.schema";
import { AbilitiesGuard } from "../auth/ability/abilities.guard";
import { AbilitiesGuardMock } from "./mocks/AbilitiesGuardMock";

jest.setTimeout(10000);

describe("ClaimController (e2e)", () => {
    let app: any;
    let db: any;
    let personalitiesId: string[];
    let claimId: string;
    const speechSources: string[] = ["http://wikipedia.org"];
    const imageSources1: string[] = ["http://wikimedia.org"];
    const imageSources2: string[] = ["http://wikidata.org"];
    const debateSources: string[] = ["http://aletheiafact.org"];
    const interviewSources: string[] = ["http://aletheiafact.org"];
    const date: string = "2023-11-25T14:49:30.992Z";

    beforeAll(async () => {
        db = await MongoMemoryServer.create({ instance: { port: 35025 } });
        await SeedTestUser(TestConfigOptions.config.db.connection_uri);
        const { insertedIds } = await SeedTestPersonality(
            TestConfigOptions.config.db.connection_uri
        );
        personalitiesId = [insertedIds["0"], insertedIds["1"]];

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule.register(TestConfigOptions.config)],
        })
            .overrideProvider(SessionGuard)
            .useValue(SessionGuardMock)
            .overrideGuard(AbilitiesGuard)
            .useValue(AbilitiesGuardMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it("/api/claim (GET) - claims should be empty", () => {
        return request(app.getHttpServer())
            .get("/api/claim")
            .query({
                page: 0,
                pageSize: 10,
                order: "asc",
                language: "pt",
                isHidden: false,
                nameSpace: NameSpaceEnum.Main,
            })
            .expect(200)
            .expect(({ body }) => expect(body?.claims.length).toEqual(0));
    });

    it("/api/claim (POST) - Create Speech Claim", () => {
        return request(app.getHttpServer())
            .post("/api/claim")
            .send({
                personalities: [personalitiesId[0]],
                contentModel: ContentModelEnum.Speech,
                nameSpace: NameSpaceEnum.Main,
                title: "Speech Claim Title",
                content: "Speech Claim Content Lorem Ipsum Dolor Sit Amet...",
                slug: "speech-claim-title",
                date,
                speechSources,
            })
            .expect(201)
            .expect(({ body }) => {
                claimId = body?._id;
                expect(body?.title).toEqual("Speech Claim Title");
            });
    });

    it("/api/claim/:id (GET) - Get by id", () => {
        return request(app.getHttpServer())
            .get(`/api/claim/${claimId}`)
            .query({ nameSpace: NameSpaceEnum.Main })
            .expect(200)
            .expect(({ body }) => {
                const hasBarackObamaPersonality = body?.personalities.some(
                    (p) => p.name === "Barack Obama"
                );
                expect(hasBarackObamaPersonality).toBeTruthy();
                expect(body?._id).toEqual(claimId);
                expect(body?.title).toEqual("Speech Claim Title");
            });
    });

    it("/api/claim/image (POST) - Create Image Claim with Personality", () => {
        return request(app.getHttpServer())
            .post("/api/claim/image")
            .send({
                personalities: [personalitiesId[0]],
                contentModel: ContentModelEnum.Image,
                nameSpace: NameSpaceEnum.Main,
                title: "Image Claim Title With Personality",
                date,
                imageSources1,
                content: {
                    FileURL: "http://localhost:4566/aletheia/imageTest1.png",
                    Key: "imageTest1.png",
                    Extension: "png",
                    DataHash: "388de39144cdc9fc50dac06e6b84bf88",
                },
            })
            .expect(201)
            .expect(({ body }) =>
                expect(body?.title).toEqual(
                    "Image Claim Title With Personality"
                )
            );
    });

    it("/api/claim/image (POST) - Create Image Claim without Personality", () => {
        return request(app.getHttpServer())
            .post("/api/claim/image")
            .send({
                personalities: [personalitiesId[0]],
                contentModel: ContentModelEnum.Image,
                nameSpace: NameSpaceEnum.Main,
                title: "Image Claim Title Without Personality",
                date,
                imageSources2,
                content: {
                    FileURL: "http://localhost:4566/aletheia/imageTest2.png",
                    Key: "imageTest2.png",
                    Extension: "png",
                    DataHash: "388de39144cdc9fc50dac06e6b84bf01",
                },
            })
            .expect(201)
            .expect(({ body }) =>
                expect(body?.title).toEqual(
                    "Image Claim Title Without Personality"
                )
            );
    });

    it("/api/claim/debate (POST) - Create Debate Claim", () => {
        return request(app.getHttpServer())
            .post("/api/claim/debate")
            .send({
                personalities: personalitiesId,
                contentModel: ContentModelEnum.Debate,
                nameSpace: NameSpaceEnum.Main,
                title: "Debate Claim Title",
                date,
                debateSources,
            })
            .expect(201)
            .expect(({ body }) =>
                expect(body?.title).toEqual("Debate Claim Title")
            );
    });

    it("/api/claim/interview (POST) - Create Interview Claim", () => {
        return request(app.getHttpServer())
            .post("/api/claim/interview")
            .send({
                personalities: personalitiesId,
                contentModel: ContentModelEnum.Interview,
                nameSpace: NameSpaceEnum.Main,
                title: "Interview Claim Title",
                date,
                interviewSources,
            })
            .expect(201)
            .expect(({ body }) =>
                expect(body?.title).toEqual("Interview Claim Title")
            );
    });

    it("/api/claim (GET)", () => {
        return request(app.getHttpServer())
            .get("/api/claim")
            .query({
                page: 0,
                pageSize: 10,
                order: "asc",
                language: "pt",
                isHidden: false,
                nameSpace: NameSpaceEnum.Main,
            })
            .expect(200)
            .expect(({ body }) => expect(body?.claims.length).toEqual(4));
    });

    it("/api/claim/hidden/:id (PUT) - Hide claim", () => {
        return request(app.getHttpServer())
            .put(`/api/claim/hidden/${claimId}`)
            .send({
                isHidden: true,
                description: "Hidden claim description",
            })
            .expect(200);
    });

    it("/api/claim/hidden/:id (PUT) - Unhide claim", () => {
        return request(app.getHttpServer())
            .put(`/api/claim/hidden/${claimId}`)
            .send({
                isHidden: false,
                description: "",
            })
            .expect(200);
    });

    it("/api/claim/:id (DELETE) - Delete claim", () => {
        return request(app.getHttpServer())
            .delete(`/api/claim/${claimId}`)
            .expect(200);
    });

    it("/api/claim/:id (GET) - Get by id", () => {
        return request(app.getHttpServer())
            .get(`/api/claim/${claimId}`)
            .query({ nameSpace: NameSpaceEnum.Main })
            .expect(404);
    });

    afterAll(async () => {
        await db.stop();
        app.close();
    });
});
