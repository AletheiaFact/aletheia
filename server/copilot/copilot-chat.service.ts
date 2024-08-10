/**
 * Service for handling Langchain Chat operations.
 *
 * This service facilitates various types of chat interactions using OpenAI's language models.
 * It supports context-aware chat.
 * Basic context-aware chat utilize pre-defined templates for processing user queries,
 *
 * @class CopilotChatService
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
import {
    ContextAwareMessagesDto,
    SenderEnum,
} from "./dtos/context-aware-messages.dto";
import { z } from "zod";

import { DynamicStructuredTool } from "@langchain/core/tools";
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";
import {
    ChatPromptTemplate,
    MessagesPlaceholder,
} from "@langchain/core/prompts";
import { HumanMessage, AIMessage } from "langchain/schema";
import { AutomatedFactCheckingService } from "../automated-fact-checking/automated-fact-checking.service";
import { EditorParseService } from "../editor-parse/editor-parse.service";
import { ConfigService } from "@nestjs/config";

enum SearchType {
    online = "online",
    gazettes = "gazettes",
}

@Injectable()
export class CopilotChatService {
    private readonly logger = new Logger("CopilotChatService");
    constructor(
        private automatedFactCheckingService: AutomatedFactCheckingService,
        private editorParseService: EditorParseService,
        private configService: ConfigService
    ) {}
    editorReport = null;

    getFactCheckingReportTool = {
        name: "get-fact-checking-report",
        description:
            "Use this tool to create a fact-checking report providing the information to the automated fact checking agents",
        schema: z.object({
            claim: z.string().describe("The claim provided by the user"),
            context: z
                .object({
                    //Bad behavior: When the user do not pass a value, the agent assumes the value from the date context
                    published_since: z
                        .string()
                        .describe(
                            "the oldest date provided specifically and just by the user"
                        ),
                    published_until: z
                        .string()
                        .describe(
                            "the newest date provided or if it's not provided the date that the claim was stated"
                        ),
                    city: z
                        .string()
                        .describe(
                            "the city location provided specifically and just by the user"
                        ),
                    sources: z
                        .array(z.string())
                        .describe(
                            "the suggested sources as an array provided specifically and just by the user"
                        ),
                })
                .describe(
                    "Context provided by the user to construct the fact-checking report"
                ),
            searchType: z
                .nativeEnum(SearchType)
                .describe(
                    "The search type provided by the user, must be a valid enum value"
                )
                .default(SearchType.online),
        }),
        func: async (data) => {
            try {
                const { stream, json } =
                    await this.automatedFactCheckingService.getResponseFromAgents(
                        data
                    );
                this.editorReport = await this.editorParseService.schema2editor(
                    {
                        ...json.messages,
                        sources: [],
                    }
                );
                return stream;
            } catch (error) {
                console.log(error);
                this.logger.error(error);
                return error;
            }
        },
    };

    async agentChat(
        contextAwareMessagesDto: ContextAwareMessagesDto,
        language
    ) {
        try {
            const date = new Date(contextAwareMessagesDto.context.claimDate);
            const localizedDate = date.toLocaleDateString();
            language = language === "pt" ? "Portuguese" : "English";
            const messagesHistory = contextAwareMessagesDto.messages.map(
                (message) => this.transformMessage(message)
            );
            const tools = [
                new DynamicStructuredTool(this.getFactCheckingReportTool),
            ];
            const currentMessageContent =
                contextAwareMessagesDto.messages[
                    contextAwareMessagesDto.messages.length - 1
                ];

            const prompt = ChatPromptTemplate.fromMessages([
                [
                    "system",
                    `
                    You are the Fact-checker Aletheia's Assistant, working with a fact-checker who requires assistance.
                    Your primary goal is to gather all relevant information from the user about the claim: {claim} that needs to be fact-checked.
                    
                    Please follow these steps carefully

                    1. Confirm the claim for fact-checking:
                    - If the user requests assistance with fact-checking, ask the user to confirm the claim that he wants to review is the claim: {claim} stated by {personality}, assure to always compose this specific question using these values {claim} and {personality} if they exists.

                    2. Confirm the type of research:
                    - Ask the user how should we proceed the research by either searching on internet or searching in public gazettes
                    
                    3. Based on the type of research, proceed gathering the necessary information:
                        **public gazettes**: ask the following questions sequentially:
                             - "In which Brazilian city or state was the claim made?"
                            - "Do you have a specific time period during which we should search in the public gazettes (e.g. January 2022 to December 2022), or should we search up to the date the claim was stated: {date}?"

                        **online search**: ask the following question:
                            - "Do you have any specific sources you suggest we consult for verifying this claim?"

                    
                    Always pose your questions one at a time and in the specified order.

                    Persist in asking all necessary questions. Do not use the tool until you have thoroughly completed all preceding steps.
                    Maintain the use of formal language in your responses, ensuring that all communication is conducted in {language}.
                    Only after all questions have been addressed and all relevant information has been gathered from the user you should proceed to use the get-fact-checking-report tool.`,
                ],
                new MessagesPlaceholder({ variableName: "chat_history" }),
                ["user", "{input}"],
                new MessagesPlaceholder({ variableName: "agent_scratchpad" }),
            ]);

            const llm = new ChatOpenAI({
                temperature: +openAI.BASIC_CHAT_OPENAI_TEMPERATURE,
                modelName: openAI.GPT_3_5_TURBO_1106.toString(),
                apiKey: this.configService.get<string>("openai.api_key"),
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
                language: language,
                date: localizedDate,
                claim: contextAwareMessagesDto.context.sentence,
                personality: contextAwareMessagesDto.context.personalityName,
                input: currentMessageContent,
                chat_history: messagesHistory,
            });

            return customMessage(HttpStatus.OK, MESSAGES.SUCCESS, {
                sender: SenderEnum.Assistant,
                content: response.output,
                editorReport: this.editorReport,
            });
        } catch (e: unknown) {
            this.exceptionHandling(e);
        }
    }

    transformMessage(message) {
        this.logger.log(`${message.sender}: ${message.content}`);
        if (message.sender === SenderEnum.Assistant) {
            return new AIMessage({
                content: message.content,
                additional_kwargs: {},
            });
        }

        return new HumanMessage({
            content: message.content,
            additional_kwargs: {},
        });
    }

    private exceptionHandling = (e: unknown) => {
        console.log(e);
        this.logger.error(e);
        throw new HttpException(
            customMessage(
                HttpStatus.INTERNAL_SERVER_ERROR,
                MESSAGES.EXTERNAL_SERVER_ERROR
            ),
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    };
}
