import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../../atoms/namespace";
import createVerificationRequestForm from "./fieldLists/CreateVerificationRequestForm";
import verificationRequestApi from "../../../api/verificationRequestApi";
import moment from "moment";
import DynamicForm from "../../Form/DynamicForm";
import SharedFormFooter from "../../SharedFormFooter";

const DynamicVerificationRequestForm = () => {
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm();
    const disabledDate = (current) =>
        current && current > moment().endOf("day");
    const router = useRouter();
    const { t } = useTranslation();
    const [nameSpace] = useAtom(currentNameSpace);
    const [isLoading, setIsLoading] = useState(false);
    const [recaptchaString, setRecaptchaString] = useState("");
    const hasCaptcha = !!recaptchaString;

    const onSubmit = (data) => {
        const newVerificationRequest = {
            nameSpace,
            content: data.content,
            source: data.source,
            publicationDate: data.publicationDate,
            email: data.email,
            date: new Date(),
            heardFrom: data.heardFrom,
            recaptcha: recaptchaString,
        };

        verificationRequestApi
            .createVerificationRequest(t, router, newVerificationRequest)
            .then((s) => {
                router.push(`/verification-request/${s.data_hash}`);
                setIsLoading(false);
            });
    };

    return (
        <form
            style={{ width: "100%", margin: "64px 0" }}
            onSubmit={handleSubmit(onSubmit)}
        >
            <DynamicForm
                currentForm={createVerificationRequestForm}
                control={control}
                errors={errors}
                disabledDate={disabledDate}
            />

            <SharedFormFooter
                isLoading={isLoading}
                setRecaptchaString={setRecaptchaString}
                hasCaptcha={hasCaptcha}
            />
        </form>
    );
};

export default DynamicVerificationRequestForm;
