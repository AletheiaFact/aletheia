import React, { useEffect, useRef, useState } from "react";
import { Form } from "antd";
import { useTranslation } from "next-i18next";
import { WarningOutlined } from "@ant-design/icons";
import { AletheiaModal } from "./AletheiaModal.style";
import AletheiaCaptcha from "../AletheiaCaptcha";
import { useAppSelector } from "../../store/store";
import TextArea from "../TextArea";
import ModalButtons from "./ModalButtons";

const HideContentModal = ({
    visible,
    isLoading,
    contentTitle,
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
            <h2 className="modal-title hide-modal">
                <WarningOutlined />
                {contentTitle}
            </h2>
            <p style={{ marginTop: 8 }}>{contentBody}</p>

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

                <ModalButtons
                    isLoading={isLoading}
                    hasCaptcha={hasCaptcha}
                    handleCancel={handleCancel}
                />
            </Form>
        </AletheiaModal>
    );
};

export default HideContentModal;
