import React, { useEffect, useRef, useState } from "react";
import { Col, Form } from "antd";
import { useTranslation } from "next-i18next";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { AletheiaModal } from "./AletheiaModal.style";
import AletheiaCaptcha from "../AletheiaCaptcha";
import AletheiaButton, { ButtonType } from "../Button";
import { useAppSelector } from "../../store/store";

const DeleteContentModal = ({
    visible,
    contentTitle,
    isLoading,
    contentBody,
    handleOk,
    handleCancel,
}) => {
    const { t } = useTranslation();
    const { vw } = useAppSelector((state) => state);
    const [recaptcha, setRecaptcha] = useState("");
    const hasCaptcha = !!recaptcha;
    const recaptchaRef = useRef(null);

    useEffect(() => {
        setRecaptcha("");
        recaptchaRef?.current?.resetRecaptcha();
    }, [visible]);

    return (
        <AletheiaModal
            className="ant-modal-content"
            visible={visible}
            footer={false}
            onCancel={handleCancel}
            width={vw?.sm ? "100%" : "70%"}
        >
            <h2
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    width: "calc(100% - 20px)",
                    color: "#CA1105",
                    fontSize: 24,
                    lineHeight: "16px",
                }}
            >
                <ExclamationCircleOutlined />
                {contentTitle}
            </h2>
            <p style={{ marginTop: 8 }}>{contentBody}</p>
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
                <Col style={{ display: "flex", justifyContent: "flex-end" }}>
                    <AletheiaButton
                        htmlType="submit"
                        type={ButtonType.blue}
                        disabled={!hasCaptcha}
                        loading={isLoading}
                    >
                        {t("warningModal:deleteButton")}
                    </AletheiaButton>
                </Col>
            </Form>
        </AletheiaModal>
    );
};

export default DeleteContentModal;
