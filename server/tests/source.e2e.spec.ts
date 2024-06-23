import { MongoMemoryServer } from "mongodb-memory-server";
import * as request from "supertest";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../app.module";
import { SessionGuard } from "../auth/session.guard";
import { SessionGuardMock } from "./mocks/SessionGuardMock";
import { TestConfigOptions } from "./utils/TestConfigOptions";
import { SeedTestUser } from "./utils/SeedTestUser";
import { AbilitiesGuard } from "../auth/ability/abilities.guard";
import { AbilitiesGuardMock } from "./mocks/AbilitiesGuardMock";
import { NameSpaceEnum } from "../auth/name-space/schemas/name-space.schema";
import { SeedTestPersonality } from "./utils/SeedTestPersonality";
import { SeedTestClaim } from "./utils/SeedTestClaim";
const ObjectId = require("mongodb").ObjectID;

jest.setTimeout(10000);

describe("SourceController (e2e)", () => {
    let app: any;
    let db: any;
    let userId: string;
    let personalitiesId: string[];
    let claimId: string;
    let targetId: string;

    beforeAll(async () => {
        db = await MongoMemoryServer.create({ instance: { port: 35025 } });
        const user = await SeedTestUser(
            TestConfigOptions.config.db.connection_uri
        );
        userId = user.insertedId;
        const { insertedIds } = await SeedTestPersonality(
            TestConfigOptions.config.db.connection_uri
        );
        personalitiesId = [insertedIds["0"], insertedIds["1"]];

        const claimRevisionId = new ObjectId();
        const claim = await SeedTestClaim(
            TestConfigOptions.config.db.connection_uri,
            personalitiesId,
            claimRevisionId
        );
        claimId = claim.insertedId;

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

    it("/api/source (GET) - sources should be empty", () => {
        return request(app.getHttpServer())
            .get("/api/source")
            .query({
                page: 0,
                order: "asc",
                pageSize: 5,
                language: "pt",
                nameSpace: NameSpaceEnum.Main,
            })
            .expect(200)
            .expect(({ body }) => expect(body?.sources.length).toEqual(0));
    });

    it("/api/source (POST) - should create a new source with valid captcha", async () => {
        const sourceData = {
            href: "https://www.wikipedia.org/",
            props: {
                summary: "mock_summaru",
                classification: "mock_classification",
            },
            user: ObjectId(userId),
            nameSpace: NameSpaceEnum.Main,
            targetId: claimId,
            recaptcha: "valid_recaptcha_token",
        };

        return request(app.getHttpServer())
            .post(`/api/source`)
            .send(sourceData)
            .expect(201)
            .expect(({ body }) => {
                targetId = body.targetId;
                expect(body.href).toEqual("https://www.wikipedia.org/");
            });
    });

    it("/api/source/:targetId (GET) - Should get sources by targetId", () => {
        return request(app.getHttpServer())
            .get(`/api/source/${targetId}`)
            .query({
                page: 0,
                order: "asc",
                pageSize: 5,
                language: "pt",
                nameSpace: NameSpaceEnum.Main,
            })
            .expect(200)
            .expect(({ body }) => {
                expect(body.sources[0].targetId).toEqual(targetId);
            });
    });

    it("/api/source (GET) - should findAll sources", () => {
        return request(app.getHttpServer())
            .get("/api/source")
            .query({
                page: 0,
                order: "asc",
                pageSize: 5,
                language: "pt",
                nameSpace: NameSpaceEnum.Main,
            })
            .expect(200)
            .expect(({ body }) => {
                expect(body?.sources.length).toEqual(1);
            });
    });

    afterAll(async () => {
        jest.restoreAllMocks();
        await db.stop();
        app.close();
    });
});
