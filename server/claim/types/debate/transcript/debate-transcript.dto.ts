import { z } from "zod";
import {
    entityId,
    isoDateTime,
    nonEmptyText,
    objectId,
} from "../../../../../lib/schemas";
import { TranscriptTurnStatus } from "../schemas/debate.schema";

export const DEBATE_TRANSCRIPT_MAX_TURNS = 50;
const TURN_TEXT_MAX = 20_000;

const personality = entityId.meta({
    description: "Speaker. Must be one of the debate's personalities.",
});
const turnText = nonEmptyText(TURN_TEXT_MAX).meta({
    description: "Transcript text of the turn. Parsed into sentences.",
});

const uniqueValues = (values: unknown[]) =>
    new Set(values).size === values.length;

const DebateTranscriptTurnSchema = z.strictObject({
    personality,
    text: turnText,
    externalId: nonEmptyText(200).optional().meta({
        description:
            "Caller-side id of the turn. A turn whose externalId is already on the debate is skipped.",
    }),
    startedAt: isoDateTime.optional().meta({
        description: "When the turn started in the source recording.",
    }),
    checkability: z.number().int().min(0).max(100).optional().meta({
        description:
            "Transcriber's 0-100 score of how checkable the turn is for a fact-checker. A triage signal, not a verdict. Omit when there is no score.",
    }),
});

export const AppendDebateTranscriptSchema = z.strictObject({
    turns: z
        .array(DebateTranscriptTurnSchema)
        .min(1)
        .max(DEBATE_TRANSCRIPT_MAX_TURNS)
        .refine(
            (turns) =>
                uniqueValues(
                    turns
                        .map((turn) => turn.externalId)
                        .filter((id) => id !== undefined)
                ),
            { error: "externalId must be unique within a request" }
        )
        .meta({
            description: "Turns added to the debate as drafts, in array order.",
        }),
    isLive: z.boolean().optional(),
});
export type AppendDebateTranscriptDto = z.output<
    typeof AppendDebateTranscriptSchema
>;

export const ListTranscriptTurnsQuerySchema = z.object({
    status: z.enum(TranscriptTurnStatus).optional(),
});
export type ListTranscriptTurnsQueryDto = z.output<
    typeof ListTranscriptTurnsQuerySchema
>;

export const EditTranscriptTurnSchema = z
    .strictObject({
        text: turnText.optional(),
        personality: personality.optional(),
    })
    .refine((body) => body.text !== undefined || body.personality, {
        error: "Send text, personality or both",
    });
export type EditTranscriptTurnDto = z.output<typeof EditTranscriptTurnSchema>;

export const ReviewTranscriptTurnsSchema = z.strictObject({
    turnIds: z
        .array(objectId)
        .min(1)
        .max(DEBATE_TRANSCRIPT_MAX_TURNS)
        .refine(uniqueValues, { error: "turnIds must be unique" }),
});
export type ReviewTranscriptTurnsDto = z.output<
    typeof ReviewTranscriptTurnsSchema
>;
