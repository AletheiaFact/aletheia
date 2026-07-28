import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ChatOpenAI } from "@langchain/openai";
import type { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { LLM_DEFAULTS } from "../llm.constants";
import type {
    ChatModelOptions,
    LLMProvider,
    ResolvedChatConfig,
} from "../llm.types";

@Injectable()
export class OpenAILLMProvider implements LLMProvider {
    constructor(private readonly configService: ConfigService) {}

    private resolveApiKey(): string | undefined {
        return (
            this.configService.get<string>("llm.api_key") ??
            this.configService.get<string>("openai.api_key") ??
            process.env.OPENAI_API_KEY
        );
    }

    private resolveBaseURL(): string | undefined {
        return this.configService.get<string>("llm.base_url") || undefined;
    }

    /**
     * Resolves chat model configuration from `llm.*` config keys, falling back to
     * `openai.api_key`, then `process.env.OPENAI_API_KEY`, then `LLM_DEFAULTS`.
     * @throws {Error} if `llm.temperature` is set but does not parse to a finite number
     */
    resolveChatConfig(): ResolvedChatConfig {
        const rawTemp = this.configService.get<string | number>(
            "llm.temperature"
        );
        let temperature: number = LLM_DEFAULTS.temperature;
        if (rawTemp !== undefined && rawTemp !== null) {
            const parsed = Number(rawTemp);
            if (!Number.isFinite(parsed)) {
                throw new Error(
                    `Invalid llm.temperature: "${rawTemp}" is not a number.`
                );
            }
            temperature = parsed;
        }
        return {
            apiKey: this.resolveApiKey(),
            model:
                this.configService.get<string>("llm.chat_model") ||
                LLM_DEFAULTS.chatModel,
            temperature,
            baseURL: this.resolveBaseURL(),
        };
    }

    /**
     * Builds a LangChain `ChatOpenAI` client from the resolved config, letting `options`
     * override the model/temperature. Works keyless when `llm.base_url` points at a
     * self-hosted OpenAI-compatible endpoint (e.g. Ollama, vLLM); throws otherwise if no
     * api key is configured.
     */
    createChatModel(options?: ChatModelOptions): BaseChatModel {
        const cfg = this.resolveChatConfig();
        if (!cfg.apiKey && !cfg.baseURL) {
            throw new Error(
                "LLM is not configured: set llm.api_key / openai.api_key / OPENAI_API_KEY, or an llm.base_url for a keyless local endpoint."
            );
        }
        return new ChatOpenAI({
            apiKey: cfg.apiKey,
            model: options?.model ?? cfg.model,
            temperature: options?.temperature ?? cfg.temperature,
            configuration: cfg.baseURL ? { baseURL: cfg.baseURL } : undefined,
        });
    }
}
