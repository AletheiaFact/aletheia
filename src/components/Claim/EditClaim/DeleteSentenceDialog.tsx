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
    sentenceText?: string;
    onCancel: () => void;
    onConfirm: () => void;
}

// Asks before deleting a sentence whose review task is still in progress.
const DeleteSentenceDialog: React.FC<Props> = ({
    open,
    sentenceText,
    onCancel,
    onConfirm,
}) => {
    const { t } = useTranslation("admin-editor");
    return (
        <Dialog open={open} onClose={onCancel}>
            <DialogTitle>{t("deleteSentence.title")}</DialogTitle>
            <DialogContent>
                <DialogContentText>{t("deleteSentence.body")}</DialogContentText>
                {sentenceText && (
                    <DialogContentText
                        sx={{ mt: 2, fontStyle: "italic" }}
                    >{`"${sentenceText}"`}</DialogContentText>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>{t("deleteSentence.cancel")}</Button>
                <Button onClick={onConfirm} color="error" variant="contained">
                    {t("deleteSentence.confirm")}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteSentenceDialog;
