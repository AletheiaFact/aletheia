import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Inject, Injectable, Scope } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { REQUEST } from "@nestjs/core";
import { AbilityFactory } from "../auth/ability/ability.factory";
import { NameSpaceService } from "../auth/name-space/name-space.service";
import { ClaimReviewService } from "../claim-review/claim-review.service";
import { ClaimRevisionService } from "../claim/claim-revision/claim-revision.service";
import { ClaimService } from "../claim/claim.service";
import { SentenceService } from "../claim/types/sentence/sentence.service";
import type { IPersonalityService } from "../interfaces/personality.service.interface";
import { ReviewTaskService } from "../review-task/review-task.service";
import { SourceService } from "../source/source.service";
import { TopicService } from "../topic/topic.service";
import type { BaseRequest } from "../types";
import { VerificationRequestStateMachineService } from "../verification-request/state-machine/verification-request.state-machine.service";
import { VerificationRequestService } from "../verification-request/verification-request.service";
import { ReviewWorkflowService } from "./review-workflow.service";
import { registerReadTools } from "./tools/read-tools";
import { registerWriteTools } from "./tools/write-tools";

export interface McpToolDeps {
    request: BaseRequest;
    configService: ConfigService;
    claimService: ClaimService;
    claimRevisionService: ClaimRevisionService;
    sentenceService: SentenceService;
    personalityService: IPersonalityService;
    claimReviewService: ClaimReviewService;
    reviewTaskService: ReviewTaskService;
    verificationRequestService: VerificationRequestService;
    verificationRequestStateMachineService: VerificationRequestStateMachineService;
    sourceService: SourceService;
    topicService: TopicService;
    abilityFactory: AbilityFactory;
    nameSpaceService: NameSpaceService;
    reviewWorkflowService: ReviewWorkflowService;
}

@Injectable({ scope: Scope.REQUEST })
export class McpService {
    constructor(
        @Inject(REQUEST) private readonly request: BaseRequest,
        private readonly configService: ConfigService,
        private readonly claimService: ClaimService,
        private readonly claimRevisionService: ClaimRevisionService,
        private readonly sentenceService: SentenceService,
        @Inject("PersonalityService")
        private readonly personalityService: IPersonalityService,
        private readonly claimReviewService: ClaimReviewService,
        private readonly reviewTaskService: ReviewTaskService,
        private readonly verificationRequestService: VerificationRequestService,
        private readonly verificationRequestStateMachineService: VerificationRequestStateMachineService,
        private readonly sourceService: SourceService,
        private readonly topicService: TopicService,
        private readonly abilityFactory: AbilityFactory,
        private readonly nameSpaceService: NameSpaceService,
        private readonly reviewWorkflowService: ReviewWorkflowService
    ) {}

    buildServer(): McpServer {
        const server = new McpServer({ name: "aletheia", version: "1.0.0" });
        const deps: McpToolDeps = {
            request: this.request,
            configService: this.configService,
            claimService: this.claimService,
            claimRevisionService: this.claimRevisionService,
            sentenceService: this.sentenceService,
            personalityService: this.personalityService,
            claimReviewService: this.claimReviewService,
            reviewTaskService: this.reviewTaskService,
            verificationRequestService: this.verificationRequestService,
            verificationRequestStateMachineService:
                this.verificationRequestStateMachineService,
            sourceService: this.sourceService,
            topicService: this.topicService,
            abilityFactory: this.abilityFactory,
            nameSpaceService: this.nameSpaceService,
            reviewWorkflowService: this.reviewWorkflowService,
        };
        registerReadTools(server, deps);
        registerWriteTools(server, deps);
        return server;
    }
}
