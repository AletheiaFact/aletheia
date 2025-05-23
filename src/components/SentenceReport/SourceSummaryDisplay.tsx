import React from "react";
import { Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import SentenceReportSummary from "./SentenceReportSummary";
import AletheiaButton from "../Button";

const SourceSummaryDisplay = ({ href }) => {
    const { t } = useTranslation();

    return (
        <SentenceReportSummary item>
            <Typography
                variant="body1"
                className="sentence-content"
                style={{ wordBreak: "break-all" }}
            >
                <cite>{href}</cite>
            </Typography>

            <AletheiaButton
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ minWidth: "fit-content" }}
            >
                {t("sources:sourceCardButton")}
            </AletheiaButton>
        </SentenceReportSummary>
    );
};

export default SourceSummaryDisplay;
