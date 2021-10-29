import React, { useState, useEffect } from "react";
import { Editor, EditorState } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import { stateFromHTML } from "draft-js-import-html";
import "draft-js/dist/Draft.css";
import {
    DatePicker,
    Form,
    Input,
    Button,
    Row,
    Checkbox,
} from "antd";
import claimApi from "../../api/claim";
import ReCAPTCHA from "react-google-recaptcha";
import { useTranslation } from "next-i18next";
import styled from "styled-components";
import { useRouter } from "next/router";
import PersonalityCard from "../Personality/PersonalityCard";

const recaptchaRef = React.createRef();
const formRef = React.createRef();

const ClaimForm = styled(Form)`
    #createClaim .ant-form-item-control {
        flex-direction: column-reverse
    }

    #createClaim .ant-form-item-extra {
        margin-bottom: 10px;
    }
`;

const ClaimCreate = ({ personality, claim = {}, sitekey, edit = false }) => {
    const { t } = useTranslation();
    const router = useRouter();

    const [ title, setTitle ] = useState("");
    const [ content, setContent ] = useState("");
    const [ date, setDate ] = useState("");
    const [ recaptcha, setRecaptcha ] = useState("")
    const [ editorState, setEditorState ] = useState(EditorState.createEmpty())
    const [ disableSubmit, setDisableSubmit ] = useState(true);

    useEffect(async () => {
        if (edit) {
            const { content, title } = await claimApi.getById(claim._id);
            setTitle(title);
            setEditorState(
                EditorState.createWithContent(
                    stateFromHTML(content.html)
                )
            );
            setContent(stateToHTML(
                editorState.getCurrentContent()
            ));
        }
    }, []);

    const toggleDisabledSubmit = () => {
        const hasRecaptcha = !!recaptcha;
        if (hasRecaptcha) {
            setDisableSubmit(!disableSubmit);
        }
    }

    const saveClaim = async () => {
        if (recaptchaRef && recaptchaRef.current) {
            recaptchaRef.current.reset();
        }

        const { slug } = await claimApi.save({
            content: stateToHTML(editorState.getCurrentContent()),
            title,
            personality: personality._id,
            // TODO: add a new input when twitter is supported
            type: "speech",
            date,
            recaptcha
        });
        // Redirect to personality profile in case _id is not present
        const path = slug ? `/personality/${personality.slug}/claim/${slug}` : `/personality/${personality.slug}`;
        router.push(path);
    }

    const updateClaim = async () => {
        await claimApi.update(claim._id, {
            title,
            content: stateToHTML(editorState.getCurrentContent())
        });
        // Redirect to personality profile in case _id is not present
        const path = `/personality/${personality._id}`;
        router.push(path);
    }

    const onChange = (newEditorState) => {
        setEditorState(newEditorState);
    }

    useEffect(() => {
        if (formRef.current) {
            formRef.current.setFieldsValue({
                content: stateToHTML(
                    editorState.getCurrentContent()
                )
            });
        }
    }, [editorState]);

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

    return (
        <>
            <PersonalityCard personality={personality} header={true} />

            <ClaimForm
                ref={formRef}
                layout="vertical"
                id="createClaim"
                onFinish={
                    edit
                        ? updateClaim
                        : saveClaim
                }
            >
                <Form.Item
                    name="title"
                    label={t("claimForm:titleField")}
                    rules={[
                        {
                            required: true,
                            message: t(
                                "claimForm:titleFieldError"
                            )
                        }
                    ]}
                    wrapperCol={{ sm: 24 }}
                    style={{
                        width: "100%"
                    }}
                >
                    <Input
                        value={title || ""}
                        onChange={e =>
                            setTitle(e.target.value)
                        }
                        placeholder={t(
                            "claimForm:titleFieldPlaceholder"
                        )}
                    />
                </Form.Item>
                <Form.Item
                    name="content"
                    label={t("claimForm:contentField")}
                    rules={[
                        {
                            required: true,
                            message: t(
                                "claimForm:contentFieldError"
                            )
                        }
                    ]}
                    extra={t("claimForm:contentFieldHelp")}
                    wrapperCol={{ sm: 24 }}
                    style={{
                        width: "100%",
                        marginBottom: "24px"
                    }}
                >
                    <div className="ant-input">
                        <Editor
                            placeholder={t(
                                "claimForm:contentFieldPlaceholder"
                            )}
                            editorState={editorState}
                            onChange={onChange}
                        />
                    </div>
                </Form.Item>
                <Form.Item
                    name="date"
                    label={t("claimForm:dateField")}
                    rules={[
                        {
                            required: true,
                            message: t(
                                "claimForm:dateFieldError"
                            )
                        }
                    ]}
                    extra={t("claimForm:dateFieldHelp")}
                    wrapperCol={{ sm: 24 }}
                    style={{
                        width: "100%",
                        marginBottom: "24px"
                    }}
                >
                    <DatePicker
                        style={{
                            width: "100%"
                        }}
                        placeholder={t(
                            "claimForm:dateFieldPlaceholder"
                        )}
                        onChange={value =>
                            setDate(value)
                        }
                    />
                </Form.Item>
                <Form.Item
                    style={{
                        color: "#973A3A"
                    }}
                >
                    {t("claimForm:disclaimer")}
                </Form.Item>
                <Form.Item
                    name="accept_terms"
                    rules={[
                        {
                            required: true,
                            message: t(
                                "claimForm:errorAcceptTerms"
                            )
                        }
                    ]}
                    valuePropName="checked"
                >
                    <Checkbox>
                        {t("claimForm:checkboxAcceptTerms")}
                    </Checkbox>
                </Form.Item>

                <Form.Item>
                    <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={sitekey}
                        onChange={onChangeCaptcha}
                        onExpired={onExpiredCaptcha}
                    />
                </Form.Item>
                <Row
                    style={{
                        justifyContent: "space-evenly",
                        marginBottom: "20px"
                    }}
                >
                    <Button onClick={() => router.back()}>
                        {t("claimForm:cancelButton")}
                    </Button>
                    {edit ? (
                        <Button
                            type="primary"
                            htmlType="submit"
                            disabled={disableSubmit}
                        >
                            {t("claimForm:updateButton")}
                        </Button>
                    ) : (
                        <Button
                            type="primary"
                            htmlType="submit"
                            disabled={disableSubmit}
                        >
                            {t("claimForm:saveButton")}
                        </Button>
                    )}
                </Row>
            </ClaimForm>
        </>
    );
}

export default ClaimCreate;
