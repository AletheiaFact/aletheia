import React, { useState } from "react";
import { Col, Form } from "antd";
import colors from "../../styles/colors";
import { useTranslation } from "next-i18next";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { AletheiaModal, ModalOkButton } from "./AletheiaModal";
import TextArea from "../TextArea";
import AletheiaCaptcha from "../AletheiaCaptcha";

const HideReviewModal = ({ visible, handleOk, handleCancel, sitekey }) => {
    const { t } = useTranslation();
    const [disableSubmit, setDisableSubmit] = useState(true);
    const [recaptcha, setRecaptcha] = useState("");

    const onChangeCaptcha = (captchaString) => {
        setRecaptcha(captchaString);
        const hasRecaptcha = !!captchaString;
        setDisableSubmit(!hasRecaptcha);
    };

    return (
        <AletheiaModal
            className="ant-modal-content"
            visible={visible}
            footer={false}
            onCancel={handleCancel}
        >
            <Col
                style={{ fontSize: 16, display: "flex", alignItems: "center" }}
            >
                <ExclamationCircleOutlined
                    style={{ fontSize: 24, color: "#CA1105" }}
                />
                <span
                    style={{
                        marginLeft: 10,
                        lineHeight: "16px",
                        fontWeight: 600,
                    }}
                >
                    Are you sure you want to hide this report
                </span>
            </Col>
            <Form
                style={{ marginTop: 16, justifyContent: "space-around" }}
                name="basic"
                initialValues={{ remember: true }}
                onFinish={handleOk}
            >
                <Form.Item
                    name="description"
                    rules={[
                        {
                            required: true,
                            message: "preencha a descrição",
                        },
                    ]}
                    style={{ marginBottom: 16 }}
                >
                    <TextArea white="white" placeholder="description" />
                </Form.Item>

                <Form.Item name="recaptcha">
                    <AletheiaCaptcha
                        sitekey={sitekey}
                        onChange={onChangeCaptcha}
                    />
                </Form.Item>

                <Col>
                    <Form.Item>
                        <ModalOkButton
                            disable={disableSubmit}
                            style={{ position: "absolute", top: 0, right: 0 }}
                            htmlType="submit"
                            shape="round"
                        >
                            <span
                                style={{
                                    color: colors.white,
                                    textAlign: "center",
                                    fontWeight: 700,
                                    fontSize: 14,
                                }}
                            >
                                Done
                            </span>
                        </ModalOkButton>
                    </Form.Item>
                </Col>
            </Form>
        </AletheiaModal>
    );
};

export default HideReviewModal;
