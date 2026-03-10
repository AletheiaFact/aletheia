import React from "react";
import { useForm } from "react-hook-form";
import DynamicForm from "../../Form/DynamicForm";
import SharedFormFooter from "../../SharedFormFooter";
import { IDynamicEventForm } from "../../../types/event";
import lifecycleEventForm from "./CreateEventForm";

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
