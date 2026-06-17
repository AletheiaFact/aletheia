import { BadRequestException, Injectable } from "@nestjs/common";
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
    intent: "edit" | "noop";
    sourceSentenceIds: string[];
    sourceDataHashes: string[];
    newTexts: string[];
}

// Validates admin-submitted per-sentence intents against the existing claim
// structure. Zod handles shape + per-variant required fields at the
// controller boundary; this service enforces semantic rules that depend on
// existing data: source sentence must exist, edit text must actually differ,
// no sentence referenced by multiple ops.
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
                throw new BadRequestException({
                    statusCode: 400,
                    message: `Sentence ${op.sourceSentenceId} not found in claim`,
                    errorCode: "intent-mismatch",
                });
            }
            if (claimedIds.has(op.sourceSentenceId)) {
                throw new BadRequestException({
                    statusCode: 400,
                    message: `Sentence ${op.sourceSentenceId} referenced by multiple operations`,
                    errorCode: "intent-mismatch",
                });
            }
            claimedIds.add(op.sourceSentenceId);

            if (op.intent === "noop") {
                result.push({
                    intent: "noop",
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
                    message: `edit op for sentence ${op.sourceSentenceId} has identical text`,
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
