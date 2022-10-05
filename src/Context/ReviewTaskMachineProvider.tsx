import { createContext, useEffect, useState } from "react";

import { initialContext } from "../reviewTaskMachine/context";
import { ReviewTaskStates } from "../reviewTaskMachine/enums";
import { createNewMachineService } from "../reviewTaskMachine/reviewTaskMachine";

interface ContextType {
    machineService: any;
}

export const ReviewTaskMachineContext = createContext<ContextType>({
    machineService: null,
});

export const ReviewTaskMachineProvider = (props) => {
    const [globalMachineService, setGlobalMachineService] = useState(null);

    useEffect(() => {
        // The states assigned and reported have compound states
        // and when we going to save we get "assigned: undraft" as a value.
        // The machine doesn't recognize when we try to persist state the initial value
        // 'cause the value it's an object. So for these states, we get only the key value
        const machine = props.baseMachine;
        if (machine) {
            machine.value =
                typeof machine.value !== "string"
                    ? Object.keys(machine.value)[0]
                    : machine.value;
        }
        const newMachine = machine || {
            context: initialContext,
            value: ReviewTaskStates.unassigned,
        };
        setGlobalMachineService(createNewMachineService(newMachine));
    }, []);

    return (
        <ReviewTaskMachineContext.Provider
            value={{ machineService: globalMachineService }}
        >
            {globalMachineService && props.children}
        </ReviewTaskMachineContext.Provider>
    );
};
