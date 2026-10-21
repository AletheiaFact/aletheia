import { randomUUID } from "crypto";
import type { ISourceService } from "../interfaces/source.service.interface";
import { PostgresClaimService } from "../claim/postgres/claim.service";
import { PostgresClaimRevisionService } from "../claim/claim-revision/postgres/claim-revision.service";
import { PostgresSentenceService } from "../claim/types/sentence/postgres/sentence.service";
import { PostgresParagraphService } from "../claim/types/paragraph/postgres/paragraph.service";
import { PostgresSpeechService } from "../claim/types/speech/postgres/speech.service";
import { PostgresUnattributedService } from "../claim/types/unattributed/postgres/unattributed.service";
import { PostgresReportService } from "../report/postgres/report.service";
import { PostgresSourceService } from "../source/postgres/source.service";
import { PostgresGroupService } from "../group/postgres/group.service";
import { ParserService } from "../claim/parser/parser.service";
import { SentenceHashService } from "../claim/admin-editor/sentence-hash.service";
import { UtilService } from "../util";
import { Roles } from "../auth/ability/ability.factory";
import { deriveSlug } from "../personality/shared/personality.rules";
import { personality } from "../personality/postgres/schema/personality.schema";
import type { DrizzleClient } from "../database/postgres/connection";

// Specs hand in the pglite client; the services only use the shared query surface.
type TestDrizzle = DrizzleClient;

export const fuzzyConfigStub = {
    get: (key: string) =>
        key === "db.postgres.fuzzy_threshold" ? 0.3 : undefined,
} as any;

export const adminRequest = (userId: string) =>
    ({
        user: { _id: userId, role: { main: Roles.Admin } },
        params: {},
        query: {},
    } as any);

/** The claim family wired by hand the way the modules do, minus Nest. */
export function buildPostgresClaimStack(
    db: TestDrizzle,
    reportSourceService: ISourceService,
    request = adminRequest(randomUUID())
) {
    const sourceService = new PostgresSourceService(db);
    const groupService = new PostgresGroupService(db);
    const reportService = new PostgresReportService(db, reportSourceService);
    const sentenceService = new PostgresSentenceService(
        db,
        reportService,
        fuzzyConfigStub
    );
    const speechService = new PostgresSpeechService(db);
    const parser = new ParserService(
        speechService,
        new PostgresParagraphService(db),
        sentenceService,
        new PostgresUnattributedService(db),
        new SentenceHashService()
    );
    const revisionService = new PostgresClaimRevisionService(
        db,
        sourceService,
        parser,
        fuzzyConfigStub
    );
    const claimService = new PostgresClaimService(
        request,
        db,
        revisionService,
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
    };
}

export async function seedPostgresPersonality(
    db: TestDrizzle,
    name: string,
    overrides: { isHidden?: boolean } = {}
) {
    const [row] = await db
        .insert(personality)
        .values({
            name,
            slug: deriveSlug(name),
            description: `Personality: ${name}`,
            ...overrides,
        })
        .returning();
    return { ...row, _id: row.id };
}
