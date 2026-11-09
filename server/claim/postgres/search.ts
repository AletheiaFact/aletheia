import { ConfigService } from "@nestjs/config";
import { eq, inArray, sql, SQL } from "drizzle-orm";
import type { DrizzleClient } from "../../database/postgres/connection";
import { orderedBy } from "../../database/postgres/ordered-by";
import { claim } from "./schema/claim.schema";
import { claimRevision } from "../claim-revision/postgres/schema/claim-revision.schema";
import { personality } from "../../personality/postgres/schema/personality.schema";

const DEFAULT_FUZZY_THRESHOLD = 0.3;

type Tx = Parameters<Parameters<DrizzleClient["transaction"]>[0]>[0];

export function fuzzyThreshold(configService: ConfigService): number {
    const configured = Number(
        configService.get<number>("db.postgres.fuzzy_threshold")
    );
    return Number.isFinite(configured)
        ? Math.min(Math.max(configured, 0), 1)
        : DEFAULT_FUZZY_THRESHOLD;
}

export function setSimilarityThreshold(tx: Tx, threshold: number) {
    return tx.execute(
        sql.raw(`SET LOCAL pg_trgm.similarity_threshold = ${threshold}`)
    );
}

/**
 * The Mongo `getVisibilityMatch` for a joined claim revision: the claim is
 * visible in the namespace and none of the revision's personalities is hidden
 * or deleted.
 */
export function visibleRevisionConditions(
    nameSpace: string | undefined
): SQL[] {
    return [
        eq(claim.isHidden, false),
        eq(claim.isDeleted, false),
        eq(claim.nameSpace, nameSpace ?? ""),
        sql`NOT EXISTS (SELECT 1 FROM ${personality} p WHERE p.id = ANY(${claimRevision.personalityIds}) AND (p.is_hidden = true OR p.is_deleted = true))`,
    ];
}

export type PersonalitySummary = { slug: string; name: string };

/** Replaces each row's `personalityIds` with the `{ slug, name }` projection the search pages read. */
export async function attachPersonalitySummaries<
    T extends { personalityIds: string[] }
>(
    db: DrizzleClient,
    rows: T[]
): Promise<
    Array<Omit<T, "personalityIds"> & { personality: PersonalitySummary[] }>
> {
    const ids = [...new Set(rows.flatMap((r) => r.personalityIds))];
    const summaries =
        ids.length > 0
            ? await db
                  .select({
                      id: personality.id,
                      slug: personality.slug,
                      name: personality.name,
                  })
                  .from(personality)
                  .where(inArray(personality.id, ids))
            : [];
    return rows.map(({ personalityIds, ...row }) => ({
        ...row,
        personality: orderedBy(summaries, personalityIds).map(
            ({ slug, name }) => ({ slug, name })
        ),
    }));
}
