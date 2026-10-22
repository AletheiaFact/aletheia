import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AbilityModule } from "../auth/ability/ability.module";
import { NameSpaceModule } from "../auth/name-space/name-space.module";
import OryModule from "../auth/ory/ory.module";
import { ClaimReviewModule } from "../claim-review/claim-review.module";
import { ClaimRevisionModule } from "../claim/claim-revision/claim-revision.module";
import { ClaimModule } from "../claim/claim.module";
import { NotificationModule } from "../notifications/notifications.module";
import { SentenceModule } from "../claim/types/sentence/sentence.module";
import { PersonalityModule } from "../personality/personality.module";
import { ReviewTaskModule } from "../review-task/review-task.module";
import { SourceModule } from "../source/source.module";
import { TopicModule } from "../topic/topic.module";
import { ViewModule } from "../view/view.module";
import { VerificationRequestModule } from "../verification-request/verification-request.module";
import { McpAuthGuard } from "./mcp-auth.guard";
import { McpOAuthProxyService } from "./mcp-oauth-proxy.service";
import { McpOAuthProviderController } from "./mcp-oauth-provider.controller";
import { McpOAuthProviderService } from "./mcp-oauth-provider.service";
import { McpOAuthController } from "./mcp-oauth.controller";
import { McpWellKnownController } from "./mcp-well-known.controller";
import { McpController } from "./mcp.controller";
import { McpService } from "./mcp.service";
import { ReviewWorkflowService } from "./review-workflow.service";

@Module({
    imports: [
        ClaimModule.register(),
        ClaimRevisionModule.register(),
        SentenceModule,
        ClaimReviewModule,
        ReviewTaskModule,
        VerificationRequestModule.register(),
        SourceModule.register(),
        TopicModule.register(),
        PersonalityModule.register(),
        OryModule,
        AbilityModule,
        NameSpaceModule,
        ConfigModule,
        ViewModule,
        NotificationModule,
    ],
    controllers: [
        McpController,
        McpWellKnownController,
        McpOAuthController,
        McpOAuthProviderController,
    ],
    providers: [
        McpService,
        McpAuthGuard,
        ReviewWorkflowService,
        McpOAuthProxyService,
        McpOAuthProviderService,
    ],
})
export class McpModule {}
