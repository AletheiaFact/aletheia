import React from "react";
import { useForm } from "react-hook-form";
import DynamicForm from "../../Form/DynamicForm";
import SharedFormFooter from "../../SharedFormFooter";
import { EventPayload } from "../../../types/event";
import lifecycleEventForm from "./CreateEventForm";

interface IDynamicEventForm {
    data?: EventPayload;
    onSubmit: (value: EventPayload) => void;
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
    onClose = () => { },
}: IDynamicEventForm) => {
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm();

    const formattedEvent = {
        ...data,
        mainTopic: {
            label: data.mainTopic.name,
            value: data.mainTopic.wikidataId,
            aliases: data.mainTopic.aliases || [],
            matchedAlias: null,
            displayLabel: data.mainTopic.name,
        }
    };

    return (
        <form
            style={{ width: "100%" }}
            onSubmit={handleSubmit(onSubmit)}
        >
            <DynamicForm
                currentForm={lifecycleEventForm}
                control={control}
                errors={errors}
                disabledFuture={false}
                machineValues={formattedEvent}
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
