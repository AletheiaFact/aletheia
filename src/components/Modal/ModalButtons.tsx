import { Col } from "antd";
import React from "react";
import { ModalCancelButton } from "./AletheiaModal.style";
import AletheiaButton, { ButtonType } from "../Button";
import { useTranslation } from "next-i18next";

const ModalButtons = ({ isLoading, hasCaptcha, handleCancel = null }) => {
    const { t } = useTranslation();

    return (
        <Col
            style={{
                marginTop: 32,
                display: "flex",
                justifyContent: "space-around",
            }}
        >
            {handleCancel && (
                <ModalCancelButton type="text" onClick={() => handleCancel()}>
                    <span
                        style={{
                            textDecorationLine: "underline",
                        }}
                    >
                        {t("orderModal:cancelButton")}
                    </span>
                </ModalCancelButton>
            )}

            <AletheiaButton
                disabled={!hasCaptcha}
                loading={isLoading}
                htmlType="submit"
                type={ButtonType.blue}
            >
                {t("orderModal:okButton")}
            </AletheiaButton>
        </Col>
    );
};

export default ModalButtons;
