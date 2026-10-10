import {
    BadRequestException,
    Inject,
    Injectable,
    Logger,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { randomUUID } from "node:crypto";
import { and, asc, eq, inArray, sql, SQL } from "drizzle-orm";
import type {
    ClaimContentRef,
    IClaimRevisionService,
} from "../../../interfaces/claim-revision.service.interface";
import type { IClaimRevision } from "../../../interfaces/claim-revision.interface";
import type { IFindAllOptions } from "../../../interfaces/personality.interface";
import type { ISourceService } from "../../../interfaces/source.service.interface";
import { DRIZZLE } from "../../../database/postgres/postgres.provider";
import type { DrizzleClient } from "../../../database/postgres/connection";
import { NotImplementedError } from "../../../database/errors";
import { ContentModelEnum } from "../../../types/enums";
import { ParserService } from "../../parser/parser.service";
import { claimRevision } from "./schema/claim-revision.schema";
import type { ClaimRevisionRow } from "./schema/claim-revision.schema";
import { claim } from "../../postgres/schema/claim.schema";
import { personality } from "../../../personality/postgres/schema/personality.schema";
import { toPersonalityEntity } from "../../../personality/postgres/personality.service";
import { loadContentTree } from "../../postgres/content-tree";

export function toClaimRevisionEntity(
    row: ClaimRevisionRow,
    populated: { personalities?: any[]; content?: any[] } = {}
): IClaimRevision {
    const { personalityIds, legacyObjectId, isDeleted, deletedAt, ...rest } =
        row;
    return {
        ...rest,
        _id: row.id,
        personalities: populated.personalities ?? personalityIds,
        ...(populated.content !== undefined
            ? { content: populated.content }
            : {}),
    } as IClaimRevision;
}

const MATCH_COLUMNS = {
    _id: claimRevision.id,
    claimId: claimRevision.claimId,
    contentId: claimRevision.contentId,
} as const;

@Injectable()
export class PostgresClaimRevisionService implements IClaimRevisionService {
    private readonly logger = new Logger(PostgresClaimRevisionService.name);

    constructor(
        @Inject(DRIZZLE) private readonly db: DrizzleClient,
        @Inject("SourceService") private readonly sourceService: ISourceService,
        private readonly parserService: ParserService,
        private readonly configService: ConfigService
    ) {}

    async getRevision(
        match: Record<string, any>
    ): Promise<IClaimRevision | null> {
        const conditions: SQL[] = [];
        for (const [key, value] of Object.entries(match)) {
            const column = MATCH_COLUMNS[key as keyof typeof MATCH_COLUMNS];
            if (!column) {
                throw new NotImplementedError(
                    "postgres",
                    `getRevision(match.${key})`
                );
            }
            conditions.push(eq(column, String(value)));
        }
        const [row] = await this.db
            .select()
            .from(claimRevision)
            .where(and(...conditions))
            .limit(1);
        return row ? this.populate(row) : null;
    }

    getRevisionById(id: string): Promise<IClaimRevision | null> {
        return this.getRevision({ _id: id });
    }

    async create(
        claimId: any,
        input: Record<string, any>
    ): Promise<IClaimRevision> {
        const revisionId = randomUUID();
        this.logger.debug(
            `Creating claim revision — claimId=${claimId} revisionId=${revisionId} contentModel=${input.contentModel}`
        );
        try {
            const contentId = await this.createContentModel(input, revisionId);
            await this.createSources(input.sources, claimId);
            if (!input.date) {
                throw new BadRequestException("date is required");
            }
            const [row] = await this.db
                .insert(claimRevision)
                .values({
                    id: revisionId,
                    title: input.title,
                    slug: input.slug,
                    contentId,
                    contentModel: input.contentModel,
                    date: new Date(input.date),
                    claimId: String(claimId),
                    personalityIds: (input.personalities ?? []).map(String),
                })
                .returning();
            this.logger.log(
                `Claim revision saved — claimId=${claimId} revisionId=${row.id} contentId=${row.contentId}`
            );
            return toClaimRevisionEntity(row);
        } catch (error) {
            const err = error as Error;
            this.logger.error(
                `Failed to create claim revision — claimId=${claimId} contentModel=${input.contentModel}: ${err.message}`,
                err.stack
            );
            throw error;
        }
    }

    async findAll({
        searchText,
        pageSize,
        skippedDocuments,
        nameSpace,
    }: IFindAllOptions): Promise<{
        totalRows: number;
        processedRevisions: any[];
    }> {
        const configured = Number(
            this.configService.get<number>("db.postgres.fuzzy_threshold")
        );
        const threshold = Number.isFinite(configured) ? configured : 0.3;
        const where = and(
            eq(claimRevision.isDeleted, false),
            eq(claim.isHidden, false),
            eq(claim.isDeleted, false),
            eq(claim.nameSpace, nameSpace ?? ""),
            sql`NOT EXISTS (SELECT 1 FROM ${personality} p WHERE p.id = ANY(${claimRevision.personalityIds}) AND (p.is_hidden = true OR p.is_deleted = true))`,
            sql`${claimRevision.title} % ${searchText}`
        );

        const { rows, totalRows } = await this.db.transaction(async (tx) => {
            await tx.execute(
                sql.raw(`SET LOCAL pg_trgm.similarity_threshold = ${threshold}`)
            );
            const rows = await tx
                .select({
                    _id: claimRevision.id,
                    title: claimRevision.title,
                    contentModel: claimRevision.contentModel,
                    slug: claimRevision.slug,
                    date: claimRevision.date,
                    personalityIds: claimRevision.personalityIds,
                })
                .from(claimRevision)
                .innerJoin(claim, eq(claim.id, claimRevision.claimId))
                .where(where)
                .orderBy(
                    sql`similarity(${claimRevision.title}, ${searchText}) DESC`,
                    asc(claimRevision.id)
                )
                .offset(skippedDocuments ?? 0)
                .limit(pageSize);
            const [{ c: totalRows }] = await tx
                .select({ c: sql<number>`count(*)::int` })
                .from(claimRevision)
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
        const byId = new Map(personalities.map((p) => [p.id, p]));

        return {
            totalRows,
            processedRevisions: rows.map(({ personalityIds, ...row }) => ({
                ...row,
                personality: personalityIds
                    .map((id) => byId.get(id))
                    .filter((p) => !!p)
                    .map((p) => ({ slug: p.slug, name: p.name })),
            })),
        };
    }

    async getByContentId(
        contentId: ClaimContentRef
    ): Promise<IClaimRevision | null> {
        const [row] = await this.db
            .select()
            .from(claimRevision)
            .where(eq(claimRevision.contentId, String(contentId)))
            .limit(1);
        return row ? toClaimRevisionEntity(row) : null;
    }

    private async populate(row: ClaimRevisionRow): Promise<IClaimRevision> {
        const [personalities, content] = await Promise.all([
            row.personalityIds.length > 0
                ? this.db
                      .select()
                      .from(personality)
                      .where(inArray(personality.id, row.personalityIds))
                : Promise.resolve([]),
            loadContentTree(this.db, row.contentModel, row.contentId),
        ]);
        const byId = new Map(
            personalities.map((p) => [p.id, toPersonalityEntity(p)])
        );
        return toClaimRevisionEntity(row, {
            personalities: row.personalityIds
                .map((id) => byId.get(id))
                .filter((p) => !!p),
            content,
        });
    }

    private async createContentModel(
        input: Record<string, any>,
        revisionId: string
    ): Promise<string> {
        switch (input.contentModel) {
            case ContentModelEnum.Speech:
                return String(
                    (await this.parserService.parse(input.content, revisionId))
                        ._id
                );
            case ContentModelEnum.Unattributed:
                return String(
                    (
                        await this.parserService.parse(
                            input.content,
                            revisionId,
                            null,
                            input.contentModel
                        )
                    )._id
                );
            case ContentModelEnum.Image:
            case ContentModelEnum.Debate:
                throw new NotImplementedError(
                    "postgres",
                    `create(contentModel=${input.contentModel})`
                );
            default:
                throw new BadRequestException(
                    `${input.contentModel} is not a valid claim type.`
                );
        }
    }

    private async createSources(sources: string[] | undefined, claimId: any) {
        if (!Array.isArray(sources)) return;
        await sources.reduce(
            (previous, href) =>
                previous.then(() => this.createSource(href, claimId)),
            Promise.resolve()
        );
    }

    private async createSource(href: string, claimId: any) {
        const existing = await this.sourceService.getSourceByHref(href);
        if (existing) {
            void this.sourceService.updateTargetId(existing._id, claimId);
        } else {
            await this.sourceService.create({
                href,
                targetId: claimId,
                targetModel: "Claim",
            });
        }
    }
}
