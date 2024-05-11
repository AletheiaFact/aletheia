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

@Injectable()
export class CopilotChatService {
    private readonly logger = new Logger("CopilotChatService");
    constructor(
        private automatedFactCheckingService: AutomatedFactCheckingService,
        private editorParseService: EditorParseService
    ) {}
    editorReport = null;

    getFactCheckingReportTool = {
        name: "get-fact-checking-report",
        description:
            "Use this tool to provide the information to the automated fact checking agents",
        schema: z.object({
            claim: z.string().describe("the claim provided"),
            context: z.object({
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
            }),
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
            } catch (e) {
                console.log(e);
                this.logger.error(e);
                throw new Error(e);
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
                //TODO: Ensure that the agent only fack-checks the claim from the context
                [
                    "system",
                    `
                    You are helpful assistant, your objective is to gather relevant informations from the user about the {claim} that has to be fact-checked.

                    A fact-checker is interacting with you because he needs assistance with his fact-check report.                    

                    Follow these steps carefully:

                    1. Confirm with the user the claim to be fack-checked:                    
                    - If the user requests assistance with the fact-check, ask the user to confirm the claim that he wants to review is the claim:{claim} stated by {personality}, assure to always compose this specific question using these values {claim} and {personality}.

                    2. Analyze the {claim}:                    
                    - Based on your analyze assure if the claim is related to Brazilian municipalities or states proceed with the following questions strictly one at a time:
                        - Ask the user Which Brazilian city or state was the claim made in?                    
                        - Ask: Do you have any time expecific time period we should search in the public gazettes? (e.g., January 2022 to December 2022), or we should search until statement of the claim date:{date}?

                    - Based on your analyze if the claim is unrelated to Brazilian municipalities or is a totally different topic proceed with the following question:
                        - Ask the user if he has any suggestion of sources that we should consult?

                    If any information is ambiguous or missing, request clarification from the user without making assumptions.
                    Always ask one question at a time and in the specified order.

                    You need to make all possible questions even if the user tries to rush the review.
                    Compose your responses using formal language and you MUST provide you answer in {language}.
                    Always pass the {claim} specifically to the tool without translating.
                    Only when you have made all questions and followed all steps to extracted information from the user, proceed to use the get-fact-checking-report tool.
                    `,
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
