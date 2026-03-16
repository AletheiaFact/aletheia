import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { ChatOpenAI } from "@langchain/openai";
import customMessage from "./customMessage.response";
import { MESSAGES } from "./messages.constants";
import { openAI } from "./openAI.constants";
import {
    SessionAgentChatDto,
    SenderEnum,
    Context,
} from "./dtos/context-aware-messages.dto";
import { z } from "zod";

import { DynamicStructuredTool } from "@langchain/core/tools";
import {
    AgentExecutor,
    createToolCallingAgent,
} from "@langchain/classic/agents";
import {
    ChatPromptTemplate,
    MessagesPlaceholder,
} from "@langchain/core/prompts";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { AutomatedFactCheckingService } from "../automated-fact-checking/automated-fact-checking.service";
import { EditorParseService } from "../editor-parse/editor-parse.service";
import { ConfigService } from "@nestjs/config";
import { CopilotSessionService } from "./copilot-session.service";
import { CopilotSourceService } from "./copilot-source.service";

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
        private configService: ConfigService,
        private copilotSessionService: CopilotSessionService,
        private copilotSourceService: CopilotSourceService
    ) {}

    private createFactCheckingReportTool(
        editorReportRef: { value: any },
        executionIdRef: { value: string | null },
        userId: string,
        sessionId: string
    ) {
        return {
            name: "get-fact-checking-report",
            description:
                "Use this tool to create a fact-checking report providing the information to the automated fact checking agents",
            schema: z.object({
                claim: z.string().describe("The claim provided by the user"),
                context: z
                    .object({
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
                    const { stream, json, executionId } =
                        await this.automatedFactCheckingService.getResponseFromAgents(
                            data,
                            sessionId
                        );

                    // Capture execution_id for storage in the session message
                    if (executionId) {
                        executionIdRef.value = executionId;
                    }

                    if (json?.messages) {
                        const agenciaSources =
                            json.messages?.sources || [];

                        // Persist Agencia sources and normalize url→href
                        const normalizedSources =
                            agenciaSources.length > 0
                                ? await this.copilotSourceService.processAgenciaSources(
                                      agenciaSources,
                                      userId
                                  )
                                : [];

                        // Build the schema for the editor.
                        // Agencia sources don't have field/textRange data needed
                        // for inline citations, so we append them as a reference
                        // list at the end of the report text instead.
                        const schemaForEditor = {
                            ...json.messages,
                            sources: [],
                        };

                        if (
                            normalizedSources.length > 0 &&
                            schemaForEditor.report
                        ) {
                            schemaForEditor.report =
                                this.appendSourcesToContent(
                                    schemaForEditor.report,
                                    normalizedSources
                                );
                        }

                        editorReportRef.value =
                            await this.editorParseService.schema2editor(
                                schemaForEditor
                            );
                    }

                    return stream;
                } catch (error) {
                    this.logger.error(error);
                    return String(error);
                }
            },
        };
    }

    /**
     * Appends a reference list of sources to the end of a report content string.
     *
     * Agencia sources don't include the field/textRange metadata required for
     * inline citations in the editor, so we present them as a numbered list
     * appended to the report text. The fact-checker can then reorganize or
     * integrate them as needed.
     */
    private appendSourcesToContent(
        content: string,
        sources: { href?: string; title?: string }[]
    ): string {
        if (!sources || sources.length === 0) {
            return content;
        }

        const sourceLines = sources.map((source, index) => {
            const num = index + 1;
            if (source.title && source.title !== source.href) {
                return `${num}. ${source.title}: ${source.href}`;
            }
            return `${num}. ${source.href}`;
        });

        return `${content}\n\nFontes:\n${sourceLines.join("\n")}`;
    }

    async agentChat(sessionAgentChatDto: SessionAgentChatDto, language, userId: string) {
        try {
            const { sessionId, message } = sessionAgentChatDto;

            const session =
                await this.copilotSessionService.getSessionById(sessionId);
            if (!session) {
                throw new Error("Session not found");
            }

            const context = session.context as Context;
            const date = new Date(context.claimDate);
            const localizedDate = date.toLocaleDateString();
            language = language === "pt" ? "Portuguese" : "English";

            // Build rich context strings
            const personalities =
                context.personalityNames?.length > 0
                    ? context.personalityNames.join(", ")
                    : context.personalityName || "unknown";
            const contentModel = context.contentModel || "";
            const topics =
                context.topics?.length > 0
                    ? context.topics.join(", ")
                    : "";

            // Persist the user message
            await this.copilotSessionService.addMessage(sessionId, {
                sender: SenderEnum.User,
                content: message,
                type: "info",
            });

            // Build chat history from stored session messages (excluding the one we just added)
            const messagesHistory = session.messages.map((msg) =>
                this.transformMessage(msg)
            );

            // Use local ref objects instead of instance variables (fixes concurrency bug)
            const editorReportRef = { value: null };
            const executionIdRef: { value: string | null } = { value: null };
            const tools = [
                new DynamicStructuredTool(
                    this.createFactCheckingReportTool(
                        editorReportRef,
                        executionIdRef,
                        userId,
                        sessionId
                    ) as any
                ),
            ];

            const prompt = ChatPromptTemplate.fromMessages([
                [
                    "system",
                    `You are the Fact-checker Aletheia's Assistant, working with a fact-checker who requires assistance.
Your primary goal is to gather all relevant information from the user about the claim that needs to be fact-checked.

## Claim Context
- **Claim**: {claim}
- **Stated by**: {personalities}
- **Claim title**: {claimTitle}
- **Date stated**: {date}
- **Content type**: {contentModel}
- **Related topics**: {topics}

## Steps to follow

1. **Confirm the claim for fact-checking**:
   - Ask the user to confirm the claim they want to review is: "{claim}" stated by {personalities}.
   - Always compose this question using the claim and personalities values above if they exist.

2. **Confirm the type of research**:
   - Ask the user how to proceed: searching on the internet or searching in public gazettes.

3. **Gather information based on the type of research**:
   - **Public gazettes**: ask the following questions sequentially:
     - "In which Brazilian city or state was the claim made?"
     - "Do you have a specific time period during which we should search in the public gazettes (e.g. January 2022 to December 2022), or should we search up to the date the claim was stated: {date}?"
   - **Online search**: ask the following question:
     - "Do you have any specific sources you suggest we consult for verifying this claim?"

## Rules
- Always pose your questions one at a time and in the specified order.
- Persist in asking all necessary questions. Do not use the tool until you have thoroughly completed all preceding steps.
- Maintain the use of formal language in your responses, ensuring that all communication is conducted in {language}.
- Only after all questions have been addressed and all relevant information has been gathered from the user you should proceed to use the get-fact-checking-report tool.`,
                ],
                new MessagesPlaceholder({ variableName: "chat_history" }),
                ["user", "{input}"],
                new MessagesPlaceholder({ variableName: "agent_scratchpad" }),
            ]);

            const llm = new ChatOpenAI({
                temperature: +openAI.BASIC_CHAT_OPENAI_TEMPERATURE,
                modelName: openAI.GPT_5_MINI.toString(),
                apiKey: this.configService.get<string>("openai.api_key"),
            });

            const agent = await createToolCallingAgent({
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
                claim: context.sentence,
                personalities: personalities,
                claimTitle: context.claimTitle || "",
                contentModel: contentModel || "not specified",
                topics: topics || "none",
                input: message,
                chat_history: messagesHistory,
            });

            // Persist the assistant response (include editorReport and executionId if produced)
            const assistantMessage: any = {
                sender: SenderEnum.Assistant,
                content: response.output,
                type: "info",
            };
            if (editorReportRef.value) {
                assistantMessage.editorReport = editorReportRef.value;
            }
            if (executionIdRef.value) {
                assistantMessage.executionId = executionIdRef.value;
            }
            await this.copilotSessionService.addMessage(
                sessionId,
                assistantMessage
            );

            return customMessage(HttpStatus.OK, MESSAGES.SUCCESS, {
                sender: SenderEnum.Assistant,
                content: response.output,
                editorReport: editorReportRef.value,
                executionId: executionIdRef.value,
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
