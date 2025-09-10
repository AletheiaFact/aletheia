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
import { ValidationPipe } from "@nestjs/common";
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
    let claimId: string;
    let claimReviewDataHash: string;
    let claimReviewId: string;

    beforeAll(async () => {
        db = await MongoMemoryServer.create({ instance: { port: 35025 } });
        const user = await SeedTestUser(
            TestConfigOptions.config.db.connection_uri
        );
        userId = user.insertedId.toString();
        const { insertedIds } = await SeedTestPersonality(
            TestConfigOptions.config.db.connection_uri
        );
        personalitiesId = [insertedIds["0"].toString(), insertedIds["1"].toString()];

        const report = await SeedTestReport(
            TestConfigOptions.config.db.connection_uri,
            userId
        );
        reportId = report.insertedId.toString();
        const sentence = await SeedTestSentence(
            TestConfigOptions.config.db.connection_uri
        );
        sentenceId = sentence.insertedId.toString();
        const paragraph = await SeedTestParagraph(
            TestConfigOptions.config.db.connection_uri,
            sentenceId
        );
        paragraphId = paragraph.insertedId.toString();
        const speeche = await SeedTestSpeech(
            TestConfigOptions.config.db.connection_uri,
            paragraphId
        );
        speecheId = speeche.insertedId.toString();
        const claimRevisionId = new ObjectId();
        const claim = await SeedTestClaim(
            TestConfigOptions.config.db.connection_uri,
            personalitiesId,
            claimRevisionId
        );
        claimId = claim.insertedId.toString();

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
        app.useGlobalPipes(
            new ValidationPipe({
                transform: true,
                transformOptions: { enableImplicitConversion: true },
                whitelist: true,
                forbidNonWhitelisted: true,
            })
        );
    });

    it("/api/review (GET) - List Reviews", () => {
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
            .expect(({ body }) => {
                claimReviewDataHash = body.reviews[0].content.data_hash;
                expect(body.totalReviews).toEqual(1);
            });
    });

    it("api/review/:data_hash (GET) - Should get claimReview by dataHash", () => {
        return request(app.getHttpServer())
            .get(`/api/review/${claimReviewDataHash}`)
            .expect(200)
            .expect(({ body }) => {
                claimReviewId = body.review._id;
                expect(body.review.target).toEqual(claimId.toString());
                expect(body.review.personality).toEqual(
                    personalitiesId[0].toString()
                );
            });
    });

    it("api/review/:id (PUT) - Should hide claimReview", () => {
        return request(app.getHttpServer())
            .put(`/api/review/${claimReviewId}`)
            .send({
                isHidden: true,
                description: "Hidden claimReview description",
            })
            .expect(200);
    });

    it("api/review/:id (PUT) - Should unhide claimReview", () => {
        return request(app.getHttpServer())
            .put(`/api/review/${claimReviewId}`)
            .send({
                isHidden: false,
                description: "",
            })
            .expect(200);
    });

    it("api/review/:id (DELETE) - Should delete claimReview", () => {
        return request(app.getHttpServer())
            .delete(`/api/review/${claimReviewId}`)
            .expect(200);
    });

    it("api/review/:data_hash (GET) - Should not be able to get claimReview", () => {
        return request(app.getHttpServer())
            .get(`/api/review/${claimReviewDataHash}`)
            .expect(200)
            .expect(({ body }) => {
                expect(body.review).toEqual(null);
            });
    });

    afterAll(async () => {
        await db.stop();
        app.close();
    });
});
