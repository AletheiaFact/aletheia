import { useForm } from "react-hook-form";
import DynamicForm from "../Form/DynamicForm";
import SharedFormFooter from "../SharedFormFooter";
import { useState } from "react";
import { Grid } from "@mui/material";
import { IDynamicBadgesForm } from "../../types/Badge";
import lifecycleBadgesForm from "./BadgesForm";

const DynamicBadgesForm = ({
    badges,
    onSubmit,
    isLoading,
    isDrawerOpen,
    onClose
}: IDynamicBadgesForm) => {
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm();
    const [recaptchaString, setRecaptchaString] = useState("");
    const hasCaptcha = !!recaptchaString;

    return (
        <Grid item xs={10}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DynamicForm
                    currentForm={lifecycleBadgesForm}
                    control={control}
                    errors={errors}
                    machineValues={badges}
                />

                <SharedFormFooter
                    isLoading={isLoading}
                    setRecaptchaString={setRecaptchaString}
                    hasCaptcha={hasCaptcha}
                    isDrawerOpen={isDrawerOpen}
                    onClose={onClose}
                />
            </form>
        </Grid>
    )
}

export default DynamicBadgesForm
