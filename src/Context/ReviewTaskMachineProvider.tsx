import { useTranslation } from "next-i18next";
import { createContext, useEffect, useState } from "react";

import ClaimReviewApi from "../api/claimReviewApi";
import ClaimReviewTaskApi from "../api/ClaimReviewTaskApi";
import Loading from "../components/Loading";
import { initialContext } from "../machines/reviewTask/context";
import { ReviewTaskStates } from "../machines/reviewTask/enums";
import { createNewMachineService } from "../machines/reviewTask/reviewTaskMachine";

interface ContextType {
    machineService: any;
    publishedReview?: { review: any; descriptionForHide?: string };
}

export const ReviewTaskMachineContext = createContext<ContextType>({
    machineService: null,
});

interface ReviewTaskMachineProviderProps {
    data_hash: string;
    children: React.ReactNode;
    baseMachine?: any;
    publishedReview?: { review: any; descriptionForHide?: string };
}

export const ReviewTaskMachineProvider = (
    props: ReviewTaskMachineProviderProps
) => {
    const [globalMachineService, setGlobalMachineService] = useState(null);
    const [publishedClaimReview, setPublishedClaimReview] = useState(
        props.publishedReview
    );
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        const fetchReviewTask = (data_hash) => {
            return props.baseMachine
                ? Promise.resolve(props.baseMachine)
                : ClaimReviewTaskApi.getMachineBySentenceHash(data_hash, t);
        };
        setLoading(true);
        fetchReviewTask(props.data_hash).then((machine) => {
            // The states assigned and reported have compound states
            // and when we going to save we get "assigned: undraft" as a value.
            // The machine doesn't recognize when we try to persist state the initial value
            // 'cause the value it's an object. So for these states, we get only the key value
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
            setLoading(false);
        });
        if (!props.publishedReview) {
            ClaimReviewApi.getClaimReviewByHash(props.data_hash).then(
                (claimReview) => {
                    setPublishedClaimReview(claimReview);
                }
            );
        } else setPublishedClaimReview(props.publishedReview);
    }, [props.baseMachine, props.data_hash, props.publishedReview, t]);

    return (
        <ReviewTaskMachineContext.Provider
            value={{
                machineService: globalMachineService,
                publishedReview: publishedClaimReview,
            }}
        >
            {loading && <Loading />}
            {!loading && globalMachineService && props.children}
        </ReviewTaskMachineContext.Provider>
    );
};
