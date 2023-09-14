import React, { useEffect, useRef, useState } from "react";
import { Form } from "antd";
import { ExclamationCircleOutlined, WarningOutlined } from "@ant-design/icons";
import { AletheiaModal } from "./AletheiaModal.style";
import AletheiaCaptcha from "../AletheiaCaptcha";
import { useAppSelector } from "../../store/store";
import ModalButtons from "./ModalButtons";
import { useTranslation } from "react-i18next";
import TextArea from "../TextArea";

const UnhideContentModal = ({
    open,
    isLoading,
    contentTitle,
    contentBody,
    handleOk,
    handleCancel,
    hasDescription = false,
    updatingHideStatus = true,
}) => {
    const { t } = useTranslation();
    const { vw } = useAppSelector((state) => state);
    const [recaptcha, setRecaptcha] = useState("");
    const hasCaptcha = !!recaptcha;
    const recaptchaRef = useRef(null);

    useEffect(() => {
        setRecaptcha("");
        recaptchaRef?.current?.resetRecaptcha();
    }, [open]);

    return (
        <AletheiaModal
            className="ant-modal-content"
            open={open}
            footer={false}
            onCancel={handleCancel}
            width={vw?.sm ? "100%" : "70%"}
        >
            <h2
                className={`modal-title ${
                    updatingHideStatus ? "hide-modal" : "delete-modal"
                }`}
            >
                {updatingHideStatus ? (
                    <WarningOutlined />
                ) : (
                    <ExclamationCircleOutlined />
                )}
                {contentTitle}
            </h2>
            <p style={{ marginTop: 8 }}>{contentBody}</p>

            <Form
                style={{ marginTop: 16, justifyContent: "space-around" }}
                name="basic"
                onFinish={handleOk}
            >
                {hasDescription && (
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
                )}

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

export default UnhideContentModal;
