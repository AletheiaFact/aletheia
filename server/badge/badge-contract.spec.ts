import { randomUUID } from "crypto";
import { Types } from "mongoose";
import type { IBadgeService } from "../interfaces/badge.service.interface";
import { MongoBadgeService } from "./mongo/badge.service";
import { PostgresBadgeService } from "./postgres/badge.service";
import {
    getTestBadgeModel,
    missingMongoId,
    resetTestBadges,
    stopTestMongo,
} from "../tests/mongo-contract-setup";
import { getTestDrizzle, resetTestDrizzle } from "../tests/postgres-setup";

type Backend = "postgres" | "mongodb";

const idOf = (x: any): string => {
    const value = x?._id ?? x?.id;
    expect(value).toBeDefined();
    return String(value);
};

const backends: Array<{
    name: Backend;
    setup: () => Promise<IBadgeService>;
    makeImageId: () => string;
    makeMissingId: () => string;
}> = [
    {
        name: "postgres",
        setup: async () => {
            await resetTestDrizzle();
            const db = await getTestDrizzle();
            return new PostgresBadgeService(db) as unknown as IBadgeService;
        },
        makeImageId: () => randomUUID(),
        makeMissingId: () => randomUUID(),
    },
    {
        name: "mongodb",
        setup: async () => {
            const model = await getTestBadgeModel();
            await resetTestBadges();
            return new MongoBadgeService(
                model as any
            ) as unknown as IBadgeService;
        },
        makeImageId: () => new Types.ObjectId().toString(),
        makeMissingId: missingMongoId,
    },
];

afterAll(async () => {
    await stopTestMongo();
});

describe.each(backends)(
    "badge contract: $name",
    ({ setup, makeImageId, makeMissingId }) => {
        let service: IBadgeService;

        beforeEach(async () => {
            service = await setup();
        }, 60_000);

        const input = (overrides: Record<string, any> = {}) => ({
            name: "Fact-checker",
            description: "Verified 10 claims",
            image: { _id: makeImageId() },
            ...overrides,
        });

        describe("create", () => {
            it("stores name, description and the image id and exposes _id", async () => {
                const body = input();
                const created = await service.create(body);
                expect(idOf(created)).toBeTruthy();
                expect(created.name).toBe("Fact-checker");
                expect(created.description).toBe("Verified 10 claims");
                expect(String(created.image)).toBe(body.image._id);
                expect(created.createdAt).toBeInstanceOf(Date);
            });

            it("ignores created_at and users from the request body", async () => {
                const created: any = await service.create(
                    input({
                        created_at: "2020-01-01T00:00:00.000Z",
                        users: [{ _id: "u1" }],
                    })
                );
                expect(created.users).toBeUndefined();
                expect(created.created_at).toBeUndefined();
                expect(created.createdAt.getFullYear()).toBeGreaterThan(2020);
            });
        });

        describe("getById", () => {
            it("returns the badge for an existing id", async () => {
                const created = await service.create(input());
                const found = await service.getById(idOf(created));
                expect(idOf(found)).toBe(idOf(created));
                expect(found.name).toBe("Fact-checker");
            });

            it("returns null for a missing id", async () => {
                expect(await service.getById(makeMissingId())).toBeNull();
            });
        });

        describe("update", () => {
            it("replaces name, description and image and returns the updated badge", async () => {
                const created = await service.create(input());
                const newImageId = makeImageId();
                const updated = await service.update({
                    _id: idOf(created),
                    name: "Reviewer",
                    description: "Reviewed 5 claims",
                    image: { _id: newImageId },
                });
                expect(idOf(updated)).toBe(idOf(created));
                expect(updated.name).toBe("Reviewer");
                expect(updated.description).toBe("Reviewed 5 claims");
                expect(String(updated.image)).toBe(newImageId);

                const found = await service.getById(idOf(created));
                expect(found.name).toBe("Reviewer");
                expect(String(found.image)).toBe(newImageId);
            });

            it("drops unknown fields from the update", async () => {
                const created = await service.create(input());
                const updated: any = await service.update({
                    _id: idOf(created),
                    name: "Reviewer",
                    description: "Reviewed 5 claims",
                    image: { _id: makeImageId() },
                    users: [{ _id: "u1" }],
                });
                expect(updated.users).toBeUndefined();
            });

            it("returns null for a missing id", async () => {
                const result = await service.update({
                    _id: makeMissingId(),
                    name: "Reviewer",
                    description: "x",
                    image: { _id: makeImageId() },
                });
                expect(result).toBeNull();
            });
        });
    }
);
