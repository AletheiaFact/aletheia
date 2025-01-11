import { useSelector } from "@xstate/react";
import { Grid } from "@mui/material";
import React, { useContext } from "react";

import { ReviewTaskMachineContext } from "../../machines/reviewTask/ReviewTaskMachineProvider";
import { ClassificationEnum, TargetModel } from "../../types/enums";
import { publishedSelector } from "../../machines/reviewTask/selectors";
import colors from "../../styles/colors";
import SentenceReportCard from "../SentenceReport/SentenceReportCard";
import TopicDisplay from "../topics/TopicDisplay";
import { Content } from "../../types/Content";
import ReviewAlert from "./ReviewAlert";
import { ReviewTaskTypeEnum } from "../../machines/reviewTask/enums";

interface ClaimReviewHeaderProps {
    personality?: string;
    target?: any;
    content: Content;
    classification?: ClassificationEnum;
    hideDescription: string;
    userIsNotRegular: boolean;
    componentStyle: any;
}

const ClaimReviewHeader = ({
    personality,
    content,
    classification,
    hideDescription,
    userIsNotRegular,
    componentStyle,
    target,
}: ClaimReviewHeaderProps) => {
    const { machineService, publishedReview, reviewTaskType } = useContext(
        ReviewTaskMachineContext
    );
    const isHidden = publishedReview?.review?.isHidden;
    const isPublished =
        useSelector(machineService, publishedSelector) ||
        publishedReview?.review;
    const isPublishedOrCanSeeHidden =
        isPublished && (!isHidden || userIsNotRegular);
    const showTopicInput =
        reviewTaskType === ReviewTaskTypeEnum.Claim ||
        reviewTaskType === ReviewTaskTypeEnum.VerificationRequest;

    return (
        <Grid
            container
            style={{
                justifyContent: "center",
                background:
                    isPublished &&
                    reviewTaskType !== ReviewTaskTypeEnum.VerificationRequest
                        ? "none"
                        : colors.lightNeutral,
            }}
        >
            <Grid item xs={componentStyle.span}>
                <Grid container>
                    <Grid item xs={12} order={{ xs: 2, lg: 1 }}>
                        <SentenceReportCard
                            personality={personality}
                            target={target}
                            content={content}
                            classification={
                                isPublishedOrCanSeeHidden ? classification : ""
                            }
                            hideDescription={
                                hideDescription?.[TargetModel.Claim]
                            }
                        />
                        {showTopicInput && (
                            <TopicDisplay
                                contentModel={target.contentModel}
                                data_hash={content.data_hash}
                                reviewTaskType={reviewTaskType}
                                topics={content?.topics || []}
                            />
                        )}
                    </Grid>

                    <ReviewAlert
                        isHidden={isHidden}
                        isPublished={isPublished}
                        hideDescription={hideDescription}
                    />
                </Grid>
            </Grid>
        </Grid>
    );
};

export default ClaimReviewHeader;
