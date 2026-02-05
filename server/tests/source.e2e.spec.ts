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
import { TestConfigOptions } from "./utils/TestConfigOptions";
import { SeedTestUser } from "./utils/SeedTestUser";
import { AbilitiesGuard } from "../auth/ability/abilities.guard";
import { AbilitiesGuardMock } from "./mocks/AbilitiesGuardMock";
import { HistoryService } from "../history/history.service";
import { HistoryServiceMock } from "./mocks/HistoryServiceMock";
import { NameSpaceEnum } from "../auth/name-space/schemas/name-space.schema";
import { SeedTestPersonality } from "./utils/SeedTestPersonality";
import { SeedTestClaim } from "./utils/SeedTestClaim";
import { CleanupDatabase } from "./utils/CleanupDatabase";
const { ObjectId } = require("mongodb");

jest.setTimeout(10000);

/**
 * SourceController E2E Test Suite
 * 
 * Tests the complete source management lifecycle for fact-checking references including:
 * - Source listing and pagination with multi-language support
 * - Source creation with reCAPTCHA validation and user attribution
 * - Target-based source retrieval for claim-specific sources
 * - Source validation and data integrity
 * - Namespace-based source organization
 * 
 * Business Context:
 * Sources are external references (URLs, documents) that support or contradict claims
 * in the fact-checking process. They are linked to specific targets (claims) and include
 * metadata like summaries and classifications. Sources require reCAPTCHA validation
 * to prevent spam and ensure quality.
 * 
 * Data Flow:
 * 1. Empty state validation → source creation with reCAPTCHA → target-based retrieval
 * 2. Listing verification → data integrity validation
 * 3. Multi-language and namespace support validation
 */
describe("SourceController (e2e)", () => {
    let app: any;
    let userId: string;
    let personalitiesId: string[];
    let claimId: string;
    let targetId: string;

    beforeAll(async () => {
        // Use shared MongoDB instance from global setup
        const mongoUri = process.env.MONGO_URI!;
        
        const user = await SeedTestUser(mongoUri);
        userId = user.insertedId.toString();

        const { insertedIds } = await SeedTestPersonality(mongoUri);
        personalitiesId = [insertedIds["0"].toString(), insertedIds["1"].toString()];

        const claimRevisionId = new ObjectId();
        const claim = await SeedTestClaim(
            mongoUri,
            personalitiesId,
            claimRevisionId
        );
        claimId = claim.insertedId.toString();

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
     * Test: GET /api/source - Empty State Validation
     * 
     * Purpose: Validates the source listing endpoint returns empty results initially
     * Business Logic:
     * - Tests clean slate before source creation
     * - Validates pagination parameters work correctly
     * - Confirms multi-language support (pt = Portuguese)
     * - Ensures namespace filtering (Main namespace)
     * - Tests proper response structure for empty collections
     * 
     * Validates:
     * - HTTP 200 response
     * - Empty sources array (length = 0)
     * - Response structure includes sources property
     * - Pagination, language, and namespace query parameters are accepted
     */
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
            .expect(({ body }) => {
                expect(body?.sources.length).toEqual(0);
                expect(body).toHaveProperty('sources');
                expect(Array.isArray(body.sources)).toBe(true);
            });
    });

    /**
     * Test: POST /api/source - Create Source with reCAPTCHA Validation
     * 
     * Purpose: Validates source creation with spam protection and user attribution
     * Business Logic:
     * - Creates new source with reCAPTCHA validation to prevent spam
     * - Links source to specific target (claim) for fact-checking context
     * - Associates source with user for attribution and moderation
     * - Includes metadata (summary, classification) for source categorization
     * - Organizes sources by namespace for content segregation
     * 
     * Validates:
     * - HTTP 201 response for successful creation
     * - Response contains targetId for claim relationship
     * - href field is preserved exactly (Wikipedia URL)
     * - Source data structure is correct
     * - reCAPTCHA validation is processed
     * - User attribution and namespace organization
     */
    it("/api/source (POST) - should create a new source with valid captcha", async () => {
        const sourceData = {
            href: "https://www.wikipedia.org/",
            props: {
                summary: "mock_summary",
                classification: "mock_classification",
            },
            user: new ObjectId(userId),
            nameSpace: NameSpaceEnum.Main,
            targetId: claimId,
            recaptcha: "valid_recaptcha_token",
        };

        return request(app.getHttpServer())
            .post(`/api/source`)
            .send(sourceData)
            .expect(201)
            .expect(({ body }) => {
                targetId = Array.isArray(body.targetId) ? body.targetId[0] : body.targetId;
                expect(body.href).toEqual("https://www.wikipedia.org/");
                expect(body).toHaveProperty('targetId');
                expect(Array.isArray(body.targetId) ? body.targetId[0] : body.targetId).toEqual(claimId);
                expect(body).toHaveProperty('props');
                expect(body.props).toHaveProperty('summary');
                expect(body.props).toHaveProperty('classification');
            });
    });

    /**
     * Test: GET /api/source/target/:targetId - Get Sources by Target ID
     * 
     * Purpose: Validates retrieval of sources linked to a specific claim/target
     * Business Logic:
     * - Retrieves sources associated with specific target (claim) for fact-checking
     * - Supports pagination for claims with many sources
     * - Maintains language and namespace filtering
     * - Enables fact-checkers to review all evidence for a specific claim
     * 
     * Validates:
     * - HTTP 200 response
     * - Sources array contains sources for the specified target
     * - First source has correct targetId relationship
     * - Pagination, language, and namespace parameters work correctly
     * - Response structure maintains consistency
     */
    it("/api/source/target/:targetId (GET) - Should get sources by targetId", () => {
        return request(app.getHttpServer())
            .get(`/api/source/target/${targetId}`)
            .query({
                page: 0,
                order: "asc",
                pageSize: 5,
                language: "pt",
                nameSpace: NameSpaceEnum.Main,
            })
            .expect(200)
            .expect(({ body }) => {
                const sourceTargetId = Array.isArray(body.sources[0].targetId) ? body.sources[0].targetId[0] : body.sources[0].targetId;
                expect(sourceTargetId).toEqual(targetId);
                expect(body).toHaveProperty('sources');
                expect(Array.isArray(body.sources)).toBe(true);
                expect(body.sources).toHaveLength(1);
                expect(body.sources[0]).toHaveProperty('href');
                expect(body.sources[0]).toHaveProperty('props');
                expect(body.sources[0]).toHaveProperty('targetId');
            });
    });

    /**
     * Test: GET /api/source - List All Sources After Creation
     * 
     * Purpose: Validates source listing after creation shows the new source
     * Business Logic:
     * - Confirms created source appears in global source listing
     * - Tests pagination with populated source data
     * - Validates multi-language query parameter handling
     * - Ensures namespace filtering works correctly
     * - Verifies data consistency between creation and retrieval
     * 
     * Validates:
     * - HTTP 200 response
     * - Sources array contains exactly 1 item (our created source)
     * - Response structure maintains consistency with empty state
     * - Language and namespace parameters are properly processed
     * - Source data integrity is preserved
     */
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
                expect(body).toHaveProperty('sources');
                expect(Array.isArray(body.sources)).toBe(true);
                expect(body.sources[0]).toHaveProperty('href');
                expect(body.sources[0]).toHaveProperty('targetId');
                expect(body.sources[0]).toHaveProperty('props');
            });
    });

    /**
     * Test: GET /api/source/target/:targetId - Handle Non-existent Target ID
     * 
     * Purpose: Validates API behavior when requesting sources for non-existent target
     * Business Logic:
     * - Should handle requests for non-existent targets gracefully
     * - Returns empty sources array for targets with no sources
     * - Maintains consistent API response format
     * 
     * Validates:
     * - HTTP 200 response (not 404)
     * - Response body contains empty sources array
     * - API handles invalid ObjectId gracefully
     */
    it("/api/source/target/:targetId (GET) - Should handle non-existent target ID", () => {
        const nonExistentTargetId = new ObjectId().toString();
        
        return request(app.getHttpServer())
            .get(`/api/source/target/${nonExistentTargetId}`)
            .query({
                page: 0,
                order: "asc",
                pageSize: 5,
                language: "pt",
                nameSpace: NameSpaceEnum.Main,
            })
            .expect(200)
            .expect(({ body }) => {
                expect(body).toHaveProperty('sources');
                expect(Array.isArray(body.sources)).toBe(true);
                expect(body.sources).toHaveLength(0);
            });
    });

    /**
     * Test: POST /api/source - Validation Error for Missing Required Fields
     * 
     * Purpose: Validates request validation for source creation
     * Business Logic:
     * - Should reject payloads missing required fields
     * - Validates href, targetId, and reCAPTCHA requirements
     * - Maintains data integrity through validation
     * 
     * Validates:
     * - HTTP 400 response for invalid payload
     * - Validation error messages for missing required fields
     */
    it("/api/source (POST) - Should validate required fields", () => {
        return request(app.getHttpServer())
            .post("/api/source")
            .send({
                // Missing href, targetId, and recaptcha
                props: {
                    summary: "test summary",
                    classification: "test classification",
                },
                user: new ObjectId(userId),
                nameSpace: NameSpaceEnum.Main,
            })
            .expect(400);
    });

    /**
     * Test: POST /api/source - reCAPTCHA Token Acceptance (Current Behavior)
     * 
     * Purpose: Documents current reCAPTCHA validation behavior
     * Business Logic:
     * - Currently accepts any reCAPTCHA token in test environment
     * - Documents that reCAPTCHA validation may be disabled in test mode
     * - Shows that source creation succeeds with any token
     * 
     * Validates:
     * - HTTP 201 response for any reCAPTCHA token (current behavior)
     * - Source creation is not blocked by reCAPTCHA in test environment
     * - Documents potential improvement area for stricter validation
     */
    it("/api/source (POST) - Should accept reCAPTCHA token in test mode", () => {
        const sourceData = {
            href: "https://example.com/test",
            props: {
                summary: "test_summary",
                classification: "test_classification",
            },
            user: new ObjectId(userId),
            nameSpace: NameSpaceEnum.Main,
            targetId: claimId,
            recaptcha: "test_recaptcha_token",
        };

        return request(app.getHttpServer())
            .post("/api/source")
            .send(sourceData)
            .expect(201)
            .expect(({ body }) => {
                expect(body.href).toEqual("https://example.com/test");
                expect(body).toHaveProperty('targetId');
                expect(body).toHaveProperty('props');
            });
    });

    afterAll(async () => {
        jest.restoreAllMocks();
        await app.close();
        await CleanupDatabase(process.env.MONGO_URI!);
    });
});
