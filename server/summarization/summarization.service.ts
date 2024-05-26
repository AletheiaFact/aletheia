import { Injectable, Logger } from "@nestjs/common";
import { SummarizationChainService } from "./summarization-chain.service";
import { ClaimReviewService } from "../claim-review/claim-review.service";

@Injectable()
export class SummarizationService {
    private readonly logger = new Logger("SummarizationLogger");
    constructor(
        private chainService: SummarizationChainService,
        private claimReviewService: ClaimReviewService
    ) {}

    async generateDailyReport(): Promise<string> {
        const query = {
            page: 0,
            pageSize: 10,
            order: "asc",
            isHidden: false,
            latest: false,
            isDailyRange: true,
        };

        try {
            const dailyClaimReviews =
                await this.claimReviewService.listDailyReviews(
                    query.page,
                    query.pageSize,
                    query.order,
                    { isHidden: query.isHidden, isDeleted: false },
                    query.latest
                );

            const summarizedReviews = await this.getSummarizedReviews(
                dailyClaimReviews
            );

            const dailyReport = this.generateHTMLReport(summarizedReviews);

            return dailyReport;
        } catch (error) {
            this.logger.error("Error generating daily report:", error);
            throw new Error("Failed to generate daily report");
        }
    }

    private async getSummarizedReviews(
        dailyClaimReviews: any[]
    ): Promise<any[]> {
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

    private generateHTMLReport(summarizedReviews: any[]): string {
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

        const baseUrl = "https://aletheiafact.org";

        const reportContent = summarizedReviews
            .map(
                (review) => `
                <div class="claim-review">
                    <p><span class="classification">${
                        classificationTranslations[review.classification]
                    }</span> | ${review.summary}</p>
                    <p><a href="${baseUrl}${
                    review.reviewHref
                }">Link para Checagem</a></p>
                </div>
            `
            )
            .join("");

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
