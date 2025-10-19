import { Injectable, forwardRef, Inject, Logger, Scope } from "@nestjs/common";
import { VerificationRequestStateMachine } from "./verification-request.state-machine";
import { VerificationRequestService } from "../verification-request.service";
import {
    VerificationRequestStateMachineEvents,
    VerificationRequestStatus,
} from "../dto/types";

@Injectable({ scope: Scope.REQUEST })
export class VerificationRequestStateMachineService {
    private readonly logger = new Logger(
        VerificationRequestStateMachineService.name
    );
    private verificationRequestStateMachine: VerificationRequestStateMachine;

    constructor(
        @Inject(forwardRef(() => VerificationRequestService))
        private readonly verificationRequestService: VerificationRequestService
    ) {
        this.verificationRequestStateMachine =
            new VerificationRequestStateMachine({
                getVerificationRequestService: () =>
                    this.verificationRequestService,
            });
    }

    async request(requestVerificationDto: any, user?: any): Promise<any> {
        return this.verificationRequestStateMachine.createMachineAndWaitForResult(
            {
                verificationRequest: {
                    ...requestVerificationDto,
                    status: VerificationRequestStatus.PRE_TRIAGE,
                },
                user,
            },
            VerificationRequestStateMachineEvents.REQUEST
        );
    }

    async preTriage(verificationRequestId: string): Promise<any> {
        return this.verificationRequestStateMachine.createMachineAndWaitForResult(
            {
                verificationRequest: {
                    id: verificationRequestId,
                    status: VerificationRequestStatus.PRE_TRIAGE,
                },
            },
            VerificationRequestStateMachineEvents.PRE_TRIAGE
        );
    }

    async embed(verificationRequestId: string): Promise<any> {
        const verificationRequest =
            await this.verificationRequestService.getById(
                verificationRequestId
            );
        return this.verificationRequestStateMachine.createMachineAndWaitForResult(
            {
                verificationRequest: {
                    id: verificationRequestId,
                    content: verificationRequest.content,
                    status: verificationRequest.status,
                },
            },
            VerificationRequestStateMachineEvents.EMBED
        );
    }

    async identifyData(verificationRequestId: string): Promise<any> {
        const verificationRequest =
            await this.verificationRequestService.getById(
                verificationRequestId
            );
        return this.verificationRequestStateMachine.createMachineAndWaitForResult(
            {
                verificationRequest: {
                    id: verificationRequestId,
                    content: verificationRequest.content,
                    status: verificationRequest.status,
                },
            },
            VerificationRequestStateMachineEvents.IDENTIFY_DATA
        );
    }

    async defineTopics(verificationRequestId: string): Promise<any> {
        const verificationRequest =
            await this.verificationRequestService.getById(
                verificationRequestId
            );

        return this.verificationRequestStateMachine.createMachineAndWaitForResult(
            {
                verificationRequest: {
                    id: verificationRequestId,
                    content: verificationRequest.content,
                    status: VerificationRequestStatus.PRE_TRIAGE,
                    identifiedData: verificationRequest.identifiedData, // Need this for the AI task
                },
            },
            VerificationRequestStateMachineEvents.DEFINE_TOPICS
        );
    }

    async defineImpactArea(verificationRequestId: string): Promise<any> {
        const verificationRequest =
            await this.verificationRequestService.getById(
                verificationRequestId
            );
        return this.verificationRequestStateMachine.createMachineAndWaitForResult(
            {
                verificationRequest: {
                    id: verificationRequestId,
                    content: verificationRequest.content,
                    status: verificationRequest.status,
                },
            },
            VerificationRequestStateMachineEvents.DEFINE_IMPACT_AREA
        );
    }

    async defineSeverity(verificationRequestId: string): Promise<any> {
        const verificationRequest =
            await this.verificationRequestService.getById(
                verificationRequestId
            );
        return this.verificationRequestStateMachine.createMachineAndWaitForResult(
            {
                verificationRequest: {
                    id: verificationRequestId,
                    ...verificationRequest,
                },
            },
            VerificationRequestStateMachineEvents.DEFINE_SEVERITY
        );
    }
}
