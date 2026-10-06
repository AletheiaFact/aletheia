import { randomUUID } from "crypto";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { Types } from "mongoose";
import type { IVerificationRequestService } from "../interfaces/verification-request.service.interface";
import { MongoVerificationRequestService } from "./mongo/verification-request.service";
import { PostgresVerificationRequestService } from "./postgres/verification-request.service";
import { MongoGroupService } from "../group/mongo/group.service";
import { PostgresGroupService } from "../group/postgres/group.service";
import {
    getTestGroupModel,
    getTestPersonalityModel,
    getTestSourceModel,
    getTestTopicModel,
    getTestVerificationRequestModel,
    missingMongoId,
    resetTestGroups,
    resetTestPersonalities,
    resetTestSources,
    resetTestTopics,
    resetTestVerificationRequests,
    stopTestMongo,
} from "../tests/mongo-contract-setup";
import { getTestDrizzle, resetTestDrizzle } from "../tests/postgres-setup";
import { ParityRecorder } from "../tests/parity";
import { topic } from "../topic/postgres/schema/topic.schema";
import { personality } from "../personality/postgres/schema/personality.schema";
import { source } from "../source/postgres/schema/source.schema";
import { VerificationRequestStatus } from "./dto/types";

type Backend = "postgres" | "mongodb";

const idOf = (x: any): string => {
    const value = x?._id ?? x?.id;
    expect(value).toBeDefined();
    return String(value);
};

const slugify = (name: string) =>
    name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9]+/g, "-");

type Seed = {
    topic: (name: string, wikidataId?: string) => Promise<any>;
    personality: (name: string) => Promise<any>;
    source: (href: string) => Promise<any>;
    findTopicsByNames: (names: string[]) => Promise<any[]>;
    findTopicsByWikidataIds: (ids: string[]) => Promise<any[]>;
    findSourceByHref: (href: string) => Promise<any>;
};

const stateMachineStub = {
    embed: vi.fn(async () => undefined),
    identifyData: vi.fn(async () => undefined),
    defineTopics: vi.fn(async () => undefined),
    defineImpactArea: vi.fn(async () => undefined),
    defineSeverity: vi.fn(async () => undefined),
};

const embeddingsStub = {
    getEmbeddings: () => ({ embedQuery: async () => [0.1, 0.2, 0.3] }),
};

function buildStubs(seed: Seed, makeId: () => string) {
    const sourceService = {
        create: vi.fn(
            async (data: { href: string }) =>
                (await seed.findSourceByHref(data.href)) ??
                seed.source(data.href)
        ),
        getSourceByHref: vi.fn((href: string) => seed.findSourceByHref(href)),
    };
    const topicService = {
        findOrCreateTopic: vi.fn(async (data: any) => {
            const [existing] = await seed.findTopicsByNames([data.name]);
            return existing ?? seed.topic(data.name, data.wikidataId);
        }),
        findByNames: vi.fn((names: string[]) => seed.findTopicsByNames(names)),
        findByWikidataIds: vi.fn((ids: string[]) =>
            seed.findTopicsByWikidataIds(ids)
        ),
    };
    const personalityService = {
        findOrCreatePersonality: vi.fn(async (data: { name: string }) =>
            seed.personality(data.name)
        ),
    };
    const aiTaskService = {
        create: vi.fn(async () => ({ _id: makeId() })),
    };
    const historyService = {
        getHistoryParams: vi.fn(() => ({})),
        createHistory: vi.fn(async () => undefined),
    };
    return {
        sourceService,
        topicService,
        personalityService,
        aiTaskService,
        historyService,
    };
}

const backends: Array<{
    name: Backend;
    setup: () => Promise<{
        service: IVerificationRequestService;
        seed: Seed;
        stubs: ReturnType<typeof buildStubs>;
    }>;
    makeId: () => string;
    makeMissingId: () => string;
}> = [
    {
        name: "postgres",
        makeId: () => randomUUID(),
        makeMissingId: () => randomUUID(),
        setup: async () => {
            await resetTestDrizzle();
            const db = await getTestDrizzle();
            const seed: Seed = {
                topic: async (name, wikidataId) => {
                    const [row] = await db
                        .insert(topic)
                        .values({
                            name,
                            slug: slugify(name),
                            language: "pt",
                            wikidataId: wikidataId ?? null,
                        })
                        .returning();
                    return { ...row, _id: row.id };
                },
                personality: async (name) => {
                    const [row] = await db
                        .insert(personality)
                        .values({
                            name,
                            slug: slugify(name),
                            description: `Personality: ${name}`,
                        })
                        .returning();
                    return { ...row, _id: row.id };
                },
                source: async (href) => {
                    const [row] = await db
                        .insert(source)
                        .values({
                            href,
                            props: {},
                            targetIds: [],
                            dataHash: randomUUID(),
                            nameSpace: "main",
                            userId: randomUUID(),
                        })
                        .returning();
                    return { ...row, _id: row.id };
                },
                findTopicsByNames: async (names) =>
                    (await db.select().from(topic))
                        .filter((t) => names.includes(t.name))
                        .map((t) => ({ ...t, _id: t.id })),
                findTopicsByWikidataIds: async (ids) =>
                    (await db.select().from(topic))
                        .filter(
                            (t) => t.wikidataId && ids.includes(t.wikidataId)
                        )
                        .map((t) => ({ ...t, _id: t.id })),
                findSourceByHref: async (href) => {
                    const row = (await db.select().from(source)).find(
                        (s) => s.href === href
                    );
                    return row ? { ...row, _id: row.id } : null;
                },
            };
            const stubs = buildStubs(seed, randomUUID);
            const service = new PostgresVerificationRequestService(
                db,
                stateMachineStub as any,
                stubs.sourceService as any,
                new PostgresGroupService(db),
                stubs.aiTaskService as any,
                stubs.topicService as any,
                stubs.personalityService as any,
                embeddingsStub as any
            ) as unknown as IVerificationRequestService;
            return { service, seed, stubs };
        },
    },
    {
        name: "mongodb",
        makeId: () => new Types.ObjectId().toString(),
        makeMissingId: missingMongoId,
        setup: async () => {
            const model = await getTestVerificationRequestModel();
            const groupModel = await getTestGroupModel();
            const topicModel = await getTestTopicModel();
            const personalityModel = await getTestPersonalityModel();
            const sourceModel = await getTestSourceModel();
            await resetTestVerificationRequests();
            await resetTestGroups();
            await resetTestTopics();
            await resetTestPersonalities();
            await resetTestSources();
            const seed: Seed = {
                topic: async (name, wikidataId) =>
                    topicModel.create({
                        name,
                        slug: slugify(name),
                        language: "pt",
                        ...(wikidataId ? { wikidataId } : {}),
                    }),
                personality: async (name) =>
                    personalityModel.create({
                        name,
                        slug: slugify(name),
                        description: `Personality: ${name}`,
                    }),
                source: async (href) =>
                    sourceModel.create({
                        href,
                        props: {},
                        targetId: [],
                        user: new Types.ObjectId(),
                        nameSpace: "main",
                        data_hash: new Types.ObjectId().toString(),
                    }),
                findTopicsByNames: (names) =>
                    topicModel.find({ name: { $in: names } }).exec(),
                findTopicsByWikidataIds: (ids) =>
                    topicModel.find({ wikidataId: { $in: ids } }).exec(),
                findSourceByHref: (href) =>
                    sourceModel.findOne({ href }).exec(),
            };
            const stubs = buildStubs(seed, () =>
                new Types.ObjectId().toString()
            );
            const service = new MongoVerificationRequestService(
                { user: { _id: new Types.ObjectId() } } as any,
                model as any,
                stateMachineStub as any,
                stubs.sourceService as any,
                new MongoGroupService(groupModel as any),
                stubs.historyService as any,
                stubs.aiTaskService as any,
                stubs.topicService as any,
                stubs.personalityService as any,
                embeddingsStub as any
            ) as unknown as IVerificationRequestService;
            return { service, seed, stubs };
        },
    },
];

const parity = new ParityRecorder({
    dropKeys: [
        "id",
        "similarity",
        "dataHash",
        "targetIds",
        "userId",
        "contentIds",
        "targetId",
        "duration",
        "estimatedCompletion",
    ],
});

// Mongo orders by ObjectId (monotonic); Postgres by created_at, whose
// resolution can tie inside one millisecond. Space out ordering-sensitive seeds.
const tick = () => new Promise((resolve) => setTimeout(resolve, 2));

afterAll(async () => {
    parity.assertAll();
    expect(parity.incomplete()).toEqual([]);
    await stopTestMongo();
});

describe.each(backends)(
    "verification-request contract: $name",
    ({ name: backend, setup, makeId, makeMissingId }) => {
        let service: IVerificationRequestService;
        let seed: Seed;
        let stubs: ReturnType<typeof buildStubs>;

        beforeEach(async () => {
            vi.clearAllMocks();
            ({ service, seed, stubs } = await setup());
        }, 60_000);

        const base = (overrides: Record<string, any> = {}) => ({
            content: "Claim to verify",
            sourceChannel: "Web",
            status: VerificationRequestStatus.PRE_TRIAGE,
            ...overrides,
        });

        describe("create", () => {
            it("stores the request, derives data_hash from the content and exposes _id", async () => {
                const created = await service.create(base());
                expect(idOf(created)).toBeTruthy();
                expect(created.content).toBe("Claim to verify");
                expect(created.data_hash).toMatch(/^[0-9a-f]{32}$/);
                expect(created.status).toBe(
                    VerificationRequestStatus.PRE_TRIAGE
                );
                expect(created.date).toBeInstanceOf(Date);
                parity.record("create:shape", backend, created);
            });

            it("keeps a caller-supplied data_hash", async () => {
                const created = await service.create(
                    base({ data_hash: "abc123" })
                );
                expect(created.data_hash).toBe("abc123");
            });

            it("creates one source per non-blank href and links them", async () => {
                const created = await service.create(
                    base({
                        source: [
                            { href: "https://a.test" },
                            { href: " " },
                            { href: "https://b.test" },
                        ],
                    })
                );
                expect(stubs.sourceService.create).toHaveBeenCalledTimes(2);
                expect(stubs.sourceService.create).toHaveBeenCalledWith({
                    href: "https://a.test",
                    targetId: idOf(created),
                });
                const a = await seed.findSourceByHref("https://a.test");
                const b = await seed.findSourceByHref("https://b.test");
                expect(created.source.map(String)).toEqual([idOf(a), idOf(b)]);
            });

            it("links an impact area from the closed list and ignores unknown ones", async () => {
                const created = await service.create(
                    base({ impactArea: { label: "Saúde", value: "health" } })
                );
                const [health] = await seed.findTopicsByNames(["Saúde"]);
                expect(String(created.impactArea)).toBe(idOf(health));

                const ignored = await service.create(
                    base({ content: "other", impactArea: "not-an-area" })
                );
                expect(ignored.impactArea).toBeFalsy();
            });

            it("rejects a missing required field with a 400 naming it", async () => {
                await expect(
                    service.create({
                        content: "x",
                        status: "Pre Triage",
                    } as any)
                ).rejects.toThrow(
                    new BadRequestException(
                        "Validation failed: sourceChannel are invalid or missing"
                    )
                );
            });

            it("rejects a duplicate data_hash with a 400", async () => {
                await service.create(base({ data_hash: "dup" }));
                await expect(
                    service.create(base({ content: "other", data_hash: "dup" }))
                ).rejects.toThrow(
                    new BadRequestException(
                        "Duplicate value for field: data_hash"
                    )
                );
            });
        });

        describe("getById", () => {
            it("returns the request without its embedding and with group unset", async () => {
                const created = await service.create(base());
                const found = await service.getById(idOf(created));
                expect(idOf(found)).toBe(idOf(created));
                expect(found.embedding).toBeUndefined();
                expect(found.group).toBeFalsy();
                parity.record("getById:shape", backend, found);
            });

            it("returns null for a missing id", async () => {
                expect(await service.getById(makeMissingId())).toBeNull();
            });
        });

        describe("findByDataHash", () => {
            it("populates sources, topics, impact area and identified personalities and keeps the embedding", async () => {
                const t1 = await seed.topic("Economia");
                const p1 = await seed.personality("Ana");
                const created = await service.create(
                    base({
                        data_hash: "populated",
                        source: [{ href: "https://s.test" }],
                        impactArea: { label: "Saúde", value: "health" },
                    })
                );
                await service.update(
                    idOf(created),
                    {
                        topics: [idOf(t1)],
                        identifiedData: [idOf(p1)],
                        embedding: [0.1, 0.2, 0.3],
                    },
                    false
                );
                const found = await service.findByDataHash("populated");
                expect(found.source.map((s: any) => s.href)).toEqual([
                    "https://s.test",
                ]);
                expect(found.topics.map((t: any) => t.name)).toEqual([
                    "Economia",
                ]);
                expect(found.identifiedData.map((p: any) => p.name)).toEqual([
                    "Ana",
                ]);
                expect(found.impactArea.name).toBe("Saúde");
                expect(found.embedding).toEqual([0.1, 0.2, 0.3]);
                parity.record("findByDataHash:populated", backend, found);

                const raw = await service.findByDataHash("populated", false);
                expect(raw.topics.map(String)).toEqual([idOf(t1)]);
                expect(String(raw.impactArea)).toBe(idOf(found.impactArea));
            });

            it("returns null for an unknown hash", async () => {
                expect(await service.findByDataHash("nope")).toBeNull();
            });
        });

        describe("listAll / count", () => {
            const seedList = async () => {
                const health = await seed.topic("Saúde");
                const econ = await seed.topic("Economia");
                const ana = await seed.personality("Ana");
                const a = await service.create(
                    base({
                        content: "Vacina causa autismo",
                        data_hash: "a",
                        sourceChannel: "whatsapp",
                    })
                );
                await tick();
                const b = await service.create(
                    base({
                        content: "Inflação subiu 10%",
                        data_hash: "b",
                        status: VerificationRequestStatus.IN_TRIAGE,
                    })
                );
                await tick();
                const c = await service.create(
                    base({
                        content: "Terceira",
                        data_hash: "c",
                        sourceChannel: "instagram",
                    })
                );
                await service.updateFieldByAiTask(
                    { targetId: idOf(a), field: "impactArea" },
                    "Saúde"
                );
                await service.update(
                    idOf(a),
                    { severity: "high_2", identifiedData: [idOf(ana)] },
                    false
                );
                await service.update(
                    idOf(b),
                    { topics: [idOf(econ)], severity: "critical" },
                    false
                );
                await service.update(
                    idOf(c),
                    { date: new Date("2020-01-15T12:00:00Z") },
                    false
                );
                return { a, b, c };
            };

            it("pages in id order with populated references and no embedding", async () => {
                const { a, b, c } = await seedList();
                const desc = await service.listAll({
                    page: 0,
                    pageSize: "2",
                    order: "desc",
                });
                expect(desc.map(idOf)).toEqual([idOf(c), idOf(b)]);
                const asc = await service.listAll({
                    page: 1,
                    pageSize: "2",
                    order: "asc",
                });
                expect(asc.map(idOf)).toEqual([idOf(c)]);
                const [first] = await service.listAll({
                    page: 0,
                    pageSize: "10",
                    order: "asc",
                });
                expect(first.impactArea.name).toBe("Saúde");
                expect(first.identifiedData.map((p: any) => p.name)).toEqual([
                    "Ana",
                ]);
                expect(first.embedding).toBeUndefined();
                expect(await service.count({})).toBe(3);
                parity.record(
                    "listAll:asc",
                    backend,
                    await service.listAll({
                        page: 0,
                        pageSize: "10",
                        order: "asc",
                    })
                );
            });

            it("filters by status, source channel, severity prefix, content, topic and impact-area names and dates", async () => {
                const { a, b, c } = await seedList();
                const ids = (rows: any[]) => rows.map(idOf).sort();
                const list = (filters: any) =>
                    service.listAll({
                        page: 0,
                        pageSize: "10",
                        order: "asc",
                        ...filters,
                    });

                expect(
                    ids(
                        await list({
                            status: [VerificationRequestStatus.IN_TRIAGE],
                        })
                    )
                ).toEqual([idOf(b)]);
                expect(
                    ids(
                        await list({ sourceChannel: ["whatsapp", "instagram"] })
                    )
                ).toEqual(ids([a, c]));
                expect(ids(await list({ sourceChannel: "all" }))).toHaveLength(
                    3
                );
                expect(ids(await list({ severity: "high" }))).toEqual([
                    idOf(a),
                ]);
                expect(ids(await list({ severity: "critical" }))).toEqual([
                    idOf(b),
                ]);
                expect(
                    ids(await list({ contentFilters: ["vacina", "10%"] }))
                ).toEqual(ids([a, b]));
                expect(ids(await list({ topics: ["Economia"] }))).toEqual([
                    idOf(b),
                ]);
                expect(ids(await list({ impactArea: ["Saúde"] }))).toEqual([
                    idOf(a),
                ]);
                expect(
                    ids(
                        await list({
                            topics: ["Economia"],
                            impactArea: ["Saúde"],
                        })
                    )
                ).toEqual(ids([a, b]));
                expect(ids(await list({ endDate: "2020-12-31" }))).toEqual([
                    idOf(c),
                ]);
                expect(ids(await list({ startDate: "2021-01-01" }))).toEqual(
                    ids([a, b])
                );
                expect(
                    await service.count({
                        severity: "high",
                        status: [VerificationRequestStatus.PRE_TRIAGE],
                    })
                ).toBe(1);
            });
        });

        describe("findAll / findBySourceUrl", () => {
            it("findAll matches content case-insensitively with the source populated", async () => {
                await service.create(
                    base({
                        content: "Vacina X",
                        data_hash: "1",
                        source: [{ href: "https://v.test" }],
                    })
                );
                await service.create(
                    base({ content: "Outro", data_hash: "2" })
                );
                const found = await service.findAll({
                    searchContent: "vacina",
                });
                expect(found.map((v) => v.content)).toEqual(["Vacina X"]);
                expect(found[0].source.map((s: any) => s.href)).toEqual([
                    "https://v.test",
                ]);
                expect((await service.findAll({})).length).toBe(2);
            });

            it("findBySourceUrl returns the requests linked to the source, newest date first, and [] for an unknown url", async () => {
                const first = await service.create(
                    base({
                        data_hash: "1",
                        source: [{ href: "https://shared.test" }],
                    })
                );
                const second = await service.create(
                    base({
                        data_hash: "2",
                        content: "2",
                        source: [{ href: "https://shared.test" }],
                    })
                );
                await service.update(
                    idOf(first),
                    { date: new Date("2020-01-01T00:00:00Z") },
                    false
                );
                await service.update(
                    idOf(second),
                    { date: new Date("2021-01-01T00:00:00Z") },
                    false
                );
                expect(stubs.sourceService.create).toHaveBeenCalledTimes(2);
                const found = await service.findBySourceUrl(
                    "https://shared.test",
                    { pageSize: 1 }
                );
                expect(found.map(idOf)).toEqual([idOf(second)]);
                expect(
                    await service.findBySourceUrl("https://unknown.test")
                ).toEqual([]);
            });
        });

        describe("update", () => {
            it("applies scalar fields, keeps publicationDate when absent, replaces sources and populates source and impact area", async () => {
                const created = await service.create(
                    base({ publicationDate: "2024-01-01" })
                );
                const health = await seed.topic("Saúde");
                const updated = await service.update(idOf(created), {
                    status: VerificationRequestStatus.POSTED,
                    source: [{ href: "https://new.test" }],
                    impactArea: idOf(health),
                });
                expect(updated.status).toBe(VerificationRequestStatus.POSTED);
                expect(updated.publicationDate).toBe("2024-01-01");
                expect(updated.source.map((s: any) => s.href)).toEqual([
                    "https://new.test",
                ]);
                expect(updated.impactArea.name).toBe("Saúde");
                parity.record("update:shape", backend, updated);
            });

            it("throws 404 for a missing id", async () => {
                await expect(
                    service.update(makeMissingId(), { status: "Posted" })
                ).rejects.toBeInstanceOf(NotFoundException);
            });

            it("creates a group from a group array, links every member, and unlinks members dropped later", async () => {
                const a = await service.create(base({ data_hash: "a" }));
                const b = await service.create(
                    base({ data_hash: "b", content: "b" })
                );
                const c = await service.create(
                    base({ data_hash: "c", content: "c" })
                );

                const grouped = await service.update(idOf(a), {
                    group: [idOf(b), idOf(c)],
                });
                const groupId = String(grouped.group);
                expect(groupId).toBeTruthy();
                for (const member of [a, b, c]) {
                    expect(
                        String(
                            (await service.getById(idOf(member))).group?._id ??
                                (await service.getById(idOf(member))).group
                        )
                    ).toBe(groupId);
                }
                const withGroup = await service.getById(idOf(a));
                expect(
                    withGroup.group.content.map((v: any) => idOf(v)).sort()
                ).toEqual([idOf(a), idOf(b), idOf(c)].sort());

                const regrouped = await service.update(idOf(a), {
                    group: [{ _id: idOf(b) }],
                });
                expect(String(regrouped.group)).toBe(groupId);
                expect((await service.getById(idOf(c))).group).toBeFalsy();
                expect(String((await service.getById(idOf(b))).group._id)).toBe(
                    groupId
                );
            });

            it("clears the group with group: null", async () => {
                const a = await service.create(base({ data_hash: "a" }));
                const b = await service.create(
                    base({ data_hash: "b", content: "b" })
                );
                await service.update(idOf(a), { group: [idOf(b)] });
                const cleared = await service.update(idOf(a), { group: null });
                expect(cleared.group).toBeFalsy();
            });
        });

        describe("removeVerificationRequestFromGroup", () => {
            it("drops the request from the group and unsets its group", async () => {
                const a = await service.create(base({ data_hash: "a" }));
                const b = await service.create(
                    base({ data_hash: "b", content: "b" })
                );
                const grouped = await service.update(idOf(a), {
                    group: [idOf(b)],
                });
                const groupId = String(grouped.group);
                const result = await service.removeVerificationRequestFromGroup(
                    idOf(b),
                    groupId
                );
                expect(result.group).toBeFalsy();
                const remaining = await service.getById(idOf(a));
                expect(
                    remaining.group.content.map((v: any) => idOf(v))
                ).toEqual([idOf(a)]);
            });

            it("throws 400 for a missing request", async () => {
                await expect(
                    service.removeVerificationRequestFromGroup(
                        makeMissingId(),
                        makeId()
                    )
                ).rejects.toBeInstanceOf(BadRequestException);
            });
        });

        describe("findSimilarRequests", () => {
            it("ranks by dot product, applies the 0.8 threshold, excludes filtered ids and limits", async () => {
                const near = await service.create(
                    base({ data_hash: "near", content: "near" })
                );
                const nearer = await service.create(
                    base({ data_hash: "nearer", content: "nearer" })
                );
                const far = await service.create(
                    base({ data_hash: "far", content: "far" })
                );
                const none = await service.create(
                    base({ data_hash: "none", content: "none" })
                );
                await service.update(
                    idOf(near),
                    { embedding: [0.9, 0.1, 0] },
                    false
                );
                await service.update(
                    idOf(nearer),
                    { embedding: [1, 0, 0] },
                    false
                );
                await service.update(
                    idOf(far),
                    { embedding: [0, 1, 0] },
                    false
                );

                const found = await service.findSimilarRequests(
                    [1, 0, 0],
                    [],
                    10
                );
                expect(found.map(idOf)).toEqual([idOf(nearer), idOf(near)]);
                expect(found[0].similarity).toBeCloseTo(1, 5);
                expect(found[1].similarity).toBeCloseTo(0.9, 5);
                expect(found[0].embedding).toBeUndefined();
                expect(
                    await service.findSimilarRequests(
                        [1, 0, 0],
                        [idOf(nearer)],
                        10
                    )
                ).toHaveLength(1);
                expect(
                    await service.findSimilarRequests([1, 0, 0], [], "1")
                ).toHaveLength(1);
                expect(await service.findSimilarRequests([], [], 10)).toEqual(
                    []
                );
                expect(none).toBeTruthy();
            });
        });

        describe("updateVerificationRequestWithTopics", () => {
            it("sets the topics found by wikidata id and returns null for an unknown hash", async () => {
                const q1 = await seed.topic("Saúde", "Q1");
                await seed.topic("Outro", "Q2");
                await service.create(base({ data_hash: "h" }));
                const result =
                    await service.updateVerificationRequestWithTopics(
                        [{ value: "Q1" }, { wikidataId: "Q9" }],
                        "h"
                    );
                expect(result).not.toBeNull();
                const after = await service.findByDataHash("h", false);
                expect(after.topics.map(String)).toEqual([idOf(q1)]);
                expect(
                    await service.updateVerificationRequestWithTopics(
                        [{ value: "Q1" }],
                        "missing"
                    )
                ).toBeNull();
            });
        });

        describe("AI task pipeline", () => {
            it("createAiTask tracks the pending task per field and skips a duplicate", async () => {
                const vr = await service.create(base());
                const dto: any = {
                    type: "TEXT_EMBEDDING",
                    callbackParams: { targetId: idOf(vr), field: "embedding" },
                };
                const first = await service.createAiTask(dto);
                expect(first.success).toBe(true);
                expect(stubs.aiTaskService.create).toHaveBeenCalledTimes(1);
                const second = await service.createAiTask(dto);
                expect(second.skipped).toBe(true);
                expect(stubs.aiTaskService.create).toHaveBeenCalledTimes(1);
                const untracked = await service.createAiTask({
                    type: "X",
                } as any);
                expect(untracked).toEqual({ success: true });
                await expect(
                    service.createAiTask({
                        type: "X",
                        callbackParams: {
                            targetId: makeMissingId(),
                            field: "embedding",
                        },
                    } as any)
                ).rejects.toBeInstanceOf(BadRequestException);
            });

            it("updateFieldByAiTask stores the embedding, records the state, clears the pending task and triggers the next states", async () => {
                const vr = await service.create(base());
                await service.createAiTask({
                    type: "TEXT_EMBEDDING",
                    callbackParams: { targetId: idOf(vr), field: "embedding" },
                } as any);
                const updated = await service.updateFieldByAiTask(
                    { targetId: idOf(vr), field: "embedding" },
                    [0.1, 0.2]
                );
                expect(updated.embedding).toEqual([0.1, 0.2]);
                expect(updated.statesExecuted).toEqual(["embedding"]);
                const after = await service.findByDataHash(vr.data_hash, false);
                expect(after.stateTransitions).toHaveLength(1);
                expect(after.stateTransitions[0]).toMatchObject({
                    from: "initial",
                    to: "embedding",
                });
                expect(after.progress).toMatchObject({
                    current: "embedding",
                    completed: 1,
                    total: 5,
                    percentage: 20,
                });
                expect(
                    Object.keys(
                        Object.fromEntries(
                            after.pendingAiTasks instanceof Map
                                ? after.pendingAiTasks
                                : Object.entries(after.pendingAiTasks ?? {})
                        )
                    )
                ).toEqual([]);
                expect(stateMachineStub.identifyData).toHaveBeenCalledWith(
                    idOf(vr)
                );
                expect(stateMachineStub.defineTopics).not.toHaveBeenCalled();

                const again = await service.updateFieldByAiTask(
                    { targetId: idOf(vr), field: "embedding" },
                    [0.1, 0.2]
                );
                expect(again.statesExecuted).toEqual(["embedding"]);
                expect(
                    (await service.findByDataHash(vr.data_hash, false))
                        .stateTransitions
                ).toHaveLength(1);
            });

            it("updateFieldByAiTask resolves personalities, topics and impact area through the ported services", async () => {
                const vr = await service.create(base());
                await service.updateFieldByAiTask(
                    { targetId: idOf(vr), field: "identifiedData" },
                    { personalities: [{ name: "Ana" }] }
                );
                await service.updateFieldByAiTask(
                    { targetId: idOf(vr), field: "topics" },
                    [{ name: "Economia" }]
                );
                await service.updateFieldByAiTask(
                    { targetId: idOf(vr), field: "impactArea" },
                    "Saúde"
                );
                const after = await service.findByDataHash(vr.data_hash);
                expect(after.identifiedData.map((p: any) => p.name)).toEqual([
                    "Ana",
                ]);
                expect(after.topics.map((t: any) => t.name)).toEqual([
                    "Economia",
                ]);
                expect(after.impactArea.name).toBe("Saúde");
                expect(after.statesExecuted).toEqual([
                    "identifiedData",
                    "topics",
                    "impactArea",
                ]);
                const noPersonalities = await service.create(
                    base({ data_hash: "np" })
                );
                const emptied = await service.updateFieldByAiTask(
                    {
                        targetId: idOf(noPersonalities),
                        field: "identifiedData",
                    },
                    {}
                );
                expect(emptied.identifiedData).toEqual([]);
            });

            it("updateFieldByAiTask with severity moves the status to In Triage", async () => {
                const vr = await service.create(base());
                const updated = await service.updateFieldByAiTask(
                    { targetId: idOf(vr), field: "severity" },
                    { severity: "high_1" }
                );
                expect(updated.severity).toBe("high_1");
                expect(updated.status).toBe(
                    VerificationRequestStatus.IN_TRIAGE
                );
            });

            it("updateFieldByAiTask rejects an invalid result, counts the retry and logs the state error", async () => {
                const vr = await service.create(base());
                await expect(
                    service.updateFieldByAiTask(
                        { targetId: idOf(vr), field: "severity" },
                        "nope"
                    )
                ).rejects.toBeInstanceOf(BadRequestException);
                const after = await service.findByDataHash(vr.data_hash, false);
                const retries =
                    after.stateRetries instanceof Map
                        ? Object.fromEntries(after.stateRetries)
                        : after.stateRetries;
                expect(retries.severity).toBe(1);
                expect(after.stateErrors).toHaveLength(1);
                expect(after.stateErrors[0].state).toBe("severity");
                await expect(
                    service.updateFieldByAiTask(
                        { targetId: idOf(vr), field: "unknown" },
                        1
                    )
                ).rejects.toBeInstanceOf(BadRequestException);
                await expect(
                    service.updateFieldByAiTask(
                        { targetId: makeMissingId(), field: "severity" },
                        "high_1"
                    )
                ).rejects.toBeInstanceOf(BadRequestException);
            });

            it("revalidateAndRunMissingStates triggers the first missing non-pending state only", async () => {
                const vr = await service.create(base());
                await service.updateFieldByAiTask(
                    { targetId: idOf(vr), field: "embedding" },
                    [0.5]
                );
                vi.clearAllMocks();
                await service.createAiTask({
                    type: "X",
                    callbackParams: {
                        targetId: idOf(vr),
                        field: "identifiedData",
                    },
                } as any);
                const current = await service.findByDataHash(
                    vr.data_hash,
                    false
                );
                await service.revalidateAndRunMissingStates(current);
                expect(stateMachineStub.identifyData).not.toHaveBeenCalled();
                expect(stateMachineStub.defineTopics).toHaveBeenCalledWith(
                    idOf(vr)
                );
                expect(
                    stateMachineStub.defineImpactArea
                ).not.toHaveBeenCalled();
            });

            it("manualOverrideField sets the field, records the state and audit entry", async () => {
                const vr = await service.create(base());
                const updated = await service.manualOverrideField(
                    idOf(vr),
                    "severity",
                    "low_1",
                    "user-1"
                );
                expect(updated.severity).toBe("low_1");
                expect(updated.statesExecuted).toEqual(["severity"]);
                expect(updated.auditLog).toHaveLength(1);
                expect(updated.auditLog[0]).toMatchObject({
                    action: "manual_override",
                    field: "severity",
                    userId: "user-1",
                });
                await expect(
                    service.manualOverrideField(
                        makeMissingId(),
                        "severity",
                        "low_1",
                        "u"
                    )
                ).rejects.toBeInstanceOf(BadRequestException);
            });
        });

        describe("cascadeUpdateDataHash", () => {
            it("rewrites every matching hash and returns the count", async () => {
                await service.create(base({ data_hash: "old" }));
                expect(await service.cascadeUpdateDataHash("old", "new")).toBe(
                    1
                );
                expect(await service.cascadeUpdateDataHash("old", "new")).toBe(
                    0
                );
                expect(
                    await service.findByDataHash("new", false)
                ).not.toBeNull();
            });
        });

        it("findRemovedIds and createEmbedContent are plain pass-throughs", async () => {
            expect(
                service.findRemovedIds(
                    { content: ["a", "b"] },
                    { content: ["b"] }
                )
            ).toEqual(["a"]);
            expect(await service.createEmbedContent("x")).toEqual([
                0.1, 0.2, 0.3,
            ]);
        });
    }
);
