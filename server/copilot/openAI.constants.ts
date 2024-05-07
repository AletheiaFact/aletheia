/**
 * Enum for OpenAI configuration parameters.
 *
 * This enum stores specific configuration values related to OpenAI usage in the
 * application, helping in maintaining consistency and ease of updates.
 *
 * @enum openAI
 *
 * @member GPT_3_5_TURBO_1106 - Identifier for the specific OpenAI model version used.
 * @member BASIC_CHAT_OPENAI_TEMPERATURE - Controls the randomness in the model's responses,
 *                                         with a higher value resulting in more random responses.
 */
export enum openAI {
    GPT_3_5_TURBO_1106 = "gpt-3.5-turbo-1106",
    BASIC_CHAT_OPENAI_TEMPERATURE = 0.1,
}
