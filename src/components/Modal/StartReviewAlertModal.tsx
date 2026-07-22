import AletheiaButton, { ButtonType } from "../AletheiaButton";
import { AletheiaModal } from "./AletheiaModal.style";
import colors from "../../styles/colors";
import React from "react";
import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

interface StartReviewAlertModalProps {
    open: boolean;
    onCancel?: () => void;
}

function StartReviewAlertModal({ open, onCancel }: StartReviewAlertModalProps) {
    const tCopilotChatBot = useTranslations("copilotChatBot");

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
                    {tCopilotChatBot("startReviewTitle")}
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
                    {tCopilotChatBot("startReviewMessage")}
                </Typography>

                <AletheiaButton
                    type={ButtonType.primary}
                    onClick={onCancel}
                    style={{ minWidth: "120px" }}
                >
                    {tCopilotChatBot("understoodBtn")}
                </AletheiaButton>
            </Box>
        </AletheiaModal>
    );
}

export default StartReviewAlertModal;
