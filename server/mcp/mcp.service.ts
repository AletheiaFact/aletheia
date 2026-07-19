import { Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ClaimService } from "../claim/claim.service";
import { ClaimRevisionService } from "../claim/claim-revision/claim-revision.service";
import { SentenceService } from "../claim/types/sentence/sentence.service";
import { ClaimReviewService } from "../claim-review/claim-review.service";
import { ReviewTaskService } from "../review-task/review-task.service";
import { VerificationRequestService } from "../verification-request/verification-request.service";
import { VerificationRequestStateMachineService } from "../verification-request/state-machine/verification-request.state-machine.service";
import { SourceService } from "../source/source.service";
import { TopicService } from "../topic/topic.service";
import { AbilityFactory } from "../auth/ability/ability.factory";
import type { IPersonalityService } from "../interfaces/personality.service.interface";
import type { BaseRequest } from "../types";
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
        private readonly abilityFactory: AbilityFactory
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
        };
        registerReadTools(server, deps);
        registerWriteTools(server, deps);
        return server;
    }
}
