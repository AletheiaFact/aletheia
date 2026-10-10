import { randomUUID } from "crypto";
import { ConflictException, NotFoundException } from "@nestjs/common";
import { Types } from "mongoose";
import type { IClaimService } from "../interfaces/claim.service.interface";
import type { IClaimRevisionService } from "../interfaces/claim-revision.service.interface";
import type { ISentenceService } from "../interfaces/sentence.service.interface";
import type { ISpeechService } from "../interfaces/speech.service.interface";
import type { IReportService } from "../interfaces/report.service.interface";
import type { ISourceService } from "../interfaces/source.service.interface";
import type { IGroupService } from "../interfaces/group.service.interface";
import { MongoClaimService } from "./mongo/claim.service";
import { MongoClaimRevisionService } from "./claim-revision/mongo/claim-revision.service";
import { MongoSentenceService } from "./types/sentence/mongo/sentence.service";
import { MongoParagraphService } from "./types/paragraph/mongo/paragraph.service";
import { MongoSpeechService } from "./types/speech/mongo/speech.service";
import { MongoUnattributedService } from "./types/unattributed/mongo/unattributed.service";
import { MongoReportService } from "../report/mongo/report.service";
import { MongoSourceService } from "../source/mongo/source.service";
import { MongoGroupService } from "../group/mongo/group.service";
import { ParserService } from "./parser/parser.service";
import { SentenceHashService } from "./admin-editor/sentence-hash.service";
import { UtilService } from "../util";
import { deriveSlug } from "../personality/shared/personality.rules";
import { HistoryServiceMock } from "../tests/mocks/HistoryServiceMock";
import {
    getTestClaimModels,
    getTestGroupModel,
    getTestPersonalityModel,
    getTestSourceModel,
    missingMongoId,
    resetTestClaims,
    resetTestGroups,
    resetTestPersonalities,
    resetTestSources,
    stopTestMongo,
} from "../tests/mongo-contract-setup";
import { getTestDrizzle, resetTestDrizzle } from "../tests/postgres-setup";
import {
    adminRequest,
    buildPostgresClaimStack,
    seedPostgresPersonality,
} from "../tests/postgres-claim-stack";
import { ParityRecorder } from "../tests/parity";

type Backend = "postgres" | "mongodb";

const idOf = (x: any): string => {
    const value = typeof x === "string" ? x : x?._id ?? x?.id;
    expect(value).toBeDefined();
    return String(value);
};

type Stack = {
    claimService: IClaimService;
    revisionService: IClaimRevisionService;
    sentenceService: ISentenceService;
    speechService: ISpeechService;
    reportService: IReportService;
    sourceService: ISourceService;
    groupService: IGroupService;
    seedPersonality: (name: string) => Promise<any>;
};

const reportSourceStub = {
    create: vi.fn(async () => ({})),
    update: vi.fn(async () => ({})),
} as any;

// Mongo-only collaborators the claim family never reaches on these paths
// (history and state-event are deferred to Phase 6, review data to Phase 3).
const mongoStubs = {
    imageService: {} as any,
    debateService: {} as any,
    claimReviewService: {
        getReviewClassificationCountsByClaimId: async () => [],
        getReviewStatsByClaimId: async () => ({}),
    } as any,
    stateEventService: {
        getStateEventParams: () => ({}),
        createStateEvent: async () => ({}),
    } as any,
    reviewTaskService: { getReviewTasksByClaimId: async () => [] } as any,
};

const backends: Array<{
    name: Backend;
    setup: () => Promise<Stack>;
    makeId: () => string;
    makeMissingId: () => string;
    makeTopicId: () => any;
}> = [
    {
        name: "postgres",
        makeId: () => randomUUID(),
        makeMissingId: () => randomUUID(),
        makeTopicId: () => randomUUID(),
        setup: async () => {
            await resetTestDrizzle();
            const db = await getTestDrizzle();
            return {
                ...buildPostgresClaimStack(db, reportSourceStub),
                seedPersonality: (name) => seedPostgresPersonality(db, name),
            };
        },
    },
    {
        name: "mongodb",
        makeId: () => new Types.ObjectId().toString(),
        makeMissingId: missingMongoId,
        makeTopicId: () => new Types.ObjectId(),
        setup: async () => {
            const models = await getTestClaimModels();
            const personalityModel = await getTestPersonalityModel();
            const sourceModel = await getTestSourceModel();
            const groupModel = await getTestGroupModel();
            await resetTestClaims();
            await resetTestPersonalities();
            await resetTestSources();
            await resetTestGroups();
            const sourceService = new MongoSourceService(sourceModel as any);
            const groupService = new MongoGroupService(groupModel as any);
            const reportService = new MongoReportService(
                models.report as any,
                reportSourceStub
            );
            const sentenceService = new MongoSentenceService(
                models.sentence as any,
                reportService,
                new UtilService()
            );
            const speechService = new MongoSpeechService(models.speech as any);
            const parser = new ParserService(
                speechService,
                new MongoParagraphService(models.paragraph as any),
                sentenceService,
                new MongoUnattributedService(models.unattributed as any),
                new SentenceHashService()
            );
            const revisionService = new MongoClaimRevisionService(
                models.claimRevision as any,
                sourceService,
                parser,
                mongoStubs.imageService,
                mongoStubs.debateService,
                new UtilService()
            );
            const claimService = new MongoClaimService(
                adminRequest(new Types.ObjectId().toString()),
                models.claim as any,
                mongoStubs.claimReviewService,
                HistoryServiceMock as any,
                mongoStubs.stateEventService,
                revisionService,
                mongoStubs.reviewTaskService,
                new UtilService(),
                groupService
            );
            return {
                claimService,
                revisionService,
                sentenceService,
                speechService,
                reportService,
                sourceService,
                groupService,
                seedPersonality: (name) =>
                    personalityModel.create({
                        name,
                        slug: deriveSlug(name),
                        description: `Personality: ${name}`,
                    }),
            };
        },
    },
];

// `id` is the Postgres column alias next to `_id`; Mongo documents have no such key.
const parity = new ParityRecorder({ dropKeys: ["id"] });

afterAll(async () => {
    parity.assertAll();
    expect(parity.incomplete()).toEqual([]);
    await stopTestMongo();
});

describe.each(backends)(
    "claim contract: $name",
    ({ name: backend, setup, makeId, makeMissingId, makeTopicId }) => {
        let stack: Stack;
        let personalityId: string;

        const speechBody = (overrides: Record<string, any> = {}) => ({
            title: "My claim",
            content:
                "First sentence here. Second sentence here.\n\nAnother paragraph.",
            date: "2024-01-01T00:00:00.000Z",
            contentModel: "Speech",
            sources: ["https://source.test/a"],
            recaptcha: "tok",
            nameSpace: "main",
            personalities: [personalityId],
            ...overrides,
        });

        beforeEach(async () => {
            vi.clearAllMocks();
            stack = await setup();
            personalityId = idOf(await stack.seedPersonality("Ada Lovelace"));
        }, 60_000);

        it("create parses a speech into paragraphs and sentences and links the sources", async () => {
            const created = await stack.claimService.create(speechBody());
            expect(created.slug).toBe("my-claim");
            expect(created.title).toBe("My claim");
            expect(created.contentModel).toBe("Speech");
            expect(idOf(created)).toBeTruthy();

            const revision = await stack.revisionService.getRevisionById(
                idOf(created.latestRevision)
            );
            expect(revision).not.toBeNull();
            expect(idOf(revision!.claimId)).toBe(idOf(created));
            expect(revision!.personalities.map(idOf)).toEqual([personalityId]);
            const speech = revision!.content[0];
            expect(speech.type).toBe("speech");
            expect(speech.content).toHaveLength(2);
            expect(speech.content[0].content).toHaveLength(2);
            expect(speech.content[1].content).toHaveLength(1);
            const first = speech.content[0].content[0];
            expect(first.content).toBe("First sentence here.");
            expect(first.data_hash).toMatch(/^[a-f0-9]{32}$/);
            expect(first.props).toEqual({ id: 1 });
            parity.record("revision:populated", backend, revision);

            const source = await stack.sourceService.getSourceByHref(
                "https://source.test/a"
            );
            expect(source).not.toBeNull();
            expect(source!.targetId!.map(String)).toContain(idOf(created));
        });

        it("create rejects a duplicate title in the same namespace with a 409", async () => {
            await stack.claimService.create(speechBody());
            await expect(
                stack.claimService.create(speechBody())
            ).rejects.toBeInstanceOf(ConflictException);
            await expect(
                stack.claimService.create(
                    speechBody({
                        nameSpace: "other",
                        sources: ["https://b.test"],
                    })
                )
            ).resolves.toMatchObject({ slug: "my-claim", nameSpace: "other" });
        });

        it("create points a verification-request group at the new claim", async () => {
            const group = await stack.groupService.create({
                content: [makeId()],
            });
            const created = await stack.claimService.create(
                speechBody({ group: idOf(group) })
            );
            await vi.waitFor(async () => {
                const updated = await stack.groupService.getById(idOf(group));
                expect(String(updated!.targetId)).toBe(idOf(created));
            });
        });

        it("create accepts an unattributed claim without personalities", async () => {
            const created = await stack.claimService.create(
                speechBody({
                    title: "Nobody said it",
                    contentModel: "Unattributed",
                    personalities: [],
                })
            );
            const revision = await stack.revisionService.getRevisionById(
                idOf(created.latestRevision)
            );
            expect(revision!.content[0].type).toBe("unattributed");
            expect(revision!.content[0].content[0].content[0].content).toBe(
                "First sentence here."
            );
            expect(revision!.personalities).toEqual([]);
        });

        it("getByClaimSlug without population flattens the latest revision and populates names and sources", async () => {
            const created = await stack.claimService.create(speechBody());
            const found = await stack.claimService.getByClaimSlug(
                "my-claim",
                undefined,
                false
            );
            expect(idOf(found)).toBe(idOf(created));
            expect(found.title).toBe("My claim");
            expect(found.contentModel).toBe("Speech");
            expect(found.slug).toBe("my-claim");
            expect(found.isHidden).toBe(false);
            expect(found.personalities).toHaveLength(1);
            expect(found.personalities[0].name).toBe("Ada Lovelace");
            expect(found.sources.map((s: any) => s.href)).toEqual([
                "https://source.test/a",
            ]);
            parity.record("get:population-false", backend, found);

            await expect(
                stack.claimService.getByClaimSlug("nope", undefined, false)
            ).rejects.toBeInstanceOf(NotFoundException);
        });

        it("getByPersonalityIdAndClaimSlug scopes the slug to the personality", async () => {
            const created = await stack.claimService.create(speechBody());
            const other = idOf(await stack.seedPersonality("Other Person"));
            const found =
                await stack.claimService.getByPersonalityIdAndClaimSlug(
                    personalityId,
                    "my-claim",
                    undefined,
                    false
                );
            expect(idOf(found)).toBe(idOf(created));
            await expect(
                stack.claimService.getByPersonalityIdAndClaimSlug(
                    other,
                    "my-claim",
                    undefined,
                    false
                )
            ).rejects.toBeInstanceOf(NotFoundException);
        });

        it("getByPersonalityId lists only that personality's claim ids", async () => {
            const created = await stack.claimService.create(speechBody());
            const other = idOf(await stack.seedPersonality("Other Person"));
            await stack.claimService.create(
                speechBody({
                    title: "Other claim",
                    personalities: [other],
                    sources: ["https://b.test"],
                })
            );
            const ids = await stack.claimService.getByPersonalityId(
                personalityId
            );
            expect(ids.map(idOf)).toEqual([idOf(created)]);
            expect(
                await stack.claimService.getByPersonalityId(makeMissingId())
            ).toEqual([]);
        });

        it("count honours the caller's filter and delete soft-deletes", async () => {
            const created = await stack.claimService.create(speechBody());
            const filter = {
                isHidden: false,
                isDeleted: false,
                nameSpace: "main",
            };
            expect(await stack.claimService.count(filter)).toBe(1);
            expect(
                await stack.claimService.count({ ...filter, nameSpace: "x" })
            ).toBe(0);

            await stack.claimService.delete(idOf(created));
            expect(await stack.claimService.count(filter)).toBe(0);
            await expect(
                stack.claimService.getByClaimSlug("my-claim", undefined, false)
            ).rejects.toBeInstanceOf(NotFoundException);
            await expect(
                stack.claimService.delete(makeMissingId())
            ).rejects.toBeInstanceOf(NotFoundException);
        });

        it("hideOrUnhideClaim toggles the flag and 404s on a missing claim", async () => {
            const created = await stack.claimService.create(speechBody());
            await stack.claimService.hideOrUnhideClaim(
                idOf(created),
                true,
                "why"
            );
            const hidden = await stack.claimService.getByClaimSlug(
                "my-claim",
                undefined,
                false
            );
            expect(hidden.isHidden).toBe(true);
            await stack.claimService.hideOrUnhideClaim(idOf(created), false);
            const shown = await stack.claimService.getByClaimSlug(
                "my-claim",
                undefined,
                false
            );
            expect(shown.isHidden).toBe(false);
            await expect(
                stack.claimService.hideOrUnhideClaim(makeMissingId(), true)
            ).rejects.toBeInstanceOf(NotFoundException);
        });

        it("a malformed claim or revision id is a 404, not a 500", async () => {
            await stack.claimService.create(speechBody());
            await expect(
                stack.claimService.hideOrUnhideClaim("not-an-id", true)
            ).rejects.toBeInstanceOf(NotFoundException);
            await expect(
                stack.claimService.getByClaimSlug(
                    "my-claim",
                    "not-an-id",
                    false
                )
            ).rejects.toBeInstanceOf(NotFoundException);
        });

        it("sentences are reachable by data_hash, carry topics and the report classification", async () => {
            const created = await stack.claimService.create(speechBody());
            const revision = await stack.revisionService.getRevisionById(
                idOf(created.latestRevision)
            );
            const hash = revision!.content[0].content[0].content[0].data_hash;

            const sentence = await stack.sentenceService.getByDataHash(hash);
            expect(sentence.content).toBe("First sentence here.");
            expect(sentence.props.classification).toBeUndefined();
            parity.record("sentence:getByDataHash", backend, sentence);

            const topicId = makeTopicId();
            await stack.sentenceService.updateSentenceWithTopics(
                [{ id: topicId, label: "Saúde", value: "Q1" }, "saude"],
                hash
            );
            const tagged = await stack.sentenceService.getByDataHash(hash);
            expect(tagged.topics).toHaveLength(2);
            expect(String(tagged.topics![0].id)).toBe(String(topicId));
            expect(
                await stack.sentenceService.getHashesByTopic(String(topicId))
            ).toEqual([hash]);
            expect(
                await stack.sentenceService.getHashesByTopic(makeMissingId())
            ).toEqual([]);

            await stack.reportService.create({
                data_hash: hash,
                reportModel: "Fact-checking",
                usersId: makeId(),
                summary: "Checked",
                sources: ["https://report.test"],
                classification: "false",
            });
            await vi.waitFor(async () => {
                const report = await stack.reportService.findByDataHash(hash);
                expect(report!.classification).toBe("false");
            });
            const classified = await stack.sentenceService.getByDataHash(hash);
            expect(classified.props.classification).toBe("false");

            await expect(
                stack.sentenceService.getByDataHash("f".repeat(32))
            ).rejects.toBeInstanceOf(NotFoundException);
        });

        it("speech and claim-revision reads resolve the content tree and the content id", async () => {
            const created = await stack.claimService.create(speechBody());
            const revision = await stack.revisionService.getRevisionById(
                idOf(created.latestRevision)
            );
            const speechId = idOf(revision!.content[0]);

            const speech = await stack.speechService.getSpeech(speechId);
            expect(speech!.content[0].content[1].content).toBe(
                "Second sentence here."
            );
            parity.record("speech:tree", backend, speech);

            const byContent = await stack.revisionService.getByContentId(
                speechId
            );
            expect(idOf(byContent)).toBe(idOf(revision));
            expect(
                await stack.revisionService.getByContentId(makeMissingId())
            ).toBeNull();
            expect(
                await stack.revisionService.getRevision({
                    _id: makeMissingId(),
                    claimId: idOf(created),
                })
            ).toBeNull();
        });
    }
);
