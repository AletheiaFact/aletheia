import React from "react";
import { Grid, Typography } from "@mui/material";
import { Trans, useTranslation } from "next-i18next";
import { getStatusStyles } from "../../../helpers/verificationRequestCardHelper";

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
    const { t } = useTranslation();
    //this could be a util too
    const formattedDate = new Date(createdAt).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    const { color, label } = getStatusStyles(currentstatus, t);

    return (
        <Grid item className="verification-info">
            <Typography variant="body2" className="verification-info-text">
                <Trans
                    i18nKey="verificationRequest:submittedAt"
                    values={{
                        date: formattedDate,
                        channel: sourceChannel,
                    }}
                    components={{
                        bold: <strong style={{ fontWeight: 700 }} />
                    }}
                />
            </Typography>
            <Grid item className="verification-info-status-row">
                <Typography variant="body2" className="verification-info-status-label">
                    {t("verificationRequest:requestStatus")}
                </Typography>
                <Typography variant="body1" className="verification-info-status-value" style={{color: color}}>
                    {label}
                </Typography>
            </Grid>
        </Grid>
    )
}

export default VerificationRequestMinimumCardHeader;
