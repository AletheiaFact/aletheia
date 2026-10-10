import { eq, inArray } from "drizzle-orm";
import type { DrizzleClient } from "../../database/postgres/connection";
import { orderedBy } from "../../database/postgres/ordered-by";
import { NotImplementedError } from "../../database/errors";
import { ContentModelEnum } from "../../types/enums";
import type {
    IParagraph,
    ISentence,
    ISpeech,
    IUnattributed,
} from "../../interfaces/claim-content.interface";
import { sentence } from "../types/sentence/postgres/schema/sentence.schema";
import { paragraph } from "../types/paragraph/postgres/schema/paragraph.schema";
import { speech } from "../types/speech/postgres/schema/speech.schema";
import { unattributed } from "../types/unattributed/postgres/schema/unattributed.schema";
import type { SpeechRow } from "../types/speech/postgres/schema/speech.schema";
import type { UnattributedRow } from "../types/unattributed/postgres/schema/unattributed.schema";
import {
    toParagraphEntity,
    toSentenceEntity,
    toSpeechEntity,
    toUnattributedEntity,
} from "./content.entity";

export async function loadSentences(
    db: DrizzleClient,
    ids: string[]
): Promise<ISentence[]> {
    if (ids.length === 0) return [];
    const rows = await db
        .select()
        .from(sentence)
        .where(inArray(sentence.id, ids));
    return orderedBy(rows, ids).map(toSentenceEntity);
}

export async function loadParagraphTrees(
    db: DrizzleClient,
    ids: string[]
): Promise<IParagraph[]> {
    if (ids.length === 0) return [];
    const rows = orderedBy(
        await db.select().from(paragraph).where(inArray(paragraph.id, ids)),
        ids
    );
    const sentenceIds = rows.flatMap((r) => r.contentIds);
    const sentences = await loadSentences(db, sentenceIds);
    const byId = new Map(sentences.map((s) => [String(s._id), s]));
    return rows.map((r) =>
        toParagraphEntity(
            r,
            r.contentIds
                .map((id) => byId.get(id))
                .filter((s): s is ISentence => !!s)
        )
    );
}

export async function loadSpeechTree(
    db: DrizzleClient,
    row: SpeechRow
): Promise<ISpeech> {
    return toSpeechEntity(row, await loadParagraphTrees(db, row.contentIds));
}

export async function loadUnattributedTree(
    db: DrizzleClient,
    row: UnattributedRow
): Promise<IUnattributed> {
    return toUnattributedEntity(
        row,
        await loadParagraphTrees(db, row.contentIds)
    );
}

/**
 * The Mongo `content` virtual on a claim revision: an array holding the one
 * content document (speech / unattributed / image / debate), populated down
 * to the sentences. Empty when the content row is missing.
 */
export async function loadContentTree(
    db: DrizzleClient,
    contentModel: string,
    contentId: string
): Promise<any[]> {
    switch (contentModel) {
        case ContentModelEnum.Speech: {
            const [row] = await db
                .select()
                .from(speech)
                .where(eq(speech.id, contentId))
                .limit(1);
            return row ? [await loadSpeechTree(db, row)] : [];
        }
        case ContentModelEnum.Unattributed: {
            const [row] = await db
                .select()
                .from(unattributed)
                .where(eq(unattributed.id, contentId))
                .limit(1);
            return row ? [await loadUnattributedTree(db, row)] : [];
        }
        default:
            throw new NotImplementedError(
                "postgres",
                `content(contentModel=${contentModel})`
            );
    }
}
