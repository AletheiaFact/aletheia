import React from "react";
import { Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import SentenceReportSummary from "./SentenceReportSummary";
import AletheiaButton from "../Button";

const SourceSummaryDisplay = ({ href }) => {
    const { t } = useTranslation();

    return (
        <SentenceReportSummary item>
            <Typography variant="body1" className="sentence-content">
                <cite>{href}</cite>
            </Typography>

            <AletheiaButton
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ width: "fit-content", whiteSpace: "nowrap" }}
            >
                {t("sources:sourceCardButton")}
            </AletheiaButton>
        </SentenceReportSummary>
    );
};

export default SourceSummaryDisplay;
