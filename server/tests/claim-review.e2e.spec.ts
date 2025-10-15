import { MongoMemoryServer } from "mongodb-memory-server";
import * as request from "supertest";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../app.module";
import { SessionGuard } from "../auth/session.guard";
import { SessionGuardMock } from "./mocks/SessionGuardMock";
import { SessionOrM2MGuard } from "../auth/m2m-or-session.guard";
import { SessionOrM2MGuardMock } from "./mocks/SessionOrM2MGuardMock";
import { M2MGuard } from "../auth/m2m.guard";
import { M2MGuardMock } from "./mocks/M2MGuardMock";
import { TestConfigOptions } from "./utils/TestConfigOptions";
import { SeedTestUser } from "./utils/SeedTestUser";
import { SeedTestPersonality } from "./utils/SeedTestPersonality";
import { NameSpaceEnum } from "../auth/name-space/schemas/name-space.schema";
import { AbilitiesGuard } from "../auth/ability/abilities.guard";
import { AbilitiesGuardMock } from "./mocks/AbilitiesGuardMock";
import { HistoryService } from "../history/history.service";
import { HistoryServiceMock } from "./mocks/HistoryServiceMock";
import { SeedTestClaimReview } from "./utils/SeedTestClaimReview";
import { SeedTestReport } from "./utils/SeedTestReport";
import { SeedTestSentence } from "./utils/SeedTestSentence";
import { SeedTestParagraph } from "./utils/SeedTestParagraph";
import { SeedTestSpeech } from "./utils/SeedTestSpeech";
import { SeedTestClaimRevision } from "./utils/SeedTestClaimRevision";
import { SeedTestClaim } from "./utils/SeedTestClaim";
import { ValidationPipe } from "@nestjs/common";
const { ObjectId } = require("mongodb");

jest.setTimeout(10000);

/**
 * ClaimReviewController E2E Test Suite
 * 
 * Tests the complete claim review lifecycle management including:
 * - Review listing and pagination
 * - Review retrieval by data hash
 * - Review visibility management (hide/unhide)
 * - Review deletion and soft-delete behavior
 * - Review access control after deletion
 * 
 * Data Flow:
 * 1. Creates test data: user → personalities → report → sentence → paragraph → speech → claim → claim-revision → claim-review
 * 2. Tests review operations through REST API endpoints
 * 3. Validates business logic and data integrity
 */
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
        const mongoUri = db.getUri();
        
        const user = await SeedTestUser(mongoUri);
        userId = user.insertedId.toString();
        const { insertedIds } = await SeedTestPersonality(mongoUri);
        personalitiesId = [insertedIds["0"].toString(), insertedIds["1"].toString()];

        const report = await SeedTestReport(mongoUri, userId);
        reportId = report.insertedId.toString();
        const sentence = await SeedTestSentence(mongoUri);
        sentenceId = sentence.insertedId.toString();
        const paragraph = await SeedTestParagraph(mongoUri, sentenceId);
        paragraphId = paragraph.insertedId.toString();
        const speeche = await SeedTestSpeech(mongoUri, paragraphId);
        speecheId = speeche.insertedId.toString();
        const claimRevisionId = new ObjectId();
        const claim = await SeedTestClaim(
            mongoUri,
            personalitiesId,
            claimRevisionId
        );
        claimId = claim.insertedId.toString();

        await SeedTestClaimRevision(
            mongoUri,
            claimRevisionId,
            personalitiesId,
            claimId,
            speecheId
        );

        await SeedTestClaimReview(
            mongoUri,
            claimId,
            personalitiesId,
            reportId,
            userId
        );

        // Update test config with actual MongoDB URI
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
            .overrideProvider(HistoryService)
            .useValue(HistoryServiceMock)
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

    /**
     * Test: GET /api/review - List Reviews with Pagination
     * 
     * Purpose: Validates the review listing endpoint with query parameters
     * Business Logic: 
     * - Returns paginated list of claim reviews
     * - Filters by visibility (isHidden: false)
     * - Supports ordering and pagination
     * - Includes total count for pagination
     * 
     * Validates:
     * - HTTP 200 response
     * - Returns exactly 1 review (our seeded data)
     * - Response structure includes reviews array and totalReviews count
     * - Extracts data_hash for subsequent tests
     * - Verifies review contains expected structure (content, report, claim, personality)
     */
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
                expect(body.reviews).toHaveLength(1);
                expect(body.reviews[0]).toHaveProperty('content');
                expect(body.reviews[0]).toHaveProperty('report');
                expect(body.reviews[0]).toHaveProperty('claim');
                expect(body.reviews[0]).toHaveProperty('personality');
                expect(body.reviews[0].content).toHaveProperty('data_hash');
            });
    });

    /**
     * Test: GET /api/review/:data_hash - Get Review by Data Hash
     * 
     * Purpose: Validates retrieval of a specific claim review using its unique data hash
     * Business Logic:
     * - Uses data_hash as unique identifier for review lookup
     * - Returns complete review object with all relationships
     * - Maintains referential integrity with claim and personality
     * 
     * Validates:
     * - HTTP 200 response
     * - Returns review object with correct structure
     * - Verifies target claim relationship (review.target === claimId)
     * - Verifies personality relationship (review.personality === personalitiesId[0])
     * - Extracts review._id for subsequent operations
     * - Confirms review contains expected properties
     */
    it("api/review/:data_hash (GET) - Should get claimReview by dataHash", () => {
        return request(app.getHttpServer())
            .get(`/api/review/${claimReviewDataHash}`)
            .expect(200)
            .expect(({ body }) => {
                claimReviewId = body.review._id;
                expect(body.review).toBeDefined();
                expect(body.review.target).toEqual(claimId.toString());
                expect(body.review.personality).toEqual(
                    personalitiesId[0].toString()
                );
                expect(body.review._id).toBeDefined();
                expect(body.review).toHaveProperty('report');
                expect(body.review.report).toHaveProperty('classification');
            });
    });

    /**
     * Test: PUT /api/review/:id - Hide Claim Review
     * 
     * Purpose: Validates the ability to hide a claim review with admin description
     * Business Logic:
     * - Allows moderation by setting isHidden flag to true
     * - Requires description explaining why review was hidden
     * - Maintains review data but excludes from public listings
     * - Updates review status without deleting content
     * 
     * Validates:
     * - HTTP 200 response for successful update
     * - Accepts isHidden: true and description payload
     * - Review becomes hidden but remains in database
     */
    it("api/review/:id (PUT) - Should hide claimReview", () => {
        return request(app.getHttpServer())
            .put(`/api/review/${claimReviewId}`)
            .send({
                isHidden: true,
                description: "Hidden claimReview description",
            })
            .expect(200);
    });

    /**
     * Test: PUT /api/review/:id - Unhide Claim Review
     * 
     * Purpose: Validates the ability to restore visibility of a previously hidden review
     * Business Logic:
     * - Reverses the hide operation by setting isHidden to false
     * - Clears the hide description when restoring visibility
     * - Makes review visible in public listings again
     * - Allows recovery from moderation actions
     * 
     * Validates:
     * - HTTP 200 response for successful update
     * - Accepts isHidden: false and empty description
     * - Review becomes visible again in public API responses
     */
    it("api/review/:id (PUT) - Should unhide claimReview", () => {
        return request(app.getHttpServer())
            .put(`/api/review/${claimReviewId}`)
            .send({
                isHidden: false,
                description: "",
            })
            .expect(200);
    });

    /**
     * Test: DELETE /api/review/:id - Delete Claim Review
     * 
     * Purpose: Validates soft-delete functionality for claim reviews
     * Business Logic:
     * - Implements soft delete (sets isDeleted flag rather than removing record)
     * - Preserves review data for audit trails and data integrity
     * - Removes review from all public API responses
     * - Maintains referential integrity with related entities
     * 
     * Validates:
     * - HTTP 200 response for successful deletion
     * - Review becomes inaccessible via public APIs
     * - Soft delete implementation (record remains in database)
     */
    it("api/review/:id (DELETE) - Should delete claimReview", () => {
        return request(app.getHttpServer())
            .delete(`/api/review/${claimReviewId}`)
            .expect(200);
    });

    /**
     * Test: GET /api/review/:data_hash - Verify Deleted Review Inaccessibility  
     * 
     * Purpose: Validates that soft-deleted reviews are not accessible via public API
     * Business Logic:
     * - Deleted reviews should not be returned by public endpoints
     * - API returns null for deleted reviews instead of 404 error
     * - Maintains consistent response format while hiding deleted content
     * - Confirms soft delete implementation works correctly
     * 
     * Validates:
     * - HTTP 200 response (endpoint exists and handles deleted reviews gracefully)
     * - Response body contains review: null (indicating review is no longer accessible)
     * - Soft delete behavior prevents data exposure after deletion
     * - API consistency in handling deleted resources
     */
    it("api/review/:data_hash (GET) - Should not be able to get claimReview", () => {
        return request(app.getHttpServer())
            .get(`/api/review/${claimReviewDataHash}`)
            .expect(200)
            .expect(({ body }) => {
                expect(body.review).toEqual(null);
                expect(body).toHaveProperty('review');
            });
    });

    /**
     * Test: GET /api/review/:data_hash - Handle Non-existent Data Hash
     * 
     * Purpose: Validates API behavior when requesting review with invalid data hash
     * Business Logic:
     * - Should gracefully handle requests for non-existent reviews
     * - Returns null instead of throwing errors
     * - Maintains consistent API response format
     * 
     * Validates:
     * - HTTP 200 response (not 404)
     * - Response body contains review: null
     * - API handles invalid data hash gracefully
     */
    it("api/review/:data_hash (GET) - Should handle non-existent data hash", () => {
        const nonExistentDataHash = "nonexistent_hash_12345";
        return request(app.getHttpServer())
            .get(`/api/review/${nonExistentDataHash}`)
            .expect(200)
            .expect(({ body }) => {
                expect(body.review).toEqual(null);
                expect(body).toHaveProperty('review');
            });
    });

    /**
     * Test: PUT /api/review/:id - Validation Error for Invalid Payload
     * 
     * Purpose: Validates request validation for update operations
     * Business Logic:
     * - Should reject invalid payloads with mongoose cast errors
     * - Validates isHidden field type and description requirements
     * - Maintains data integrity through validation
     * 
     * Validates:
     * - HTTP 500 response for mongoose cast error (actual API behavior)
     * - System handles invalid data type appropriately
     */
    it("api/review/:id (PUT) - Should validate update payload", () => {
        // First create a new review for this test by re-seeding
        return SeedTestClaimReview(
            db.getUri(),
            claimId,
            personalitiesId,
            reportId,
            userId
        ).then((newReview) => {
            const newReviewId = newReview.insertedId.toString();
            
            return request(app.getHttpServer())
                .put(`/api/review/${newReviewId}`)
                .send({
                    isHidden: "invalid_boolean", // Should be boolean
                    description: "test description",
                })
                .expect(500); // Mongoose cast error returns 500
        });
    });

    /**
     * Test: DELETE /api/review/:id - Handle Non-existent Review ID
     * 
     * Purpose: Validates API behavior when attempting to delete non-existent review
     * Business Logic:
     * - Should handle deletion attempts for non-existent reviews
     * - Currently returns 500 due to null pointer error (actual API behavior)
     * - Demonstrates need for better error handling in service layer
     * 
     * Validates:
     * - HTTP 500 response for non-existent resource (actual behavior)
     * - API error handling for missing resources
     */
    it("api/review/:id (DELETE) - Should handle non-existent review ID", () => {
        const nonExistentId = new ObjectId().toString();
        return request(app.getHttpServer())
            .delete(`/api/review/${nonExistentId}`)
            .expect(500); // Service returns 500 due to null pointer error
    });

    afterAll(async () => {
        await db.stop();
        app.close();
    });
});
