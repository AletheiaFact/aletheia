import { StateMachineContext } from "./base";
import type { IVerificationRequestService } from "../../interfaces/verification-request.service.interface";

export interface VerificationRequestStateMachineContext
    extends StateMachineContext {
    verificationRequest:
        | any & {
              // TODO: improve this type
              id?: string;
          };
    user?: any;
}

export interface VerificationRequestStateMachineService {
    verificationRequestService: IVerificationRequestService;
}
