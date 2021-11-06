import React, {
    useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Form, Button, Input } from "antd";
import ClaimReviewSelect from "../Form/ClaimReviewSelect";
import claimReviewApi from "../../api/claimReview";
import {useTranslation} from "next-i18next";
import SourceInput from "../Source/SourceInput";
import { useRouter } from "next/router";

const recaptchaRef = React.createRef();

const ClaimReviewForm = ({ claimId, personalityId, highlight, sitekey, handleOk, handleCancel }) => {
    const { t } = useTranslation();
    const router = useRouter();
    const claim = claimId;
    const personality = personalityId;
    const sentence_hash = highlight.props["data-hash"];
    const sentence_content = highlight.content;

    const [ classification, setClassification ] =  useState("");
    const [ recaptcha, setRecaptcha ] = useState("");
    const [ sources, setSources ] = useState([""]);
    const [ disableSubmit, setDisableSubmit ] = useState(true);


    const toggleDisabledSubmit = () => {
        const hasRecaptcha = !!recaptcha;
        const hasClassification = !!classification;
        if (hasClassification && hasClassification.length === "") {
            setDisableSubmit(true);
        } else {
            if (hasRecaptcha && hasClassification) {
                setDisableSubmit(!disableSubmit);
            }
        }
    }

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
    }, [recaptcha]);

    const onChangeClassification = (value) => {
        if (value) {
            setClassification(value);
        }
    }

    useEffect(() => {
        toggleDisabledSubmit();
    }, [classification]);

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
            <Form onFinish={onSubmit}>
                <Form.Item
                    name="classification"
                    label={t("claimReviewForm:selectLabel")}
                >
                    <ClaimReviewSelect
                        type="select"
                        onChange={onChangeClassification}
                        defaultValue=""
                    />
                </Form.Item>
                <SourceInput
                    name="source"
                    label={t("sourceForm:label")}
                    onChange={(e, index) => {
                        setSources(sources.map((source, i) => {
                            return i === index ? e.target.value : source;
                        }));
                    }}
                    addSource={() => {
                        setSources(sources.concat(""));
                    }}
                    removeSource={(index) => {
                        setSources(sources.filter((source, i) => {
                            return i !== index
                        }))
                    }}
                    placeholder={t("sourceForm:placeholder")}
                    sources={sources}
                />
                <Form.Item>
                    <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={sitekey}
                        onChange={onChangeCaptcha}
                        onExpired={onExpiredCaptcha}
                    />
                </Form.Item>
                <Form.Item>
                    <Button onClick={handleCancel}>
                        {t("claimReviewForm:cancelButton")}
                    </Button>
                    <Button
                        type="primary"
                        htmlType="Submit"
                        disabled={disableSubmit}
                    >
                        {t("claimReviewForm:addReviewButton")}
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
}

export default ClaimReviewForm;
