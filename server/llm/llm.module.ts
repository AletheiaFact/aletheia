import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { LLM_PROVIDER, EMBEDDINGS_PROVIDER } from "./llm.tokens";
import { OpenAILLMProvider } from "./providers/openai.llm-provider";
import { OpenAIEmbeddingsProvider } from "./providers/openai.embeddings-provider";

/**
 * Global module exposing the LLM/embeddings provider abstraction.
 *
 * The token bindings are the single seam a deployer changes to swap providers.
 * The default implementations target any OpenAI-compatible endpoint (configure
 * `llm.base_url`).
 */
@Global()
@Module({
    imports: [ConfigModule],
    providers: [
        { provide: LLM_PROVIDER, useClass: OpenAILLMProvider },
        { provide: EMBEDDINGS_PROVIDER, useClass: OpenAIEmbeddingsProvider },
    ],
    exports: [LLM_PROVIDER, EMBEDDINGS_PROVIDER],
})
export class LlmModule {}
