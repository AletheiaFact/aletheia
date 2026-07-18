import { Module } from "@nestjs/common";
import { ClaimModule } from "../claim/claim.module";
import { ClaimRevisionModule } from "../claim/claim-revision/claim-revision.module";
import { SentenceModule } from "../claim/types/sentence/sentence.module";
import { ClaimReviewModule } from "../claim-review/claim-review.module";
import { ReviewTaskModule } from "../review-task/review-task.module";
import { VerificationRequestModule } from "../verification-request/verification-request.module";
import { SourceModule } from "../source/source.module";
import { TopicModule } from "../topic/topic.module";
import { PersonalityModule } from "../personality/personality.module";
import OryModule from "../auth/ory/ory.module";
import { McpController } from "./mcp.controller";
import { McpWellKnownController } from "./mcp-well-known.controller";
import { McpService } from "./mcp.service";
import { McpAuthGuard } from "./mcp-auth.guard";

@Module({
    imports: [
        ClaimModule,
        ClaimRevisionModule,
        SentenceModule,
        ClaimReviewModule,
        ReviewTaskModule,
        VerificationRequestModule,
        SourceModule,
        TopicModule,
        PersonalityModule.register(),
        OryModule,
    ],
    controllers: [McpController, McpWellKnownController],
    providers: [McpService, McpAuthGuard],
})
export class McpModule {}
