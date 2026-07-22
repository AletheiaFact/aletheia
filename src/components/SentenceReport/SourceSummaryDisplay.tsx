import React from "react";
import { Typography } from "@mui/material";
import SentenceReportSummary from "./SentenceReportSummary";
import AletheiaButton from "../AletheiaButton";
import { useTranslations } from "next-intl";

const SourceSummaryDisplay = ({ href }) => {
    const tSources = useTranslations("sources");

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
                {tSources("sourceCardButton")}
            </AletheiaButton>
        </SentenceReportSummary>
    );
};

export default SourceSummaryDisplay;
