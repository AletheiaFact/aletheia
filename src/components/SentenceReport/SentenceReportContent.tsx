import { Grid, Divider, Typography } from "@mui/material";

import React, { useContext } from "react";
import SentenceReportContentStyle from "./SentenceReportContent.style";
import ClaimSourceList from "../Source/ClaimSourceList";
import { useTranslation } from "next-i18next";
import dompurify from "dompurify";
import ClassificationText from "../ClassificationText";
import { useSelector } from "@xstate/react";
import { publishedSelector } from "../../machines/reviewTask/selectors";
import { ReviewTaskMachineContext } from "../../machines/reviewTask/ReviewTaskMachineProvider";

const SentenceReportContent = ({
    context,
    classification,
    showClassification,
    href,
}) => {
    const { t } = useTranslation();
    const { machineService, publishedReview, reviewTaskType } = useContext(
        ReviewTaskMachineContext
    );
    const { summary, questions, report, verification, sources } = context;
    const sanitizer = dompurify.sanitize;
    const sortedSources = sources?.sort((a, b) => a.props.sup - b.props.sup);
    const showAllSources = !(
        useSelector(machineService, publishedSelector) ||
        publishedReview?.review
    );

    return (
        <SentenceReportContentStyle>
            {showClassification && classification && (
                <Grid item xs={12}>
                    <Typography variant="body1" className="title">
                        {t(`claimReview:title${reviewTaskType}Review`)}
                    </Typography>
                    <Typography variant="body1" className="paragraph">
                        <ClassificationText classification={classification} />
                    </Typography>
                    <Divider className="report-Divider" />
                </Grid>
            )}
            {summary && (
                <Grid item xs={12}>
                    <Typography variant="body1" className="title">
                        {t("claimReview:summarySectionTitle")}
                    </Typography>
                    <p
                        dangerouslySetInnerHTML={{
                            __html: sanitizer(summary),
                        }}
                        className="paragraph"
                    />
                    <Divider className="report-Divider" />
                </Grid>
            )}
            {questions && questions.length > 0 && (
                <Grid item xs={12}>
                    <Typography variant="body1" className="title">
                        {t("claimReview:questionsSectionTitle")}
                    </Typography>
                    {questions.map((item) => {
                        return (
                            <li
                                key={item}
                                className="paragraph"
                                dangerouslySetInnerHTML={{
                                    __html: sanitizer(item),
                                }}
                            />
                        );
                    })}
                    <Divider className="report-Divider" />
                </Grid>
            )}
            {report && (
                <Grid item xs={12}>
                    <Typography variant="body1" className="title">
                        {t("claimReview:verificationSectionTitle")}
                    </Typography>
                    <p
                        dangerouslySetInnerHTML={{ __html: sanitizer(report) }}
                        className="paragraph"
                    />
                    <Divider className="report-Divider" />
                </Grid>
            )}
            {verification && (
                <Grid item xs={12}>
                    <Typography variant="body1" className="title">
                        {t("claimReview:howSectionTitle")}
                    </Typography>
                    <p
                        dangerouslySetInnerHTML={{
                            __html: sanitizer(verification),
                        }}
                        className="paragraph"
                    />
                    <Divider className="report-Divider" />
                </Grid>
            )}
            <Grid item xs={12}>
                {sources && sources?.length > 0 && (
                    <>
                        <Typography className="title" variant="h4">
                            {t("claim:sourceSectionTitle")}
                        </Typography>
                        <ClaimSourceList
                            sources={sortedSources}
                            seeMoreHref={`${href}/sources`}
                            showAllSources={showAllSources}
                        />
                    </>
                )}
            </Grid>
        </SentenceReportContentStyle>
    );
};

export default SentenceReportContent;
