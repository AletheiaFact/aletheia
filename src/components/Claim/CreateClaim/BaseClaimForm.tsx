import React, { useState } from "react";
import { Checkbox, Form, Row } from "antd";
import moment from "moment";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import colors from "../../../styles/colors";
import AletheiaCaptcha from "../../AletheiaCaptcha";
import Input from "../../AletheiaInput";
import Button, { ButtonType } from "../../Button";
import DatePickerInput from "../../Form/DatePickerInput";
import SourceInput from "../../Source/SourceInput";
import { CircularProgress } from "@mui/material";

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
    const [date, setDate] = useState("");
    const [disableSubmit, setDisableSubmit] = useState(true);
    const [sources, setSources] = useState([""]);
    const [recaptcha, setRecaptcha] = useState("");

    const disabledDate = (current) => {
        return disableFutureDates && current && current > moment().endOf("day");
    };

    const onChangeCaptcha = (captchaString) => {
        setRecaptcha(captchaString);
        const hasRecaptcha = !!captchaString;
        setDisableSubmit(!hasRecaptcha);
    };

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
        <Form
            layout="vertical"
            id="createClaim"
            onFinish={onFinish}
            style={{ padding: "32px 0" }}
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
                wrapperCol={{ sm: 24 }}
                style={{
                    width: "100%",
                }}
            >
                <Input
                    value={title || ""}
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
                    {
                        required: true,
                        message: t("claimForm:dateFieldError"),
                    },
                ]}
                extra={dateExtraText}
                wrapperCol={{ sm: 24 }}
                style={{
                    width: "100%",
                    marginBottom: "24px",
                }}
            >
                <DatePickerInput
                    placeholder={t("claimForm:dateFieldPlaceholder")}
                    onChange={(value) => setDate(value)}
                    data-cy={"testSelectDate"}
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
                <Form.Item
                    style={{
                        color: colors.error,
                    }}
                >
                    {disclaimer}
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
            <Form.Item>
                <AletheiaCaptcha onChange={onChangeCaptcha} />
            </Form.Item>
            <Row
                style={{
                    justifyContent: "space-evenly",
                    marginBottom: "20px",
                }}
            >
                <Button buttonType={ButtonType.white} onClick={() => router.back()}>
                    {t("claimForm:cancelButton")}
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={disableSubmit || isLoading}
                    startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
                    data-cy={"testSaveButton"}
                >
                    {t("claimForm:saveButton")}
                </Button>
            </Row>
        </Form>
    );
};

export default BaseClaimForm;
