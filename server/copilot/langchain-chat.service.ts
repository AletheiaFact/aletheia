/**
 * Service for handling Langchain Chat operations.
 *
 * This service facilitates various types of chat interactions using OpenAI's language models.
 * It supports context-aware chat.
 * Basic context-aware chat utilize pre-defined templates for processing user queries,
 *
 * @class LangchainChatService
 *
 * @method contextAwareChat - Processes messages with consideration for the context of previous interactions, using a context-aware template for coherent responses. Handles errors with HttpExceptions.
 * @param {ContextAwareMessagesDto} contextAwareMessagesDto - Data Transfer Object containing the user’s current message and the chat history.
 * @returns Contextually relevant response from the OpenAI model.
 *
 * The class utilizes several internal methods for operations such as loading chat chains, formatting messages, generating success responses, and handling exceptions.
 * These methods interact with external libraries and services, including the OpenAI API, file system operations, and custom utilities for message formatting and response generation.
 */

import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { ChatOpenAI } from "@langchain/openai";
import customMessage from "./customMessage.response";
import { MESSAGES } from "./messages.constants";
import { openAI } from "./openAI.constants";
import { ContextAwareMessagesDto } from "./dtos/context-aware-messages.dto";
import { z } from "zod";

import { DynamicStructuredTool } from "@langchain/core/tools";
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";
import {
    ChatPromptTemplate,
    MessagesPlaceholder,
} from "@langchain/core/prompts";
import { HumanMessage, AIMessage } from "langchain/schema";

@Injectable()
export class LangchainChatService {
    constructor() {}
    memories = [];

    async agentChat(contextAwareMessagesDto: ContextAwareMessagesDto) {
        try {
            const tools = [
                new DynamicStructuredTool({
                    name: "extract-values",
                    description: "call this to get values provied by the user",
                    schema: z.object({
                        claim: z.string().describe("the claim provided"),
                        dateRange: z
                            .string()
                            .describe("the date range provided"),
                        location: z.string().describe("the location provided"),
                        suggestedFonts: z
                            .string()
                            .describe("the suggested fonts provided"),
                    }),
                    func: async ({
                        claim,
                        dateRange,
                        location,
                        suggestedFonts,
                    }) => {
                        console.log(
                            `Claim: ${claim}, Date Range: ${dateRange}, Location: ${location}, Suggested Fonts: ${suggestedFonts}`
                        );
                        return claim;
                    },
                }),
            ];

            const messages = contextAwareMessagesDto.messages ?? [];

            const currentMessageContent = messages[messages.length - 1].content;

            const prompt = ChatPromptTemplate.fromMessages([
                [
                    "system",
                    `Your job is to get information from a user about the claim they want to fact-check.
                    You should get the following information from them:

                    - What is the claim you want to fact-check ?
                    - What is the date range you want to search from the public gazettes ? e.g: January 2022 to December 2022.
                    - Which brazillian city the claim was stated ?
                    - Do you have any suggestion of sources you want to look at ?

                    If you are not able to discerne this info, ask them to clarify! Do not attempt to wildly guess.

                    After you are able to discerne all the information, call the relevant tool`,
                ],
                new MessagesPlaceholder({ variableName: "chat_history" }),
                ["user", "{input}"],
                new MessagesPlaceholder({ variableName: "agent_scratchpad" }),
            ]);

            const llm = new ChatOpenAI({
                temperature: +openAI.BASIC_CHAT_OPENAI_TEMPERATURE,
                modelName: openAI.GPT_3_5_TURBO_1106.toString(),
            });

            const agent = await createOpenAIFunctionsAgent({
                llm,
                tools,
                prompt,
            });

            const agentExecutor = new AgentExecutor({
                agent,
                tools,
            });

            const response = await agentExecutor.invoke({
                input: currentMessageContent,
                chat_history: this.memories,
            });

            this.memories.push(
                new HumanMessage({
                    content: messages[0].content,
                    additional_kwargs: {},
                }),
                new AIMessage({
                    content: response.output,
                    additional_kwargs: {},
                })
            );
            return customMessage(
                HttpStatus.OK,
                MESSAGES.SUCCESS,
                response.output
            );
        } catch (e: unknown) {
            this.exceptionHandling(e);
        }
    }

    private exceptionHandling = (e: unknown) => {
        Logger.error(e);
        throw new HttpException(
            customMessage(
                HttpStatus.INTERNAL_SERVER_ERROR,
                MESSAGES.EXTERNAL_SERVER_ERROR
            ),
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    };
}
