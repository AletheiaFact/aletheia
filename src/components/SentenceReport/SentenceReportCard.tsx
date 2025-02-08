import { Grid, Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import React, { useContext } from "react";

import ReviewClassification from "../ClaimReview/ReviewClassification";
import PersonalityMinimalCard from "../Personality/PersonalityMinimalCard";
import SentenceReportCardStyle from "./SentenceReportCard.style";
import AletheiaAlert from "../AletheiaAlert";
import { useAppSelector } from "../../store/store";
import { ReviewTaskTypeEnum } from "../../machines/reviewTask/enums";
import { ReviewTaskMachineContext } from "../../machines/reviewTask/ReviewTaskMachineProvider";
import ClaimSummaryDisplay from "./ClaimSummaryDisplay";
import SourceSummaryDisplay from "./SourceSummaryDisplay";
import VerificationRequestDisplay from "../VerificationRequest/VerificationRequestDisplay";

const SentenceReportCard = ({
    target,
    personality,
    classification,
    content,
    hideDescription,
}: {
    personality?: any;
    target: any;
    content: any;
    classification?: any;
    hideDescription?: string;
}) => {
    const { t } = useTranslation();
    const { reviewTaskType } = useContext(ReviewTaskMachineContext);
    const isClaim = reviewTaskType === ReviewTaskTypeEnum.Claim;
    const {
        vw: { sm, md },
    } = useAppSelector((state) => state);
    const isSource = reviewTaskType === ReviewTaskTypeEnum.Source;
    const isVerificationRequest =
        reviewTaskType === ReviewTaskTypeEnum.VerificationRequest;

    return (
        <SentenceReportCardStyle container>
            {personality && (
                <Grid item md={3} sm={12}>
                    <PersonalityMinimalCard
                        personality={personality}
                        avatarSize={80}
                    />
                </Grid>
            )}
            <Grid item
                lg={personality ? 9 : 12}
                md={personality ? (md && !sm ? 8.5 : 9) : 12}
                sm={12}
                className="sentence-card"
            >
                {classification && (
                    <Typography variant="h1" className="classification">
                        <ReviewClassification
                            // TODO: Create a more meaningful h1 for this page
                            label={t(
                                `claimReview:title${reviewTaskType}Review`
                            )}
                            classification={classification}
                        />
                    </Typography>
                )}
                {isClaim && (
                    <ClaimSummaryDisplay
                        claim={target}
                        content={content?.content}
                        personality={personality}
                    />
                )}
                {isSource && <SourceSummaryDisplay href={content?.href} />}
                {isVerificationRequest && (
                    <VerificationRequestDisplay content={content} />
                )}
                {hideDescription && (
                    <AletheiaAlert
                        type="warning"
                        message={t("claim:warningTitle")}
                        description={hideDescription}
                        showIcon={true}
                        style={{ padding: "10px" }}
                    />
                )}
            </Grid>
        </SentenceReportCardStyle>
    );
};

export default SentenceReportCard;
