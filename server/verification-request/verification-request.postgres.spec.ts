import { randomUUID } from "crypto";
import { PostgresVerificationRequestService } from "./postgres/verification-request.service";
import { PostgresGroupService } from "../group/postgres/group.service";
import { getTestDrizzle, resetTestDrizzle } from "../tests/postgres-setup";
import { NotImplementedError } from "../database/errors";
import { topic } from "../topic/postgres/schema/topic.schema";

describe.skipIf(process.env.DB_TYPE !== "postgres")(
    "verification-request postgres-only",
    () => {
        let service: PostgresVerificationRequestService;
        let db: Awaited<ReturnType<typeof getTestDrizzle>>;

        const topicService = {
            findByWikidataIds: vi.fn(async (ids: string[]) =>
                (await db.select().from(topic))
                    .filter((t) => t.wikidataId && ids.includes(t.wikidataId))
                    .map((t) => ({ ...t, _id: t.id }))
            ),
            findByNames: vi.fn(async () => []),
            findOrCreateTopic: vi.fn(),
        };

        const create = (overrides: Record<string, any> = {}) =>
            service.create({
                content: "c",
                sourceChannel: "Web",
                status: "Pre Triage",
                ...overrides,
            });

        beforeEach(async () => {
            await resetTestDrizzle();
            db = await getTestDrizzle();
            service = new PostgresVerificationRequestService(
                db,
                {} as any,
                {} as any,
                new PostgresGroupService(db),
                {} as any,
                topicService as any,
                {} as any,
                {} as any
            );
        });

        it("getByIdWithPopulatedFields rejects an unknown populate path with a 501", async () => {
            const vr = await create();
            await expect(
                service.getByIdWithPopulatedFields(vr._id, ["claims"])
            ).rejects.toBeInstanceOf(NotImplementedError);
        });

        it("update resolves an impact-area label through the closed list and 501s on an unknown one (Mongo stores the raw string)", async () => {
            topicService.findOrCreateTopic.mockImplementation(
                async (data: { name: string; wikidataId?: string }) => {
                    const [row] = await db
                        .insert(topic)
                        .values({
                            name: data.name,
                            slug: data.name.toLowerCase(),
                            wikidataId: data.wikidataId,
                            language: "pt",
                        })
                        .returning();
                    return { ...row, _id: row.id };
                }
            );
            const vr = await create();
            const updated = await service.update(vr._id, {
                impactArea: "Saúde",
            });
            expect(updated.impactArea.name).toBe("Saúde");
            await expect(
                service.update(vr._id, { impactArea: "not an area" })
            ).rejects.toBeInstanceOf(NotImplementedError);
        });

        it("update with a group array and postProcess=false is a 501 (Mongo would store raw ids)", async () => {
            const vr = await create();
            await expect(
                service.update(vr._id, { group: [randomUUID()] }, false)
            ).rejects.toBeInstanceOf(NotImplementedError);
        });

        it("cascadeUpdateDataHash with a session and manualOverrideField on an unmapped field are 501s", async () => {
            const vr = await create();
            await expect(
                service.cascadeUpdateDataHash("a", "b", {})
            ).rejects.toBeInstanceOf(NotImplementedError);
            await expect(
                service.manualOverrideField(vr._id, "nope", 1, "u")
            ).rejects.toBeInstanceOf(NotImplementedError);
        });

        it("updateVerificationRequestWithTopics returns the updated entity (documented divergence: Mongo returns the pre-update document)", async () => {
            const [q1] = await db
                .insert(topic)
                .values({
                    name: "Saúde",
                    slug: "saude",
                    language: "pt",
                    wikidataId: "Q1",
                })
                .returning();
            await create({ data_hash: "h" });
            const result = await service.updateVerificationRequestWithTopics(
                [{ value: "Q1" }],
                "h"
            );
            expect(result.topics).toEqual([q1.id]);
        });

        it("findSimilarRequests fails loud on an embedding dimension mismatch (Mongo's $zip silently truncates)", async () => {
            const vr = await create();
            await service.update(vr._id, { embedding: [1, 0, 0] }, false);
            await expect(
                service.findSimilarRequests([1, 0], [], 5)
            ).rejects.toThrow(/dimensions/);
        });

        it("getById with a non-uuid id raises the driver error (Mongo: CastError)", async () => {
            await expect(service.getById("not-a-uuid")).rejects.toThrow();
        });

        it("entity exposes _id, drops raw id columns and surfaces Maps as plain objects", async () => {
            const vr = await create();
            expect(vr._id).toBe(vr.id);
            expect(vr).not.toHaveProperty("dataHash");
            expect(vr).not.toHaveProperty("topicIds");
            expect(vr.pendingAiTasks).toEqual({});
            expect(vr.stateRetries).toEqual({});
            expect(vr.embedding).toBeNull();
        });
    }
);
