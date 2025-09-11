import { Injectable, forwardRef, Inject, Logger } from '@nestjs/common'
import { VerificationRequestStateMachine } from './verification-request.state-machine'
import { VerificationRequestService } from '../verification-request.service'
import { VerificationRequestStateMachineEvents, VerificationRequestStatus } from '../dto/types'

@Injectable()
export class VerificationRequestStateMachineService {
    private readonly logger = new Logger(VerificationRequestStateMachineService.name)
    private verificationRequestStateMachine: VerificationRequestStateMachine

    constructor(
        @Inject(forwardRef(() => VerificationRequestService))
        private readonly verificationRequestService: VerificationRequestService,
    ) {
        this.verificationRequestStateMachine = new VerificationRequestStateMachine({
            getVerificationRequestService: () => this.verificationRequestService,
        })
    }

    async request(requestVerificationDto: any): Promise<any> {
        return this.verificationRequestStateMachine.createMachineAndWaitForResult(
            {
                verificationRequest: { ...requestVerificationDto, status: VerificationRequestStatus.PRE_TRIAGE },
            },
            VerificationRequestStateMachineEvents.REQUEST,
        )
    }

    async preTriage(verificationRequestId: string): Promise<any> {
        console.log('data sent by client', verificationRequestId)
        return this.verificationRequestStateMachine.createMachineAndWaitForResult(
            {
                verificationRequest: { id: verificationRequestId, status: VerificationRequestStatus.PRE_TRIAGE },
            },
            VerificationRequestStateMachineEvents.PRE_TRIAGE,
        )
    }
}