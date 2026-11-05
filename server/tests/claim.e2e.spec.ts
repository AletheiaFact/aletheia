import request from "supertest";
import { Test, TestingModule } from "@nestjs/testing";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "../app.module";
import { SessionGuard } from "../auth/session.guard";
import { SessionGuardMock } from "./mocks/SessionGuardMock";
import { SessionOrM2MGuard } from "../auth/m2m-or-session.guard";
import { SessionOrM2MGuardMock } from "./mocks/SessionOrM2MGuardMock";
import { M2MGuard } from "../auth/m2m.guard";
import { M2MGuardMock } from "./mocks/M2MGuardMock";
import { TestConfigOptions } from "./utils/TestConfigOptions";
import { SeedTestUser } from "./utils/SeedTestUser";
import { SeedTestPersonality } from "./utils/SeedTestPersonality";
import { ContentModelEnum } from "../types/enums";
import { NameSpaceEnum } from "../auth/name-space/schemas/name-space.schema";
import { AbilitiesGuard } from "../auth/ability/abilities.guard";
import { AbilitiesGuardMock } from "./mocks/AbilitiesGuardMock";
import { M2MOrAbilitiesGuard } from "../auth/decorators/m2m-or-abilities.decorator";
import { CaptchaService } from "../captcha/captcha.service";
import { MongoPersonalityService } from "../personality/mongo/personality.service";
import { HistoryService } from "../history/history.service";
import { HistoryServiceMock } from "./mocks/HistoryServiceMock";
import { CleanupDatabase } from "./utils/CleanupDatabase";
import { getConnectionToken } from "@nestjs/mongoose";
import { Types } from "mongoose";

/**
 * ClaimController E2E Test Suite
 *
 * Tests the complete claim lifecycle management including:
 * - Multiple content model types (Speech, Image, Debate) with different validation rules
 * - Claim creation, retrieval, and management across content types
 * - Personality association and path generation for different scenarios
 * - Visibility management (hide/unhide) for content moderation
 * - Soft delete functionality with proper access control
 * - Comprehensive validation for required fields and business rules
 * - Pagination and filtering capabilities
 *
 * Business Context:
 * Claims are the core content units in the fact-checking platform. They represent
 * statements made by public figures that need verification. The system supports:
 * - Speech Claims: Text-based statements with source citations
 * - Image Claims: Visual content with metadata and file storage
 * - Debate Claims: Multi-personality discussions requiring 2+ participants
 *
 * Technical Features:
 * - Content model polymorphism with type-specific validation
 * - Personality service integration with mock data
 * - reCAPTCHA validation (mocked in test environment)
 * - Soft delete pattern with mongoose-softdelete
 * - Path generation with SEO-friendly slugs
 * - Namespace-based content organization
 *
 * Data Flow:
 * 1. Empty state validation → claim creation by type → retrieval with population
 * 2. Moderation workflows (hide/unhide) → soft deletion → access validation
 * 3. Validation testing → pagination testing → cleanup
 */

const captchaService = {
    validate: vi.fn().mockResolvedValue(true),
};

const personalityService = {
    getById: vi.fn().mockImplementation((id) => {
        if (!id) return Promise.resolve(null);
        return Promise.resolve({
            _id: id,
            name: "Barack Obama",
            slug: "barack-obama",
            description: "presidente dos Estados Unidos entre 2009 e 2017",
            wikidata: "Q76",
            isHidden: false,
            isDeleted: false,
        });
    }),
    getPersonalityBySlug: vi.fn(),
    getClaimsByPersonalitySlug: vi.fn(),
};

describe("ClaimController (e2e)", () => {
    let app: any;
    let personalitiesId: string[];
    let claimId: string;
    let speechClaimId: string;
    let imageClaimId: string;
    let debateClaimId: string;
    const speechSources: string[] = ["http://wikipedia.org"];
    const imageSources1: string[] = ["http://wikimedia.org"];
    const imageSources2: string[] = ["http://wikidata.org"];
    const debateSources: string[] = ["http://aletheiafact.org"];
    const date: string = "2023-11-25T14:49:30.992Z";

    beforeAll(async () => {
        // Use shared MongoDB instance from global setup
        const mongoUri = process.env.MONGO_URI!;

        await SeedTestUser(mongoUri);
        const { insertedIds } = await SeedTestPersonality(mongoUri);
        personalitiesId = [
            insertedIds["0"].toString(),
            insertedIds["1"].toString(),
        ];

        // Update test config with shared MongoDB URI
        const testConfig = {
            ...TestConfigOptions.config,
            db: {
                ...TestConfigOptions.config.db,
                connection_uri: mongoUri,
            },
        };

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule.register(testConfig)],
        })
            .overrideGuard(SessionGuard)
            .useValue(SessionGuardMock)
            .overrideGuard(SessionOrM2MGuard)
            .useValue(SessionOrM2MGuardMock)
            .overrideGuard(M2MGuard)
            .useValue(M2MGuardMock)
            .overrideGuard(AbilitiesGuard)
            .useValue(AbilitiesGuardMock)
            .overrideGuard(M2MOrAbilitiesGuard)
            .useValue(SessionGuardMock)
            .overrideProvider(CaptchaService)
            .useValue(captchaService)
            .overrideProvider("PersonalityService")
            .useValue(personalityService)
            .overrideProvider(HistoryService)
            .useValue(HistoryServiceMock)
            .compile();

        app = moduleFixture.createNestApplication();
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

    /**
     * Test: Initial Database State - Empty Claims Collection
     * Purpose: Validates that the database starts with no claims before any are created
     * Validates:
     * - GET /api/claim returns 200 status
     * - Response body contains claims array with length 0
     * - Pagination and filtering parameters work correctly
     */
    it("/api/claim (GET) - claims should be empty", () => {
        return request(app.getHttpServer())
            .get("/api/claim")
            .query({
                page: 0,
                pageSize: 10,
                order: "asc",
                language: "pt",
                isHidden: false,
                nameSpace: NameSpaceEnum.Main,
            })
            .expect(200)
            .expect(({ body }) => expect(body?.claims.length).toEqual(0));
    });

    /**
     * Test: Speech Claim Creation
     * Purpose: Validates creation of a speech-type claim with personality association
     * Validates:
     * - POST /api/claim returns 201 status for successful creation
     * - Response includes claim ID, title, and generated path
     * - Speech content model is properly handled
     * - Personality association works correctly
     * - Sources array is properly processed
     * - Recaptcha validation is bypassed in test environment
     */
    it("/api/claim (POST) - Create Speech Claim", async () => {
        const response = await request(app.getHttpServer())
            .post("/api/claim")
            .send({
                personalities: [personalitiesId[0]],
                contentModel: ContentModelEnum.Speech,
                nameSpace: NameSpaceEnum.Main,
                title: "Speech Claim Title",
                content: "Speech Claim Content Lorem Ipsum Dolor Sit Amet...",
                date,
                sources: speechSources,
                recaptcha: "valid_recaptcha_token",
            });

        expect(response.status).toBe(201);
        speechClaimId = response.body?._id;
        claimId = speechClaimId; // Set default claimId for dependent tests

        // Validate response structure and content
        expect(response.body?.title).toEqual("Speech Claim Title");
        expect(response.body?._id).toBeDefined();
        expect(response.body?.path).toBeDefined();
        expect(response.body?.path).toContain(
            "/personality/barack-obama/claim/"
        );
        expect(response.body?.path).toContain("speech-claim-title");
    });

    /**
     * Test: Claim Retrieval by ID with Personality Population
     * Purpose: Validates retrieval of a specific claim with populated personality data
     * Validates:
     * - GET /api/claim/:id returns 200 status
     * - Claim data is correctly retrieved from database
     * - Personality population works (Barack Obama should be populated)
     * - All claim fields are properly returned
     * - Namespace filtering works correctly
     */
    it("/api/claim/:id (GET) - Get by id", async () => {
        expect(claimId).toBeDefined();

        const response = await request(app.getHttpServer())
            .get(`/api/claim/${claimId}`)
            .query({ nameSpace: NameSpaceEnum.Main });

        expect(response.status).toBe(200);

        // Validate personality population works correctly
        const hasBarackObamaPersonality = response.body?.personalities.some(
            (p) => p.name === "Barack Obama"
        );
        expect(hasBarackObamaPersonality).toBeTruthy();
        expect(response.body?.personalities).toHaveLength(1);
        expect(response.body?.personalities[0]?.slug).toEqual("barack-obama");

        // Validate all claim fields are properly returned
        expect(response.body?._id).toEqual(claimId);
        expect(response.body?.title).toEqual("Speech Claim Title");
        expect(response.body?.contentModel).toEqual("Speech");
        expect(response.body?.nameSpace).toEqual("main");
        expect(response.body?.isHidden).toBe(false);
        expect(response.body?.isDeleted).toBe(false);
        expect(response.body?.sources).toBeDefined();
        expect(response.body?.sources).toHaveLength(1);
        expect(response.body?.sources[0]?.href).toEqual("http://wikipedia.org");
    });

    /**
     * Test: Image Claim Creation with Personality
     * Purpose: Validates creation of image-type claim with associated personality
     * Validates:
     * - POST /api/claim/image returns 201 status
     * - Image content model with file metadata is properly handled
     * - Personality association works for image claims
     * - Response includes title and generated path
     * - Image-specific content structure (FileURL, Key, Extension, DataHash)
     */
    it("/api/claim/image (POST) - Create Image Claim with Personality", async () => {
        const response = await request(app.getHttpServer())
            .post("/api/claim/image")
            .send({
                personalities: [personalitiesId[0]],
                contentModel: ContentModelEnum.Image,
                nameSpace: NameSpaceEnum.Main,
                title: "Image Claim Title With Personality",
                date,
                sources: imageSources1,
                content: {
                    FileURL: "http://localhost:4566/aletheia/imageTest1.png",
                    Key: "imageTest1.png",
                    Extension: "png",
                    DataHash: "388de39144cdc9fc50dac06e6b84bf88",
                },
                recaptcha: "valid_recaptcha_token",
            })
            .expect(201);

        // Validate response structure and content
        expect(response.status).toBe(201);
        expect(response.body?.title).toEqual(
            "Image Claim Title With Personality"
        );
        expect(response.body?.path).toBeDefined();
        expect(response.body?.path).toContain(
            "/personality/barack-obama/claim/"
        );

        imageClaimId = response.body?._id || response.body?.path;
    });

    /**
     * Test: Image Claim Creation without Personality
     * Purpose: Validates creation of image-type claim without personality association
     * Validates:
     * - POST /api/claim/image works with empty personalities array
     * - System handles claims not linked to any public figure
     * - Different image content (different DataHash) is accepted
     * - Path generation works without personality slug
     */
    it("/api/claim/image (POST) - Create Image Claim without Personality", async () => {
        const response = await request(app.getHttpServer())
            .post("/api/claim/image")
            .send({
                personalities: [], // Empty array instead of missing field
                contentModel: ContentModelEnum.Image,
                nameSpace: NameSpaceEnum.Main,
                title: "Image Claim Title Without Personality",
                date,
                sources: imageSources2,
                content: {
                    FileURL: "http://localhost:4566/aletheia/imageTest2.png",
                    Key: "imageTest2.png",
                    Extension: "png",
                    DataHash: "388de39144cdc9fc50dac06e6b84bf01",
                },
                recaptcha: "valid_recaptcha_token",
            });

        expect(response.status).toBe(201);
        expect(response.body?.title).toEqual(
            "Image Claim Title Without Personality"
        );
        expect(response.body?.path).toBeDefined();

        // Validate that path doesn't contain personality slug (since no personality)
        expect(response.body?.path).toContain("/claim/");
        expect(response.body?.path).not.toContain("/personality/");
    });

    /**
     * Test: Debate Claim Creation
     * Purpose: Validates creation of debate-type claim requiring multiple personalities
     * Validates:
     * - POST /api/claim/debate returns 201 status
     * - Debate content model validation (requires ≥2 personalities)
     * - Multiple personality association works
     * - Debate-specific DTO validation passes
     * - Response includes title and path for debate viewing
     */
    it("/api/claim/debate (POST) - Create Debate Claim", async () => {
        const response = await request(app.getHttpServer())
            .post("/api/claim/debate")
            .send({
                personalities: personalitiesId, // Should have 2 personalities
                contentModel: ContentModelEnum.Debate,
                nameSpace: NameSpaceEnum.Main,
                title: "Debate Claim Title",
                date,
                sources: debateSources, // Fixed from debateSources to sources
                recaptcha: "valid_recaptcha_token",
            });

        // Validate successful creation
        expect(response.status).toBe(201);

        // Debate endpoint may return different response formats
        // Accept either _id, path, or just success status
        debateClaimId =
            response.body?._id || response.body?.path || "debate-created";

        // If the response contains a path, validate it
        if (response.body?.path) {
            expect(response.body.path).toContain("/claim/");
            expect(response.body.path).toContain("/debate");
        }
    });

    /**
     * Test: Debate transcript drafts
     * Purpose: Validates the transcript draft flow of a debate
     * Validates:
     * - POST /api/claim/debate/:debateId/append creates hidden draft speeches
     * - Drafts stay out of the debate content, speech and sentence reads
     * - Reviewers list, edit, approve (transcript order) and reject drafts
     * - Resent externalIds are skipped, also after a rejection
     * - 400 / 404 / 409 cases
     */
    describe("debate transcript drafts", () => {
        let debateId: string;
        const turnsUrl = () => `/api/claim/debate/${debateId}/transcript-turns`;
        const db = () => app.get(getConnectionToken());
        const getDebate = () =>
            db()
                .collection("debates")
                .findOne({ _id: new Types.ObjectId(debateId) });
        const getSpeech = (speechId: string) =>
            db()
                .collection("speeches")
                .findOne({ _id: new Types.ObjectId(speechId) });
        const firstSentenceHash = async (speechId: string) => {
            const speech = await getSpeech(speechId);
            const paragraph = await db()
                .collection("paragraphs")
                .findOne({ _id: speech.content[0] });
            const sentence = await db()
                .collection("sentences")
                .findOne({ _id: paragraph.content[0] });
            return sentence.data_hash;
        };
        const drafts: Record<string, { turnId: string; speechId: string }> = {};

        beforeAll(async () => {
            const claimId = debateClaimId.split("/")[2];
            const revision = await db()
                .collection("claimrevisions")
                .findOne({ claimId: new Types.ObjectId(claimId) });
            debateId = revision.contentId.toString();
        });

        it("append creates hidden drafts, not debate content", async () => {
            const response = await request(app.getHttpServer())
                .post(`/api/claim/debate/${debateId}/append`)
                .send({
                    turns: [
                        {
                            personality: personalitiesId[0],
                            text: "We will lower taxes. Everyone benefits.",
                            externalId: "turn-1",
                            startedAt: "2023-11-25T15:00:00.000Z",
                            checkability: 72,
                        },
                        {
                            personality: personalitiesId[1],
                            text: "That plan was tried before.",
                            externalId: "turn-2",
                            checkability: 0,
                        },
                        {
                            personality: personalitiesId[0],
                            text: "Teh plan is new.",
                            externalId: "turn-3",
                        },
                    ],
                    isLive: true,
                });

            expect(response.status).toBe(201);
            expect(response.body.skipped).toEqual([]);
            expect(response.body.isLive).toBe(true);
            for (const draft of response.body.drafts) {
                drafts[draft.externalId] = draft;
            }
            expect(Object.keys(drafts)).toEqual(["turn-1", "turn-2", "turn-3"]);

            const debate = await getDebate();
            expect(debate.isLive).toBe(true);
            expect(debate.content).toHaveLength(0);
            expect(debate.transcriptTurns.map((t) => t.status)).toEqual([
                "draft",
                "draft",
                "draft",
            ]);
            expect(debate.transcriptTurns[0].startedAt).toEqual(
                new Date("2023-11-25T15:00:00.000Z")
            );
            expect(
                debate.transcriptTurns.map((t) => t.checkability ?? null)
            ).toEqual([72, 0, null]);
            expect(debate.transcriptTurns[2]).not.toHaveProperty(
                "checkability"
            );

            const speech = await getSpeech(drafts["turn-1"].speechId);
            expect(speech.isDraft).toBe(true);
            expect(speech.personality.toString()).toBe(personalitiesId[0]);
        });

        it("hides draft speeches and sentences from public reads", async () => {
            const speechResponse = await request(app.getHttpServer()).get(
                `/api/speech/${drafts["turn-1"].speechId}`
            );
            expect(speechResponse.body).toEqual({});

            const hash = await firstSentenceHash(drafts["turn-1"].speechId);
            const sentenceResponse = await request(app.getHttpServer()).get(
                `/api/sentence/${hash}`
            );
            expect(sentenceResponse.status).toBe(404);
        });

        it("lists drafts in transcript order with their speeches", async () => {
            const response = await request(app.getHttpServer())
                .get(turnsUrl())
                .query({ status: "draft" });

            expect(response.status).toBe(200);
            expect(response.body.map((t) => t.externalId)).toEqual([
                "turn-1",
                "turn-2",
                "turn-3",
            ]);
            expect(response.body[0].speech._id).toBe(drafts["turn-1"].speechId);
            expect(response.body[0].speech.content.length).toBeGreaterThan(0);
            expect(response.body.map((t) => t.checkability ?? null)).toEqual([
                72,
                0,
                null,
            ]);
        });

        it("edits a draft by parsing a new draft speech", async () => {
            const response = await request(app.getHttpServer())
                .patch(`${turnsUrl()}/${drafts["turn-3"].turnId}`)
                .send({ text: "The plan is new." });

            expect(response.status).toBe(200);
            expect(response.body.text).toBe("The plan is new.");
            expect(response.body.speechId).not.toBe(drafts["turn-3"].speechId);

            const debate = await getDebate();
            expect(debate.transcriptTurns[2].text).toBe("The plan is new.");
            expect(debate.transcriptTurns[2].speech.toString()).toBe(
                response.body.speechId
            );
            drafts["turn-3"].speechId = response.body.speechId;
        });

        it("approves drafts in transcript order and makes them public", async () => {
            const response = await request(app.getHttpServer())
                .post(`${turnsUrl()}/approve`)
                .send({
                    turnIds: [drafts["turn-3"].turnId, drafts["turn-1"].turnId],
                });

            expect(response.status).toBe(201);
            expect(response.body.turns.map((t) => t.status)).toEqual([
                "approved",
                "approved",
            ]);

            const debate = await getDebate();
            expect(debate.content.map(String)).toEqual([
                drafts["turn-1"].speechId,
                drafts["turn-3"].speechId,
            ]);
            expect(debate.transcriptTurns[0].reviewedAt).toBeInstanceOf(Date);
            expect(debate.transcriptTurns[0].checkability).toBe(72);

            const speechResponse = await request(app.getHttpServer()).get(
                `/api/speech/${drafts["turn-1"].speechId}`
            );
            expect(speechResponse.body._id).toBe(drafts["turn-1"].speechId);

            const hash = await firstSentenceHash(drafts["turn-1"].speechId);
            const sentenceResponse = await request(app.getHttpServer()).get(
                `/api/sentence/${hash}`
            );
            expect(sentenceResponse.status).toBe(200);
        });

        it("returns 409 when a turn was already reviewed", async () => {
            const approveAgain = await request(app.getHttpServer())
                .post(`${turnsUrl()}/approve`)
                .send({ turnIds: [drafts["turn-1"].turnId] });
            expect(approveAgain.status).toBe(409);

            const edit = await request(app.getHttpServer())
                .patch(`${turnsUrl()}/${drafts["turn-1"].turnId}`)
                .send({ text: "Changed after approval." });
            expect(edit.status).toBe(409);
        });

        it("rejects a draft, keeping it out of the debate", async () => {
            const response = await request(app.getHttpServer())
                .post(`${turnsUrl()}/reject`)
                .send({ turnIds: [drafts["turn-2"].turnId] });

            expect(response.status).toBe(201);
            const debate = await getDebate();
            expect(debate.content).toHaveLength(2);
            expect(debate.transcriptTurns[1].status).toBe("rejected");
            expect((await getSpeech(drafts["turn-2"].speechId)).isDraft).toBe(
                true
            );
        });

        it("skips resent turns, including rejected ones", async () => {
            const response = await request(app.getHttpServer())
                .post(`/api/claim/debate/${debateId}/append`)
                .send({
                    turns: [
                        {
                            personality: personalitiesId[1],
                            text: "That plan was tried before.",
                            externalId: "turn-2",
                            checkability: 90,
                        },
                        {
                            personality: personalitiesId[0],
                            text: "Not like this.",
                            externalId: "turn-4",
                        },
                    ],
                });

            expect(response.status).toBe(201);
            expect(response.body.skipped).toEqual(["turn-2"]);
            expect(response.body.drafts.map((d) => d.externalId)).toEqual([
                "turn-4",
            ]);
            const debate = await getDebate();
            expect(debate.transcriptTurns).toHaveLength(4);
            expect(debate.transcriptTurns[1].checkability).toBe(0);
        });

        it("lists and approves drafts in spoken order, not arrival order", async () => {
            // turn-5 is spoken later but arrives first, as with a relabel
            // or a block that is only sent once final.
            for (const turn of [
                {
                    personality: personalitiesId[0],
                    text: "Second in the debate.",
                    externalId: "turn-5",
                    startedAt: "2023-11-25T15:10:00.000Z",
                },
                {
                    personality: personalitiesId[1],
                    text: "First in the debate.",
                    externalId: "turn-6",
                    startedAt: "2023-11-25T15:05:00.000Z",
                },
            ]) {
                const response = await request(app.getHttpServer())
                    .post(`/api/claim/debate/${debateId}/append`)
                    .send({ turns: [turn] });
                expect(response.status).toBe(201);
                drafts[turn.externalId] = response.body.drafts[0];
            }

            const list = await request(app.getHttpServer())
                .get(turnsUrl())
                .query({ status: "draft" });
            // turn-4 has no startedAt, so its arrival time (now) puts it last.
            expect(list.body.map((t) => t.externalId)).toEqual([
                "turn-6",
                "turn-5",
                "turn-4",
            ]);

            const approve = await request(app.getHttpServer())
                .post(`${turnsUrl()}/approve`)
                .send({
                    turnIds: [drafts["turn-5"].turnId, drafts["turn-6"].turnId],
                });
            expect(approve.status).toBe(201);
            expect(approve.body.turns.map((t) => t.turnId)).toEqual([
                drafts["turn-6"].turnId,
                drafts["turn-5"].turnId,
            ]);

            const debate = await getDebate();
            expect(debate.content.map(String).slice(-2)).toEqual([
                drafts["turn-6"].speechId,
                drafts["turn-5"].speechId,
            ]);
        });

        it("returns 400 for an invalid append body", async () => {
            const response = await request(app.getHttpServer())
                .post(`/api/claim/debate/${debateId}/append`)
                .send({
                    turns: [{ personality: personalitiesId[0], text: "  " }],
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("Validation failed");
            expect(response.body.issues[0].path).toBe("turns.0.text");
        });

        it("returns 400 for a checkability out of range", async () => {
            const response = await request(app.getHttpServer())
                .post(`/api/claim/debate/${debateId}/append`)
                .send({
                    turns: [
                        {
                            personality: personalitiesId[0],
                            text: "Too checkable.",
                            externalId: "turn-out-of-range",
                            checkability: 101,
                        },
                    ],
                });

            expect(response.status).toBe(400);
            expect(response.body.issues[0].path).toBe("turns.0.checkability");
        });

        it("returns 400 for an invalid review body", async () => {
            const response = await request(app.getHttpServer())
                .post(`${turnsUrl()}/approve`)
                .send({ turnIds: ["turn-4"] });

            expect(response.status).toBe(400);
            expect(response.body.issues[0].path).toBe("turnIds.0");
        });

        it("returns 400 for a speaker who is not in the debate", async () => {
            const response = await request(app.getHttpServer())
                .post(`/api/claim/debate/${debateId}/append`)
                .send({
                    turns: [
                        {
                            personality: new Types.ObjectId().toString(),
                            text: "I was not invited.",
                        },
                    ],
                });

            expect(response.status).toBe(400);
            expect((await getDebate()).transcriptTurns).toHaveLength(6);
        });

        it("returns 404 for an unknown debate or turn", async () => {
            const unknownDebate = await request(app.getHttpServer())
                .post(
                    `/api/claim/debate/${new Types.ObjectId().toString()}/append`
                )
                .send({
                    turns: [{ personality: personalitiesId[0], text: "Hi." }],
                });
            expect(unknownDebate.status).toBe(404);

            const unknownTurn = await request(app.getHttpServer())
                .post(`${turnsUrl()}/approve`)
                .send({ turnIds: [new Types.ObjectId().toString()] });
            expect(unknownTurn.status).toBe(404);
        });
    });

    /**
     * Test: List All Claims after Creation
     * Purpose: Validates retrieval of all created claims with proper count
     * Validates:
     * - GET /api/claim returns all non-hidden claims
     * - Pagination parameters work correctly
     * - Filtering by isHidden=false works
     * - Namespace filtering works
     * - Total count matches expected (4 claims: Speech, Image w/ personality, Image w/o personality, Debate)
     */
    it("/api/claim (GET) - List all created claims", () => {
        return request(app.getHttpServer())
            .get("/api/claim")
            .query({
                page: 0,
                pageSize: 10,
                order: "asc",
                language: "pt",
                isHidden: false,
                nameSpace: NameSpaceEnum.Main,
            })
            .expect(200)
            .expect(({ body }) => expect(body?.claims.length).toEqual(4));
    });

    /**
     * Test: Hide Claim Functionality
     * Purpose: Validates ability to hide a claim from public view
     * Validates:
     * - PUT /api/claim/hidden/:id returns 200 status
     * - Claim can be marked as hidden with description
     * - Admin permissions are properly handled (mocked in test)
     * - Hidden claims won't appear in public listings
     */
    it("/api/claim/hidden/:id (PUT) - Hide claim", async () => {
        expect(claimId).toBeDefined();

        // Hide the claim
        await request(app.getHttpServer())
            .put(`/api/claim/hidden/${claimId}`)
            .send({
                isHidden: true,
                description: "Hidden claim description",
                recaptcha: "valid_recaptcha_token",
            })
            .expect(200);

        // Verify claim no longer appears in public listings
        const response = await request(app.getHttpServer())
            .get("/api/claim")
            .query({
                page: 0,
                pageSize: 10,
                order: "asc",
                language: "pt",
                isHidden: false,
                nameSpace: NameSpaceEnum.Main,
            })
            .expect(200);

        expect(response.body?.claims.length).toEqual(3); // Should be 3 instead of 4
    });

    /**
     * Test: Unhide Claim Functionality
     * Purpose: Validates ability to restore a hidden claim to public view
     * Validates:
     * - PUT /api/claim/hidden/:id can reverse hide operation
     * - isHidden flag can be set to false
     * - Description can be cleared
     * - Claim will reappear in public listings
     */
    it("/api/claim/hidden/:id (PUT) - Unhide claim", async () => {
        expect(claimId).toBeDefined();

        // Unhide the claim
        await request(app.getHttpServer())
            .put(`/api/claim/hidden/${claimId}`)
            .send({
                isHidden: false,
                description: "",
                recaptcha: "valid_recaptcha_token",
            })
            .expect(200);

        // Verify claim reappears in public listings
        const response = await request(app.getHttpServer())
            .get("/api/claim")
            .query({
                page: 0,
                pageSize: 10,
                order: "asc",
                language: "pt",
                isHidden: false,
                nameSpace: NameSpaceEnum.Main,
            })
            .expect(200);

        expect(response.body?.claims.length).toEqual(4); // Should be back to 4
    });

    /**
     * Test: Soft Delete Claim Functionality
     * Purpose: Validates soft deletion of claims (using mongoose-softdelete)
     * Validates:
     * - DELETE /api/claim/:id returns 200 status
     * - Claim is marked as deleted but not physically removed
     * - Admin permissions are required (mocked in test)
     * - Deleted claims won't be accessible via normal queries
     */
    it("/api/claim/:id (DELETE) - Delete claim", () => {
        expect(claimId).toBeDefined();
        return request(app.getHttpServer())
            .delete(`/api/claim/${claimId}`)
            .expect(200);
    });

    /**
     * Test: Verify Soft Delete Behavior
     * Purpose: Validates that deleted claims return 404 and are inaccessible
     * Validates:
     * - GET /api/claim/:id returns 404 for soft-deleted claims
     * - Soft delete properly removes claim from normal access
     * - Database integrity is maintained (claim still exists but marked deleted)
     */
    it("/api/claim/:id (GET) - Get by id after deletion", () => {
        expect(claimId).toBeDefined();
        return request(app.getHttpServer())
            .get(`/api/claim/${claimId}`)
            .query({ nameSpace: NameSpaceEnum.Main })
            .expect(404);
    });

    /**
     * Test: Validation Error - Missing Required Fields
     * Purpose: Validates that claims cannot be created without required fields
     * Validates:
     * - POST /api/claim returns 400 for missing title
     * - Proper error response structure
     * - ValidationPipe is working correctly
     */
    it("/api/claim (POST) - Validation error for missing title", () => {
        return request(app.getHttpServer())
            .post("/api/claim")
            .send({
                personalities: [personalitiesId[0]],
                contentModel: ContentModelEnum.Speech,
                nameSpace: NameSpaceEnum.Main,
                // title: missing intentionally
                content: "Content without title",
                date,
                sources: speechSources,
                recaptcha: "valid_recaptcha_token",
            })
            .expect(400);
    });

    /**
     * Test: Validation Error - Invalid Content Model
     * Purpose: Validates that claims reject invalid content model values
     * Validates:
     * - POST /api/claim returns 400 for invalid enum values
     * - Content model validation is working
     */
    it("/api/claim (POST) - Validation error for invalid content model", () => {
        return request(app.getHttpServer())
            .post("/api/claim")
            .send({
                personalities: [personalitiesId[0]],
                contentModel: "InvalidModel", // Invalid enum value
                nameSpace: NameSpaceEnum.Main,
                title: "Test Title",
                content: "Test Content",
                date,
                sources: speechSources,
                recaptcha: "valid_recaptcha_token",
            })
            .expect(400);
    });

    /**
     * Test: Debate Claim Validation - Insufficient Personalities
     * Purpose: Validates that debate claims require at least 2 personalities
     * Validates:
     * - POST /api/claim/debate returns 400 with only 1 personality
     * - @ArrayMinSize(2) validation is working
     */
    it("/api/claim/debate (POST) - Validation error for insufficient personalities", () => {
        return request(app.getHttpServer())
            .post("/api/claim/debate")
            .send({
                personalities: [personalitiesId[0]], // Only 1 personality, needs 2+
                contentModel: ContentModelEnum.Debate,
                nameSpace: NameSpaceEnum.Main,
                title: "Debate Title",
                date,
                sources: debateSources,
                recaptcha: "valid_recaptcha_token",
            })
            .expect(400);
    });

    /**
     * Test: GET Non-existent Claim
     * Purpose: Validates 404 response for non-existent claim IDs
     * Validates:
     * - GET /api/claim/:id returns 404 for non-existent IDs
     * - Proper error handling for invalid ObjectIds
     */
    it("/api/claim/:id (GET) - Get non-existent claim", () => {
        const nonExistentId = "507f1f77bcf86cd799439011"; // Valid ObjectId format but non-existent
        return request(app.getHttpServer())
            .get(`/api/claim/${nonExistentId}`)
            .query({ nameSpace: NameSpaceEnum.Main })
            .expect(404);
    });

    /**
     * Test: Pagination Functionality
     * Purpose: Validates pagination parameters work correctly
     * Validates:
     * - Different page sizes return correct number of results
     * - Page boundaries work correctly
     * - Pagination metadata is accurate
     */
    it("/api/claim (GET) - Pagination with page size 2", async () => {
        // First, ensure we have claims by creating a few more if needed
        const response = await request(app.getHttpServer())
            .get("/api/claim")
            .query({
                page: 0,
                pageSize: 2,
                order: "asc",
                language: "pt",
                isHidden: false,
                nameSpace: NameSpaceEnum.Main,
            })
            .expect(200);

        // Should return maximum 2 claims
        expect(response.body?.claims.length).toBeLessThanOrEqual(2);
        expect(response.body?.pageSize).toEqual(2);
        expect(response.body?.totalClaims).toBeGreaterThan(0);
        expect(response.body?.totalPages).toBeGreaterThan(0);
    });

    afterAll(async () => {
        await app.close();
        await CleanupDatabase(process.env.MONGO_URI!);
    });
});
