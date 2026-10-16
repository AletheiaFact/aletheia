import request from "supertest";
import {
    Controller,
    INestApplication,
    Post,
    ValidationPipe,
} from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { z } from "zod";
import {
    objectId,
    pageQuery,
    pageSizeQuery,
    queryArray,
} from "../../../lib/schemas";
import { ZodBody, ZodParam, ZodQuery } from "./zod.decorators";
import { ZodValidationPipe } from "./zod-validation.pipe";
import { ZodValidationException } from "./zod-validation.exception";

const CreateThingSchema = z.strictObject({
    name: z.string().trim().min(1),
    tags: z.array(z.string()).default([]),
});
type CreateThingDto = z.output<typeof CreateThingSchema>;

const ListThingsQuery = z.object({
    page: pageQuery.default(0),
    pageSize: pageSizeQuery(50).default(10),
    filter: queryArray(z.string()).optional(),
});
type ListThingsQueryDto = z.output<typeof ListThingsQuery>;

@Controller("things")
class ThingsController {
    @Post()
    create(@ZodBody(CreateThingSchema) body: CreateThingDto) {
        return body;
    }

    @Post("search")
    search(@ZodQuery(ListThingsQuery) query: ListThingsQueryDto) {
        return query;
    }

    @Post(":id")
    byId(@ZodParam("id", objectId) id: string) {
        return { id };
    }
}

describe("ZodValidationPipe", () => {
    it("returns the schema output (defaults and transforms applied)", async () => {
        const pipe = new ZodValidationPipe(CreateThingSchema);
        await expect(pipe.transform({ name: "  a  " })).resolves.toEqual({
            name: "a",
            tags: [],
        });
    });

    it("throws ZodValidationException carrying issues and target", async () => {
        const pipe = new ZodValidationPipe(CreateThingSchema);
        const error = await pipe
            .transform({ name: "" }, { type: "body" })
            .catch((e) => e);
        expect(error).toBeInstanceOf(ZodValidationException);
        expect(error.getResponse()).toMatchObject({
            statusCode: 400,
            message: "Validation failed",
            target: "body",
            issues: [expect.objectContaining({ path: "name" })],
        });
    });

    it("does not disguise non-Zod errors as 400s", async () => {
        const exploding = z.string().transform(() => {
            throw new Error("bug in transform");
        });
        const pipe = new ZodValidationPipe(exploding);
        await expect(pipe.transform("x")).rejects.toThrow("bug in transform");
        await expect(pipe.transform("x")).rejects.not.toBeInstanceOf(
            ZodValidationException
        );
    });
});

describe("Zod decorators (in-process Nest app, global ValidationPipe as in main.ts)", () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [ThingsController],
        }).compile();
        app = moduleRef.createNestApplication();
        // Mirror server/main.ts so we prove the two pipes coexist.
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

    afterAll(async () => {
        await app.close();
    });

    it("ZodBody validates and returns parsed output", async () => {
        const res = await request(app.getHttpServer())
            .post("/things")
            .send({ name: " x " })
            .expect(201);
        expect(res.body).toEqual({ name: "x", tags: [] });
    });

    it("ZodBody rejects unknown keys on strict schemas", async () => {
        const res = await request(app.getHttpServer())
            .post("/things")
            .send({ name: "x", isAdmin: true })
            .expect(400);
        expect(res.body.issues[0].code).toBe("unrecognized_keys");
    });

    it("ZodQuery coerces strings, applies defaults, normalizes arrays", async () => {
        const res = await request(app.getHttpServer())
            .post("/things/search?page=2&filter=a")
            .expect(201);
        expect(res.body).toEqual({ page: 2, pageSize: 10, filter: ["a"] });
    });

    it("ZodQuery rejects qs bracket objects (NoSQL operator injection)", async () => {
        await request(app.getHttpServer())
            .post("/things/search?filter[$ne]=a")
            .expect(400);
    });

    it("ZodQuery enforces bounds", async () => {
        await request(app.getHttpServer())
            .post("/things/search?pageSize=500")
            .expect(400);
    });

    it("ZodParam validates a single route param", async () => {
        await request(app.getHttpServer())
            .post("/things/not-an-id")
            .expect(400);
        await request(app.getHttpServer())
            .post("/things/507f1f77bcf86cd799439011")
            .expect(201);
    });

    it("publishes schemas to the Swagger document", () => {
        const document = SwaggerModule.createDocument(
            app,
            new DocumentBuilder().build()
        );
        const create = document.paths["/things"].post;
        expect(
            (create.requestBody as any).content["application/json"].schema
        ).toMatchObject({
            type: "object",
            required: ["name"],
            properties: { name: { type: "string" } },
        });

        const search = document.paths["/things/search"].post;
        const names = (search.parameters as any[]).map((p) => p.name);
        expect(names).toEqual(
            expect.arrayContaining(["page", "pageSize", "filter"])
        );

        const byId = document.paths["/things/{id}"].post;
        expect((byId.parameters as any[])[0]).toMatchObject({
            name: "id",
            in: "path",
            schema: { type: "string", pattern: expect.any(String) },
        });
    });
});
