import { createContext, useEffect, useState } from "react";
import { initialContext } from "../machines/createClaim/context";
import { createNewCreateClaimMachineService } from "../machines/createClaim/createClaimMachine";
import { CreateClaimStates } from "../machines/createClaim/types";

interface ContextType {
    machineService: any;
}

export const CreateClaimMachineContext = createContext<ContextType>({
    machineService: null,
});

export const CreateClaimMachineProvider = (props) => {
    const [providedMachineService, setprovidedMachineService] = useState(null);

    useEffect(() => {
        const machine = {
            context: props.context || initialContext,
            value: CreateClaimStates.notStarted,
        };

        setprovidedMachineService(createNewCreateClaimMachineService(machine));
    }, []);

    return (
        <CreateClaimMachineContext.Provider
            value={{ machineService: providedMachineService }}
        >
            {providedMachineService && props.children}
        </CreateClaimMachineContext.Provider>
    );
};
