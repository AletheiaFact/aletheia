import { Grid } from "@mui/material";
import React from "react";
import { ModalCancelButton } from "./AletheiaModal.style";
import AletheiaButton, { ButtonType } from "../AletheiaButton";
import { useTranslations } from "next-intl";

const ModalButtons = ({ isLoading, hasCaptcha, handleCancel = null }) => {
    const tOrderModal = useTranslations("orderModal");

    return (
        <Grid item
            style={{
                marginTop: 32,
                display: "flex",
                justifyContent: "space-around",
            }}
        >
            {handleCancel && (
                <ModalCancelButton type="button" onClick={() => handleCancel()}>
                    <span
                        style={{
                            textDecorationLine: "underline",
                        }}
                    >
                        {tOrderModal("cancelButton")}
                    </span>
                </ModalCancelButton>
            )}

            <AletheiaButton
                disabled={!hasCaptcha}
                loading={isLoading}
                htmlType="submit"
                type={ButtonType.primary}
            >
                {tOrderModal("okButton")}
            </AletheiaButton>
        </Grid>
    );
};

export default ModalButtons;
