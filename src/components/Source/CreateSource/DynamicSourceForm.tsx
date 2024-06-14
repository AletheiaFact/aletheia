import AletheiaButton, { ButtonType } from "../../Button";
import React, { useRef, useState } from "react";
import AletheiaCaptcha from "../../AletheiaCaptcha";
import DynamicForm from "../../Form/DynamicForm";
import { Row } from "antd";
import { useForm } from "react-hook-form";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../../atoms/namespace";
import { currentUserId } from "../../../atoms/currentUser";
import SourceApi from "../../../api/sourceApi";
import createSourceForm from "./fieldLists/createSourceForm";

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
    const recaptchaRef = useRef(null);

    const onSubmit = ({ source }) => {
        const newSource = {
            nameSpace,
            href: source,
            user: userId,
            recaptcha: recaptchaString,
            props: {},
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
                machineValues={{}}
                control={control}
                errors={errors}
            />

            <AletheiaCaptcha onChange={setRecaptchaString} ref={recaptchaRef} />
            <Row
                style={{
                    padding: "32px 0 0",
                    justifyContent: "space-evenly",
                }}
            >
                <AletheiaButton
                    type={ButtonType.gray}
                    onClick={() => router.back()}
                >
                    {t("claimForm:cancelButton")}
                </AletheiaButton>
                <AletheiaButton
                    loading={isLoading}
                    type={ButtonType.blue}
                    htmlType="submit"
                    disabled={!hasCaptcha || isLoading}
                    data-cy={"testSaveButton"}
                >
                    {t("claimForm:saveButton")}
                </AletheiaButton>
            </Row>
        </form>
    );
};

export default DynamicSourceForm;
