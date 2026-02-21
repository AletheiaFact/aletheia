import moment from "moment";
import { useForm } from "react-hook-form";
import { IDynamicNameSpaceForm } from "../../types/Namespace";
import lifecycleNameSpaceForm from "./NameSpaceForm";
import DynamicForm from "../Form/DynamicForm";
import SharedFormFooter from "../SharedFormFooter";
import { useState } from "react";
import { Grid } from "@mui/material";
import Button from "../Button";
import DailyReportApi from "../../api/dailyReport";

const DynamicNameSpaceForm = ({
    nameSpace,
    onSubmit,
    isLoading,
    setIsLoading,
    isDrawerOpen,
    onClose,
    t,
}: IDynamicNameSpaceForm) => {
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm();
    const disabledDate = (current) =>
        current && current > moment().endOf("day");
    const [recaptchaString, setRecaptchaString] = useState("");
    const hasCaptcha = !!recaptchaString;

    const handleDailyReviews = async () => {
        setIsLoading(true);
        try {
            await DailyReportApi.sendDailyReportEmail(
                nameSpace._id,
                nameSpace.slug,
                t
            );
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Grid item xs={10}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DynamicForm
                    currentForm={lifecycleNameSpaceForm}
                    control={control}
                    errors={errors}
                    disabledDate={disabledDate}
                    machineValues={nameSpace}
                />

                <SharedFormFooter
                    isLoading={isLoading}
                    setRecaptchaString={setRecaptchaString}
                    hasCaptcha={hasCaptcha}
                    isDrawerOpen={isDrawerOpen}
                    onClose={onClose}
                    extraButton={nameSpace?._id && (
                        <Button
                            onClick={handleDailyReviews}
                            loading={isLoading}
                            htmlType="button"
                        >
                            {t("notification:dailyReportButton") as string}
                        </Button>
                    )}
                />
            </form >
        </Grid >
    )
}

export default DynamicNameSpaceForm
