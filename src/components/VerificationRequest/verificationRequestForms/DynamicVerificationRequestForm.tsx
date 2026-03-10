import React from "react";
import { useForm } from "react-hook-form";
import createVerificationRequestForm from "./fieldLists/CreateVerificationRequestForm";
import DynamicForm from "../../Form/DynamicForm";
import SharedFormFooter from "../../SharedFormFooter";
import editVerificationRequestForm from "./fieldLists/EditVerificationRequestForm";
import { IDynamicVerificationRequestForm } from "../../../types/VerificationRequest";

const DynamicVerificationRequestForm = ({
    data,
    onSubmit,
    isLoading,
    setRecaptchaString,
    hasCaptcha,
    isEdit,
    isDrawerOpen,
    onClose
}: IDynamicVerificationRequestForm) => {
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
                currentForm={isEdit ? editVerificationRequestForm : createVerificationRequestForm}
                control={control}
                errors={errors}
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

export default DynamicVerificationRequestForm;
