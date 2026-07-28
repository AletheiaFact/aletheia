import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { OpenAIEmbeddings } from "@langchain/openai";
import { OpenAIEmbeddingsProvider } from "./openai.embeddings-provider";

function configFrom(values: Record<string, unknown>) {
    return { get: (key: string) => values[key] } as unknown as ConfigService;
}

describe("OpenAIEmbeddingsProvider (Unit)", () => {
    async function build(values: Record<string, unknown>) {
        const moduleRef: TestingModule = await Test.createTestingModule({
            providers: [
                OpenAIEmbeddingsProvider,
                { provide: ConfigService, useValue: configFrom(values) },
            ],
        }).compile();
        return moduleRef.get(OpenAIEmbeddingsProvider);
    }

    it("omits the model when llm.embeddings_model is not configured", async () => {
        const provider = await build({ "openai.api_key": "sk-test" });
        const cfg = provider.resolveEmbeddingsConfig();
        expect(cfg.apiKey).toBe("sk-test");
        expect(cfg.model).toBeUndefined();
        expect(cfg.baseURL).toBeUndefined();
    });

    it("uses configured embeddings model and base_url", async () => {
        const provider = await build({
            "llm.api_key": "sk-llm",
            "llm.embeddings_model": "nomic-embed-text",
            "llm.base_url": "http://localhost:11434/v1",
        });
        const cfg = provider.resolveEmbeddingsConfig();
        expect(cfg.apiKey).toBe("sk-llm");
        expect(cfg.model).toBe("nomic-embed-text");
        expect(cfg.baseURL).toBe("http://localhost:11434/v1");
    });

    it("getEmbeddings returns an OpenAIEmbeddings instance", async () => {
        const provider = await build({ "openai.api_key": "sk-test" });
        expect(provider.getEmbeddings()).toBeInstanceOf(OpenAIEmbeddings);
    });

    it("getEmbeddings succeeds with only base_url (keyless local endpoint)", async () => {
        const prev = process.env.OPENAI_API_KEY;
        delete process.env.OPENAI_API_KEY;
        try {
            const provider = await build({
                "llm.base_url": "http://localhost:11434/v1",
            });
            expect(provider.getEmbeddings()).toBeInstanceOf(OpenAIEmbeddings);
        } finally {
            process.env.OPENAI_API_KEY = prev;
        }
    });

    it("fails fast when neither api key nor base_url is configured", async () => {
        const prev = process.env.OPENAI_API_KEY;
        delete process.env.OPENAI_API_KEY;
        try {
            const provider = await build({});
            expect(() => provider.getEmbeddings()).toThrow(/api key|base_url/i);
        } finally {
            process.env.OPENAI_API_KEY = prev;
        }
    });
});
