import { randomUUID } from "crypto";
import { Types } from "mongoose";
import type { IGroupService } from "../interfaces/group.service.interface";
import { MongoGroupService } from "./mongo/group.service";
import { PostgresGroupService } from "./postgres/group.service";
import {
    getTestGroupModel,
    getTestVerificationRequestModel,
    missingMongoId,
    resetTestGroups,
    resetTestVerificationRequests,
    stopTestMongo,
} from "../tests/mongo-contract-setup";
import { getTestDrizzle, resetTestDrizzle } from "../tests/postgres-setup";
import { verificationRequest } from "../verification-request/postgres/schema/verification-request.schema";

type Backend = "postgres" | "mongodb";

const idOf = (x: any): string => {
    const value = x?._id ?? x?.id;
    expect(value).toBeDefined();
    return String(value);
};

const backends: Array<{
    name: Backend;
    setup: () => Promise<IGroupService>;
    makeId: () => string;
    makeMissingId: () => string;
    insertVerificationRequest: (content: string) => Promise<string>;
}> = [
    {
        name: "postgres",
        setup: async () => {
            await resetTestDrizzle();
            return new PostgresGroupService(
                await getTestDrizzle()
            ) as unknown as IGroupService;
        },
        makeId: () => randomUUID(),
        makeMissingId: () => randomUUID(),
        insertVerificationRequest: async (content) => {
            const db = await getTestDrizzle();
            const [row] = await db
                .insert(verificationRequest)
                .values({
                    dataHash: randomUUID(),
                    content,
                    sourceChannel: "Web",
                    status: "Pre Triage",
                })
                .returning({ id: verificationRequest.id });
            return row.id;
        },
    },
    {
        name: "mongodb",
        setup: async () => {
            const model = await getTestGroupModel();
            await resetTestGroups();
            await resetTestVerificationRequests();
            return new MongoGroupService(
                model as any
            ) as unknown as IGroupService;
        },
        makeId: () => new Types.ObjectId().toString(),
        makeMissingId: missingMongoId,
        insertVerificationRequest: async (content) => {
            const model = await getTestVerificationRequestModel();
            const doc = await model.create({
                data_hash: new Types.ObjectId().toString(),
                content,
                sourceChannel: "Web",
                status: "Pre Triage",
            });
            return doc._id.toString();
        },
    },
];

afterAll(async () => {
    await stopTestMongo();
});

describe.each(backends)(
    "group contract: $name",
    ({ setup, makeId, makeMissingId, insertVerificationRequest }) => {
        let service: IGroupService;

        beforeEach(async () => {
            service = await setup();
        }, 60_000);

        describe("create", () => {
            it("inserts a group with the given content ids", async () => {
                const a = makeId();
                const b = makeId();
                const group = await service.create({ content: [a, b] });
                expect(idOf(group)).toBeTruthy();
                expect(group.content.map(String)).toEqual([a, b]);
            });

            it("updates the existing group that already holds any of the content ids", async () => {
                const a = makeId();
                const b = makeId();
                const first = await service.create({ content: [a] });
                const second = await service.create({ content: [b, a] });
                expect(idOf(second)).toBe(idOf(first));
                expect(second.content.map(String)).toEqual([b, a]);
                const found = await service.getById(idOf(first));
                expect(found.content.map(String)).toEqual([b, a]);
            });
        });

        describe("getById", () => {
            it("returns null for a missing id", async () => {
                expect(await service.getById(makeMissingId())).toBeNull();
            });
        });

        describe("getByContentId", () => {
            it("returns the group holding the content id with its verification requests populated", async () => {
                const vrA = await insertVerificationRequest("first");
                const vrB = await insertVerificationRequest("second");
                const group = await service.create({ content: [vrA, vrB] });
                const found = await service.getByContentId(vrB);
                expect(idOf(found)).toBe(idOf(group));
                expect(found.content.map((v: any) => idOf(v))).toEqual([
                    vrA,
                    vrB,
                ]);
                expect(found.content.map((v: any) => v.content)).toEqual([
                    "first",
                    "second",
                ]);
            });

            it("returns null when no group holds the id", async () => {
                expect(
                    await service.getByContentId(makeMissingId())
                ).toBeNull();
            });
        });

        describe("updateWithTargetId", () => {
            it("sets the target id and returns the updated group", async () => {
                const group = await service.create({ content: [makeId()] });
                const target = makeId();
                const updated = await service.updateWithTargetId(
                    idOf(group),
                    target
                );
                expect(String(updated.targetId)).toBe(target);
            });

            it("returns null for a missing group", async () => {
                expect(
                    await service.updateWithTargetId(makeMissingId(), makeId())
                ).toBeNull();
            });
        });

        describe("removeContent", () => {
            it("drops the content id and returns the updated group", async () => {
                const a = makeId();
                const b = makeId();
                const group = await service.create({ content: [a, b] });
                const updated: any = await service.removeContent(
                    idOf(group),
                    a
                );
                expect(updated.content.map(String)).toEqual([b]);
            });

            it("deletes the group when the last content id is removed", async () => {
                const a = makeId();
                const group = await service.create({ content: [a] });
                const result: any = await service.removeContent(idOf(group), a);
                expect(result.deletedCount).toBe(1);
                expect(await service.getById(idOf(group))).toBeNull();
            });

            it("returns undefined for a missing group", async () => {
                expect(
                    await service.removeContent(makeMissingId(), makeId())
                ).toBeUndefined();
            });
        });
    }
);
