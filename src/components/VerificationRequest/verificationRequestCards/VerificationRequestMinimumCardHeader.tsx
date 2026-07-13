import React from "react";
import { Grid, Typography } from "@mui/material";
import { getStatusStyles } from "../../../helpers/verificationRequestCardHelper";
import { useTranslations } from "next-intl";

interface VerificationRequestMinimumCardHeaderProps {
    sourceChannel: string;
    createdAt: Date;
    currentstatus: string;
}

const VerificationRequestMinimumCardHeader = ({
    sourceChannel,
    createdAt,
    currentstatus,
}: VerificationRequestMinimumCardHeaderProps) => {
    const tVerificationRequest = useTranslations("verificationRequest");
    const t = useTranslations();
    //this could be a util too
    const formattedDate = new Date(createdAt).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    const { color, label } = getStatusStyles(currentstatus);

    return (
        <Grid item className="verification-info">
            <Typography variant="body2" className="verification-info-text">
                {tVerificationRequest.rich("submittedAt", {
                    date: formattedDate,
                    channel: sourceChannel,
                    bold: (chunks) => (
                        <strong style={{ fontWeight: 700 }}>
                            {chunks}
                        </strong>
                    ),
                })}
            </Typography>
            <Grid item className="verification-info-status-row">
                <Typography variant="body2" className="verification-info-status-label">
                    {tVerificationRequest("requestStatus")}
                </Typography>
                <Typography variant="body1" className="verification-info-status-value" style={{ color: color }}>
                    {label}
                </Typography>
            </Grid>
        </Grid>
    )
}

export default VerificationRequestMinimumCardHeader;
