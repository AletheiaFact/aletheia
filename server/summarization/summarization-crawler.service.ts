import { Injectable, Logger } from "@nestjs/common";
import { SummarizationCrawlerChainService } from "./summarization-crawler-chain.service";
import { WebBrowser } from "langchain/tools/webbrowser";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { openAI } from "../copilot/openAI.constants";
import { AgentExecutor, createOpenAIToolsAgent } from "langchain/agents";
import { ConfigService } from "@nestjs/config";
import colors from "../../src/styles/colors";
import {
    ChatPromptTemplate,
    MessagesPlaceholder,
} from "@langchain/core/prompts";

@Injectable()
export class SummarizationCrawlerService {
    private readonly logger = new Logger("SummarizationLogger");
    constructor(
        private chainService: SummarizationCrawlerChainService,
        private configService: ConfigService
    ) {}

    async getSummarizedReviews(dailyReviews: any[]): Promise<any[]> {
        try {
            return await Promise.all(
                dailyReviews.map(async (review) => {
                    const href =
                        review?.report?.sources[0]?.href || review?.href;
                    const classification =
                        review?.report?.classification ||
                        review?.props?.classification;
                    const summary = await this.bulletPoints(
                        review?.report?.summary || review?.props.summary
                    );
                    return {
                        summary,
                        classification,
                        href,
                    };
                })
            );
        } catch (error) {
            this.logger.error("Error summarizing reviews:", error);
            throw new Error("Failed to summarize reviews");
        }
    }

    generateHTMLReport(summarizedReviews: any[], nameSpace: string): string {
        const classificationTranslations = {
            "not-fact": "Não é fato",
            trustworthy: "Confiável",
            "trustworthy-but": "Confiável, mas",
            arguable: "Discutível",
            misleading: "Enganoso",
            false: "Falso",
            unsustainable: "Insustentável",
            exaggerated: "Exagerado",
            unverifiable: "Inverificável",
        };

        const reportContent =
            summarizedReviews.length > 0
                ? summarizedReviews
                      .map(
                          (review) => `
                <div class="claim-review">
                    <p><span class="classification ${review.classification}">${
                              classificationTranslations[review.classification]
                          }</span> | ${review.summary}</p>
                    <p><a href="${review.href}">Link para Checagem</a></p>
                </div>
            `
                      )
                      .join("")
                : `<div class="claim-review">
                <p>Nenhuma informação disponível na atualização de hoje. Caso tenha encontrado um problema, por favor, entre em contato conosco através do email contato@aletheiafact.org</p>
            </div>`;

        return `
            <html>
                <head>
                    <style>
                        .claim-review {
                            margin-bottom: 20px;
                        }
                        .classification {
                            font-weight: bold;
                        }
                        a {
                            color: ${colors.bluePrimary};
                        }
                        .not-fact {
                            color: #006060;   
                        }
                        .trustworthy {
                            color: #008000;   
                        }
                        .trustworthy-but {
                            color: #5A781D;   
                        }
                        .arguable {
                            color: #9F6B3F;   
                        }
                        .misleading {
                            color: #D6395F;   
                        }
                        .false {
                            color: #D32B20;   
                        }
                        .unsustainable {
                            color: #A74165;   
                        }
                        .exaggerated {
                            color: #B8860B;   
                        }
                        .unverifiable {
                            color: #C9502A;   
                        }
                    </style>
                </head>
                <body>
                    <h1>${nameSpace}</h1>
                    ${reportContent}
                </body>
            </html>
        `;
    }

    async bulletPoints(content) {
        const stuffChain = this.chainService.createBulletPointsChain();
        return await this.chainService.generateAnswer(stuffChain, content);
    }

    async summarizePage(source, language = "pt") {
        language = language === "pt" ? "Portuguese" : "English";
        const prompt = ChatPromptTemplate.fromMessages([
            [
                "system",
                `Summarize the content found at the provided URL {source}. Please provide a concise and accurate summary,
                utilizing your understanding of the content's main points, key information, and essential details. Consider summarizing
                in 1-2 paragraphs. Compose your responses using formal language and you MUST provide you answer in {language}.`,
            ],
            new MessagesPlaceholder({ variableName: "agent_scratchpad" }),
        ]);

        const llm = new ChatOpenAI({
            temperature: +openAI.BASIC_CHAT_OPENAI_TEMPERATURE,
            modelName: openAI.GPT_3_5_TURBO_1106.toString(),
            apiKey: this.configService.get<string>("openai.api_key"),
        });

        const embeddings = new OpenAIEmbeddings();
        const tools = [new WebBrowser({ model: llm, embeddings })];

        const agent = await createOpenAIToolsAgent({
            llm,
            tools,
            prompt,
        });

        const agentExecutor = new AgentExecutor({
            agent,
            tools,
        });

        return agentExecutor.invoke({ source, language });
    }
}
