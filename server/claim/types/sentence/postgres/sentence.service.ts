import {
    BadRequestException,
    Inject,
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { and, asc, eq, inArray, sql } from "drizzle-orm";
import type {
    ISentenceService,
    SentenceFindAllOptions,
} from "../../../../interfaces/sentence.service.interface";
import type { ISentence } from "../../../../interfaces/claim-content.interface";
import type { IReportService } from "../../../../interfaces/report.service.interface";
import { DRIZZLE } from "../../../../database/postgres/postgres.provider";
import type { DrizzleClient } from "../../../../database/postgres/connection";
import { toError } from "../../../../util/error-handling";
import { sentence } from "./schema/sentence.schema";
import { claimRevision } from "../../../claim-revision/postgres/schema/claim-revision.schema";
import { claim } from "../../../postgres/schema/claim.schema";
import { personality } from "../../../../personality/postgres/schema/personality.schema";
import { toSentenceEntity } from "../../../postgres/content.entity";

@Injectable()
export class PostgresSentenceService implements ISentenceService {
    private readonly logger = new Logger(PostgresSentenceService.name);

    constructor(
        @Inject(DRIZZLE) private readonly db: DrizzleClient,
        @Inject("ReportService") private readonly reportService: IReportService,
        private readonly configService: ConfigService
    ) {}

    async create(sentenceBody: Record<string, any>): Promise<any> {
        const [row] = await this.db
            .insert(sentence)
            .values({
                dataHash: sentenceBody.data_hash,
                props: sentenceBody.props ?? {},
                content: sentenceBody.content,
                topics: sentenceBody.topics ?? null,
                claimRevisionId: String(sentenceBody.claimRevisionId),
            })
            .returning({ id: sentence.id });
        return row.id;
    }

    async getByDataHash(data_hash: string): Promise<ISentence> {
        if (!data_hash) {
            throw new BadRequestException(
                "Invalid data_hash: must be a string."
            );
        }
        const report = await this.reportService.findByDataHash(data_hash);
        const [row] = await this.db
            .select()
            .from(sentence)
            .where(eq(sentence.dataHash, data_hash))
            .orderBy(asc(sentence.createdAt), asc(sentence.id))
            .limit(1);
        if (!row) {
            throw new NotFoundException();
        }
        const entity = toSentenceEntity(row);
        entity.props = {
            classification: report?.classification,
            ...entity.props,
        };
        return entity;
    }

    async updateSentenceWithTopics(
        topics: any[],
        data_hash: string
    ): Promise<ISentence | null> {
        const found = await this.getByDataHash(data_hash);
        if (!Array.isArray(topics)) {
            throw new BadRequestException("Invalid topics array.");
        }
        const [row] = await this.db
            .update(sentence)
            .set({ topics, updatedAt: new Date() })
            .where(eq(sentence.id, String(found._id)))
            .returning();
        return row ? toSentenceEntity(row) : null;
    }

    async findAll({
        searchText,
        pageSize,
        skippedDocuments,
        filter,
        nameSpace,
    }: SentenceFindAllOptions): Promise<{
        totalRows: number;
        processedSentences: any[];
    }> {
        const configured = Number(
            this.configService.get<number>("db.postgres.fuzzy_threshold")
        );
        const threshold = Number.isFinite(configured) ? configured : 0.3;
        const filters = filter ? ([] as string[]).concat(filter) : [];
        if (!searchText && filters.length === 0) {
            throw new BadRequestException(
                "searchText or a topic filter is required."
            );
        }

        const conditions = [
            eq(sentence.isDeleted, false),
            eq(claim.isHidden, false),
            eq(claim.isDeleted, false),
            eq(claim.nameSpace, nameSpace ?? ""),
            sql`NOT EXISTS (SELECT 1 FROM ${personality} p WHERE p.id = ANY(${claimRevision.personalityIds}) AND (p.is_hidden = true OR p.is_deleted = true))`,
        ];
        if (searchText) {
            conditions.push(sql`${sentence.content} % ${searchText}`);
        }
        if (filters.length > 0) {
            conditions.push(
                sql`${sentence.topics} ?| ARRAY[${sql.join(
                    filters.map((f) => sql`${f}`),
                    sql`, `
                )}]::text[]`
            );
        }
        const where = and(...conditions);
        const order = searchText
            ? sql`similarity(${sentence.content}, ${searchText}) DESC`
            : asc(sentence.createdAt);

        const { rows, totalRows } = await this.db.transaction(async (tx) => {
            if (searchText) {
                await tx.execute(
                    sql.raw(
                        `SET LOCAL pg_trgm.similarity_threshold = ${threshold}`
                    )
                );
            }
            const base = tx
                .select({
                    _id: sentence.id,
                    content: sentence.content,
                    data_hash: sentence.dataHash,
                    props: sentence.props,
                    revisionId: claimRevision.id,
                    revisionSlug: claimRevision.slug,
                    revisionDate: claimRevision.date,
                    revisionContentModel: claimRevision.contentModel,
                    personalityIds: claimRevision.personalityIds,
                })
                .from(sentence)
                .innerJoin(
                    claimRevision,
                    eq(claimRevision.id, sentence.claimRevisionId)
                )
                .innerJoin(claim, eq(claim.id, claimRevision.claimId))
                .where(where);
            const rows = await base
                .orderBy(order, asc(sentence.id))
                .offset(skippedDocuments ?? 0)
                .limit(pageSize);
            const [{ c: totalRows }] = await tx
                .select({ c: sql<number>`count(*)::int` })
                .from(sentence)
                .innerJoin(
                    claimRevision,
                    eq(claimRevision.id, sentence.claimRevisionId)
                )
                .innerJoin(claim, eq(claim.id, claimRevision.claimId))
                .where(where);
            return { rows, totalRows };
        });

        const personalityIds = [
            ...new Set(rows.flatMap((r) => r.personalityIds)),
        ];
        const personalities =
            personalityIds.length > 0
                ? await this.db
                      .select({
                          id: personality.id,
                          slug: personality.slug,
                          name: personality.name,
                      })
                      .from(personality)
                      .where(inArray(personality.id, personalityIds))
                : [];
        const personalityById = new Map(personalities.map((p) => [p.id, p]));

        const processedSentences = await Promise.all(
            rows.map(async (row) => {
                const projected = {
                    _id: row._id,
                    content: row.content,
                    data_hash: row.data_hash,
                    props: row.props,
                    personality: row.personalityIds
                        .map((id) => personalityById.get(id))
                        .filter((p) => !!p)
                        .map((p) => ({ slug: p.slug, name: p.name })),
                    claim: [
                        {
                            _id: row.revisionId,
                            slug: row.revisionSlug,
                            date: row.revisionDate,
                            contentModel: row.revisionContentModel,
                        },
                    ],
                };
                return Object.assign(
                    projected,
                    await this.getByDataHash(row.data_hash)
                );
            })
        );

        return { totalRows, processedSentences };
    }

    async getHashesByTopic(topicId: string): Promise<string[]> {
        this.logger.debug(`Fetching sentence hashes for topic: ${topicId}`);
        try {
            const rows = await this.db
                .select({ dataHash: sentence.dataHash })
                .from(sentence)
                .where(
                    sql`${sentence.topics} @> ${JSON.stringify([
                        { id: topicId },
                    ])}::jsonb`
                );
            return rows.map((r) => r.dataHash);
        } catch (error) {
            const err = toError(error);
            this.logger.error(
                `Failed to fetch sentence hashes for topic: ${topicId}`,
                err.stack
            );
            throw new InternalServerErrorException(
                `An error occurred while retrieving sentences for the requested topic.`
            );
        }
    }
}
