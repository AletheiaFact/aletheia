import {
    ConflictException,
    Inject,
    Injectable,
    Logger,
    NotFoundException,
    Scope,
} from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { randomUUID } from "crypto";
import { and, eq, sql, SQL } from "drizzle-orm";
import type {
    ClaimListQuery,
    IClaimService,
} from "../../interfaces/claim.service.interface";
import type { IClaim } from "../../interfaces/claim.interface";
import type { IClaimRevisionService } from "../../interfaces/claim-revision.service.interface";
import type { IGroupService } from "../../interfaces/group.service.interface";
import type { BaseRequest } from "../../types";
import { DRIZZLE } from "../../database/postgres/postgres.provider";
import type { DrizzleClient } from "../../database/postgres/connection";
import { NotImplementedError } from "../../database/errors";
import { rethrowUniqueViolation } from "../../database/postgres/unique-violation";
import { UtilService } from "../../util";
import { NameSpaceEnum } from "../../auth/name-space/schemas/name-space.schema";
import { deriveClaimSlug } from "../shared/claim.rules";
import { claim } from "./schema/claim.schema";
import type { ClaimRow } from "./schema/claim.schema";
import { claimRevision } from "../claim-revision/postgres/schema/claim-revision.schema";
import { personality } from "../../personality/postgres/schema/personality.schema";
import { source } from "../../source/postgres/schema/source.schema";
import { toPersonalityEntity } from "../../personality/postgres/personality.service";
import { loadContentTree } from "./content-tree";

export function toClaimEntity(
    row: ClaimRow,
    populated: {
        personalities?: any[];
        latestRevision?: any;
        sources?: any[];
    } = {}
): IClaim {
    const {
        personalityIds,
        latestRevisionId,
        groupId,
        legacyObjectId,
        deletedAt,
        ...rest
    } = row;
    return {
        ...rest,
        _id: row.id,
        personalities: populated.personalities ?? personalityIds,
        latestRevision: populated.latestRevision ?? latestRevisionId,
        group: groupId ?? undefined,
        ...(populated.sources !== undefined
            ? { sources: populated.sources }
            : {}),
    } as IClaim;
}

type ClaimMatch = {
    _id?: string;
    slug?: string;
    personalities?: string;
    nameSpace?: string;
    isHidden?: boolean;
};

const MATCH_KEYS = ["_id", "slug", "personalities", "nameSpace", "isHidden"];

@Injectable({ scope: Scope.REQUEST })
export class PostgresClaimService implements IClaimService {
    private readonly logger = new Logger(PostgresClaimService.name);

    constructor(
        @Inject(REQUEST) private req: BaseRequest,
        @Inject(DRIZZLE) private readonly db: DrizzleClient,
        @Inject("ClaimRevisionService")
        private claimRevisionService: IClaimRevisionService,
        private util: UtilService,
        @Inject("GroupService") private groupService: IGroupService
    ) {}

    listAll(
        _page: number,
        _pageSize: number,
        _order: string,
        _query: ClaimListQuery
    ): Promise<{ data: any[]; total: number }> {
        return Promise.reject(
            new NotImplementedError("postgres", "listAll(postProcess)")
        );
    }

    async count(query: ClaimListQuery = {}): Promise<number> {
        const [{ c }] = await this.db
            .select({ c: sql<number>`count(*)::int` })
            .from(claim)
            .where(this.whereFor(query, { softDeleteFilter: false }));
        return c;
    }

    async create(input: Record<string, any>): Promise<any> {
        const nameSpace =
            typeof input.nameSpace === "string"
                ? input.nameSpace
                : NameSpaceEnum.Main;
        const slug = deriveClaimSlug(input.title);
        const [existing] = await this.db
            .select({ id: claim.id })
            .from(claim)
            .where(
                and(
                    eq(claim.slug, slug),
                    eq(claim.nameSpace, nameSpace),
                    eq(claim.isDeleted, false)
                )
            )
            .limit(1);
        if (existing) {
            this.logger.warn(
                `Duplicate claim title — slug=${slug} nameSpace=${nameSpace} existingId=${existing.id}`
            );
            throw new ConflictException(
                "There is already a claim with this title."
            );
        }

        const claimId = randomUUID();
        const revision = await this.claimRevisionService.create(claimId, {
            ...input,
            slug,
        });

        let row: ClaimRow;
        try {
            [row] = await this.db
                .insert(claim)
                .values({
                    id: claimId,
                    slug: revision.slug,
                    personalityIds: (input.personalities ?? []).map(String),
                    latestRevisionId: String(revision._id),
                    isHidden: false,
                    nameSpace,
                    groupId: input.group ? String(input.group) : null,
                })
                .returning();
        } catch (error) {
            rethrowUniqueViolation(error, "claim");
        }

        if (input.group) {
            await this.groupService.updateWithTargetId(
                String(input.group),
                claimId
            );
        }

        this.logger.log(
            `Claim created successfully — id=${claimId} contentModel=${input.contentModel} slug=${row.slug} revision=${revision._id}`
        );
        return { ...revision, ...this.toEntity(row) };
    }

    update(
        _claimId: string,
        _claimRevisionUpdate: Record<string, any>
    ): Promise<any> {
        return Promise.reject(new NotImplementedError("postgres", "update"));
    }

    async delete(claimId: string): Promise<any> {
        await this.getClaim(
            this.util.getParamsBasedOnUserRole(
                { _id: claimId, nameSpace: NameSpaceEnum.Main },
                this.req
            ) as ClaimMatch,
            undefined,
            false,
            false
        );
        const rows = await this.db
            .update(claim)
            .set({
                isDeleted: true,
                deletedAt: new Date(),
                updatedAt: new Date(),
            })
            .where(and(eq(claim.id, claimId), eq(claim.isDeleted, false)))
            .returning({ id: claim.id });
        return { modifiedCount: rows.length };
    }

    async hideOrUnhideClaim(
        claimId: string,
        isHidden: boolean,
        _description?: string
    ): Promise<any> {
        const rows = await this.db
            .update(claim)
            .set({ isHidden, updatedAt: new Date() })
            .where(and(eq(claim.id, claimId), eq(claim.isDeleted, false)))
            .returning({ id: claim.id });
        if (rows.length === 0) {
            throw new NotFoundException("Claim not found");
        }
        return { modifiedCount: rows.length };
    }

    getById(claimId: string, nameSpace: string = NameSpaceEnum.Main) {
        return this.getClaim(
            this.util.getParamsBasedOnUserRole(
                { _id: claimId, nameSpace },
                this.req
            ) as ClaimMatch
        );
    }

    getByClaimSlug(
        claimSlug: string,
        revisionId: string | undefined = undefined,
        population = true
    ) {
        const nameSpace = this.req.params.namespace || NameSpaceEnum.Main;
        return this.getClaim(
            this.util.getParamsBasedOnUserRole(
                { slug: claimSlug, nameSpace },
                this.req
            ) as ClaimMatch,
            revisionId,
            true,
            population
        );
    }

    async getByPersonalityId(
        personalityId: string,
        nameSpace = NameSpaceEnum.Main
    ): Promise<Array<Pick<IClaim, "_id">>> {
        const match = this.util.getParamsBasedOnUserRole(
            { personalities: personalityId, nameSpace },
            this.req
        ) as ClaimMatch;
        const rows = await this.db
            .select({ id: claim.id })
            .from(claim)
            .where(this.whereFor(match));
        return rows.map((r) => ({ _id: r.id }));
    }

    getByPersonalityIdAndClaimSlug(
        personalityId: string,
        claimSlug: string,
        revisionId: string | undefined = undefined,
        population = true
    ) {
        const nameSpace = this.req.params.namespace || NameSpaceEnum.Main;
        return this.getClaim(
            this.util.getParamsBasedOnUserRole(
                { personalities: personalityId, slug: claimSlug, nameSpace },
                this.req
            ) as ClaimMatch,
            revisionId,
            true,
            population
        );
    }

    private toEntity(
        row: ClaimRow,
        populated?: Parameters<typeof toClaimEntity>[1]
    ): IClaim {
        return toClaimEntity(row, populated);
    }

    private whereFor(
        match: Record<string, any>,
        { softDeleteFilter = true } = {}
    ): SQL | undefined {
        const unsupported = Object.keys(match).filter(
            (k) => !MATCH_KEYS.includes(k) && k !== "isDeleted"
        );
        if (unsupported.length > 0) {
            throw new NotImplementedError(
                "postgres",
                `claim query(${unsupported.join(",")})`
            );
        }
        const conditions: SQL[] = [];
        if (match._id !== undefined) conditions.push(eq(claim.id, match._id));
        if (match.slug !== undefined)
            conditions.push(eq(claim.slug, match.slug));
        if (match.nameSpace !== undefined)
            conditions.push(eq(claim.nameSpace, match.nameSpace));
        if (match.isHidden !== undefined)
            conditions.push(eq(claim.isHidden, Boolean(match.isHidden)));
        if (match.personalities !== undefined)
            conditions.push(
                sql`${claim.personalityIds} @> ARRAY[${String(
                    match.personalities
                )}]::uuid[]`
            );
        if (match.isDeleted !== undefined) {
            conditions.push(eq(claim.isDeleted, Boolean(match.isDeleted)));
        } else if (softDeleteFilter) {
            conditions.push(eq(claim.isDeleted, false));
        }
        return and(...conditions);
    }

    private async getClaim(
        match: ClaimMatch,
        revisionId: string | undefined = undefined,
        postprocess = true,
        population = true
    ) {
        let row: ClaimRow | undefined;
        try {
            [row] = await this.db
                .select()
                .from(claim)
                .where(this.whereFor(match))
                .limit(1);
        } catch (error) {
            if (isInvalidUuidError(error)) throw new NotFoundException();
            throw error;
        }
        if (!row) throw new NotFoundException();

        const sources = await this.loadSources(row.id);

        if (revisionId) {
            const revision = await this.claimRevisionService.getRevision({
                _id: revisionId,
                claimId: row.id,
            });
            if (!revision) throw new NotFoundException();
            const { latestRevision, ...entity } = this.toEntity(row, {
                sources,
            });
            const merged = { ...entity, ...revision, _id: row.id };
            return postprocess && population
                ? this.postProcess(merged)
                : merged;
        }

        const [revisionRow] = await this.db
            .select()
            .from(claimRevision)
            .where(eq(claimRevision.id, row.latestRevisionId))
            .limit(1);

        if (population) {
            const personalities = await this.loadPersonalities(
                row.personalityIds
            );
            const latestRevision = revisionRow
                ? {
                      ...revisionRow,
                      _id: revisionRow.id,
                      personalities: revisionRow.personalityIds,
                      content: await loadContentTree(
                          this.db,
                          revisionRow.contentModel,
                          revisionRow.contentId
                      ),
                  }
                : undefined;
            const entity = this.toEntity(row, {
                personalities: personalities.map(toPersonalityEntity),
                latestRevision,
                sources,
            });
            return postprocess ? this.postProcess(entity) : entity;
        }

        const personalities = await this.loadPersonalities(row.personalityIds);
        const latestRevision = revisionRow
            ? {
                  _id: revisionRow.id,
                  title: revisionRow.title,
                  contentModel: revisionRow.contentModel,
                  date: revisionRow.date,
                  slug: revisionRow.slug,
              }
            : undefined;
        return {
            ...latestRevision,
            _id: row.id,
            personalities: personalities.map((p) => ({
                _id: p.id,
                name: p.name,
            })),
            isHidden: row.isHidden,
            sources,
            latestRevision: undefined,
        };
    }

    private async loadPersonalities(ids: string[]) {
        if (ids.length === 0) return [];
        const rows = await this.db
            .select()
            .from(personality)
            .where(
                sql`${personality.id} = ANY(${sql`ARRAY[${sql.join(
                    ids.map((id) => sql`${id}`),
                    sql`, `
                )}]::uuid[]`})`
            );
        const byId = new Map(rows.map((r) => [r.id, r]));
        return ids.map((id) => byId.get(id)).filter((r) => !!r);
    }

    private async loadSources(claimId: string) {
        const rows = await this.db
            .select({
                id: source.id,
                href: source.href,
                targetIds: source.targetIds,
            })
            .from(source)
            .where(sql`${source.targetIds} @> ARRAY[${claimId}]::uuid[]`);
        return rows.map((r) => ({
            _id: r.id,
            href: r.href,
            targetId: r.targetIds,
        }));
    }

    private postProcess(_claim: any): Promise<any> {
        return Promise.reject(
            new NotImplementedError(
                "postgres",
                "postProcess(claim-review, review-task)"
            )
        );
    }
}

function isInvalidUuidError(error: unknown): boolean {
    const e = error as any;
    return [e, e?.cause].some(
        (c) =>
            c &&
            (c.code === "22P02" ||
                /invalid input syntax for type uuid/.test(
                    String(c.message ?? "")
                ))
    );
}
