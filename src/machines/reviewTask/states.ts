import { ReviewTaskMachineContextType } from "./context";
import { ReviewTaskStates } from "./enums";

export type ReviewTaskMachineState =
    | {
          value: ReviewTaskStates.unassigned;
          context: ReviewTaskMachineContextType;
      }
    | {
          value: ReviewTaskStates.assigned;
          context: ReviewTaskMachineContextType;
      }
    | {
          value: ReviewTaskStates.reported;
          context: ReviewTaskMachineContextType;
      }
    | {
          value: ReviewTaskStates.published;
          context: ReviewTaskMachineContextType;
      };
