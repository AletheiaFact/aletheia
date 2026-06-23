import { z } from "zod";

// Per-sentence operation intent submitted by the admin editor UI.
// Discriminated union — zod enforces per-variant required fields at the
// controller boundary. Currently supported intents: noop, edit.
export const SentenceOpSchema = z.discriminatedUnion("intent", [
    z.object({
        intent: z.literal("noop"),
        sourceSentenceId: z.string().min(1),
    }),
    z.object({
        intent: z.literal("edit"),
        sourceSentenceId: z.string().min(1),
        newText: z.string().trim().min(1),
    }),
]);

export type SentenceOpDto = z.infer<typeof SentenceOpSchema>;
export type SentenceOpIntent = SentenceOpDto["intent"];
