import { createContext, useEffect, useState } from "react";
import { initialContext } from "../machines/createClaim/context";
import { createNewCreateClaimMachineService } from "../machines/createClaim/createClaimMachine";
import { CreateClaimStates } from "../machines/createClaim/types";
import { useAppSelector } from "../store/store";
import { ContentModelEnum } from "../types/enums";

interface ContextType {
    machineService: any;
}

export const CreateClaimMachineContext = createContext<ContextType>({
    machineService: null,
});

export const CreateClaimMachineProvider = (props) => {
    const [providedMachineService, setprovidedMachineService] = useState(null);
    const { enableImageClaim } = useAppSelector((state) => state.featureFlags);

    const context = {
        ...initialContext,
        ...props.context,
    };

    if (!enableImageClaim) {
        context.claimData.contentModel = ContentModelEnum.Speech;
    }

    useEffect(() => {
        const machine = {
            context,
            value: enableImageClaim
                ? CreateClaimStates.notStarted
                : CreateClaimStates.setupSpeech,
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
