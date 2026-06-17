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
    onRefresh: () => void;
    onDiscard: () => void;
}

const ConflictDialog: React.FC<Props> = ({ open, onRefresh, onDiscard }) => {
    const { t } = useTranslation("admin-editor");
    return (
        <Dialog open={open}>
            <DialogTitle>{t("conflict.title")}</DialogTitle>
            <DialogContent>
                <DialogContentText>{t("conflict.body")}</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onDiscard}>{t("conflict.discard")}</Button>
                <Button onClick={onRefresh} variant="contained">
                    {t("conflict.refresh")}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConflictDialog;
