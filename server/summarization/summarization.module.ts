import { Module } from "@nestjs/common";
import { SummarizationChainService } from "./summarization-chain.service";
import { SummarizationService } from "./summarization.service";
import { SummarizationController } from "./summarization.controller";
import { ClaimReviewModule } from "../claim-review/claim-review.module";
import { AbilityModule } from "../auth/ability/ability.module";
import { ConfigModule } from "@nestjs/config";
import { WinstonLogger } from "../winstonLogger";

@Module({
    imports: [ClaimReviewModule, AbilityModule, ConfigModule],
    providers: [SummarizationChainService, SummarizationService, WinstonLogger],
    exports: [SummarizationService],
    controllers: [SummarizationController],
})
export class SummarizationModule {}
