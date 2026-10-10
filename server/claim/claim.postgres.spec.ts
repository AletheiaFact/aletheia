import { randomUUID } from "crypto";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { PostgresClaimService } from "./postgres/claim.service";
import { PostgresClaimRevisionService } from "./claim-revision/postgres/claim-revision.service";
import { PostgresSentenceService } from "./types/sentence/postgres/sentence.service";
import { getTestDrizzle, resetTestDrizzle } from "../tests/postgres-setup";
import {
    buildPostgresClaimStack,
    seedPostgresPersonality,
} from "../tests/postgres-claim-stack";
import { NotImplementedError } from "../database/errors";
import { claim } from "./postgres/schema/claim.schema";
import { claimRevision } from "./claim-revision/postgres/schema/claim-revision.schema";
import { sentence } from "./types/sentence/postgres/schema/sentence.schema";

describe.skipIf(process.env.DB_TYPE !== "postgres")(
    "claim postgres-only",
    () => {
        let db: Awaited<ReturnType<typeof getTestDrizzle>>;
        let claimService: PostgresClaimService;
        let revisionService: PostgresClaimRevisionService;
        let sentenceService: PostgresSentenceService;
        let personalityId: string;

        const seedPersonality = async (name: string, isHidden = false) =>
            (await seedPostgresPersonality(db, name, { isHidden })).id;

        const body = (overrides: Record<string, any> = {}) => ({
            title: "Economy grows",
            content: "The economy grew last year. Taxes went down.",
            date: "2024-01-01T00:00:00.000Z",
            contentModel: "Speech",
            sources: [],
            nameSpace: "main",
            personalities: [personalityId],
            ...overrides,
        });

        beforeEach(async () => {
            await resetTestDrizzle();
            db = await getTestDrizzle();
            ({ claimService, revisionService, sentenceService } =
                buildPostgresClaimStack(db, {} as any));
            personalityId = await seedPersonality("Ada Lovelace");
        });

        it("reads that need the review enrichment are loud 501s until claim-review and review-task port", async () => {
            const created = await claimService.create(body());
            await expect(
                claimService.getById(created._id)
            ).rejects.toBeInstanceOf(NotImplementedError);
            await expect(
                claimService.getByClaimSlug("economy-grows")
            ).rejects.toBeInstanceOf(NotImplementedError);
            await expect(
                claimService.listAll(0, 10, "asc", { isHidden: false })
            ).rejects.toBeInstanceOf(NotImplementedError);
            await expect(
                claimService.update(created._id, { title: "x" })
            ).rejects.toBeInstanceOf(NotImplementedError);
        });

        it("a missing claim is a 404 before the enrichment guard, and a malformed id is a 404 too", async () => {
            await expect(
                claimService.getById(randomUUID())
            ).rejects.toBeInstanceOf(NotFoundException);
            await expect(
                claimService.getById("not-a-uuid")
            ).rejects.toBeInstanceOf(NotFoundException);
        });

        it("a claim query with a key the Postgres filter cannot honour is a loud 501", async () => {
            await expect(
                claimService.count({ title: "x" } as any)
            ).rejects.toBeInstanceOf(NotImplementedError);
        });

        it("reading a revision whose content type has not ported is a loud 501", async () => {
            const created = await claimService.create(body());
            const [row] = await db
                .insert(claimRevision)
                .values({
                    title: "Picture",
                    slug: "picture",
                    contentId: randomUUID(),
                    contentModel: "Image",
                    date: new Date(),
                    claimId: created._id,
                    personalityIds: [personalityId],
                })
                .returning();
            await expect(
                revisionService.getRevisionById(row.id)
            ).rejects.toBeInstanceOf(NotImplementedError);
        });

        it("create rejects an unknown contentModel or a missing date before writing any content", async () => {
            await expect(
                claimService.create(body({ contentModel: "Nope" }))
            ).rejects.toBeInstanceOf(BadRequestException);
            await expect(
                claimService.create(body({ date: undefined }))
            ).rejects.toBeInstanceOf(BadRequestException);
            expect(await db.select().from(sentence)).toEqual([]);
        });

        it("sentence findAll needs a searchText or a topic filter", async () => {
            await expect(
                sentenceService.findAll({ searchText: "", pageSize: 10 })
            ).rejects.toBeInstanceOf(BadRequestException);
        });

        it("image and debate claims are loud 501s until their tables port", async () => {
            await expect(
                claimService.create(
                    body({ contentModel: "Image", content: { DataHash: "x" } })
                )
            ).rejects.toBeInstanceOf(NotImplementedError);
            await expect(
                claimService.create(body({ contentModel: "Debate" }))
            ).rejects.toBeInstanceOf(NotImplementedError);
        });

        it("the (name_space, slug) unique index closes the duplicate-title race", async () => {
            await claimService.create(body());
            await expect(
                db.insert(claim).values({
                    slug: "economy-grows",
                    nameSpace: "main",
                    latestRevisionId: randomUUID(),
                })
            ).rejects.toThrow(/duplicate key/);
        });

        it("sentence findAll searches content by trigram, honours visibility and the topics filter", async () => {
            const hiddenPersonality = await seedPersonality("Hidden One", true);
            const visible = await claimService.create(body());
            await claimService.create(
                body({
                    title: "Hidden claim",
                    personalities: [hiddenPersonality],
                })
            );
            await claimService.create(
                body({ title: "Other namespace", nameSpace: "other" })
            );
            const hiddenClaim = await claimService.create(
                body({ title: "Hidden by flag" })
            );
            await claimService.hideOrUnhideClaim(hiddenClaim._id, true);

            const result = await sentenceService.findAll({
                searchText: "economy grew",
                pageSize: 10,
                nameSpace: "main",
            });
            expect(result.totalRows).toBe(1);
            expect(result.processedSentences).toHaveLength(1);
            const [hit] = result.processedSentences;
            expect(hit.content).toBe("The economy grew last year.");
            expect(hit.personality).toEqual([
                { slug: "ada-lovelace", name: "Ada Lovelace" },
            ]);
            expect(hit.claim[0]).toMatchObject({
                slug: "economy-grows",
                contentModel: "Speech",
            });
            expect(String(hit.claim[0]._id)).toBe(
                String(visible.latestRevision)
            );

            await sentenceService.updateSentenceWithTopics(
                ["economia", { id: randomUUID(), label: "Economia" }],
                hit.data_hash
            );
            const byTopic = await sentenceService.findAll({
                searchText: "",
                filter: "economia",
                pageSize: 10,
                nameSpace: "main",
            });
            expect(byTopic.processedSentences.map((s) => s.data_hash)).toEqual([
                hit.data_hash,
            ]);
            const noTopic = await sentenceService.findAll({
                searchText: "",
                filter: ["saude"],
                pageSize: 10,
                nameSpace: "main",
            });
            expect(noTopic.totalRows).toBe(0);
        });

        it("claim-revision findAll searches titles by trigram under the same visibility rules", async () => {
            const hiddenPersonality = await seedPersonality("Hidden One", true);
            await claimService.create(body());
            await claimService.create(
                body({
                    title: "Economy shrinks",
                    personalities: [hiddenPersonality],
                })
            );
            const result = await revisionService.findAll({
                searchText: "economy",
                pageSize: 10,
                skippedDocuments: 0,
                nameSpace: "main",
            });
            expect(result.totalRows).toBe(1);
            expect(result.processedRevisions[0]).toMatchObject({
                title: "Economy grows",
                slug: "economy-grows",
                contentModel: "Speech",
                personality: [{ slug: "ada-lovelace", name: "Ada Lovelace" }],
            });
            const paged = await revisionService.findAll({
                searchText: "economy",
                pageSize: 10,
                skippedDocuments: 1,
                nameSpace: "main",
            });
            expect(paged.processedRevisions).toEqual([]);
            expect(paged.totalRows).toBe(1);
        });

        it("getRevision guards unsupported match keys", async () => {
            await expect(
                revisionService.getRevision({ title: "x" })
            ).rejects.toBeInstanceOf(NotImplementedError);
        });
    }
);
