import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { ChatOpenAI } from "@langchain/openai";
import { OpenAILLMProvider } from "./openai.llm-provider";
import { LLM_DEFAULTS } from "../llm.constants";

/** Build a ConfigService whose get(key) reads from a plain map. */
function configFrom(values: Record<string, unknown>) {
    return {
        get: (key: string) => values[key],
    } as unknown as ConfigService;
}

describe("OpenAILLMProvider (Unit)", () => {
    async function build(values: Record<string, unknown>) {
        const moduleRef: TestingModule = await Test.createTestingModule({
            providers: [
                OpenAILLMProvider,
                { provide: ConfigService, useValue: configFrom(values) },
            ],
        }).compile();
        return moduleRef.get(OpenAILLMProvider);
    }

    it("resolves defaults when only an api key is configured", async () => {
        const provider = await build({ "openai.api_key": "sk-test" });
        const cfg = provider.resolveChatConfig();
        expect(cfg.apiKey).toBe("sk-test");
        expect(cfg.model).toBe(LLM_DEFAULTS.chatModel);
        expect(cfg.temperature).toBe(LLM_DEFAULTS.temperature);
        expect(cfg.baseURL).toBeUndefined();
    });

    it("prefers llm.* config and coerces temperature", async () => {
        const provider = await build({
            "llm.api_key": "sk-llm",
            "openai.api_key": "sk-old",
            "llm.chat_model": "llama3.1",
            "llm.temperature": "0.2",
            "llm.base_url": "http://localhost:11434/v1",
        });
        const cfg = provider.resolveChatConfig();
        expect(cfg.apiKey).toBe("sk-llm");
        expect(cfg.model).toBe("llama3.1");
        expect(cfg.temperature).toBe(0.2);
        expect(cfg.baseURL).toBe("http://localhost:11434/v1");
    });

    it("falls back openai.api_key -> OPENAI_API_KEY env", async () => {
        const prev = process.env.OPENAI_API_KEY;
        process.env.OPENAI_API_KEY = "sk-env";
        try {
            const provider = await build({});
            expect(provider.resolveChatConfig().apiKey).toBe("sk-env");
        } finally {
            process.env.OPENAI_API_KEY = prev;
        }
    });

    it("createChatModel returns a ChatOpenAI honoring option overrides", async () => {
        const provider = await build({ "openai.api_key": "sk-test" });
        const model = provider.createChatModel({
            model: "gpt-4o-mini",
            temperature: 0,
        });
        expect(model).toBeInstanceOf(ChatOpenAI);
        expect((model as ChatOpenAI).model).toBe("gpt-4o-mini");
        expect((model as ChatOpenAI).temperature).toBe(0);
    });

    it("fails fast when neither api key nor base_url is configured", async () => {
        const prev = process.env.OPENAI_API_KEY;
        delete process.env.OPENAI_API_KEY;
        try {
            const provider = await build({});
            expect(() => provider.createChatModel()).toThrow(
                /api key|base_url/i
            );
        } finally {
            process.env.OPENAI_API_KEY = prev;
        }
    });

    it("createChatModel succeeds keyless when only llm.base_url is configured", async () => {
        const prev = process.env.OPENAI_API_KEY;
        delete process.env.OPENAI_API_KEY;
        try {
            const provider = await build({
                "llm.base_url": "http://localhost:11434/v1",
            });
            const model = provider.createChatModel();
            expect(model).toBeInstanceOf(ChatOpenAI);
        } finally {
            process.env.OPENAI_API_KEY = prev;
        }
    });

    it("throws on invalid llm.temperature", async () => {
        const provider = await build({
            "openai.api_key": "sk-test",
            "llm.temperature": "abc",
        });
        expect(() => provider.resolveChatConfig()).toThrow(/temperature/i);
    });
});
