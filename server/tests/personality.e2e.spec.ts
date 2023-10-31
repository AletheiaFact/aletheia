import { MongoMemoryServer } from "mongodb-memory-server";
import * as request from "supertest";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../app.module";
import { SessionGuard } from "../auth/session.guard";
import { SessionGuardMock } from "./mocks/SessionGuardMock";
import { TestConfigOptions } from "./utils/TestConfigOptions";
import { SeedTestUser } from "./utils/SeedTestUser";

jest.setTimeout(10000);

describe("PersonalityController (e2e)", () => {
    let app: any;
    let db: any;

    beforeAll(async () => {
        db = await MongoMemoryServer.create({ instance: { port: 35025 } });
        await SeedTestUser(TestConfigOptions.config.db.connection_uri);

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule.register(TestConfigOptions)],
        })
            .overrideProvider(SessionGuard)
            .useValue(SessionGuardMock)
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
            .expect((res) =>
                expect(res?.body?.personalities.length).toEqual(0)
            );
    });

    it("/api/personality (GET)", () => {
        return request(app.getHttpServer())
            .post("/api/personality")
            .send({
                name: "Barack Obama",
                description: "President of the United States from 2009 to 2017",
                wikidata: "Q76",
            })
            .expect(201)
            .expect((res) => expect(res?.body?.wikidata).toEqual("Q76"));
    });

    it("/api/personality (GET)", () => {
        return request(app.getHttpServer())
            .get("/api/personality")
            .query({
                page: 0,
                pageSize: 10,
                order: "asc",
                language: "pt",
            })
            .expect(200)
            .expect((res) => expect(res?.body?.personalities.length).toEqual(1))
            .expect((res) =>
                expect(res?.body?.personalities[0]?.wikidata).toEqual("Q76")
            );
    });

    afterAll(async () => {
        await db.stop();
        app.close();
    });
});
