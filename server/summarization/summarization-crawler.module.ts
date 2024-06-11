import { Module } from "@nestjs/common";
import { SummarizationCrawlerChainService } from "./summarization-crawler-chain.service";
import { SummarizationCrawlerService } from "./summarization-crawler.service";
import { ClaimReviewModule } from "../claim-review/claim-review.module";
import { AbilityModule } from "../auth/ability/ability.module";
import { ConfigModule } from "@nestjs/config";
import { SummarizationCrawlerController } from "./summarization-crawler.controller";

@Module({
    imports: [ClaimReviewModule, AbilityModule, ConfigModule],
    providers: [SummarizationCrawlerChainService, SummarizationCrawlerService],
    exports: [SummarizationCrawlerService],
    controllers: [SummarizationCrawlerController],
})
export class SummarizationCrawlerModule {}
