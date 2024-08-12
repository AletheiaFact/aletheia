import React, { useState } from "react";
import { Form, Row } from "antd";
import moment from "moment";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import AletheiaCaptcha from "../../AletheiaCaptcha";
import Input from "../../AletheiaInput";
import Button, { ButtonType } from "../../Button";
import DatePickerInput from "../../Form/DatePickerInput";
import TextArea from "../../TextArea";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../../atoms/namespace";

const BaseVerificationRequestForm = ({
    handleSubmit,
    disableFutureDates,
    isLoading,
}) => {
    const { t } = useTranslation();
    const router = useRouter();
    const [nameSpace] = useAtom(currentNameSpace);
    const [heardFrom, setHeardFrom] = useState("");
    const [email, setEmail] = useState("");
    const [date, setDate] = useState("");
    const [content, setContent] = useState("");
    const [disableSubmit, setDisableSubmit] = useState(true);
    const [source, setSource] = useState("");
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
        const newVerificationRequest = {
            nameSpace,
            content: content,
            source: source,
            publicationDate: date,
            email: email,
            date: new Date(),
            heardFrom: heardFrom,
            recaptcha: recaptcha,
        };
        handleSubmit(newVerificationRequest);
    };

    return (
        <Form
            layout="vertical"
            id="createVerificationRequest"
            onFinish={onFinish}
            style={{ padding: "32px 0" }}
        >
            <Form.Item
                name="content"
                label={t(
                    "verificationRequest:verificationRequestCreateContentLabel"
                )}
                rules={[
                    {
                        required: true,
                        whitespace: true,
                        //Another here
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
                    value={content || ""}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={t(
                        "verificationRequest:verificationRequestCreateContentPlaceholder"
                    )}
                    data-cy={"testContentVerificationRequest"}
                />
            </Form.Item>
            <Form.Item
                name="heardFrom"
                label={t(
                    "verificationRequest:verificationRequestCreateHeardFromLabel"
                )}
                wrapperCol={{ sm: 24 }}
                style={{
                    width: "100%",
                }}
            >
                <Input
                    value={heardFrom || ""}
                    onChange={(e) => setHeardFrom(e.target.value)}
                    placeholder={t(
                        "verificationRequest:verificationRequestCreateHeardFromPlaceholder"
                    )}
                    data-cy={"testTitleClaimForm"}
                />
            </Form.Item>
            <Form.Item
                name="date"
                label={t(
                    "verificationRequest:verificationRequestCreatePublicationDateLabel"
                )}
                rules={[
                    {
                        required: true,
                        message: t("claimForm:dateFieldError"),
                    },
                ]}
                wrapperCol={{ sm: 24 }}
                style={{
                    width: "100%",
                    marginBottom: "24px",
                }}
            >
                <DatePickerInput
                    placeholder={t(
                        "verificationRequest:verificationRequestCreatePublicationDatePlaceholder"
                    )}
                    onChange={(value) => setDate(value)}
                    data-cy={"testSelectDate"}
                    disabledDate={disabledDate}
                />
            </Form.Item>
            <Form.Item
                name="source"
                label={t(
                    "verificationRequest:verificationRequestCreateSourceLabel"
                )}
                wrapperCol={{ sm: 24 }}
                style={{
                    width: "100%",
                }}
                rules={[
                    {
                        message: t("sourceForm:errorMessageValidURL"),
                        type: "url",
                    },
                ]}
            >
                <Input
                    value={source || ""}
                    onChange={(e) => setSource(e.target.value)}
                    placeholder={t(
                        "verificationRequest:verificationRequestCreateSourcePlaceholder"
                    )}
                    data-cy={"testSourceVerificationRequestForm"}
                />
            </Form.Item>
            <Form.Item
                name="email"
                label={t(
                    "verificationRequest:verificationRequestCreateEmailLabel"
                )}
                wrapperCol={{ sm: 24 }}
                style={{
                    width: "100%",
                }}
            >
                <Input
                    value={email || ""}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t(
                        "verificationRequest:verificationRequestCreateEmailPlaceholder"
                    )}
                    data-cy={"testEmailVerificationRequestForm"}
                />
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

export default BaseVerificationRequestForm;
