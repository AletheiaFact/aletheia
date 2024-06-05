import React, { useState } from "react";
import { Checkbox, Col, Form, Row } from "antd";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import colors from "../../../styles/colors";
import AletheiaCaptcha from "../../AletheiaCaptcha";
import Input from "../../AletheiaInput";
import Button, { ButtonType } from "../../Button";
import TextArea from "../../TextArea";
import { SelectInput } from "../../Form/ClaimReviewSelect";
import { Option } from "antd/lib/mentions";
import ClassificationText from "../../ClassificationText";

interface BaseSourceFormProps {
    handleSubmit: (values: any) => void;
    disableFutureDates?: boolean;
    isLoading: boolean;
    disclaimer?: string;
    dateExtraText: string;
}

const BaseSourceForm = ({
    handleSubmit,
    isLoading,
    disclaimer,
}: BaseSourceFormProps) => {
    const { t } = useTranslation();
    const router = useRouter();
    const [disableSubmit, setDisableSubmit] = useState(true);
    const [recaptcha, setRecaptcha] = useState("");

    const onChangeCaptcha = (captchaString) => {
        setRecaptcha(captchaString);
        const hasRecaptcha = !!captchaString;
        setDisableSubmit(!hasRecaptcha);
    };

    const onFinish = (values) => {
        handleSubmit({ ...values, recaptcha });
    };

    return (
        <Form
            layout="vertical"
            id="createClaim"
            onFinish={onFinish}
            style={{ padding: "32px 0" }}
        >
            <Form.Item
                name={"source"}
                label={t("sourceForm:sourceLabel")}
                rules={[
                    {
                        message: t("sourceForm:errorMessageValidURL"),
                        type: "url",
                    },
                    {
                        required: true,
                        message: t("common:requiredFieldError"),
                    },
                ]}
            >
                <Row>
                    <Col span={24}>
                        <Input
                            placeholder={t("sourceForm:placeholder")}
                            data-cy={"testSource1"}
                        />
                    </Col>
                </Row>
            </Form.Item>

            <Form.Item
                name={"summary"}
                label={t("sourceForm:summaryLabel")}
                rules={[
                    {
                        required: true,
                        whitespace: true,
                        message: t("claimForm:contentFieldError"),
                    },
                ]}
                wrapperCol={{ sm: 24 }}
                style={{
                    width: "100%",
                    marginBottom: "24px",
                }}
            >
                <TextArea
                    rows={4}
                    placeholder={t("sourceForm:summaryPlaceholder")}
                    data-cy={"testContentClaim"}
                />
            </Form.Item>

            <Form.Item
                name={"classification"}
                label={t("sourceForm:classificationLabel")}
                rules={[
                    {
                        required: true,
                        message: t("common:requiredFieldError"),
                    },
                ]}
            >
                <SelectInput
                    data-cy={"testClassificationText"}
                    style={{ background: colors.lightGray }}
                    placeholder={t("sourceForm:classificationPlaceholder")}
                >
                    <Option value="" disabled>
                        {t("sourceForm:classificationPlaceholder")}
                    </Option>
                    <Option value="not-fact">
                        <ClassificationText classification="not-fact" />
                    </Option>
                    <Option value="trustworthy">
                        <ClassificationText classification="trustworthy" />
                    </Option>
                    <Option value="trustworthy-but">
                        <ClassificationText classification="trustworthy-but" />
                    </Option>
                    <Option value="arguable">
                        <ClassificationText classification="arguable" />
                    </Option>
                    <Option value="misleading">
                        <ClassificationText classification="misleading" />
                    </Option>
                    <Option value="false">
                        <ClassificationText classification="false" />
                    </Option>
                    <Option value="unsustainable">
                        <ClassificationText classification="unsustainable" />
                    </Option>
                    <Option value="exaggerated">
                        <ClassificationText classification="exaggerated" />
                    </Option>
                    <Option value="unverifiable">
                        <ClassificationText classification="unverifiable" />
                    </Option>
                </SelectInput>
            </Form.Item>

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

export default BaseSourceForm;
