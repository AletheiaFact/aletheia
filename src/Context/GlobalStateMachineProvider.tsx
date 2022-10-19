import { useTranslation } from "next-i18next";
import { createContext, useEffect, useState } from "react";
import ClaimReviewTaskApi from "../api/ClaimReviewTaskApi";
import Loading from "../components/Loading";

import { initialContext } from "../machine/context";
import { ReviewTaskStates } from "../machine/enums";
import { createNewMachineService } from "../machine/reviewTaskMachine";

interface GlobalContextType {
    machineService: any;
}

export const GlobalStateMachineContext = createContext<GlobalContextType>({
    machineService: null,
});

export const GlobalStateMachineProvider = (props) => {
    const [globalMachineService, setGlobalMachineService] = useState(null);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        const fetchReviewTask = (data_hash) => {
            return props.baseMachine
                ? new Promise<void>((resolve, reject) => {
                      resolve(props.baseMachine);
                  })
                : ClaimReviewTaskApi.getMachineBySentenceHash(data_hash, t);
        };
        setLoading(true);
        fetchReviewTask(props.data_hash).then((machine) => {
            // The states assigned and reported have compound states
            // and when we going to save we get "assigned: undraft" as a value.
            // The machine doesn't recognize when we try to persist state the initial value
            // 'cause the value it's an object. So for these states, we get only the key value
            if (machine) {
                console.log(
                    "provider fetchReviewTask",
                    props.data_hash,
                    machine
                );
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
            setLoading(false);
        });
    }, [props.baseMachine, props.data_hash, t]);

    return (
        <GlobalStateMachineContext.Provider
            value={{ machineService: globalMachineService }}
        >
            {loading && <Loading />}
            {!loading && globalMachineService && props.children}
        </GlobalStateMachineContext.Provider>
    );
};
