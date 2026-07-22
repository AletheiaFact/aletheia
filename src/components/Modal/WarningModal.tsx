import React from "react";
import { ErrorOutlineOutlined } from "@mui/icons-material";
import { Grid } from "@mui/material";
import AletheiaButton, { ButtonType } from "../AletheiaButton";
import { AletheiaModal, ModalCancelButton } from "./AletheiaModal.style";
import colors from "../../styles/colors";
import { useTranslations } from "next-intl";

const WarningModal = ({
    open,
    title,
    width,
    handleOk,
    handleCancel,
    ...props
}) => {
    const tWarningModal = useTranslations("warningModal");

    return (
        <AletheiaModal
            open={open}
            onCancel={handleCancel}
            width={width}
            {...props}
            style={{ alignSelf: "flex-start", paddingTop: "10vh" }}
            title={
                <Grid item style={{ display: "flex", marginTop: "-4px" }}>
                    <ErrorOutlineOutlined
                        style={{ fontSize: 26, color: colors.warning }}
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
                        {tWarningModal(title)}
                    </span>
                </Grid>
            }
        >
            <Grid item
                style={{
                    marginTop: 16,
                    display: "flex",
                    justifyContent: "space-around",
                }}
            >
                <ModalCancelButton type="button" onClick={() => handleCancel()}>
                    <span
                        style={{
                            width: "auto",
                            textDecorationLine: "underline",
                        }}
                    >
                        {tWarningModal("cancelButton")}
                    </span>
                </ModalCancelButton>

                <AletheiaButton
                    onClick={handleOk}
                    type={ButtonType.primary}
                >
                    {tWarningModal("okButton")}
                </AletheiaButton>
            </Grid>
        </AletheiaModal>
    );
};

export default WarningModal;
