import React, { useState } from "react";
import { Checkbox, Form } from "antd";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import Input from "../../AletheiaInput";
import DatePickerInput from "../../Form/DatePickerInput";
import SourceInput from "../../Source/SourceInput";
import BaseForm from "./BaseForm";
import useFormManagement from "../../../utils/useFormManagement";
import colors from "../../../styles/colors";
interface BaseClaimFormProps {
    content?: React.ReactNode;
    handleSubmit: (values: any) => void;
    disableFutureDates?: boolean;
    isLoading: boolean;
    disclaimer?: string;
    dateExtraText: string;
}

const BaseClaimForm = ({
    content,
    handleSubmit,
    disableFutureDates,
    isLoading,
    disclaimer,
    dateExtraText,
}: BaseClaimFormProps) => {
    const { t } = useTranslation();
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [sources, setSources] = useState([""]);
    const {
        recaptcha,
        disableSubmit,
        date,
        setDate,
        disabledDate,
        onChangeCaptcha,
    } = useFormManagement(disableFutureDates);

    const onFinish = () => {
        const values = {
            title,
            date,
            sources,
            recaptcha,
        };
        handleSubmit(values);
    };

    return (
        <BaseForm
            onFinish={onFinish}
            isLoading={isLoading}
            disableSubmit={disableSubmit}
            onChangeCaptcha={onChangeCaptcha}
            router={router}
            t={t}
        >
            <Form.Item
                name="title"
                label={t("claimForm:titleField")}
                rules={[
                    {
                        required: true,
                        message: t("claimForm:titleFieldError"),
                        whitespace: true,
                    },
                ]}
            >
                <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={t("claimForm:titleFieldPlaceholder")}
                    data-cy={"testTitleClaimForm"}
                />
            </Form.Item>

            {content}

            <Form.Item
                name="date"
                label={t("claimForm:dateField")}
                rules={[
                    { required: true, message: t("claimForm:dateFieldError") },
                ]}
                extra={dateExtraText}
            >
                <DatePickerInput
                    placeholder={t("claimForm:dateFieldPlaceholder")}
                    onChange={setDate}
                    disabledDate={disabledDate}
                />
            </Form.Item>

            <SourceInput
                name="source"
                label={t("sourceForm:label")}
                onChange={(e, index) => {
                    setSources(
                        sources.map((source, i) => {
                            return i === index ? e.target.value : source;
                        })
                    );
                }}
                addSource={() => {
                    setSources(sources.concat(""));
                }}
                removeSource={(index) => {
                    setSources(
                        sources.filter((_source, i) => {
                            return i !== index;
                        })
                    );
                }}
                placeholder={t("sourceForm:placeholder")}
                sources={sources}
            />

            {disclaimer && (
                <Form.Item>
                    <div style={{ color: colors.redText }}>{disclaimer}</div>
                </Form.Item>
            )}
            <Form.Item
                name="accept_terms"
                rules={[
                    {
                        required: true,
                        message: t("claimForm:errorAcceptTerms"),
                    },
                ]}
                valuePropName="checked"
            >
                <Checkbox data-cy={"testCheckboxAcceptTerms"}>
                    {t("claimForm:checkboxAcceptTerms")}
                </Checkbox>
            </Form.Item>
        </BaseForm>
    );
};

export default BaseClaimForm;
