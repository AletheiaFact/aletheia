import React from "react";
import { ErrorOutlineOutlined } from "@mui/icons-material";
import { Grid } from "@mui/material";
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
    ...props
}) => {
    const { t } = useTranslation();

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
                        {t(title)}
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
                        {t("warningModal:cancelButton")}
                    </span>
                </ModalCancelButton>

                <AletheiaButton onClick={handleOk} type={ButtonType.blue}>
                    {t("warningModal:okButton")}
                </AletheiaButton>
            </Grid>
        </AletheiaModal>
    );
};

export default WarningModal;
