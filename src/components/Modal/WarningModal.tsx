import React from "react";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Col } from "antd";
import { useTranslation } from "next-i18next";
import AletheiaButton, { ButtonType } from "../Button";
import { AletheiaModal, ModalCancelButton } from "./AletheiaModal.style";
import colors from "../../styles/colors";

const WarningModal = ({
    open,
    title,
    width,
    handleOk,
    handleCancel,
    footer = false,
    ...props
}) => {
    const { t } = useTranslation();

    return (
        <AletheiaModal
            className="ant-modal-content"
            open={open}
            footer={footer}
            onCancel={handleCancel}
            width={width}
            {...props}
        >
            <Col style={{ display: "flex", marginTop: "-4px" }}>
                <ExclamationCircleOutlined
                    style={{ fontSize: 24, color: colors.warning }}
                />
                <span
                    style={{
                        marginLeft: 10,
                        paddingRight: 28,
                        fontSize: 16,
                        fontWeight: 600,
                        lineHeight: "18px",
                    }}
                >
                    {t(title)}
                </span>
            </Col>
            <Col
                style={{
                    marginTop: 16,
                    display: "flex",
                    justifyContent: "space-around",
                }}
            >
                <ModalCancelButton type="text" onClick={() => handleCancel()}>
                    <span
                        style={{
                            width: "auto",
                            textDecorationLine: "underline",
                        }}
                    >
                        {t("warningModal:cancelButton")}
                    </span>
                </ModalCancelButton>

                <AletheiaButton onClick={handleOk} type={ButtonType.blue}>
                    {t("warningModal:okButton")}
                </AletheiaButton>
            </Col>
        </AletheiaModal>
    );
};

export default WarningModal;
