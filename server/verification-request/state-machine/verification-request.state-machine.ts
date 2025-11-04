import { CommonStateMachineStates, StateMachineBase } from './base'
import { VerificationRequestStateMachineContext } from './verification-request.state-machine.interface'
import { VerificationRequestService } from '../verification-request.service'
import { VerificationRequestStateMachineStates, VerificationRequestStatus } from '../dto/types'
import { getVerificationRequestStateMachineConfig } from './verification-request.state-machine.config'

type StatusToStateMap = Record<VerificationRequestStatus, VerificationRequestStateMachineStates>

export class VerificationRequestStateMachine extends StateMachineBase<VerificationRequestStateMachineContext> {
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

    const verificationRequest = await this.getVerificationRequestService().getById(context.verificationRequest?.id)
    // For PRE_TRIAGE status, determine next state based on what's been executed
    if (verificationRequest?.status === VerificationRequestStatus.PRE_TRIAGE) {
      const statesExecuted = verificationRequest.statesExecuted || [];

      // Define the expected order of states
      const expectedStates = [
        { field: 'embedding', state: VerificationRequestStateMachineStates.EMBEDDING },
        { field: 'identifiedData', state: VerificationRequestStateMachineStates.IDENTIFYING_DATA },
        { field: 'topics', state: VerificationRequestStateMachineStates.DEFINING_TOPICS },
        { field: 'impactArea', state: VerificationRequestStateMachineStates.DEFINING_IMPACT_AREA },
        { field: 'severity', state: VerificationRequestStateMachineStates.DEFINING_SEVERITY }
      ];

      // Find the first missing state
      for (const { field, state } of expectedStates) {
        if (!statesExecuted.includes(field)) {
          console.log(`Next missing step: ${field} -> ${state}`);
          return state;
        }
      }

      // All steps completed, but still in PRE_TRIAGE - should not happen
      return CommonStateMachineStates.REHYDRATE;
    }

    // For other statuses, use simple mapping
    const statusMap: StatusToStateMap = {
        [VerificationRequestStatus.PRE_TRIAGE]: VerificationRequestStateMachineStates.IDENTIFYING_DATA,
        [VerificationRequestStatus.IN_TRIAGE]: VerificationRequestStateMachineStates.EMBEDDING,
        [VerificationRequestStatus.POSTED]: VerificationRequestStateMachineStates.EMBEDDING,
        [VerificationRequestStatus.DECLINED]: VerificationRequestStateMachineStates.EMBEDDING
    }

    return statusMap[verificationRequest?.status] || CommonStateMachineStates.REHYDRATE
  }
}
