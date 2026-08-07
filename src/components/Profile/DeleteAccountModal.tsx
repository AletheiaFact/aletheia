import React, { useState } from "react";
import { ErrorOutlineOutlined } from "@mui/icons-material";
import { Grid, TextField, Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import AletheiaButton, { ButtonType } from "../AletheiaButton";
import { AletheiaModal, ModalCancelButton } from "../Modal/AletheiaModal.style";
import colors from "../../styles/colors";

interface DeleteAccountModalProps {
    open: boolean;
    email: string;
    loading?: boolean;
    handleConfirm: () => void;
    handleCancel: () => void;
}

const DeleteAccountModal = ({
    open,
    email,
    loading = false,
    handleConfirm,
    handleCancel,
}: DeleteAccountModalProps) => {
    const { t } = useTranslation();
    const [typed, setTyped] = useState("");
    const matches =
        typed.trim().toLowerCase() === (email || "").trim().toLowerCase();

    const onCancel = () => {
        setTyped("");
        handleCancel();
    };

    return (
        <AletheiaModal
            open={open}
            onCancel={onCancel}
            style={{ alignSelf: "flex-start", paddingTop: "10vh" }}
            title={
                <Grid item style={{ display: "flex", marginTop: "-4px" }}>
                    <ErrorOutlineOutlined
                        style={{ fontSize: 26, color: colors.error }}
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
                        {t("profile:deleteConfirmTitle")}
                    </span>
                </Grid>
            }
        >
            <Typography variant="subtitle1" style={{ marginTop: 8 }}>
                {t("profile:deleteConfirmBody")}
            </Typography>

            <TextField
                fullWidth
                size="small"
                label={t("profile:deleteConfirmInputLabel")}
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                data-cy="deleteAccountConfirmInput"
                style={{ marginTop: 16 }}
            />

            <Grid
                item
                style={{
                    marginTop: 24,
                    display: "flex",
                    justifyContent: "space-around",
                }}
            >
                <ModalCancelButton type="button" onClick={onCancel}>
                    <span style={{ textDecorationLine: "underline" }}>
                        {t("warningModal:cancelButton")}
                    </span>
                </ModalCancelButton>

                <AletheiaButton
                    onClick={handleConfirm}
                    loading={loading}
                    disabled={!matches || loading}
                    type={ButtonType.error}
                    data-cy="deleteAccountConfirmButton"
                >
                    {t("profile:deleteConfirmButton")}
                </AletheiaButton>
            </Grid>
        </AletheiaModal>
    );
};

export default DeleteAccountModal;
