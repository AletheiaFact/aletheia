import React, { useState } from "react";
import { Checkbox, Form, Row, message } from "antd";
import moment from "moment";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import colors from "../../../styles/colors";
import AletheiaCaptcha from "../../AletheiaCaptcha";
import Input from "../../AletheiaInput";
import Button, { ButtonType } from "../../Button";
import DatePickerInput from "../../Form/DatePickerInput";
import SourceInput from "../../Source/SourceInput";
import SourceApi from "../../../api/sourceApi";

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

    const checkLink = async (url) => {

        try {
            const request = await SourceApi.checkSource(url);
            if (request?.status === 200) {
                return true;
            } else {
                message.error(t("sources:sourceInvalid"));
                return false;
            }
        } catch (error) {
            message.error(t("sources:sourceInvalid"));
            return false;
        }
    }

    const onFinish = async () => {

        const validSource = await Promise.all(
            sources.map((source) => checkLink(source)));

            if (validSource.includes(false)) return;

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
                        color: colors.redText,
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
                <Button type={ButtonType.white} onClick={() => router.back()}>
                    {t("claimForm:cancelButton")}
                </Button>
                <Button
                    loading={isLoading}
                    type={ButtonType.blue}
                    htmlType="submit"
                    disabled={disableSubmit || isLoading}
                    data-cy={"testSaveButton"}
                >
                    {t("claimForm:saveButton")}
                </Button>
            </Row>
        </Form>
    );
};

export default BaseClaimForm;
