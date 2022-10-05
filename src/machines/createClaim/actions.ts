import { assign } from "xstate";
import { SaveContextEvent } from "./events";
import { CreateClaimContext } from "./context";

export const saveClaimContext = assign<CreateClaimContext, SaveContextEvent>(
    (context, event) => {
        return {
            claimData: {
                ...context.claimData,
                ...event.claimData,
            },
        };
    }
);
