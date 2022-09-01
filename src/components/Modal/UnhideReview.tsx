import React from "react";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Col } from "antd";
import { useTranslation } from "next-i18next";
import AletheiaButton, { ButtonType } from "../Button";
import { AletheiaModal, ModalCancelButton } from "./AletheiaModal";

const UnhideReviewModal = ({ visible, isLoading, handleOk, handleCancel }) => {
    const { t } = useTranslation();

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
                    style={{ fontSize: 24, color: "#DB9F0D" }}
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
            <Col
                style={{
                    marginTop: 32,
                    display: "flex",
                    justifyContent: "space-around",
                }}
            >
                <ModalCancelButton type="text" onClick={handleCancel}>
                    <span
                        style={{
                            textDecorationLine: "underline",
                        }}
                    >
                        {t("orderModal:cancelButton")}
                    </span>
                </ModalCancelButton>

                <AletheiaButton
                    loading={isLoading}
                    type={ButtonType.blue}
                    onClick={handleOk}
                >
                    {t("orderModal:okButton")}
                </AletheiaButton>
            </Col>
        </AletheiaModal>
    );
};

export default UnhideReviewModal;
