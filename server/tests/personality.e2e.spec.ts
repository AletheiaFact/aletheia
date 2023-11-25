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

jest.setTimeout(10000);

describe("PersonalityController (e2e)", () => {
    let app: any;
    let db: any;
    let personalityId: string;

    beforeAll(async () => {
        db = await MongoMemoryServer.create({ instance: { port: 35025 } });
        await SeedTestUser(TestConfigOptions.config.db.connection_uri);

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule.register(TestConfigOptions)],
        })
            .overrideProvider(SessionGuard)
            .useValue(SessionGuardMock)
            .overrideGuard(AbilitiesGuard)
            .useValue(AbilitiesGuardMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it("/api/personality (GET) - personalities should be empty", () => {
        return request(app.getHttpServer())
            .get("/api/personality")
            .query({
                page: 0,
                pageSize: 10,
                order: "asc",
                language: "pt",
            })
            .expect(200)
            .expect(({ body }) =>
                expect(body?.personalities.length).toEqual(0)
            );
    });

    it("/api/personality (POST) - Create Personality", () => {
        return request(app.getHttpServer())
            .post("/api/personality")
            .send({
                name: "Barack Obama",
                description: "President of the United States from 2009 to 2017",
                wikidata: "Q76",
            })
            .expect(201)
            .expect(({ body }) => {
                personalityId = body?._id;
                expect(body?.wikidata).toEqual("Q76");
            });
    });

    it("/api/personality (GET) - List all", () => {
        return request(app.getHttpServer())
            .get("/api/personality")
            .query({
                page: 0,
                pageSize: 10,
                order: "asc",
                language: "pt",
            })
            .expect(200)
            .expect(({ body }) => {
                expect(body?.personalities.length).toEqual(1);
                expect(body?.personalities[0]?.wikidata).toEqual("Q76");
            });
    });

    it("/api/personality/:id (GET) - Get by id", () => {
        return request(app.getHttpServer())
            .get(`/api/personality/${personalityId}`)
            .query({ language: "pt" })
            .expect(200)
            .expect(({ body }) => {
                expect(body?._id).toEqual(personalityId);
                expect(body?.name).toEqual("Barack Obama");
            });
    });

    it("/api/personality/hidden/:id (PUT) - Hide Personality", () => {
        return request(app.getHttpServer())
            .put(`/api/personality/hidden/${personalityId}`)
            .send({
                isHidden: true,
                description: "Hidden personality description",
            })
            .expect(200);
    });

    it("/api/personality/hidden/:id (PUT) - Unhide Personality", () => {
        return request(app.getHttpServer())
            .put(`/api/personality/hidden/${personalityId}`)
            .send({
                isHidden: false,
                description: "",
            })
            .expect(200);
    });

    it("/api/personality/:id (DELETE) - Delete Personality", () => {
        return request(app.getHttpServer())
            .delete(`/api/personality/${personalityId}`)
            .expect(200);
    });

    it("/api/personality/:id (GET) - Get by id", () => {
        return request(app.getHttpServer())
            .get(`/api/personality/${personalityId}`)
            .query({ language: "pt" })
            .expect(200)
            .expect(({ body }) => expect(body).toMatchObject({}));
    });

    afterAll(async () => {
        await db.stop();
        app.close();
    });
});
