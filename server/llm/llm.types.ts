import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import type { Embeddings } from "@langchain/core/embeddings";

export interface ChatModelOptions {
    model?: string;
    temperature?: number;
}

export interface ResolvedChatConfig {
    apiKey?: string;
    model: string;
    temperature: number;
    baseURL?: string;
}

export interface ResolvedEmbeddingsConfig {
    apiKey?: string;
    model?: string;
    baseURL?: string;
}

export interface LLMProvider {
    /** Returns a LangChain chat model. Options override configured defaults. */
    createChatModel(options?: ChatModelOptions): BaseChatModel;
}

export interface EmbeddingsProvider {
    /** Returns a LangChain embeddings client. */
    getEmbeddings(): Embeddings;
}
