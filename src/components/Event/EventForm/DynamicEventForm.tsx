import React from "react";
import { useForm } from "react-hook-form";
import DynamicForm from "../../Form/DynamicForm";
import SharedFormFooter from "../../SharedFormFooter";
import { EventPayload } from "../../../types/event";
import lifecycleEventForm from "./CreateEventForm";
import { ManualTopic } from "../../../types/Topic";
import { ParticipantDraft } from "../Participants/participantDrafts";

/** Values held by the event form (and used to prefill it when editing). */
export type EventFormValues = Omit<
    EventPayload,
    "mainTopic" | "participants"
> & {
    mainTopic: ManualTopic;
    participants?: ParticipantDraft[];
};

interface IDynamicEventForm {
    data?: EventFormValues;
    onSubmit: (value: EventFormValues) => void;
    isLoading: boolean;
    setRecaptchaString: React.Dispatch<React.SetStateAction<string>>;
    hasCaptcha: boolean;
    isDrawerOpen?: boolean;
    onClose?: () => void;
}

const DynamicEventForm = ({
    data,
    onSubmit,
    isLoading,
    setRecaptchaString,
    hasCaptcha,
    isDrawerOpen = false,
    onClose = () => {},
}: IDynamicEventForm) => {
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm();

    return (
        <form style={{ width: "100%" }} onSubmit={handleSubmit(onSubmit)}>
            <DynamicForm
                currentForm={lifecycleEventForm}
                control={control}
                errors={errors}
                disabledFuture={false}
                machineValues={data}
            />

            <SharedFormFooter
                isLoading={isLoading}
                setRecaptchaString={setRecaptchaString}
                hasCaptcha={hasCaptcha}
                isDrawerOpen={isDrawerOpen}
                onClose={onClose}
            />
        </form>
    );
};

export default DynamicEventForm;
