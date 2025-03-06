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
            open={open}
            namespace={nameSpace}
            onCancel={handleCancel}
            style={{ alignSelf: "flex-start", paddingTop: "10vh" }}
            title={
                <h2
                    style={{
                        fontFamily: "open sans, sans-serif",
                        fontWeight: 700,
                        fontSize: 14,
                        textAlign: "center",
                        textTransform: "uppercase",
                    }}
                >
                    {t("orderModal:title")}
                </h2>
            }
        >
            <OrderRadio value={value} setValue={setValue} />
            
            <div
                style={{
                    marginTop: 30,
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                <ModalCancelButton type="button" onClick={handleCancel}>
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
