import {
    BadRequestException,
    ConflictException,
    Injectable,
} from "@nestjs/common";
import { SentenceOpDto } from "./dto/sentence-op.dto";

export interface PreviousSentenceSnapshot {
    sentenceId: string;
    dataHash: string;
    text: string;
    position: number;
    paragraphDataHash: string;
    sentenceSequence: number;
}

export interface ClassifiedSentenceOp {
    intent: "edit" | "noop" | "delete";
    sourceSentenceIds: string[];
    sourceDataHashes: string[];
    newTexts: string[];
}

// Validates admin-submitted per-sentence intents against the existing claim
// structure. Zod handles shape + per-variant required fields at the
// controller boundary; this service enforces semantic rules that depend on
// existing data: source sentence must exist, edit text must actually differ,
// no sentence referenced by multiple ops. Whether a sentence may be deleted
// depends on its reviews and its speech, so AdminEditorService checks that.
@Injectable()
export class DiffValidatorService {
    classifyForEditOnly(
        previousSentences: PreviousSentenceSnapshot[],
        sentenceOps: SentenceOpDto[]
    ): ClassifiedSentenceOp[] {
        const byId = new Map<string, PreviousSentenceSnapshot>();
        for (const s of previousSentences) byId.set(s.sentenceId, s);

        const claimedIds = new Set<string>();
        const result: ClassifiedSentenceOp[] = [];

        for (const op of sentenceOps) {
            const snap = byId.get(op.sourceSentenceId);
            if (!snap) {
                // The editor's view is stale: another user replaced or
                // deleted this sentence (a debate keeps its revision, so the
                // baseRevisionId check does not catch it).
                throw new ConflictException({
                    statusCode: 409,
                    message: "Sentence no longer exists in the claim",
                    errorCode: "sentence-not-found",
                });
            }
            if (claimedIds.has(op.sourceSentenceId)) {
                throw new BadRequestException({
                    statusCode: 400,
                    message: "A sentence is referenced by multiple operations",
                    errorCode: "intent-mismatch",
                });
            }
            claimedIds.add(op.sourceSentenceId);

            if (op.intent === "noop" || op.intent === "delete") {
                result.push({
                    intent: op.intent,
                    sourceSentenceIds: [op.sourceSentenceId],
                    sourceDataHashes: [snap.dataHash],
                    newTexts: [],
                });
                continue;
            }

            const trimmed = op.newText.trim();
            if (trimmed === snap.text.trim()) {
                throw new BadRequestException({
                    statusCode: 400,
                    message: "An edit op has identical text",
                    errorCode: "intent-mismatch",
                });
            }
            result.push({
                intent: "edit",
                sourceSentenceIds: [op.sourceSentenceId],
                sourceDataHashes: [snap.dataHash],
                newTexts: [trimmed],
            });
        }

        return result;
    }
}
