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
import { AdminUserMock } from "./utils/AdminUserMock";
import { NotificationService } from "../notifications/notifications.service";

jest.setTimeout(10000);

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
        await SeedTestUser(TestConfigOptions.config.db.connection_uri);

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule.register(TestConfigOptions.config)],
        })
            .overrideProvider(SessionGuard)
            .useValue(SessionGuardMock)
            .overrideGuard(AbilitiesGuard)
            .useValue(AbilitiesGuardMock)
            .overrideProvider(NotificationService)
            .useValue(notificationService)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

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

    afterAll(async () => {
        jest.restoreAllMocks();
        await db.stop();
        app.close();
    });
});
