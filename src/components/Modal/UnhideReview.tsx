import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Col } from "antd";
import { useTranslation } from "next-i18next";
import React from "react";
import colors from "../../styles/colors";
import {
    AletheiaModal,
    ModalCancelButton,
    ModalOkButton,
} from "./AletheiaModal";

const UnhideReviewModal = ({ visible, handleOk, handleCancel }) => {
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
                    Are you sure you want to Unhide this report
                </span>
            </Col>
            <Col
                style={{
                    marginTop: 32,
                    display: "flex",
                    justifyContent: "space-around",
                }}
            >
                <ModalCancelButton onClick={handleCancel} shape="round">
                    <span
                        style={{
                            color: colors.blueSecondary,
                            textDecorationLine: "underline",
                            textAlign: "center",
                            fontWeight: 700,
                            fontSize: 14,
                        }}
                    >
                        Cancel
                    </span>
                </ModalCancelButton>
                <ModalOkButton onClick={handleOk} shape="round">
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
            </Col>
        </AletheiaModal>
    );
};

export default UnhideReviewModal;
