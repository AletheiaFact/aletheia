import { ReviewTaskMachineContext } from "./context";
import { ReviewTaskStates } from "./enums";

export type ReviewTaskMachineState =
    | { value: ReviewTaskStates.unassigned; context: ReviewTaskMachineContext }
    | { value: ReviewTaskStates.assigned; context: ReviewTaskMachineContext }
    | {
          value: ReviewTaskStates.reported;
          context: ReviewTaskMachineContext;
      }
    | { value: ReviewTaskStates.published; context: ReviewTaskMachineContext };
