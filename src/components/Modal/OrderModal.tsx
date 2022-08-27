import { useTranslation } from "next-i18next";
import React from "react";

import AletheiaButton, { ButtonType } from "../Button";
import OrderRadio from "../Radio/OrderRadio";
import { AletheiaModal, ModalCancelButton } from "./AletheiaModal.style";

const OrderModal = ({ visible, value, setValue, handleOk, handleCancel }) => {
    const { t } = useTranslation();

    return (
        <AletheiaModal
            className="ant-modal-content"
            visible={visible}
            footer={false}
            onCancel={handleCancel}
            title={t("orderModal:title")}
            width={300}
        >
            <OrderRadio value={value} setValue={setValue} />

            <div
                style={{
                    marginTop: 30,
                    display: "flex",
                    justifyContent: "space-between",
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

                <AletheiaButton type={ButtonType.blue} onClick={handleOk}>
                    {t("orderModal:okButton")}
                </AletheiaButton>
            </div>
        </AletheiaModal>
    );
};

export default OrderModal;
