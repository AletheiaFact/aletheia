import React, { useRef, useState } from "react";
import { Col, Form } from "antd";
import { useTranslation } from "next-i18next";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { AletheiaModal } from "./AletheiaModal.style";
import TextArea from "../TextArea";
import AletheiaCaptcha from "../AletheiaCaptcha";
import AletheiaButton, { ButtonType } from "../Button";

const HideReviewModal = ({ visible, isLoading, handleOk, handleCancel }) => {
    const { t } = useTranslation();
    //Fix me: Recaptcha doesn't reset on the second time
    const [recaptcha, setRecaptcha] = useState("");
    const hasCaptcha = !!recaptcha;
    const recaptchaRef = useRef(null);

    return (
        <AletheiaModal
            className="ant-modal-content"
            visible={visible}
            footer={false}
            onCancel={handleCancel}
            width={500}
        >
            <Col
                style={{
                    fontSize: 16,
                    display: "flex",
                    width: "calc(100% - 20px)",
                }}
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
                    {t("claimReview:hideModalTitle")}
                </span>
            </Col>
            <Form
                style={{ marginTop: 16, justifyContent: "space-around" }}
                name="basic"
                onFinish={handleOk}
            >
                <Form.Item
                    name="description"
                    rules={[
                        {
                            required: true,
                            message: t("claimReview:descriptionInputError"),
                        },
                    ]}
                    style={{ marginBottom: 16 }}
                >
                    <TextArea
                        white="white"
                        placeholder={t(
                            "claimReview:descriptionInputPlaceholder"
                        )}
                    />
                </Form.Item>

                <Form.Item name="recaptcha">
                    <AletheiaCaptcha
                        onChange={setRecaptcha}
                        ref={recaptchaRef}
                    />
                </Form.Item>

                <Col style={{ display: "flex", justifyContent: "flex-end" }}>
                    <AletheiaButton
                        disabled={!hasCaptcha}
                        loading={isLoading}
                        htmlType="submit"
                        type={ButtonType.blue}
                        onClick={() => recaptchaRef.current?.resetRecaptcha()}
                    >
                        {t("orderModal:okButton")}
                    </AletheiaButton>
                </Col>
            </Form>
        </AletheiaModal>
    );
};

export default HideReviewModal;
