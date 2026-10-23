import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Inject, Injectable, Scope } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { REQUEST } from "@nestjs/core";
import { AbilityFactory } from "../auth/ability/ability.factory";
import { NameSpaceService } from "../auth/name-space/name-space.service";
import { ClaimReviewService } from "../claim-review/claim-review.service";
import type { IClaimRevisionService } from "../interfaces/claim-revision.service.interface";
import type { IClaimService } from "../interfaces/claim.service.interface";
import type { IPersonalityService } from "../interfaces/personality.service.interface";
import type { ISentenceService } from "../interfaces/sentence.service.interface";
import type { ISourceService } from "../interfaces/source.service.interface";
import type { ITopicService } from "../interfaces/topic.service.interface";
import type { IVerificationRequestService } from "../interfaces/verification-request.service.interface";
import { ReviewTaskService } from "../review-task/review-task.service";
import type { BaseRequest } from "../types";
import { VerificationRequestStateMachineService } from "../verification-request/state-machine/verification-request.state-machine.service";
import { ReviewWorkflowService } from "./review-workflow.service";
import { registerReadTools } from "./tools/read-tools";
import { registerWriteTools } from "./tools/write-tools";

export interface McpToolDeps {
    request: BaseRequest;
    configService: ConfigService;
    claimService: IClaimService;
    claimRevisionService: IClaimRevisionService;
    sentenceService: ISentenceService;
    personalityService: IPersonalityService;
    claimReviewService: ClaimReviewService;
    reviewTaskService: ReviewTaskService;
    verificationRequestService: IVerificationRequestService;
    verificationRequestStateMachineService: VerificationRequestStateMachineService;
    sourceService: ISourceService;
    topicService: ITopicService;
    abilityFactory: AbilityFactory;
    nameSpaceService: NameSpaceService;
    reviewWorkflowService: ReviewWorkflowService;
}

@Injectable({ scope: Scope.REQUEST })
export class McpService {
    constructor(
        @Inject(REQUEST) private readonly request: BaseRequest,
        private readonly configService: ConfigService,
        @Inject("ClaimService")
        private readonly claimService: IClaimService,
        @Inject("ClaimRevisionService")
        private readonly claimRevisionService: IClaimRevisionService,
        @Inject("SentenceService")
        private readonly sentenceService: ISentenceService,
        @Inject("PersonalityService")
        private readonly personalityService: IPersonalityService,
        private readonly claimReviewService: ClaimReviewService,
        private readonly reviewTaskService: ReviewTaskService,
        @Inject("VerificationRequestService")
        private readonly verificationRequestService: IVerificationRequestService,
        private readonly verificationRequestStateMachineService: VerificationRequestStateMachineService,
        @Inject("SourceService")
        private readonly sourceService: ISourceService,
        @Inject("TopicService")
        private readonly topicService: ITopicService,
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
