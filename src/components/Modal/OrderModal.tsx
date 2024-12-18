import { useTranslation } from "next-i18next";
import React from "react";

import AletheiaButton, { ButtonType } from "../Button";
import OrderRadio from "../Radio/OrderRadio";
import { AletheiaModal, ModalCancelButton } from "./AletheiaModal.style";
import { useAtom } from "jotai";
import { currentNameSpace } from "../../atoms/namespace";

const OrderModal = ({ open, value, setValue, handleOk, handleCancel }) => {
    const [nameSpace] = useAtom(currentNameSpace);
    const { t } = useTranslation();

    return (
        <AletheiaModal
            className="ant-modal-content"
            open={open}
            footer={false}
            namespace={nameSpace}
            onCancel={handleCancel}
            title={t("orderModal:title")}
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

                <AletheiaButton buttonType={ButtonType.blue} onClick={handleOk}>
                    {t("orderModal:okButton")}
                </AletheiaButton>
            </div>
        </AletheiaModal>
    );
};

export default OrderModal;
