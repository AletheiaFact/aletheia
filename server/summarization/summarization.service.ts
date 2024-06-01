import { Injectable, Logger } from "@nestjs/common";
import { SummarizationChainService } from "./summarization-chain.service";
import { ConfigService } from "@nestjs/config";
import { NameSpaceEnum } from "../auth/name-space/schemas/name-space.schema";

@Injectable()
export class SummarizationService {
    private readonly logger = new Logger("SummarizationLogger");
    constructor(
        private chainService: SummarizationChainService,
        private configService: ConfigService
    ) {}

    async getSummarizedReviews(dailyClaimReviews: any[]): Promise<any[]> {
        try {
            return await Promise.all(
                dailyClaimReviews.map(async (claimReview) => {
                    const summary = await this.bulletPoints(
                        claimReview.report.summary
                    );
                    return {
                        classification: claimReview.report.classification,
                        summary: summary.text,
                        reviewHref: claimReview.reviewHref,
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
        const baseUrl = this.configService.get<string>("baseUrl");

        const reportContent =
            summarizedReviews.length > 0
                ? summarizedReviews
                      .map(
                          (review, key) => `
                <div class="claim-review">
                    <h1>${nameSpace}</h1>
                    <p><span class="classification ${
                        Object.keys(classificationTranslations)[key]
                    }">${
                              classificationTranslations[review.classification]
                          }</span> | ${review.summary}</p>
                    <p><a href="${baseUrl}/${nameSpace}${
                              review.reviewHref
                          }">Link para Checagem</a></p>
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
                            color: rgb(17, 39, 58);
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
                    ${reportContent}
                </body>
            </html>
        `;
    }

    async bulletPoints(content) {
        const stuffChain = this.chainService.createBulletPointsChain();
        const text = await this.chainService.generateAnswer(
            stuffChain,
            content
        );

        return {
            text,
        };
    }
}
