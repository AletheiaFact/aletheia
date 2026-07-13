import React from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import { useTranslation } from "next-i18next";

interface Props {
    open: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}

const DiscardConfirmDialog: React.FC<Props> = ({
    open,
    onCancel,
    onConfirm,
}) => {
    const { t } = useTranslation("admin-editor");
    return (
        <Dialog open={open} onClose={onCancel}>
            <DialogTitle>{t("discard.title")}</DialogTitle>
            <DialogContent>
                <DialogContentText>{t("discard.body")}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>{t("discard.cancel")}</Button>
                <Button onClick={onConfirm} color="error" variant="contained">
                    {t("discard.confirm")}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DiscardConfirmDialog;
