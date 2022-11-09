import { CreateClaimContext } from "./context";
import { CreateClaimStates } from "./types";

export type CreateClaimMachineStates =
    | { value: CreateClaimStates.notStarted; context: CreateClaimContext }
    | { value: CreateClaimStates.setupSpeech; context: CreateClaimContext }
    | { value: CreateClaimStates.personalityAdded; context: CreateClaimContext }
    | { value: CreateClaimStates.persisted; context: CreateClaimContext };
