import type {
    IParagraph,
    ISentence,
    ISpeech,
    IUnattributed,
} from "../../interfaces/claim-content.interface";
import type { SentenceRow } from "../types/sentence/postgres/schema/sentence.schema";
import type { ParagraphRow } from "../types/paragraph/postgres/schema/paragraph.schema";
import type { SpeechRow } from "../types/speech/postgres/schema/speech.schema";
import type { UnattributedRow } from "../types/unattributed/postgres/schema/unattributed.schema";

// Mongo stores `isDraft` only on drafts and unsets it on approval, so the
// key is present only when it is true.
function draftFlag(isDraft: boolean) {
    return isDraft ? { isDraft: true } : {};
}

export function toSentenceEntity(row: SentenceRow): ISentence {
    const {
        dataHash,
        legacyObjectId,
        isDeleted,
        deletedAt,
        topics,
        isDraft,
        ...rest
    } = row;
    return {
        ...rest,
        ...draftFlag(isDraft),
        _id: row.id,
        data_hash: dataHash,
        topics: topics ?? undefined,
    } as ISentence;
}

export function toParagraphEntity(
    row: ParagraphRow,
    content?: ISentence[]
): IParagraph {
    const {
        dataHash,
        contentIds,
        legacyObjectId,
        isDeleted,
        deletedAt,
        ...rest
    } = row;
    return {
        ...rest,
        _id: row.id,
        data_hash: dataHash,
        content: content ?? contentIds,
    } as IParagraph;
}

export function toSpeechEntity(
    row: SpeechRow,
    content?: IParagraph[]
): ISpeech {
    const {
        contentIds,
        personalityId,
        legacyObjectId,
        isDeleted,
        deletedAt,
        isDraft,
        ...rest
    } = row;
    return {
        ...rest,
        ...draftFlag(isDraft),
        _id: row.id,
        content: content ?? contentIds,
        personality: personalityId ?? undefined,
    } as ISpeech;
}

export function toUnattributedEntity(
    row: UnattributedRow,
    content?: IParagraph[]
): IUnattributed {
    const { contentIds, legacyObjectId, isDeleted, deletedAt, ...rest } = row;
    return {
        ...rest,
        _id: row.id,
        content: content ?? contentIds,
    } as IUnattributed;
}
