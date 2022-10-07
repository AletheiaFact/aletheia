import React, { useState, useEffect } from "react";
import "draft-js/dist/Draft.css";
import { DatePicker, Form, Row, Checkbox, FormInstance } from "antd";
import claimApi from "../../../api/claim";
import { useTranslation } from "next-i18next";
import styled from "styled-components";
import { useRouter } from "next/router";
import PersonalityCard from "../../Personality/PersonalityCard";
import SourceInput from "../../Source/SourceInput";
import Button, { ButtonType } from "../../Button";
import Input from "../../AletheiaInput";
import TextArea from "../../TextArea";
import AletheiaCaptcha from "../../AletheiaCaptcha";
import moment from "moment";
import colors from "../../../styles/colors";

const formRef = React.createRef<FormInstance>();

const ClaimForm = styled(Form)`
    #createClaim .ant-form-item-control {
        flex-direction: column-reverse;
    }

    #createClaim .ant-form-item-extra {
        margin-bottom: 10px;
    }
`;

const DatePickerInput = styled(DatePicker)`
    background: ${(props) => (props.white ? colors.white : colors.lightGray)};
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
    border-radius: 4px;
    border: none;
    height: 40px;

    input::placeholder {
        color: #515151;
    }

    :focus {
        border: none;
        box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);
    }

    :active {
        border: none;
    }

    :hover {
        border: none;
    }
`;

const ClaimCreate = ({
    personality,
    claim = { _id: "" },
    sitekey,
    edit = false,
}) => {
    const { t } = useTranslation();
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [date, setDate] = useState("");
    const [disableSubmit, setDisableSubmit] = useState(true);
    const [sources, setSources] = useState([""]);
    const [recaptcha, setRecaptcha] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const setTitleAndContent = async () => {
            if (edit) {
                const fetchedClaim = await claimApi.getById(claim._id, t);
                setTitle(fetchedClaim.title);
                setContent(fetchedClaim.content.text);
            }
        };
        setTitleAndContent();
    }, []);

    const disabledDate = (current) => {
        return current && current > moment().endOf("day");
    };

    const saveClaim = async () => {
        if (!isLoading) {
            setIsLoading(true);
            const { slug } = await claimApi.save(t, {
                content,
                title,
                personality: personality._id,
                // TODO: add a new input when twitter is supported
                contentModel: "Speech",
                date,
                sources,
                recaptcha,
            });
            // Redirect to personality profile in case slug is not present
            const path = slug
                ? `/personality/${personality.slug}/claim/${slug}`
                : `/personality/${personality.slug}`;
            router.push(path);
        }
    };

    const updateClaim = async () => {
        if (!isLoading) {
            setIsLoading(true);
            await claimApi.update(claim._id, t, {
                title,
                content,
            });
            // Redirect to personality profile in case _id is not present
            const path = `/personality/${personality._id}`;
            router.push(path);
        }
    };

    useEffect(() => {
        if (formRef.current) {
            formRef.current.setFieldsValue({ content });
        }
    }, [content]);

    const onChangeCaptcha = (captchaString) => {
        setRecaptcha(captchaString);
        const hasRecaptcha = !!captchaString;
        setDisableSubmit(!hasRecaptcha);
    };

    return (
        <>
            {personality && (
                <PersonalityCard
                    personality={personality}
                    header={true}
                    mobile={true}
                />
            )}

            <ClaimForm
                ref={formRef}
                layout="vertical"
                id="createClaim"
                onFinish={edit ? updateClaim : saveClaim}
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
                    name="content"
                    label={t("claimForm:contentField")}
                    rules={[
                        {
                            required: true,
                            whitespace: true,
                            message: t("claimForm:contentFieldError"),
                        },
                    ]}
                    extra={t("claimForm:contentFieldHelp")}
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
                        placeholder={t("claimForm:contentFieldPlaceholder")}
                        data-cy={"testContentClaim"}
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
                    extra={t("claimForm:dateFieldHelp")}
                    wrapperCol={{ sm: 24 }}
                    style={{
                        width: "100%",
                        marginBottom: "24px",
                    }}
                >
                    <DatePickerInput
                        style={{
                            width: "100%",
                        }}
                        placeholder={t("claimForm:dateFieldPlaceholder")}
                        onChange={(value) => setDate(value)}
                        data-cy={"dataAserSelecionada"}
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
                <Form.Item
                    style={{
                        color: "#973A3A",
                    }}
                >
                    {t("claimForm:disclaimer")}
                </Form.Item>
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
                    <AletheiaCaptcha
                        sitekey={sitekey}
                        onChange={onChangeCaptcha}
                    />
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
                    {edit ? (
                        <Button
                            loading={isLoading}
                            type={ButtonType.blue}
                            htmlType="submit"
                            disabled={disableSubmit || isLoading}
                        >
                            {t("claimForm:updateButton")}
                        </Button>
                    ) : (
                        <Button
                            loading={isLoading}
                            type={ButtonType.blue}
                            htmlType="submit"
                            disabled={disableSubmit || isLoading}
                            data-cy={"testSaveButton"}
                        >
                            {t("claimForm:saveButton")}
                        </Button>
                    )}
                </Row>
            </ClaimForm>
        </>
    );
};

export default ClaimCreate;
