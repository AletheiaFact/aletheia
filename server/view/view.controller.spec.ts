import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import request from "supertest";
import { ViewController } from "./view.controller";
import { ViewService } from "./view.service";
import { CaptchaService } from "../captcha/captcha.service";

describe("ViewController cache headers (Unit)", () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            controllers: [ViewController],
            providers: [
                {
                    provide: ViewService,
                    useValue: {
                        render: vi.fn((_req, res) => {
                            res.end("ok");
                            return Promise.resolve();
                        }),
                    },
                },
                { provide: ConfigService, useValue: { get: () => undefined } },
                {
                    provide: CaptchaService,
                    useValue: { getClientConfig: () => ({}) },
                },
            ],
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app?.close();
    });

    it("serves hashed /_next/static assets as immutable for a year", async () => {
        const response = await request(app.getHttpServer()).get(
            "/_next/static/chunks/framework-c17f08e07d1abc.js"
        );

        expect(response.status).toBe(200);
        expect(response.headers["cache-control"]).toBe(
            "public, max-age=31536000, immutable"
        );
    });

    it("keeps a short TTL for other /_next paths", async () => {
        const response = await request(app.getHttpServer()).get(
            "/_next/image?url=%2Flogo.png&w=64&q=75"
        );

        expect(response.status).toBe(200);
        expect(response.headers["cache-control"]).toBe("public, max-age=60");
    });
});
