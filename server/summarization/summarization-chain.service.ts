import { PromptTemplate } from "@langchain/core/prompts";
import { Injectable } from "@nestjs/common";
import { loadSummarizationChain, StuffDocumentsChain } from "langchain/chains";
import { ChatOpenAI } from "@langchain/openai";
import { openAI } from "../copilot/openAI.constants";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { WinstonLogger } from "../winstonLogger";

@Injectable()
export class SummarizationChainService {
    private logger: WinstonLogger;
    constructor() {}

    createBulletPointsChain(): StuffDocumentsChain {
        const systemMessage = `Write a summary of the following text delimited by triple dashes.`;
        const stuffPromptTemplate = `
        ${systemMessage}
        Return your response in one bullet point.
        ---{text}---
        BULLET POINT SUMMARY:`;

        const inputVariables = ["text"];
        const stuffPrompt = new PromptTemplate({
            template: stuffPromptTemplate,
            inputVariables,
        });
        const llm = new ChatOpenAI({
            temperature: +openAI.BASIC_CHAT_OPENAI_TEMPERATURE,
            modelName: openAI.GPT_3_5_TURBO_1106.toString(),
        });

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
