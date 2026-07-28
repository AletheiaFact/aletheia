import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { OpenAIEmbeddings } from "@langchain/openai";
import type { Embeddings } from "@langchain/core/embeddings";
import type {
    EmbeddingsProvider,
    ResolvedEmbeddingsConfig,
} from "../llm.types";

@Injectable()
export class OpenAIEmbeddingsProvider implements EmbeddingsProvider {
    constructor(private readonly configService: ConfigService) {}

    private resolveApiKey(): string | undefined {
        return (
            this.configService.get<string>("llm.api_key") ??
            this.configService.get<string>("openai.api_key") ??
            process.env.OPENAI_API_KEY
        );
    }

    /**
     * Resolves embeddings config. The model is intentionally left undefined
     * unless explicitly configured, so LangChain's default model is preserved
     * and stored embedding vectors remain comparable.
     */
    resolveEmbeddingsConfig(): ResolvedEmbeddingsConfig {
        return {
            apiKey: this.resolveApiKey(),
            model:
                this.configService.get<string>("llm.embeddings_model") ||
                undefined,
            baseURL:
                this.configService.get<string>("llm.base_url") || undefined,
        };
    }

    /**
     * Builds a LangChain Embeddings client for any OpenAI-compatible endpoint.
     * Fails fast when neither an API key nor a base_url is configured.
     */
    getEmbeddings(): Embeddings {
        const cfg = this.resolveEmbeddingsConfig();
        if (!cfg.apiKey && !cfg.baseURL) {
            throw new Error(
                "Embeddings are not configured: set llm.api_key / openai.api_key / OPENAI_API_KEY, or an llm.base_url for a keyless local endpoint."
            );
        }
        return new OpenAIEmbeddings({
            apiKey: cfg.apiKey,
            ...(cfg.model ? { model: cfg.model } : {}),
            configuration: cfg.baseURL ? { baseURL: cfg.baseURL } : undefined,
        });
    }
}
