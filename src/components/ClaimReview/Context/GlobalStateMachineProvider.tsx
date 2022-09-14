import { useTranslation } from "next-i18next";
import { createContext, useEffect, useState } from "react";
import ClaimReviewTaskApi from "../../../api/ClaimReviewTaskApi";
import { initialContext } from "../../../machine/context";
import { ReviewTaskStates } from "../../../machine/enums";
import { createNewMachineService } from "../../../machine/reviewTaskMachine";
import { useAppSelector } from "../../../store/store";

interface GlobalContextType {
    machineService: any;
}

export const GlobalStateMachineContext = createContext<GlobalContextType>({
    machineService: null,
});

export const GlobalStateMachineProvider = (props) => {
    const { isLoggedIn } = useAppSelector((state) => ({
        isLoggedIn: state.login,
    }));
    const { t } = useTranslation();
    const [globalMachineService, setGlobalMachineService] = useState(null);

    useEffect(() => {
        isLoggedIn &&
            ClaimReviewTaskApi.getMachineBySentenceHash(
                props.data_hash,
                t
            ).then(({ machine }) => {
                // The states assigned and reported have compound states
                // and when we going to save we get "assigned: undraft" as a value.
                // The machine doesn't recognize when we try to persist state the initial value
                // 'cause the value it's an object. So for these states, we get only the key value
                if (machine) {
                    machine.value =
                        machine.value !== ReviewTaskStates.published
                            ? Object.keys(machine.value)[0]
                            : machine.value;
                    machine.context.utils = { t };
                }
                const newMachine = machine || {
                    context: initialContext,
                    value: ReviewTaskStates.unassigned,
                };
                setGlobalMachineService(createNewMachineService(newMachine));
            });
    }, []);

    return (
        <GlobalStateMachineContext.Provider
            value={{ machineService: globalMachineService }}
        >
            {globalMachineService && props.children}
        </GlobalStateMachineContext.Provider>
    );
};
