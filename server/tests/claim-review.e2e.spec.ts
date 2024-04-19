import { MongoMemoryServer } from "mongodb-memory-server";
import * as request from "supertest";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../app.module";
import { SessionGuard } from "../auth/session.guard";
import { SessionGuardMock } from "./mocks/SessionGuardMock";
import { TestConfigOptions } from "./utils/TestConfigOptions";
import { SeedTestUser } from "./utils/SeedTestUser";
import { SeedTestPersonality } from "./utils/SeedTestPersonality";
import { NameSpaceEnum } from "../auth/name-space/schemas/name-space.schema";
import { AbilitiesGuard } from "../auth/ability/abilities.guard";
import { AbilitiesGuardMock } from "./mocks/AbilitiesGuardMock";
import { SeedTestClaimReview } from "./utils/SeedTestClaimReview";
import { SeedTestReport } from "./utils/SeedTestReport";
import { SeedTestSentence } from "./utils/SeedTestSentence";
import { SeedTestParagraph } from "./utils/SeedTestParagraph";
import { SeedTestSpeech } from "./utils/SeedTestSpeech";
import { SeedTestClaimRevision } from "./utils/SeedTestClaimRevision";
import { SeedTestClaim } from "./utils/SeedTestClaim";
const ObjectId = require("mongodb").ObjectID;

jest.setTimeout(10000);

describe("ClaimReviewController (e2e)", () => {
    let app: any;
    let db: any;
    let userId: string;
    let personalitiesId: string[];
    let reportId: string;
    let sentenceId: string;
    let paragraphId: string;
    let speecheId: string;
    let claimRevisionId: string;
    let claimId: string;

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

        const report = await SeedTestReport(
            TestConfigOptions.config.db.connection_uri,
            userId
        );
        reportId = report.insertedId;
        const sentence = await SeedTestSentence(
            TestConfigOptions.config.db.connection_uri
        );
        sentenceId = sentence.insertedId;
        const paragraph = await SeedTestParagraph(
            TestConfigOptions.config.db.connection_uri,
            sentenceId
        );
        paragraphId = paragraph.insertedId;
        const speeche = await SeedTestSpeech(
            TestConfigOptions.config.db.connection_uri,
            paragraphId
        );
        speecheId = speeche.insertedId;
        const claimRevisionId = new ObjectId();
        const claim = await SeedTestClaim(
            TestConfigOptions.config.db.connection_uri,
            personalitiesId,
            claimRevisionId
        );
        claimId = claim.insertedId;

        await SeedTestClaimRevision(
            TestConfigOptions.config.db.connection_uri,
            claimRevisionId,
            personalitiesId,
            claimId,
            speecheId
        );

        await SeedTestClaimReview(
            TestConfigOptions.config.db.connection_uri,
            claimId,
            personalitiesId,
            reportId,
            userId
        );

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

    it("/api/review (GET) - ", () => {
        return request(app.getHttpServer())
            .get("/api/review")
            .query({
                page: 0,
                pageSize: 10,
                order: "asc",
                isHidden: false,
                latest: false,
                nameSpace: NameSpaceEnum.Main,
            })
            .expect(200)
            .expect(({ body }) => console.log(body, "TEST"));
    });

    afterAll(async () => {
        await db.stop();
        app.close();
    });
});
