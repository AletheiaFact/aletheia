import AletheiaButton, { ButtonType } from "../Button";
import { AletheiaModal } from "./AletheiaModal.style";
import colors from "../../styles/colors";
import { useTranslation } from "next-i18next";
import React from "react";
import { Box, Typography } from "@mui/material";

interface StartReviewAlertModalProps {
    open: boolean;
    onCancel?: () => void;
}

function StartReviewAlertModal({ open, onCancel }: StartReviewAlertModalProps) {
    const { t } = useTranslation("copilotChatBot");

    return (
        <AletheiaModal
            open={open}
            onCancel={onCancel}
            style={{ alignSelf: "flex-start", paddingTop: "10vh" }}
            title={
                <Typography
                    variant="h2"
                    style={{
                        fontWeight: 700,
                        fontSize: 14,
                        textAlign: "center",
                        textTransform: "uppercase",
                        padding: "0 34px",
                        color: colors.neutral,
                    }}
                >
                    {t("startReviewTitle")}
                </Typography>
            }
        >
            <Box style={{ padding: "20px 0", justifyItems: "center", textAlign: "center" }}>
                <Typography
                    variant="body1"
                    style={{
                        fontSize: 14,
                        color: colors.neutral,
                        marginBottom: "24px",
                        lineHeight: "1.5",
                    }}
                >
                    {t("startReviewMessage")}
                </Typography>

                <AletheiaButton
                    type={ButtonType.blue}
                    onClick={onCancel}
                    style={{ minWidth: "120px" }}
                >
                    {t("understoodBtn")}
                </AletheiaButton>
            </Box>
        </AletheiaModal>
    );
}

export default StartReviewAlertModal;
