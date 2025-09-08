import { CommonStateMachineStates, StateMachineBase } from './base'
import { VerificationRequestStateMachineContext } from './verification-request.state-machine.interface'
import { VerificationRequestService } from '../verification-request.service'
import { VerificationRequestStateMachineStates, VerificationRequestStatus } from 'verification-request/dto/types'
import { getVerificationRequestStateMachineConfig } from './verification-request.state-machine.config'

type StatusToStateMap = Record<VerificationRequestStatus, VerificationRequestStateMachineStates>

export class EncounterStateMachine extends StateMachineBase<VerificationRequestStateMachineContext> {
  protected stateMachineConfig = getVerificationRequestStateMachineConfig
  private getVerificationRequestService: () => VerificationRequestService

  constructor({ getVerificationRequestService }: { getVerificationRequestService: () => VerificationRequestService }) {
    super({ verificationRequestService: null as any }) // Initialize with a temporary value
    this.getVerificationRequestService = getVerificationRequestService
    this.stateMachineService = { verificationRequestService: getVerificationRequestService() }
  }

  protected async getEntityCurrentState(context: VerificationRequestStateMachineContext): Promise<string> {
    if (!context.verificationRequest?.id) {
      return CommonStateMachineStates.REHYDRATE
    }
    const statusMap: StatusToStateMap = {
        [VerificationRequestStatus.PRE_TRIAGE]: VerificationRequestStateMachineStates.EMBEDDING,
        [VerificationRequestStatus.IN_TRIAGE]: VerificationRequestStateMachineStates.EMBEDDING,
        [VerificationRequestStatus.POSTED]: VerificationRequestStateMachineStates.EMBEDDING,
        [VerificationRequestStatus.DECLINED]: VerificationRequestStateMachineStates.EMBEDDING
    }
    const encounter = await this.getVerificationRequestService().getById(context.verificationRequest?.id)
    return statusMap[encounter?.status] || CommonStateMachineStates.REHYDRATE
  }
}
