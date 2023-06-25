import React, { useRef, useState } from "react";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Col, Form } from "antd";
import { useTranslation } from "next-i18next";
import AletheiaButton, { ButtonType } from "../Button";
import { AletheiaModal, ModalCancelButton } from "./AletheiaModal.style";
import AletheiaCaptcha from "../AletheiaCaptcha";

const UnhideReviewModal = ({ visible, isLoading, handleOk, handleCancel }) => {
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
            <Col style={{ fontSize: 16, display: "flex" }}>
                <ExclamationCircleOutlined
                    style={{ fontSize: 24, color: "#DB9F0D", marginTop: -4 }}
                />
                <span
                    style={{
                        marginLeft: 10,
                        fontWeight: 600,
                        lineHeight: "16px",
                    }}
                >
                    {t("claimReview:unhideModalTitle")}
                </span>
            </Col>
            <Form
                style={{ marginTop: 16, justifyContent: "space-around" }}
                name="basic"
                onFinish={handleOk}
            >
                <Form.Item name="recaptcha">
                    <AletheiaCaptcha
                        onChange={setRecaptcha}
                        ref={recaptchaRef}
                    />
                </Form.Item>

                <Col
                    style={{
                        marginTop: 32,
                        display: "flex",
                        justifyContent: "space-around",
                    }}
                >
                    <ModalCancelButton
                        type="text"
                        onClick={() => {
                            setRecaptcha("");
                            recaptchaRef.current?.resetRecaptcha();
                            handleCancel();
                        }}
                    >
                        <span
                            style={{
                                textDecorationLine: "underline",
                            }}
                        >
                            {t("orderModal:cancelButton")}
                        </span>
                    </ModalCancelButton>

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

export default UnhideReviewModal;
