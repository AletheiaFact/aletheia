import { Form, FormInstance, Row } from "antd";
import { useAtom } from "jotai";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React, { useState } from "react";

import { createClaimMachineAtom } from "../../../machines/createClaim/provider";
import { CreateClaimEvents } from "../../../machines/createClaim/types";
import AletheiaCaptcha from "../../AletheiaCaptcha";
import Input from "../../AletheiaInput";
import Button, { ButtonType } from "../../Button";
import DatePickerInput from "../../Form/DatePickerInput";
import SourceInput from "../../Source/SourceInput";

const formRef = React.createRef<FormInstance>();

const ClaimCreateDebate = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [disableSubmit, setDisableSubmit] = useState(true);
    const [sources, setSources] = useState([""]);
    const [recaptcha, setRecaptcha] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [_, send] = useAtom(createClaimMachineAtom);

    const saveClaim = () => {
        if (!isLoading) {
            setIsLoading(true);

            const claim = {
                title,
                date,
                sources,
                recaptcha,
            };
            send({
                type: CreateClaimEvents.persist,
                claimData: claim,
                t,
                router,
            });
        }
    };

    const onChangeCaptcha = (captchaString) => {
        setRecaptcha(captchaString);
        const hasRecaptcha = !!captchaString;
        setDisableSubmit(!hasRecaptcha);
    };

    return (
        <>
            <Form
                ref={formRef}
                layout="vertical"
                id="createClaim"
                onFinish={saveClaim}
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

                <Form.Item
                    name="date"
                    label={t("claimForm:dateField")}
                    rules={[
                        {
                            required: true,
                            message: t("claimForm:dateFieldError"),
                        },
                    ]}
                    extra={t("claimForm:dateFieldHelpDebate")}
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

                <Form.Item>
                    <AletheiaCaptcha onChange={onChangeCaptcha} />
                </Form.Item>
                <Row
                    style={{
                        justifyContent: "space-evenly",
                        marginBottom: "20px",
                    }}
                >
                    <Button
                        type={ButtonType.white}
                        onClick={() => router.back()}
                    >
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
        </>
    );
};

export default ClaimCreateDebate;
