import React from "react";
import { Typography } from "antd";
import { useTranslation } from "next-i18next";
import SentenceReportSummary from "./SentenceReportSummary";
import AletheiaButton from "../Button";

const { Paragraph } = Typography;

const SourceSummaryDisplay = ({ href }) => {
    const { t } = useTranslation();

    return (
        <SentenceReportSummary>
            <Paragraph className="sentence-content">
                <cite>{href}</cite>
            </Paragraph>

            <AletheiaButton
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ width: "fit-content" }}
            >
                {t("sources:sourceCardButton")}
            </AletheiaButton>
        </SentenceReportSummary>
    );
};

export default SourceSummaryDisplay;
