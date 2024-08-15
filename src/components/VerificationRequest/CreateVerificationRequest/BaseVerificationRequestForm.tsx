import React, { useState } from "react";
import { Form } from "antd";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import TextArea from "../../TextArea";
import Input from "../../AletheiaInput";
import DatePickerInput from "../../Form/DatePickerInput";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../../atoms/namespace";
import BaseForm from "../../Claim/CreateClaim/BaseForm";
import useFormManagement from "../../../utils/useFormManagement";

const CreateVerificationRequestForm = ({
    handleSubmit,
    disableFutureDates,
    isLoading,
}) => {
    const { t } = useTranslation();
    const router = useRouter();
    const [nameSpace] = useAtom(currentNameSpace);
    const [heardFrom, setHeardFrom] = useState("");
    const [email, setEmail] = useState("");
    const [content, setContent] = useState("");
    const [source, setSource] = useState("");
    const {
        recaptcha,
        disableSubmit,
        date,
        setDate,
        disabledDate,
        onChangeCaptcha,
    } = useFormManagement(disableFutureDates);

    const onFinish = () => {
        const newVerificationRequest = {
            nameSpace,
            content,
            source,
            publicationDate: date,
            email,
            date: new Date(),
            heardFrom,
            recaptcha,
        };
        handleSubmit(newVerificationRequest);
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
                name="content"
                label={t(
                    "verificationRequest:verificationRequestCreateContentLabel"
                )}
                rules={[
                    {
                        required: true,
                        message: t("verificationRequest:contentFieldError"),
                    },
                ]}
            >
                <TextArea
                    rows={4}
                    value={content}
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
                extra={t("verificationRequest:heardFromExtraText")}
            >
                <Input
                    value={heardFrom}
                    onChange={(e) => setHeardFrom(e.target.value)}
                    placeholder={t(
                        "verificationRequest:verificationRequestCreateHeardFromPlaceholder"
                    )}
                    data-cy={"testHeardFromVerificationRequestForm"}
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
                        message: t("verificationRequest:dateFieldError"),
                    },
                ]}
            >
                <DatePickerInput
                    placeholder={t(
                        "verificationRequest:verificationRequestCreatePublicationDatePlaceholder"
                    )}
                    onChange={setDate}
                    data-cy={"testSelectDate"}
                    disabledDate={disabledDate}
                />
            </Form.Item>

            <Form.Item
                name="source"
                label={t(
                    "verificationRequest:verificationRequestCreateSourceLabel"
                )}
                extra={t("verificationRequest:sourceExtraText")}
            >
                <Input
                    value={source}
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
                extra={t("verificationRequest:emailFromExtraText")}
            >
                <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t(
                        "verificationRequest:verificationRequestCreateEmailPlaceholder"
                    )}
                    data-cy={"testEmailVerificationRequestForm"}
                />
            </Form.Item>
        </BaseForm>
    );
};

export default CreateVerificationRequestForm;
