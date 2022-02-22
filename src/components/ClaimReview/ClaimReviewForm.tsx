import React, { useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Form } from "antd";
import ClaimReviewSelect from "../Form/ClaimReviewSelect";
import claimReviewApi from "../../api/claimReview";
import { useTranslation } from "next-i18next";
import SourceInput from "../Source/SourceInput";
import { useRouter } from "next/router";
import Button, { ButtonType } from "../Button";
import TextArea from "../TextArea";
import { PlusOutlined } from "@ant-design/icons";
import colors from "../../styles/colors";
const recaptchaRef = React.createRef<ReCAPTCHA>();

const ClaimReviewForm = ({
    claimId,
    personalityId,
    highlight,
    sitekey,
    handleOk,
    handleCancel,
}) => {
    const { t } = useTranslation();
    const router = useRouter();
    const claim = claimId;
    const personality = personalityId;
    const sentence_hash = highlight.props["data-hash"];
    const sentence_content = highlight.content;

    const [report, setReport] = useState("");
    const [classification, setClassification] = useState("");
    const [recaptcha, setRecaptcha] = useState("");
    const [sources, setSources] = useState([""]);
    const [disableSubmit, setDisableSubmit] = useState(true);

    const toggleDisabledSubmit = () => {
        const hasRecaptcha = !!recaptcha;
        const hasClassification = !!classification;
        if (hasClassification && classification.length === 0) {
            setDisableSubmit(true);
        } else {
            if (hasRecaptcha && hasClassification) {
                setDisableSubmit(!disableSubmit);
            }
        }
    };

    const onExpiredCaptcha = () => {
        return new Promise<void>(resolve => {
            setDisableSubmit(true);
            resolve();
        });
    }

    const onChangeCaptcha = () => {
        const recaptchaString = recaptchaRef.current.getValue();
        setRecaptcha(recaptchaString);
    }

    useEffect(() => {
        toggleDisabledSubmit();
    }, [recaptcha, classification]);

    const onChangeClassification = (value) => {
        if (value) {
            setClassification(value);
        }
    }

    const onSubmit = () => {
        if (recaptchaRef && recaptchaRef.current) {
            recaptchaRef.current.reset();
        }
        setDisableSubmit(true);
        claimReviewApi.save({
            classification,
            claim,
            personality,
            sentence_hash,
            sentence_content,
            report,
            recaptcha,
            sources
        }, t).then(response => {
            if (response.success) {
                handleOk();
                router.reload();
            }
        });

    }

    return (
        <>
            <Form onFinish={onSubmit} layout="vertical">
                <Form.Item
                    name="classification"
                    label={
                        <span
                            style={{
                                color: colors.black,
                                fontWeight: 600,
                                paddingLeft: 10,
                            }}
                        >
                            {t("claimReviewForm:selectLabel")}
                        </span>
                    }
                >
                    <ClaimReviewSelect
                        type="select"
                        onChange={onChangeClassification}
                        defaultValue=""
                    />
                </Form.Item>
                <SourceInput
                    name="source"
                    label={
                        <span
                            style={{
                                color: colors.black,
                                fontWeight: 600,
                            }}
                        >
                            {t("sourceForm:label")}
                        </span>
                    }
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
                            sources.filter((source, i) => {
                                return i !== index;
                            })
                        );
                    }}
                    placeholder={t("sourceForm:placeholder")}
                    sources={sources}
                />

                <Form.Item
                    name="report"
                    label={
                        <span
                            style={{
                                color: colors.black,
                                fontWeight: 600,
                            }}
                        >
                            {t("claimForm:reportField")}
                        </span>
                    }
                    rules={[
                        {
                            required: true,
                            message: t("claimForm:reportFieldError")
                        }
                    ]}
                    wrapperCol={{ sm: 24 }}
                    style={{
                        width: "100%",
                        marginBottom: "24px"
                    }}
                >
                    <TextArea
                        rows={4}
                        value={report || ""}
                        onChange={(e) => setReport(e.target.value)}
                        placeholder={t("claimForm:reportFieldPlaceholder")}
                    />
                </Form.Item>
                <Form.Item>
                    <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={sitekey}
                        onChange={onChangeCaptcha}
                        onExpired={onExpiredCaptcha}
                    />
                </Form.Item>
                <Form.Item>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-evenly",
                        }}
                    >
                        <Button type={ButtonType.white} onClick={handleCancel}>
                            {t("claimReviewForm:cancelButton")}
                        </Button>
                        <Button
                            type={ButtonType.blue}
                            htmlType="submit"
                            disabled={disableSubmit}
                            icon={<PlusOutlined />}
                        >
                            {t("claimReviewForm:addReviewButton")}
                        </Button>
                    </div>
                </Form.Item>
            </Form>
        </>
    );
}

export default ClaimReviewForm;
