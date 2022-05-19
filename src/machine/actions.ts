import { assign } from "xstate"
import { reviewTaskMachineContext } from "./context";
import { AssignEvent } from "./events";


export const assignedUser = assign<reviewTaskMachineContext, AssignEvent>({
    userId: (_context, event) => event.userId,
    sentence_hash: (_context, event) => event.sentence_hash
});
