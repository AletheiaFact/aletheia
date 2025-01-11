import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../../atoms/namespace";
import { currentUserId } from "../../../atoms/currentUser";
import SourceApi from "../../../api/sourceApi";
import DynamicForm from "../../Form/DynamicForm";
import createSourceForm from "./fieldLists/createSourceForm";
import SharedFormFooter from "../../SharedFormFooter";

const DynamicSourceForm = () => {
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm();
    const router = useRouter();
    const { t } = useTranslation();
    const [nameSpace] = useAtom(currentNameSpace);
    const [userId] = useAtom(currentUserId);
    const [isLoading, setIsLoading] = useState(false);
    const [recaptchaString, setRecaptchaString] = useState("");
    const hasCaptcha = !!recaptchaString;

    const onSubmit = ({ source }) => {
        const newSource = {
            nameSpace,
            href: source,
            user: userId,
            recaptcha: recaptchaString,
        };

        SourceApi.createSource(t, router, newSource).then((s) => {
            router.push(`/source/${s.data_hash}`);
            setIsLoading(false);
        });
    };

    return (
        <form
            style={{ width: "100%", margin: "64px 0" }}
            onSubmit={handleSubmit(onSubmit)}
        >
            <DynamicForm
                currentForm={createSourceForm}
                control={control}
                errors={errors}
            />

            <SharedFormFooter
                isLoading={isLoading}
                setRecaptchaString={setRecaptchaString}
                hasCaptcha={hasCaptcha}
            />
        </form>
    );
};

export default DynamicSourceForm;
