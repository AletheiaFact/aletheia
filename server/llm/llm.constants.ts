/**
 * Default chat-model parameters used when the `llm` config block does not
 * override them. These preserve the values previously hardcoded in the
 * (now removed) `server/copilot/openAI.constants.ts` enum.
 *
 * NOTE: there is intentionally NO default embeddings model. Omitting the model
 * lets LangChain use its built-in default, keeping newly generated embedding
 * vectors comparable with vectors already stored in the database.
 */
export const LLM_DEFAULTS = {
    chatModel: "gpt-5-mini-2025-08-07",
    temperature: 1,
} as const;
