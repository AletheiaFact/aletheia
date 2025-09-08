import { StateMachineContext } from './base'
import { VerificationRequestService } from '../verification-request.service'

export interface VerificationRequestStateMachineContext extends StateMachineContext {
  verificationRequest: (
    | any // TODO: improve this type
  ) & {
    id?: string
  }
}

export interface VerificationRequestStateMachineService {
  verificationRequestService: VerificationRequestService
}
