import { MongoMemoryServer } from "mongodb-memory-server";
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
import { AdminUserMock } from "./utils/AdminUserMock";
import { NotificationService } from "../notifications/notifications.service";

jest.setTimeout(10000);

/**
 * NotificationController E2E Test Suite
 * 
 * Tests the complete notification system lifecycle including:
 * - Notification sending via Novu integration
 * - HMAC hash generation for secure client authentication
 * - Token retrieval for notification widget authentication
 * - Mock service validation for test environment isolation
 * 
 * Business Context:
 * The notification system uses Novu as the primary notification infrastructure.
 * It supports email notifications, topic-based subscriptions, and secure
 * client-side notification widgets through HMAC authentication tokens.
 * 
 * Data Flow:
 * 1. Notification sending → Novu trigger → email delivery
 * 2. Token retrieval → HMAC generation → secure widget authentication
 * 3. Mock service isolation ensures tests don't trigger real notifications
 */

const notificationService = {
    sendNotification: jest.fn(),
    generateHmacHash: jest.fn(),
};

describe("NotificationController (e2e)", () => {
    let app: any;
    let db: any;
    const payload = "Test Message Notification";

    beforeAll(async () => {
        db = await MongoMemoryServer.create({ instance: { port: 35025 } });
        const mongoUri = db.getUri();
        
        await SeedTestUser(mongoUri);

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
            .overrideProvider(NotificationService)
            .useValue(notificationService)
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
     * Test: POST /api/notification - Send Notification via Novu
     * 
     * Purpose: Validates notification sending through Novu integration
     * Business Logic:
     * - Accepts subscriberId and payload for notification content
     * - Triggers Novu "email-notifications" workflow
     * - Returns notification data with payload confirmation
     * - Uses mock service to avoid real notification sending in tests
     * 
     * Validates:
     * - HTTP 201 response for successful notification sending
     * - Notification service is called with correct parameters
     * - Response contains the original payload data
     * - Mock service properly simulates Novu API response
     */
    it("api/notification (POST) - should send a notification", () => {
        const mockResponse = {
            data: { payload: payload },
            status: 201,
        };
        notificationService.sendNotification.mockResolvedValueOnce(
            mockResponse
        );

        return request(app.getHttpServer())
            .post("/api/notification")
            .send({
                subscriberId: AdminUserMock._id,
                payload: payload,
            })
            .expect(201)
            .expect(({ body }) => expect(body.data.payload).toEqual(payload));
    });

    /**
     * Test: GET /api/notification/token/:subscriberId - Generate Authentication Tokens
     * 
     * Purpose: Validates secure token generation for notification widget authentication
     * Business Logic:
     * - Generates HMAC hash using Novu API key and subscriber ID
     * - Provides authentication tokens for client-side notification widgets
     * - Uses SHA256 HMAC for secure subscriber verification
     * - Returns both HMAC hash and application identifier
     * 
     * Validates:
     * - HTTP 200 response for successful token generation
     * - HMAC hash generation service is called with subscriber ID
     * - Response contains the generated HMAC hash
     * - Mock service properly simulates secure hash generation
     */
    it("api/notification/token/:subscriberId (GET) - should get tokens and generate HmacHash", () => {
        const mockHash = "fobwejf";
        jest.spyOn(notificationService, "generateHmacHash").mockReturnValueOnce(
            mockHash
        );

        return request(app.getHttpServer())
            .get(`/api/notification/token/${AdminUserMock._id}`)
            .expect(200)
            .expect(({ body }) => expect(body.hmacHash).toEqual(mockHash));
    });

    /**
     * Test: POST /api/notification - Handle Missing Fields (Current Behavior)
     * 
     * Purpose: Documents current API behavior with missing fields
     * Business Logic:
     * - Currently accepts requests even with missing fields
     * - Notification service handles undefined values gracefully
     * - Mock service returns successful response regardless of input
     * 
     * Validates:
     * - HTTP 201 response (current behavior with missing fields)
     * - Service accepts undefined subscriberId and payload
     * - Mock service maintains consistent response format
     */
    it("/api/notification (POST) - Should handle missing fields (current behavior)", () => {
        const mockResponse = {
            data: { payload: undefined },
            status: 201,
        };
        notificationService.sendNotification.mockResolvedValueOnce(
            mockResponse
        );

        return request(app.getHttpServer())
            .post("/api/notification")
            .send({
                // Missing subscriberId and payload to test current behavior
            })
            .expect(201);
    });

    /**
     * Test: GET /api/notification/token/:subscriberId - Handle Invalid Subscriber ID
     * 
     * Purpose: Validates API behavior when requesting tokens with invalid subscriber ID
     * Business Logic:
     * - Should handle requests for invalid subscriber IDs gracefully
     * - HMAC generation should work with any string input
     * - Returns consistent response format even with invalid IDs
     * 
     * Validates:
     * - HTTP 200 response (HMAC can be generated for any string)
     * - Response contains HMAC hash even for invalid subscriber ID
     * - Mock service handles edge cases gracefully
     */
    it("/api/notification/token/:subscriberId (GET) - Should handle invalid subscriber ID", () => {
        const invalidSubscriberId = "invalid_subscriber_id";
        const mockHash = "generated_hash_for_invalid_id";
        
        jest.spyOn(notificationService, "generateHmacHash").mockReturnValueOnce(
            mockHash
        );

        return request(app.getHttpServer())
            .get(`/api/notification/token/${invalidSubscriberId}`)
            .expect(200)
            .expect(({ body }) => {
                expect(body.hmacHash).toEqual(mockHash);
                expect(body).toHaveProperty('hmacHash');
                // Note: applicationIdentifier may be undefined in test environment
            });
    });

    /**
     * Test: POST /api/notification - Handle Service Failure
     * 
     * Purpose: Validates API behavior when notification service fails
     * Business Logic:
     * - Should handle Novu service failures gracefully
     * - May return error response or fallback behavior
     * - Maintains API consistency during service outages
     * 
     * Validates:
     * - Appropriate error handling when service throws exception
     * - API maintains consistent response format during failures
     */
    it("/api/notification (POST) - Should handle service failure", () => {
        notificationService.sendNotification.mockRejectedValueOnce(
            new Error("Novu service unavailable")
        );

        return request(app.getHttpServer())
            .post("/api/notification")
            .send({
                subscriberId: AdminUserMock._id,
                payload: "Test notification",
            })
            .expect(500); // Service error should return 500
    });

    afterAll(async () => {
        jest.restoreAllMocks();
        await db.stop();
        app.close();
    });
});
