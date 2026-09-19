import { PromptTemplate } from "@langchain/core/prompts";
import { Inject, Injectable, Logger } from "@nestjs/common";
import {
    loadSummarizationChain,
    StuffDocumentsChain,
} from "@langchain/classic/chains";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { LLM_PROVIDER } from "../llm/llm.tokens";
import type { LLMProvider } from "../llm/llm.types";

@Injectable()
export class SummarizationCrawlerChainService {
    private readonly logger = new Logger("SummarizationChainLogger");
    constructor(
        @Inject(LLM_PROVIDER) private readonly llmProvider: LLMProvider
    ) {}

    createBulletPointsChain(): StuffDocumentsChain {
        const systemMessage = `Write a summary of the following text delimited by triple dashes.`;
        const stuffPromptTemplate = `
        ${systemMessage}
        Return your response in one bullet point.
        You MUST provide you answer in portuguese.
        ---{text}---
        BULLET POINT SUMMARY:`;

        const inputVariables = ["text"];
        const stuffPrompt = new PromptTemplate({
            template: stuffPromptTemplate,
            inputVariables,
        });
        const llm = this.llmProvider.createChatModel();

        return loadSummarizationChain(llm, {
            type: "stuff",
            prompt: stuffPrompt,
            verbose: true,
        }) as StuffDocumentsChain;
    }

    private async createDocumentsFromText(content: string) {
        try {
            const textSplitter = new RecursiveCharacterTextSplitter({
                chunkSize: 1000,
            });
            return await textSplitter.createDocuments([content]);
        } catch (error) {
            this.logger.error("Error creating documents from text:", error);
            throw new Error("Failed to create documents from text");
        }
    }

    async generateAnswer(
        stuffChain: StuffDocumentsChain,
        content: string
    ): Promise<string> {
        try {
            const docs = await this.createDocumentsFromText(content);

            const results = await stuffChain.invoke({
                input_documents: docs,
            });

            return results.text as string;
        } catch (error) {
            this.logger.error("Error generating answer:", error);
            throw new Error("Failed to generate answer");
        }
    }
}
