import {
    BadRequestException,
    Injectable,
    Inject,
    NotFoundException,
} from "@nestjs/common";
import type {
    ISourceService,
    SourceTargetRef,
} from "../../interfaces/source.service.interface";
import { ISource } from "../../interfaces/source.interface";
import { DRIZZLE } from "../../database/postgres/postgres.provider";
import type { DrizzleClient } from "../../database/postgres/connection";
import { NotImplementedError } from "../../database/errors";
import { rethrowUniqueViolation } from "../../database/postgres/unique-violation";
import { eq, and, sql, desc, asc, SQL } from "drizzle-orm";
import { deriveDataHash, isValidSourceHref } from "../shared/source.rules";
import { source } from "./schema/source.schema";
import type { SourceRow } from "./schema/source.schema";

@Injectable()
export class PostgresSourceService implements ISourceService {
    constructor(@Inject(DRIZZLE) private readonly db: DrizzleClient) {}

    /**
     * Boundary mapper (§2): raw row → the entity shape callers expect.
     * Exposes the Mongo-parity aliases the callers actually read —
     * `_id`, `data_hash`, `targetId`, `user` — alongside the native columns.
     * Never return a raw row cast `as ISource`.
     */
    private toEntity(row: SourceRow): ISource {
        return {
            ...row,
            _id: row.id,
            data_hash: row.dataHash,
            targetId: row.targetIds,
            user: row.userId,
        } as unknown as ISource;
    }

    /** SQLSTATE 23505 → neutral DuplicateKeyError (shared infra). */
    private rethrowMapped(error: unknown): never {
        rethrowUniqueViolation(error, "source");
    }

    /** Mongo-parity `sort({_id: order})`: insertion order via created_at. */
    private orderByFor(order: string | number): SQL[] {
        if (order === "asc" || order === "ascending" || order === 1) {
            return [asc(source.createdAt), asc(source.id)];
        }
        if (order === "desc" || order === "descending" || order === -1) {
            return [desc(source.createdAt), desc(source.id)];
        }
        throw new NotImplementedError("postgres", `sort(order=${order})`);
    }

    /** `props.classification` must exist (Mongo `$exists: true` filter). */
    private hasClassification(): SQL {
        return sql`${source.props} ? 'classification'`;
    }

    async listAll({
        page,
        pageSize,
        order,
        nameSpace,
    }: {
        page: number;
        pageSize: string;
        order: string;
        nameSpace: string;
    }): Promise<ISource[]> {
        const size = Number.parseInt(pageSize, 10);
        if (!Number.isFinite(size)) {
            throw new NotImplementedError("postgres", "listAll(pageSize=NaN)");
        }
        const rows = await this.db
            .select()
            .from(source)
            .where(
                and(
                    eq(source.nameSpace, nameSpace),
                    this.hasClassification(),
                    eq(source.isDeleted, false)
                )
            )
            .orderBy(...this.orderByFor(order))
            .offset(page * size)
            .limit(size);
        return rows.map((r) => this.toEntity(r));
    }

    async listAllDailySourceReviews(
        query: Record<string, any>
    ): Promise<ISource[]> {
        // Live caller (daily-report) sends { nameSpace } plus an optional
        // { "props.date": { $gt: Date } }. Anything else is unsupported —
        // fail loud, never silently ignore a filter (§1.5).
        const unsupportedKeys = Object.keys(query ?? {}).filter(
            (k) => k !== "nameSpace" && k !== "props.date"
        );
        if (unsupportedKeys.length > 0) {
            throw new NotImplementedError(
                "postgres",
                `listAllDailySourceReviews(query.${unsupportedKeys.join(
                    ",query."
                )})`
            );
        }
        const conditions: SQL[] = [
            this.hasClassification(),
            eq(source.isDeleted, false),
        ];
        if (query?.nameSpace !== undefined) {
            conditions.push(eq(source.nameSpace, query.nameSpace));
        }
        const dateFilter = query?.["props.date"];
        if (dateFilter !== undefined) {
            const gt = dateFilter?.$gt;
            const onlyGt =
                gt !== undefined &&
                Object.keys(dateFilter).every((k) => k === "$gt");
            if (!onlyGt) {
                throw new NotImplementedError(
                    "postgres",
                    "listAllDailySourceReviews(props.date operator)"
                );
            }
            conditions.push(
                sql`(${source.props}->>'date')::timestamptz > ${new Date(
                    gt
                ).toISOString()}`
            );
        }
        const rows = await this.db
            .select()
            .from(source)
            .where(and(...conditions));
        return rows.map((r) => this.toEntity(r));
    }

    async create(data: any): Promise<ISource> {
        if (!isValidSourceHref(data?.href)) {
            throw new BadRequestException("Invalid URL");
        }
        const dataHash = deriveDataHash(data.href);

        // Mongo parity: create() dedups on data_hash and returns the
        // existing source untouched.
        const existing = await this.findByDataHash(dataHash);
        if (existing) return this.toEntity(existing);

        const props = data.props?.date
            ? { ...data.props, date: new Date(data.props.date) }
            : data.props ?? null;

        try {
            const [row] = await this.db
                .insert(source)
                .values({
                    href: data.href,
                    props,
                    targetIds: data.targetId ? [String(data.targetId)] : [],
                    // Mongo fabricates a random ObjectId when data.user is
                    // absent (`new Types.ObjectId(undefined)`) — accidental;
                    // Postgres stores NULL instead (documented divergence).
                    userId: data.user ? String(data.user) : null,
                    dataHash,
                    nameSpace: data.nameSpace ?? undefined,
                })
                .returning();
            return this.toEntity(row);
        } catch (error) {
            this.rethrowMapped(error);
        }
    }

    async updateTargetId(
        sourceId: string,
        newTargetId: SourceTargetRef
    ): Promise<ISource> {
        const [row] = await this.db
            .select()
            .from(source)
            .where(eq(source.id, sourceId))
            .limit(1);
        if (!row) {
            throw new NotFoundException(`Source not found: ${sourceId}`);
        }
        // Mongo ObjectId instances stringify to their hex form; uuids pass
        // through (SourceTargetRef declares a meaningful toString).
        const newTargetIdStr = String(newTargetId);
        const [updated] = await this.db
            .update(source)
            .set({
                targetIds: [...row.targetIds, newTargetIdStr],
                updatedAt: new Date(),
            })
            .where(eq(source.id, sourceId))
            .returning();
        return this.toEntity(updated);
    }

    async getByTargetId(
        targetId: string,
        page: number,
        pageSize: number,
        order: string
    ): Promise<ISource[]> {
        const rows = await this.db
            .select()
            .from(source)
            .where(sql`${source.targetIds} @> ARRAY[${targetId}]::uuid[]`)
            .orderBy(...this.orderByFor(order))
            .offset(page * pageSize)
            .limit(pageSize);
        return rows.map((r) => this.toEntity(r));
    }

    find(_match: Record<string, any>): any {
        // Dead code on the Mongo side too: zero callers, and the Mongo
        // implementation queries a literal `match` field (broken). Kept on
        // the interface for surface parity; loud here.
        throw new NotImplementedError("postgres", "find");
    }

    async getSourceByHref(href: string): Promise<ISource | null> {
        const [row] = await this.db
            .select()
            .from(source)
            .where(eq(source.href, href))
            .limit(1);
        return row ? this.toEntity(row) : null;
    }

    async getById(sourceId: string): Promise<ISource | null> {
        const [row] = await this.db
            .select()
            .from(source)
            .where(eq(source.id, sourceId))
            .limit(1);
        if (!row) {
            // Mongo resolves null (callers then 200-empty/500); Postgres
            // keeps the better 404 — same documented divergence as
            // personality getById.
            throw new NotFoundException(`Source not found: ${sourceId}`);
        }
        return this.toEntity(row);
    }

    async getByDataHash(dataHash: string): Promise<ISource> {
        const row = await this.findByDataHash(dataHash);
        if (!row) {
            // Mongo parity: bare NotFoundException (no message).
            throw new NotFoundException();
        }
        return this.toEntity(row);
    }

    async update(dataHash: string, sourceBodyUpdate: any): Promise<ISource> {
        const row = await this.findByDataHash(dataHash);
        if (!row) throw new NotFoundException();

        // Mongo parity: Object.assign onto the doc, then save — non-schema
        // keys are silently stripped by the strict schema, props is replaced
        // whole (shallow merge), data_hash is NOT recomputed on href change,
        // and a scalar targetId is cast to a one-element array. data_hash IS
        // a Mongo schema key (Mongo would apply it) but rewriting the dedup
        // key through update() is not supported here — guard loud (§1.5).
        const body = sourceBodyUpdate ?? {};
        if (body.data_hash !== undefined) {
            throw new NotImplementedError("postgres", "update(data_hash)");
        }
        const patch: Record<string, any> = { updatedAt: new Date() };
        if (body.href !== undefined) patch.href = body.href;
        if (body.props !== undefined) patch.props = body.props;
        if (body.nameSpace !== undefined) patch.nameSpace = body.nameSpace;
        if (body.user !== undefined) patch.userId = String(body.user);
        if (body.targetId !== undefined) {
            patch.targetIds = Array.isArray(body.targetId)
                ? body.targetId.map(String)
                : [String(body.targetId)];
        }
        try {
            const [updated] = await this.db
                .update(source)
                .set(patch)
                .where(eq(source.id, row.id))
                .returning();
            return this.toEntity(updated);
        } catch (error) {
            this.rethrowMapped(error);
        }
    }

    async count(query: Record<string, any>): Promise<number> {
        // Live caller (source controller) sends { nameSpace }. Guard other
        // Mongo-shaped keys loudly (§1.5).
        const unsupportedKeys = Object.keys(query ?? {}).filter(
            (k) => k !== "nameSpace"
        );
        if (unsupportedKeys.length > 0) {
            throw new NotImplementedError(
                "postgres",
                `count(query.${unsupportedKeys.join(",query.")})`
            );
        }
        const conditions: SQL[] = [
            this.hasClassification(),
            eq(source.isDeleted, false),
        ];
        if (query?.nameSpace !== undefined) {
            conditions.push(eq(source.nameSpace, query.nameSpace));
        }
        const [{ c }] = await this.db
            .select({ c: sql<number>`count(*)::int` })
            .from(source)
            .where(and(...conditions));
        return c;
    }

    private async findByDataHash(dataHash: string): Promise<SourceRow | null> {
        const [row] = await this.db
            .select()
            .from(source)
            .where(
                and(eq(source.dataHash, dataHash), eq(source.isDeleted, false))
            )
            .limit(1);
        return row ?? null;
    }
}
