import { Module } from "@nestjs/common";
import { SummarizationChainService } from "./summarization-chain.service";
import { SummarizationService } from "./summarization.service";
import { ClaimReviewModule } from "../claim-review/claim-review.module";
import { AbilityModule } from "../auth/ability/ability.module";
import { ConfigModule } from "@nestjs/config";
import { SummarizationController } from "./summarization.controller";

@Module({
    imports: [ClaimReviewModule, AbilityModule, ConfigModule],
    providers: [SummarizationChainService, SummarizationService],
    exports: [SummarizationService],
    controllers: [SummarizationController],
})
export class SummarizationModule {}
