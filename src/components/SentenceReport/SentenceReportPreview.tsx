import React from "react";
import CTARegistration from "../Home/CTARegistration";
import { Grid } from "@mui/material";
import SentenceReportComments from "./SentenceReportComments";
import SentenceReportContent from "./SentenceReportContent";
import { isUserLoggedIn } from "../../atoms/currentUser";
import { useAtom } from "jotai";

const SentenceReportPreview = ({
    canShowReportPreview,
    context,
    href,
    componentStyle,
}) => {
    const [isLoggedIn] = useAtom(isUserLoggedIn);
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
            {!isLoggedIn && <CTARegistration />}
        </Grid>
    );
};

export default SentenceReportPreview;
