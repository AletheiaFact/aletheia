import { assign } from "xstate"
import { reviewTaskMachineContext } from "./context";
import { AssignEvent } from "./events";


export const assignedUser = assign<reviewTaskMachineContext, AssignEvent>({
  id: (_context, event) => event.id,
  sentenceHash: (_context, event) => event.sentenceHash
});
