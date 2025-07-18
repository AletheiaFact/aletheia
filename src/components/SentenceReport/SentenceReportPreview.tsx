import React from "react";
import CTAFolder from "../Home/CTAFolder";
import { Grid } from "@mui/material";
import SentenceReportComments from "./SentenceReportComments";
import SentenceReportContent from "./SentenceReportContent";

const SentenceReportPreview = ({
    canShowReportPreview,
    context,
    href,
    componentStyle,
}) => {
    return (
        <Grid item xs={componentStyle.span}>
            {canShowReportPreview && (
                <SentenceReportComments context={context} />
            )}
            <SentenceReportContent
                context={context?.reviewDataHtml || context}
                classification={context.classification}
                showClassification={canShowReportPreview}
                href={href}
            />

            <CTAFolder />
        </Grid>
    );
};

export default SentenceReportPreview;
