import { useTranslation } from "next-i18next";
import { createContext, useEffect, useState } from "react";

import ClaimReviewApi from "../../api/claimReviewApi";
import ClaimReviewTaskApi from "../../api/ClaimReviewTaskApi";
import Loading from "../../components/Loading";
import { initialContext } from "./context";
import { ReviewTaskEvents, ReviewTaskStates } from "./enums";
import { createNewMachineService } from "./reviewTaskMachine";
import getNextForm from "./getNextForm";
import getNextEvents from "./getNextEvent";
import { FormField } from "../../components/Form/FormField";

interface ContextType {
    machineService: any;
    publishedReview?: { review: any };
    setFormAndEvents?: (param: string, isSameLabel?: boolean) => void;
    form?: FormField[];
    events?: ReviewTaskEvents[];
}

export const ReviewTaskMachineContext = createContext<ContextType>({
    machineService: null,
});

interface ReviewTaskMachineProviderProps {
    data_hash: string;
    children: React.ReactNode;
    baseMachine?: any;
    publishedReview?: { review: any };
}

/* We chose not to use Jotai as the provider for this machine because we need
 * to recreate the machine service every time the drawer is opened and at the
 * moment the best option seems to be to use context rather than try to get
 * around Jotai's default behavior of keeping the first machine created.
 */

export const ReviewTaskMachineProvider = (
    props: ReviewTaskMachineProviderProps
) => {
    const [globalMachineService, setGlobalMachineService] = useState(null);
    const [publishedClaimReview, setPublishedClaimReview] = useState(
        props.publishedReview
    );
    const [form, setForm] = useState(null);
    const [events, setEvents] = useState(null);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const preloadedOptions =
        globalMachineService?.state?.context?.preloadedOptions;

    useEffect(() => {
        const fetchReviewTask = (data_hash) => {
            return props.baseMachine
                ? Promise.resolve(props.baseMachine)
                : ClaimReviewTaskApi.getMachineByDataHash(data_hash);
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

    const setPreloadAssignedUsers = (form) => {
        if (!preloadedOptions) {
            return form;
        }

        form.forEach((item) => {
            if (
                item.type === "inputSearch" &&
                preloadedOptions[item.fieldName]
            ) {
                item.extraProps.preloadedOptions =
                    preloadedOptions[item.fieldName];
            }
        });

        return form;
    };

    const setFormAndEvents = (
        param: ReviewTaskEvents | ReviewTaskStates,
        isSameLabel: boolean = false
    ): void => {
        if (param === ReviewTaskEvents.draft) {
            return;
        }

        const nextForm = setPreloadAssignedUsers(
            getNextForm(param, isSameLabel)
        );
        setForm(nextForm);
        setEvents(getNextEvents(param, isSameLabel));
    };

    return (
        <ReviewTaskMachineContext.Provider
            value={{
                machineService: globalMachineService,
                publishedReview: publishedClaimReview,
                setFormAndEvents,
                form,
                events,
            }}
        >
            {loading && <Loading />}
            {!loading && globalMachineService && props.children}
        </ReviewTaskMachineContext.Provider>
    );
};
